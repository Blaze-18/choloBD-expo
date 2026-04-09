/**
 * Error Alert Component
 * Displays formatted tour API errors to users
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TourApiError } from '../../types/tours';
import { mapTourApiError, ErrorDisplay } from '../../utils/errorHandling';

console.log('[ErrorAlert] Component loaded');

interface ErrorAlertProps {
  error: TourApiError | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  onContactSupport?: () => void;
  showActions?: boolean;
}

export function ErrorAlert({
  error,
  onDismiss,
  onRetry,
  onContactSupport,
  showActions = true,
}: ErrorAlertProps) {
  if (!error) return null;

  const errorDisplay = mapTourApiError(error);

  console.log('[ErrorAlert] Rendering error:', errorDisplay.code);

  const getBackgroundColor = () => {
    switch (error.type) {
      case 'VALIDATION':
        return '#FFF3CD';
      case 'NOT_FOUND':
        return '#F8D7DA';
      case 'CONFLICT':
        return '#F8D7DA';
      case 'SERVER':
        return '#F8D7DA';
      default:
        return '#E2E3E5';
    }
  };

  const getBorderColor = () => {
    switch (error.type) {
      case 'VALIDATION':
        return '#FFC107';
      case 'NOT_FOUND':
        return '#DC3545';
      case 'CONFLICT':
        return '#DC3545';
      case 'SERVER':
        return '#DC3545';
      default:
        return '#999';
    }
  };

  const getTextColor = () => {
    switch (error.type) {
      case 'VALIDATION':
        return '#856404';
      case 'NOT_FOUND':
        return '#721C24';
      case 'CONFLICT':
        return '#721C24';
      case 'SERVER':
        return '#721C24';
      default:
        return '#383D41';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
    >
      {/* Close button */}
      {onDismiss && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            console.log('[ErrorAlert] Dismissing error');
            onDismiss();
          }}
        >
          <Text style={[styles.closeButtonText, { color: getTextColor() }]}>✕</Text>
        </TouchableOpacity>
      )}

      {/* Error content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: getTextColor() }]}>{errorDisplay.title}</Text>
        <Text style={[styles.message, { color: getTextColor() }]}>{errorDisplay.message}</Text>

        {errorDisplay.actionHint && (
          <Text style={[styles.hint, { color: getTextColor(), opacity: 0.8 }]}>{errorDisplay.actionHint}</Text>
        )}
      </View>

      {/* Action buttons */}
      {showActions && (
        <View style={styles.actions}>
          {onRetry && error.type === 'VALIDATION' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.retryButton]}
              onPress={() => {
                console.log('[ErrorAlert] Retry pressed');
                onRetry();
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}

          {onContactSupport && (error.type === 'SERVER' || error.type === 'UNKNOWN') && (
            <TouchableOpacity
              style={[styles.actionButton, styles.supportButton]}
              onPress={() => {
                console.log('[ErrorAlert] Contact support pressed');
                onContactSupport();
              }}
            >
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 5,
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingRight: 24,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  hint: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
  },
  retryButtonText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '600',
  },
  supportButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  supportButtonText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ErrorAlert;
