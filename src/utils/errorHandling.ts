/**
 * Error Handling Utilities
 * Map API errors to user-friendly messages and handle tour-specific conflicts
 */

import { TourApiError } from '../types/tours';

export interface ErrorDisplay {
  title: string;
  message: string;
  actionHint?: string;
  code: string;
}

/**
 * Map TourApiError to user-friendly error display
 */
export function mapTourApiError(error: TourApiError | null): ErrorDisplay {
  if (!error) {
    return {
      title: 'Unknown Error',
      message: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN',
    };
  }

  switch (error.type) {
    case 'VALIDATION':
      return {
        title: 'Validation Error',
        message: error.message || 'Please check your input and try again.',
        actionHint: 'Review the highlighted fields and correct them.',
        code: 'VALIDATION',
      };

    case 'NOT_FOUND':
      return {
        title: 'Not Found',
        message: error.message || 'The tour or location you are looking for does not exist.',
        actionHint: 'Go back to the list and try selecting a different tour.',
        code: 'NOT_FOUND',
      };

    case 'CONFLICT':
      // Check if it's a "in use" conflict
      if (error.message.toLowerCase().includes('in use')) {
        return {
          title: 'Tour in Use',
          message: 'This tour cannot be deleted because it is referenced by active bookings. Contact support to remove references.',
          actionHint: 'Cancel deletion or contact support.',
          code: 'CONFLICT_IN_USE',
        };
      }
      // Check if it's a duplicate conflict
      if (error.message.toLowerCase().includes('duplicate') || error.message.toLowerCase().includes('already exists')) {
        return {
          title: 'Tour Already Exists',
          message: 'A tour with this name already exists for this location. Use a different name.',
          actionHint: 'Change the package name or modify the location.',
          code: 'CONFLICT_DUPLICATE',
        };
      }
      return {
        title: 'Conflict',
        message: error.message || 'There is a conflict with your request. Please try again.',
        actionHint: 'Review your changes and try again.',
        code: 'CONFLICT',
      };

    case 'SERVER':
      return {
        title: 'Server Error',
        message: error.message || 'The server encountered an error. Please try again later.',
        actionHint: 'If the problem persists, contact support.',
        code: 'SERVER',
      };

    default:
      return {
        title: 'Error',
        message: error.message || 'An error occurred. Please try again.',
        code: 'UNKNOWN',
      };
  }
}

/**
 * Parse validation error details
 */
export function parseValidationErrors(error: TourApiError | null): Record<string, string> {
  if (!error || !error.details) {
    return {};
  }

  const errors: Record<string, string> = {};

  // If details is already a dict of field errors
  if (typeof error.details === 'object' && !Array.isArray(error.details)) {
    Object.entries(error.details).forEach(([key, value]) => {
      errors[key] = Array.isArray(value) ? value.join(', ') : String(value);
    });
  }

  return errors;
}

/**
 * Check if error is due to insufficient permissions
 */
export function isPermissionError(error: TourApiError | null): boolean {
  return error?.statusCode === 403 || error?.statusCode === 401;
}

/**
 * Check if error is a network error (not from server response)
 */
export function isNetworkError(error: TourApiError | null): boolean {
  return error?.statusCode === 0 || error?.type === 'UNKNOWN';
}

/**
 * Determine if user should retry or contact support
 */
export function getRecoveryAction(error: TourApiError | null): 'retry' | 'contact-support' | 'go-back' {
  if (!error) return 'go-back';

  switch (error.type) {
    case 'VALIDATION':
    case 'CONFLICT':
      return 'retry';
    case 'NOT_FOUND':
      return 'go-back';
    case 'SERVER':
    case 'UNKNOWN':
    default:
      return 'contact-support';
  }
}

