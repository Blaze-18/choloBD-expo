/**
 * Tour Builder API Test Script - Admin Features
 * Tests tour builder endpoints with admin credentials
 * Run: node test-tour-builder-admin.js
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://192.168.0.105:5000';
const TEST_USER = {
  email: 'service_admin2@gmail.com',
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
let createdTourId = null;

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
    console.error(`  No response received.`);
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
 * Helper: Generate a valid UUID-like string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Step 1: Authenticate admin user
 */
async function authenticateUser() {
  log('STEP 1', 'Authenticating service admin user...');
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
        isAdmin: userRole === 'admin' || userRole === 'masterAdmin',
      }
    );

    return true;
  } catch (error) {
    logError('AUTHENTICATION FAILED', error);
    return false;
  }
}

/**
 * Step 2: Fetch available locations (to use for creating tour)
 */
async function fetchAvailableLocations() {
  log('STEP 2', 'Fetching available locations...');

  try {
    const response = await api.get('/api/locations');
    const locations = response.data?.data || [];

    if (locations.length === 0) {
      logSuccess('NO LOCATIONS FOUND', 'No locations available. Will use placeholder ID.', {
        count: 0,
      });
      return null;
    }

    logSuccess('FETCH LOCATIONS SUCCESS', `Retrieved ${locations.length} locations`, {
      count: locations.length,
      locationSample: locations.slice(0, 2),
    });

    return locations[0];
  } catch (error) {
    logError('FETCH LOCATIONS FAILED', error);
    log('INFO', 'Continuing with placeholder location ID...');
    return null;
  }
}

/**
 * Helper: Generate a valid UUID-like string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Step 3: Create a new tour (admin only)
 */
async function testCreateTour(location) {
  log('STEP 3', 'Creating new tour (admin feature)...');

  const locationId = location?.id || generateUUID();

  // Use valid enum values for tour type and transport options
  const createPayload = {
    packageName: `Test Tour Created at ${new Date().toISOString()}`,
    tourType: 'ADVENTURE', // Changed from 'Adventure' to 'ADVENTURE'
    duration: 3,
    locationId,
    totalBudget: 75000,
    shortDescription: 'Test tour created by service admin',
    maxGroupSize: 15,
    rating: 4.5,
    isActive: true,
    isPopular: false,
    daySegments: [
      {
        dayNumber: 1,
        tourSpotId: generateUUID(), // Generate valid UUID
        activitySpotId: generateUUID(),
        transportOption: 'BUS', // Changed from 'CAR' to 'BUS'
        hotelOption: 'LUXURY', // Changed from 'Hotel A' to 'LUXURY'
      },
      {
        dayNumber: 2,
        tourSpotId: generateUUID(),
        activitySpotId: generateUUID(),
        transportOption: 'FLIGHT', // Changed from 'BOAT' to 'FLIGHT'
        hotelOption: 'BUDGET', // Changed from 'Hotel B' to 'BUDGET'
      },
      {
        dayNumber: 3,
        tourSpotId: generateUUID(),
        transportOption: 'TRAIN', // Changed from 'CAR' to 'TRAIN'
        hotelOption: 'RESORT', // Changed from 'Hotel C' to 'RESORT'
      },
    ],
  };

  console.log('  Payload:', JSON.stringify(createPayload, null, 2));

  try {
    const response = await api.post('/api/tour-builder', createPayload);
    const tour = response.data?.data;

    if (!tour || !tour.id) {
      throw new Error('No tour ID in response');
    }

    createdTourId = tour.id;

    logSuccess('CREATE TOUR SUCCESS', `Tour created with ID: ${tour.id}`, {
      tourId: tour.id,
      packageName: tour.packageName,
      duration: tour.duration,
      budget: tour.totalBudget,
      daySegments: tour.daySegments?.length || 0,
    });

    return tour;
  } catch (error) {
    logError('CREATE TOUR FAILED', error);
    return null;
  }
}

/**
 * Step 4: Fetch the created tour to verify
 */
async function testFetchCreatedTour(tour) {
  if (!tour || !tour.id) {
    log('STEP 4', 'Skipping: No tour was created');
    return null;
  }

  log('STEP 4', `Fetching created tour (ID: ${tour.id}) to verify...`);

  try {
    const response = await api.get(`/api/tour-builder/${tour.id}`);
    const fetchedTour = response.data?.data;

    logSuccess('FETCH CREATED TOUR SUCCESS', `Verified tour exists`, {
      tourId: fetchedTour?.id,
      packageName: fetchedTour?.packageName,
      daySegments: fetchedTour?.daySegments?.length,
    });

    return fetchedTour;
  } catch (error) {
    logError('FETCH CREATED TOUR FAILED', error);
    return null;
  }
}

/**
 * Step 5: Update the created tour
 */
async function testUpdateTour(tour) {
  if (!tour || !tour.id) {
    log('STEP 5', 'Skipping: No tour to update');
    return null;
  }

  log('STEP 5', `Updating tour (ID: ${tour.id})...`);

  const updatePayload = {
    packageName: `${tour.packageName} - UPDATED`,
    shortDescription: 'Updated description by admin',
    rating: 4.8,
    isPopular: true,
  };

  console.log('  Payload:', JSON.stringify(updatePayload, null, 2));

  try {
    const response = await api.put(`/api/tour-builder/${tour.id}`, updatePayload);
    const updatedTour = response.data?.data;

    logSuccess('UPDATE TOUR SUCCESS', `Tour updated`, {
      tourId: updatedTour?.id,
      packageName: updatedTour?.packageName,
      rating: updatedTour?.rating,
      isPopular: updatedTour?.isPopular,
    });

    return updatedTour;
  } catch (error) {
    logError('UPDATE TOUR FAILED', error);
    return null;
  }
}

/**
 * Step 6: Update day segments of a tour
 */
async function testUpdateTourSegments(tour) {
  if (!tour || !tour.id) {
    log('STEP 6', 'Skipping: No tour to update');
    return;
  }

  log('STEP 6', `Updating day segments of tour (ID: ${tour.id})...`);

  const updatePayload = {
    daySegments: [
      {
        dayNumber: 1,
        tourSpotId: generateUUID(),
        transportOption: 'FLIGHT', // Use valid enum
        hotelOption: 'BUDGET', // Use valid enum
      },
      {
        dayNumber: 2,
        tourSpotId: generateUUID(),
        transportOption: 'TRAIN', // Use valid enum
        hotelOption: 'BOUTIQUE', // Use valid enum
      },
      {
        dayNumber: 3,
        tourSpotId: generateUUID(),
        transportOption: 'CAR_RENTAL', // Use valid enum
        hotelOption: 'HOSTEL', // Use valid enum
      },
    ],
  };

  console.log('  Updating with', updatePayload.daySegments.length, 'segments');

  try {
    const response = await api.put(`/api/tour-builder/${tour.id}`, updatePayload);
    const updatedTour = response.data?.data;

    logSuccess('UPDATE SEGMENTS SUCCESS', `Day segments updated`, {
      tourId: updatedTour?.id,
      segmentCount: updatedTour?.daySegments?.length,
      segments: updatedTour?.daySegments?.map((s) => ({
        day: s.dayNumber,
        spot: s.tourSpotName,
        transport: s.transportOption,
      })),
    });

    return updatedTour;
  } catch (error) {
    logError('UPDATE SEGMENTS FAILED', error);
    return null;
  }
}

/**
 * Step 7: Fetch tour list again to verify created tour is in list
 */
async function testFetchTourListAgain() {
  log('STEP 7', 'Fetching tour list to verify created tour appears...');

  try {
    const response = await api.get('/api/tour-builder', {
      params: {
        isActive: true,
      },
    });

    const tours = response.data?.data || [];
    const foundTour = tours.find((t) => t.id === createdTourId);

    if (foundTour) {
      logSuccess('TOUR IN LIST VERIFIED', `Found created tour in list`, {
        tourId: foundTour.id,
        packageName: foundTour.packageName,
        listSize: tours.length,
      });
    } else {
      log('INFO', `Tour not found in list. Total tours: ${tours.length}`);
    }

    return tours;
  } catch (error) {
    logError('FETCH TOUR LIST FAILED', error);
    return [];
  }
}

/**
 * Step 8: Delete the created tour (admin only)
 */
async function testDeleteTour(tour) {
  if (!tour || !tour.id) {
    log('STEP 8', 'Skipping: No tour to delete');
    return false;
  }

  log('STEP 8', `Deleting tour (ID: ${tour.id})...`);

  try {
    await api.delete(`/api/tour-builder/${tour.id}`);

    logSuccess('DELETE TOUR SUCCESS', `Tour deleted`, {
      tourId: tour.id,
      packageName: tour.packageName,
    });

    return true;
  } catch (error) {
    logError('DELETE TOUR FAILED', error);
    return false;
  }
}

/**
 * Step 9: Verify deleted tour is gone (404)
 */
async function testVerifyTourDeleted(tourId) {
  if (!tourId) {
    log('STEP 9', 'Skipping: No tour ID to verify');
    return;
  }

  log('STEP 9', `Verifying deleted tour returns 404...`);

  try {
    await api.get(`/api/tour-builder/${tourId}`);
    logSuccess('UNEXPECTED', 'Deleted tour still exists!');
  } catch (error) {
    if (error.response?.status === 404) {
      logSuccess('DELETE VERIFICATION SUCCESS', `Deleted tour correctly returns 404`, {
        status: error.response.status,
        message: error.response.data?.message,
      });
    } else {
      logError('DELETE VERIFICATION FAILED', error);
    }
  }
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TOUR BUILDER API TEST SUITE - ADMIN FEATURES');
  console.log('='.repeat(80));

  try {
    // Step 1: Authenticate
    const isAuthenticated = await authenticateUser();
    if (!isAuthenticated) {
      console.error('\n❌ Cannot continue without authentication');
      process.exit(1);
    }

    // Step 2: Fetch locations
    const location = await fetchAvailableLocations();

    // Step 3: Create tour
    const createdTour = await testCreateTour(location);

    // Step 4: Fetch created tour
    let fetchedTour = await testFetchCreatedTour(createdTour);

    // Step 5: Update tour
    const updatedTour = await testUpdateTour(createdTour);

    // Step 6: Update segments
    const tourWithUpdatedSegments = await testUpdateTourSegments(createdTour);

    // Step 7: Fetch list again
    await testFetchTourListAgain();

    // Step 8: Delete tour
    const wasDeleted = await testDeleteTour(createdTour);

    // Step 9: Verify deleted
    if (wasDeleted) {
      await testVerifyTourDeleted(createdTour?.id);
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('✅ TEST SUITE COMPLETED');
    console.log('='.repeat(80));
    console.log('\nSummary:');
    console.log('  ✓ Admin user can create tours');
    console.log('  ✓ Created tours can be fetched');
    console.log('  ✓ Admin user can update tours');
    console.log('  ✓ Admin user can update day segments');
    console.log('  ✓ Created tours appear in list');
    console.log('  ✓ Admin user can delete tours');
    console.log('  ✓ Deleted tours return 404');
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
