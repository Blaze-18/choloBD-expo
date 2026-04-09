# Tour Builder API Test Scripts

This directory contains comprehensive test scripts for the Tour Builder API endpoints.

## Overview

There are three test scripts that verify different aspects of the Tour Builder API:

### 1. **test-tour-builder.js** - General User Features
Tests the **read-only** endpoints that general users can access.

**Features Tested:**
- ✓ Authentication with general user credentials
- ✓ Fetch tour list (GET `/api/tour-builder`)
- ✓ Fetch tour list with filters (isActive=true)
- ✓ Fetch single tour detail (GET `/api/tour-builder/:id`)
- ✓ Permission check: General users CANNOT create tours
- ✓ Permission check: General users CANNOT update tours
- ✓ Permission check: General users CANNOT delete tours
- ✓ Error handling: Invalid tour IDs return 404

**Test User:**
```
Email: user1@gmail.com
Password: yoyomeowanan2001
Role: user
```

**Run:**
```bash
node scripts/test-tour-builder.js
```

**Expected Output:**
- 8 steps with detailed logging
- Permission errors for create/update/delete operations (expected)
- 404 error for invalid tour IDs (expected)

---

### 2. **test-tour-builder-admin.js** - Admin Features (CRUD Operations)
Tests the **full CRUD** endpoints that admin users can perform.

**Features Tested:**
- ✓ Authentication with admin credentials
- ✓ Fetch available locations (for reference)
- ✓ Create new tour (POST `/api/tour-builder`)
- ✓ Fetch created tour to verify
- ✓ Update tour details (PUT `/api/tour-builder/:id`)
- ✓ Update day segments of a tour
- ✓ Fetch tour list to verify created tour appears
- ✓ Delete created tour (DELETE `/api/tour-builder/:id`)
- ✓ Verify deleted tour returns 404

**Test User:**
```
Email: service_admin2@gmail.com
Password: yoyomeowanan2001
Role: admin (or masterAdmin)
```

**Run:**
```bash
node scripts/test-tour-builder-admin.js
```

**Expected Output:**
- 9 steps showing full CRUD lifecycle
- Tour creation with day segments
- Successful updates
- Successful deletion
- Verification that deleted tour is gone (404)

---

### 3. **test-tour-builder-errors.js** - Error & Edge Cases
Tests error handling and validation for edge cases.

**Error Cases Tested:**
- ✓ Missing required fields → 400 (Validation Error)
- ✓ Invalid data types (non-numeric duration, negative budget, etc.) → 400
- ✓ Invalid day segments (day > duration, duplicates, missing fields) → 400
- ✓ Not found errors (invalid IDs, invalid locations) → 404
- ✓ Unauthorized access (no auth token) → 401/403
- ✓ Conflict detection (duplicate tour creation) → 409

**Test User:**
```
Email: service_admin2@gmail.com
Password: yoyomeowanan2001
Role: admin
```

**Run:**
```bash
node scripts/test-tour-builder-errors.js
```

**Expected Output:**
- Multiple test cases for each error condition
- Verification that correct HTTP status codes are returned
- Detailed error messages

---

## Running All Tests

Run the tests in this order for comprehensive validation:

```bash
# 1. Test general user features (read-only)
node scripts/test-tour-builder.js

# 2. Test admin features (CRUD)
node scripts/test-tour-builder-admin.js

# 3. Test error handling and edge cases
node scripts/test-tour-builder-errors.js
```

## Requirements

- Node.js (v14+)
- `axios` package (already installed in project)

## API Configuration

The scripts use the following backend URL:
```
http://192.168.0.105:5000
```

To change the API base URL, edit the `API_BASE_URL` constant in each script:
```javascript
const API_BASE_URL = 'http://your-ip:5000';
```

## Console Output Formatting

All scripts use color-coded and timestamped output:

- **✅ [timestamp] Label** - Success messages
- **❌ [timestamp] Label** - Error messages
- **[timestamp] Label** - Info messages

Each message includes:
- Timestamp (ISO format)
- Operation status
- HTTP status code (when applicable)
- Response data or error details

## Troubleshooting

### Authentication Failed
- Verify credentials are correct
- Check that the backend is running
- Verify API_BASE_URL is correct

### Connection Refused
- Backend is not running on the specified IP/port
- Check firewall settings
- Verify network connectivity

### 404 Not Found
- Tour IDs may not exist on the backend
- Location IDs may not exist (use locations from `/api/locations`)
- Try running admin test first to create sample tours

### 400 Validation Errors
- Check payload format against test examples
- Verify all required fields are provided
- Ensure data types are correct (numbers, not strings)

### 409 Conflict Errors
- May indicate duplicate tour creation
- Tour may already exist with same name
- Try using different timestamp in tour name

## Test Data

The admin test creates tours with the following structure:

```javascript
{
  packageName: 'Test Tour Created at [ISO timestamp]',
  tourType: 'Adventure',
  duration: 3,
  locationId: '[actual location ID from /api/locations]',
  totalBudget: 75000,
  shortDescription: 'Test tour created by service admin',
  maxGroupSize: 15,
  rating: 4.5,
  isActive: true,
  isPopular: false,
  daySegments: [
    {
      dayNumber: 1,
      tourSpotId: 'spot-1',
      activitySpotId: 'activity-1',
      transportOption: 'CAR',
      hotelOption: 'Hotel A',
    },
    // ... more segments
  ]
}
```

## Logging for Debugging

All test scripts include comprehensive console logging:

```
[timestamp] MODULE_NAME: Operation description
  Status: XXX
  Message: Error or success message
  Data: Response or error details (if applicable)
```

To debug specific issues:
1. Review the console output for exact status code
2. Check the error message and details
3. Cross-reference with expected behavior
4. Report the full console output for support

## Success Criteria

### General User Test
✓ All 8 steps complete successfully
✓ Permission errors on create/update/delete (expected)
✓ 404 on invalid IDs (expected)

### Admin Test
✓ All 9 steps complete successfully
✓ Tour created with proper ID in response
✓ Tour updated with new values
✓ Tour deleted and verified as gone

### Error Test
✓ All 6 error categories tested
✓ Correct HTTP status codes returned
✓ Error messages clear and descriptive

## Notes

- Tests are **non-destructive** for general users (read-only)
- Admin tests **create and delete** test tours (cleanup included)
- Error tests **may create temporary test tours** (cleanup included)
- Timestamps are used in tour names to avoid conflicts
- All tests include proper error handling and recovery

## Support

If tests fail:
1. Check backend logs
2. Verify credentials
3. Confirm API URL
4. Review error messages in console output
5. Ensure all middleware is properly configured on backend

---

**Last Updated:** April 9, 2026
