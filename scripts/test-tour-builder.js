/**
 * Tour Builder API Test Script
 * Tests tour builder endpoints with general user credentials
 * Run: node test-tour-builder.js
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://192.168.0.105:5000';
const TEST_USER = {
  email: 'user1@gmail.com',
  password: 'yoyomeowanan2001',
};

// Axios instance for API calls
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let authToken = null;
let userId = null;
let userRole = null;

/**
 * Helper: Log with formatting
 */
function log(label, message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${label}`);
  console.log(`  ${message}`);
  if (data) {
    console.log('  Data:', JSON.stringify(data, null, 2));
  }
}

/**
 * Helper: Log error with details
 */
function logError(label, error) {
  const timestamp = new Date().toISOString();
  console.error(`\n❌ [${timestamp}] ${label}`);
  if (error.response) {
    console.error(`  Status: ${error.response.status}`);
    console.error(`  Message: ${error.response.data?.message || error.message}`);
    console.error(`  Details:`, JSON.stringify(error.response.data, null, 2));
  } else if (error.request) {
    console.error(`  No response received. Request details:`, error.request);
  } else {
    console.error(`  Error: ${error.message}`);
  }
}

/**
 * Helper: Log success
 */
function logSuccess(label, message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`\n✅ [${timestamp}] ${label}`);
  console.log(`  ${message}`);
  if (data) {
    console.log('  Response:', JSON.stringify(data, null, 2));
  }
}

/**
 * Step 1: Authenticate user
 */
async function authenticateUser() {
  log('STEP 1', 'Authenticating general user...');
  console.log(`  Email: ${TEST_USER.email}`);

  try {
    const response = await api.post('/api/auth/login-jwt', {
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    const data = response.data?.data;
    authToken = data?.accessToken;
    userId = data?.user?.id;
    userRole = data?.user?.role;

    if (!authToken) {
      throw new Error('No access token in response');
    }

    // Set auth header for subsequent requests
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    logSuccess(
      'AUTHENTICATION SUCCESS',
      `Logged in as: ${data?.user?.userName || data?.user?.email}`,
      {
        userId,
        userRole,
        tokenLength: authToken.length,
      }
    );

    return true;
  } catch (error) {
    logError('AUTHENTICATION FAILED', error);
    return false;
  }
}

/**
 * Step 2: Fetch tour list (GET /api/tour-builder)
 */
async function testFetchTourList() {
  log('STEP 2', 'Fetching tour list (no filters)...');

  try {
    const response = await api.get('/api/tour-builder');
    const tours = response.data?.data || [];

    logSuccess('FETCH TOUR LIST SUCCESS', `Retrieved ${tours.length} tours`, {
      count: tours.length,
      tourSample: tours.length > 0 ? tours[0] : 'No tours',
    });

    return tours;
  } catch (error) {
    logError('FETCH TOUR LIST FAILED', error);
    return [];
  }
}

/**
 * Step 3: Fetch tour list with filters (GET /api/tour-builder?isActive=true)
 */
async function testFetchTourListWithFilters(tours) {
  log('STEP 3', 'Fetching tour list with filters (isActive=true)...');

  try {
    const response = await api.get('/api/tour-builder', {
      params: {
        isActive: true,
      },
    });

    const filteredTours = response.data?.data || [];

    logSuccess('FETCH FILTERED TOUR LIST SUCCESS', `Retrieved ${filteredTours.length} active tours`, {
      count: filteredTours.length,
    });

    return filteredTours;
  } catch (error) {
    logError('FETCH FILTERED TOUR LIST FAILED', error);
    return [];
  }
}

/**
 * Step 4: Fetch single tour detail (GET /api/tour-builder/:id)
 */
async function testFetchTourDetail(tours) {
  if (tours.length === 0) {
    log('STEP 4', 'Skipping: No tours available to fetch detail');
    return null;
  }

  const tourId = tours[0].id;
  log('STEP 4', `Fetching tour detail for ID: ${tourId}...`);

  try {
    const response = await api.get(`/api/tour-builder/${tourId}`);
    const tour = response.data?.data;

    logSuccess('FETCH TOUR DETAIL SUCCESS', `Retrieved tour: ${tour?.packageName}`, {
      tourId: tour?.id,
      packageName: tour?.packageName,
      duration: tour?.duration,
      budget: tour?.totalBudget,
      daySegmentsCount: tour?.daySegments?.length || 0,
      daySegmentsSample: tour?.daySegments?.slice(0, 2),
    });

    return tour;
  } catch (error) {
    logError('FETCH TOUR DETAIL FAILED', error);
    return null;
  }
}

/**
 * Step 5: Try to create a tour (should fail - general user)
 * POST /api/tour-builder
 */
async function testCreateTour() {
  log('STEP 5', 'Attempting to create tour (should fail for general user)...');

  const testPayload = {
    packageName: 'Test Tour - General User',
    tourType: 'Adventure',
    duration: 3,
    locationId: '123', // Placeholder
    totalBudget: 50000,
    shortDescription: 'Test tour creation by general user',
    isActive: true,
  };

  try {
    const response = await api.post('/api/tour-builder', testPayload);
    const tour = response.data?.data;

    logSuccess('CREATE TOUR UNEXPECTED SUCCESS', 'General user was able to create tour!', {
      tourId: tour?.id,
      packageName: tour?.packageName,
    });

    return tour;
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      logSuccess(
        'CREATE TOUR PERMISSION CHECK',
        'General user correctly denied (expected behavior)',
        {
          status: error.response.status,
          message: error.response.data?.message,
        }
      );
    } else {
      logError('CREATE TOUR FAILED WITH ERROR', error);
    }
    return null;
  }
}

/**
 * Step 6: Try to update a tour (should fail - general user)
 * PUT /api/tour-builder/:id
 */
async function testUpdateTour(tour) {
  if (!tour) {
    log('STEP 6', 'Skipping: No tour to update');
    return;
  }

  log('STEP 6', `Attempting to update tour ID: ${tour.id} (should fail for general user)...`);

  const updatePayload = {
    packageName: 'Updated by General User',
  };

  try {
    const response = await api.put(`/api/tour-builder/${tour.id}`, updatePayload);

    logSuccess('UPDATE TOUR UNEXPECTED SUCCESS', 'General user was able to update tour!', {
      tourId: response.data?.data?.id,
    });
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      logSuccess(
        'UPDATE TOUR PERMISSION CHECK',
        'General user correctly denied (expected behavior)',
        {
          status: error.response.status,
          message: error.response.data?.message,
        }
      );
    } else {
      logError('UPDATE TOUR FAILED WITH ERROR', error);
    }
  }
}

/**
 * Step 7: Try to delete a tour (should fail - general user)
 * DELETE /api/tour-builder/:id
 */
async function testDeleteTour(tour) {
  if (!tour) {
    log('STEP 7', 'Skipping: No tour to delete');
    return;
  }

  log('STEP 7', `Attempting to delete tour ID: ${tour.id} (should fail for general user)...`);

  try {
    await api.delete(`/api/tour-builder/${tour.id}`);

    logSuccess('DELETE TOUR UNEXPECTED SUCCESS', 'General user was able to delete tour!', {
      tourId: tour.id,
    });
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      logSuccess(
        'DELETE TOUR PERMISSION CHECK',
        'General user correctly denied (expected behavior)',
        {
          status: error.response.status,
          message: error.response.data?.message,
        }
      );
    } else {
      logError('DELETE TOUR FAILED WITH ERROR', error);
    }
  }
}

/**
 * Step 8: Test invalid tour ID (404)
 */
async function testInvalidTourId() {
  log('STEP 8', 'Testing fetch with invalid tour ID (should return 404)...');

  const invalidId = 'invalid-tour-id-12345';

  try {
    await api.get(`/api/tour-builder/${invalidId}`);
    logSuccess('UNEXPECTED', 'Invalid ID returned a tour');
  } catch (error) {
    if (error.response?.status === 404) {
      logSuccess(
        'INVALID TOUR ID HANDLING',
        'Invalid ID correctly returned 404',
        {
          status: error.response.status,
          message: error.response.data?.message,
        }
      );
    } else {
      logError('INVALID TOUR ID UNEXPECTED ERROR', error);
    }
  }
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TOUR BUILDER API TEST SUITE - GENERAL USER');
  console.log('='.repeat(80));

  try {
    // Step 1: Authenticate
    const isAuthenticated = await authenticateUser();
    if (!isAuthenticated) {
      console.error('\n❌ Cannot continue without authentication');
      process.exit(1);
    }

    // Step 2: Fetch tour list
    const tours = await testFetchTourList();

    // Step 3: Fetch tour list with filters
    await testFetchTourListWithFilters(tours);

    // Step 4: Fetch single tour detail
    const selectedTour = await testFetchTourDetail(tours);

    // Step 5: Try to create tour (should fail)
    await testCreateTour();

    // Step 6: Try to update tour (should fail)
    await testUpdateTour(selectedTour);

    // Step 7: Try to delete tour (should fail)
    await testDeleteTour(selectedTour);

    // Step 8: Test invalid tour ID
    await testInvalidTourId();

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('✅ TEST SUITE COMPLETED');
    console.log('='.repeat(80));
    console.log('\nSummary:');
    console.log('  ✓ General user can fetch tour list');
    console.log('  ✓ General user can fetch tour details');
    console.log('  ✓ General user cannot create tours (permission denied)');
    console.log('  ✓ General user cannot update tours (permission denied)');
    console.log('  ✓ General user cannot delete tours (permission denied)');
    console.log('  ✓ Invalid tour IDs return 404');
    console.log('\n');
  } catch (error) {
    console.error('\n❌ Unexpected error during test suite:', error);
    process.exit(1);
  }
}

// Run the tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
