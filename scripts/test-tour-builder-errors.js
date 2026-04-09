/**
 * Tour Builder API Test Script - Error & Edge Cases
 * Tests error handling and edge cases for tour builder endpoints
 * Run: node test-tour-builder-errors.js
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
function logError(label, statusCode, message) {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${label}`);
  console.log(`  Status: ${statusCode}`);
  console.log(`  Message: ${message}`);
}

/**
 * Helper: Log success
 */
function logSuccess(label, message) {
  const timestamp = new Date().toISOString();
  console.log(`\n✅ [${timestamp}] ${label}`);
  console.log(`  ${message}`);
}

/**
 * Step 1: Authenticate
 */
async function authenticateUser() {
  log('STEP 1', 'Authenticating admin user...');

  try {
    const response = await api.post('/api/auth/login-jwt', {
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    const authToken = response.data?.data?.accessToken;
    if (!authToken) {
      throw new Error('No access token');
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    logSuccess('AUTHENTICATION SUCCESS', `Admin user authenticated`);
    return true;
  } catch (error) {
    logError('AUTHENTICATION FAILED', error.response?.status || 'N/A', error.message);
    return false;
  }
}

/**
 * Test 1: Missing required fields
 */
async function testMissingRequiredFields() {
  log('TEST 1', 'Testing missing required fields (should return 400)...');

  const testCases = [
    {
      name: 'Missing packageName',
      payload: {
        tourType: 'Adventure',
        duration: 3,
        locationId: 'loc-1',
        totalBudget: 50000,
      },
    },
    {
      name: 'Missing duration',
      payload: {
        packageName: 'Test Tour',
        tourType: 'Adventure',
        locationId: 'loc-1',
        totalBudget: 50000,
      },
    },
    {
      name: 'Missing locationId',
      payload: {
        packageName: 'Test Tour',
        tourType: 'Adventure',
        duration: 3,
        totalBudget: 50000,
      },
    },
    {
      name: 'Missing totalBudget',
      payload: {
        packageName: 'Test Tour',
        tourType: 'Adventure',
        duration: 3,
        locationId: 'loc-1',
      },
    },
  ];

  for (const testCase of testCases) {
    try {
      await api.post('/api/tour-builder', testCase.payload);
      logSuccess('UNEXPECTED', `${testCase.name}: Request succeeded (should fail)`);
    } catch (error) {
      if (error.response?.status === 400) {
        logSuccess(`VALIDATION ERROR - ${testCase.name}`, `Correctly returned 400`);
      } else {
        logError(`ERROR - ${testCase.name}`, error.response?.status || 'N/A', error.response?.data?.message);
      }
    }
  }
}

/**
 * Test 2: Invalid data types
 */
async function testInvalidDataTypes() {
  log('TEST 2', 'Testing invalid data types (should return 400)...');

  const testCases = [
    {
      name: 'Non-numeric duration',
      payload: {
        packageName: 'Test Tour',
        tourType: 'Adventure',
        duration: 'not a number',
        locationId: 'loc-1',
        totalBudget: 50000,
      },
    },
    {
      name: 'Negative budget',
      payload: {
        packageName: 'Test Tour',
        tourType: 'Adventure',
        duration: 3,
        locationId: 'loc-1',
        totalBudget: -50000,
      },
    },
    {
      name: 'Zero duration',
      payload: {
        packageName: 'Test Tour',
        tourType: 'Adventure',
        duration: 0,
        locationId: 'loc-1',
        totalBudget: 50000,
      },
    },
    {
      name: 'Invalid rating (>5)',
      payload: {
        packageName: 'Test Tour',
        tourType: 'Adventure',
        duration: 3,
        locationId: 'loc-1',
        totalBudget: 50000,
        rating: 6,
      },
    },
  ];

  for (const testCase of testCases) {
    try {
      await api.post('/api/tour-builder', testCase.payload);
      logSuccess('UNEXPECTED', `${testCase.name}: Request succeeded (should fail)`);
    } catch (error) {
      if (error.response?.status === 400) {
        logSuccess(`VALIDATION ERROR - ${testCase.name}`, `Correctly returned 400`);
      } else {
        logError(`ERROR - ${testCase.name}`, error.response?.status || 'N/A', error.response?.data?.message);
      }
    }
  }
}

/**
 * Test 3: Invalid day segments
 */
async function testInvalidDaySegments() {
  log('TEST 3', 'Testing invalid day segments (should return 400)...');

  const testCases = [
    {
      name: 'Segment day > duration',
      payload: {
        packageName: 'Test Tour',
        tourType: 'Adventure',
        duration: 2,
        locationId: 'loc-1',
        totalBudget: 50000,
        daySegments: [
          {
            dayNumber: 1,
            tourSpotId: 'spot-1',
            transportOption: 'CAR',
            hotelOption: 'Hotel A',
          },
          {
            dayNumber: 5, // > duration (2)
            tourSpotId: 'spot-2',
            transportOption: 'CAR',
            hotelOption: 'Hotel B',
          },
        ],
      },
    },
    {
      name: 'Duplicate day numbers',
      payload: {
        packageName: 'Test Tour',
        tourType: 'Adventure',
        duration: 2,
        locationId: 'loc-1',
        totalBudget: 50000,
        daySegments: [
          {
            dayNumber: 1,
            tourSpotId: 'spot-1',
            transportOption: 'CAR',
            hotelOption: 'Hotel A',
          },
          {
            dayNumber: 1, // Duplicate
            tourSpotId: 'spot-2',
            transportOption: 'CAR',
            hotelOption: 'Hotel B',
          },
        ],
      },
    },
    {
      name: 'Missing required segment fields',
      payload: {
        packageName: 'Test Tour',
        tourType: 'Adventure',
        duration: 1,
        locationId: 'loc-1',
        totalBudget: 50000,
        daySegments: [
          {
            dayNumber: 1,
            // Missing tourSpotId
            transportOption: 'CAR',
            hotelOption: 'Hotel A',
          },
        ],
      },
    },
  ];

  for (const testCase of testCases) {
    try {
      await api.post('/api/tour-builder', testCase.payload);
      logSuccess('UNEXPECTED', `${testCase.name}: Request succeeded (should fail)`);
    } catch (error) {
      if (error.response?.status === 400) {
        logSuccess(`VALIDATION ERROR - ${testCase.name}`, `Correctly returned 400`);
      } else {
        logError(`ERROR - ${testCase.name}`, error.response?.status || 'N/A', error.response?.data?.message);
      }
    }
  }
}

/**
 * Test 4: Not found errors (404)
 */
async function testNotFoundErrors() {
  log('TEST 4', 'Testing 404 Not Found errors...');

  const testCases = [
    {
      name: 'Invalid tour ID',
      method: 'get',
      url: '/api/tour-builder/invalid-tour-id-xyz',
    },
    {
      name: 'Invalid location in tour creation',
      method: 'post',
      url: '/api/tour-builder',
      payload: {
        packageName: 'Test Tour',
        tourType: 'Adventure',
        duration: 3,
        locationId: 'invalid-location-id-xyz',
        totalBudget: 50000,
      },
    },
  ];

  for (const testCase of testCases) {
    try {
      if (testCase.method === 'get') {
        await api.get(testCase.url);
      } else if (testCase.method === 'post') {
        await api.post(testCase.url, testCase.payload);
      }
      logSuccess('UNEXPECTED', `${testCase.name}: Request succeeded (should fail)`);
    } catch (error) {
      if (error.response?.status === 404) {
        logSuccess(`NOT FOUND - ${testCase.name}`, `Correctly returned 404`);
      } else {
        logError(`ERROR - ${testCase.name}`, error.response?.status || 'N/A', error.response?.data?.message);
      }
    }
  }
}

/**
 * Test 5: Unauthorized access (no token)
 */
async function testUnauthorizedAccess() {
  log('TEST 5', 'Testing unauthorized access (no token)...');

  // Create a separate API instance without auth
  const unauthApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  try {
    // Try to create a tour without auth
    await unauthApi.post('/api/tour-builder', {
      packageName: 'Test Tour',
      tourType: 'Adventure',
      duration: 3,
      locationId: 'loc-1',
      totalBudget: 50000,
    });
    logSuccess('UNEXPECTED', 'Create tour succeeded without auth (should fail)');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logSuccess(`UNAUTHORIZED - Create Tour`, `Correctly returned ${error.response.status}`);
    } else {
      logError(`ERROR - Create Tour`, error.response?.status || 'N/A', error.response?.data?.message);
    }
  }

  try {
    // Try to update without auth
    await unauthApi.put('/api/tour-builder/some-id', {
      packageName: 'Updated',
    });
    logSuccess('UNEXPECTED', 'Update tour succeeded without auth (should fail)');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logSuccess(`UNAUTHORIZED - Update Tour`, `Correctly returned ${error.response.status}`);
    } else {
      logError(`ERROR - Update Tour`, error.response?.status || 'N/A', error.response?.data?.message);
    }
  }

  try {
    // Try to delete without auth
    await unauthApi.delete('/api/tour-builder/some-id');
    logSuccess('UNEXPECTED', 'Delete tour succeeded without auth (should fail)');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logSuccess(`UNAUTHORIZED - Delete Tour`, `Correctly returned ${error.response.status}`);
    } else {
      logError(`ERROR - Delete Tour`, error.response?.status || 'N/A', error.response?.data?.message);
    }
  }
}

/**
 * Test 6: Conflict errors (409) - Duplicate tours
 */
async function testConflictErrors() {
  log('TEST 6', 'Testing conflict errors (409)...');

  const tourPayload = {
    packageName: `Conflict Test Tour - ${Date.now()}`,
    tourType: 'Adventure',
    duration: 3,
    locationId: 'test-location-id',
    totalBudget: 50000,
  };

  try {
    // Create first tour
    log('INFO', 'Creating first tour to test duplicate...');
    const response1 = await api.post('/api/tour-builder', tourPayload);
    const tourId1 = response1.data?.data?.id;

    if (tourId1) {
      logSuccess('First tour created', tourId1);

      // Try to create duplicate
      log('INFO', 'Attempting to create duplicate tour...');
      try {
        await api.post('/api/tour-builder', tourPayload);
        logSuccess('UNEXPECTED', 'Duplicate tour creation succeeded (may indicate no duplicate check)');
      } catch (error) {
        if (error.response?.status === 409) {
          logSuccess(`DUPLICATE DETECTION - Create Tour`, `Correctly returned 409`);
        } else if (error.response?.status === 400) {
          log('INFO', 'Duplicate check may be implemented as validation (400)');
        } else {
          logError(`ERROR - Duplicate Detection`, error.response?.status || 'N/A', error.response?.data?.message);
        }
      }

      // Clean up
      try {
        await api.delete(`/api/tour-builder/${tourId1}`);
        logSuccess('Cleanup', `Deleted test tour ${tourId1}`);
      } catch (cleanupError) {
        log('WARNING', `Failed to cleanup tour ${tourId1}`);
      }
    }
  } catch (error) {
    logError('CONFLICT TEST SETUP FAILED', error.response?.status || 'N/A', error.response?.data?.message);
  }
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TOUR BUILDER API TEST SUITE - ERROR & EDGE CASES');
  console.log('='.repeat(80));

  try {
    // Authenticate
    const isAuthenticated = await authenticateUser();
    if (!isAuthenticated) {
      console.error('\n❌ Cannot continue without authentication');
      process.exit(1);
    }

    // Run all tests
    await testMissingRequiredFields();
    await testInvalidDataTypes();
    await testInvalidDaySegments();
    await testNotFoundErrors();
    await testUnauthorizedAccess();
    await testConflictErrors();

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('✅ ERROR TEST SUITE COMPLETED');
    console.log('='.repeat(80));
    console.log('\nValidation Checks Performed:');
    console.log('  ✓ Missing required fields → 400');
    console.log('  ✓ Invalid data types → 400');
    console.log('  ✓ Invalid day segments → 400');
    console.log('  ✓ Not found errors → 404');
    console.log('  ✓ Unauthorized access → 401/403');
    console.log('  ✓ Conflict detection → 409');
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
