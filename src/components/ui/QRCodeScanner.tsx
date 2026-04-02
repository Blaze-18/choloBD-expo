import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QRCodeScannerProps {
  onScan: (qrToken: string) => void;
  isLoading?: boolean;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, isLoading = false }) => {
  const [manualInput, setManualInput] = useState('');
  const [scanMethod, setScanMethod] = useState<'camera' | 'manual'>('camera');

  const handleManualScan = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput('');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <View className="flex-1 p-6 bg-background dark:bg-background-dark justify-center">
        {/* Camera Scanner - Placeholder */}
        {scanMethod === 'camera' && (
          <View className="mb-6 items-center">
            <View className="w-64 h-64 rounded-xl bg-gray-200 dark:bg-gray-700 items-center justify-center border-2 border-dashed border-muted dark:border-muted-dark">
              <Ionicons name="camera" size={64} color="#9ca3af" />
              <Text className="mt-4 text-sm text-muted dark:text-muted-dark text-center">
                Camera integration coming soon
              </Text>
              <Text className="mt-2 text-xs text-muted dark:text-muted-dark text-center">
                Point camera at QR code to scan
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setScanMethod('manual')}
              className="mt-4 px-4 py-2 rounded-lg border border-primary"
            >
              <Text className="text-primary font-semibold">Use Manual Input Instead</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Manual Input Method */}
        {scanMethod === 'manual' && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-text dark:text-text-dark mb-4">
              Manual QR Token Entry
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-text dark:text-text-dark mb-2">
                Paste QR Token
              </Text>
              <TextInput
                className="p-3 border border-border dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-text dark:text-text-dark text-xs"
                placeholder="Paste QR token here..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                value={manualInput}
                onChangeText={setManualInput}
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              onPress={handleManualScan}
              disabled={!manualInput.trim() || isLoading}
              className="bg-primary px-4 py-3 rounded-lg items-center mb-3"
              style={{
                opacity: !manualInput.trim() || isLoading ? 0.5 : 1,
              }}
            >
              <Text className="text-white font-semibold">
                {isLoading ? 'Scanning...' : 'Validate QR Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setScanMethod('camera')}
              className="px-4 py-2 rounded-lg border border-primary items-center"
            >
              <Text className="text-primary font-semibold">Try Camera Scanner</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Instructions */}
        <View className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <Text className="text-sm font-semibold text-blue-900 dark:text-blue-50 mb-2">
            How to use:
          </Text>
          <Text className="text-xs text-blue-800 dark:text-blue-100">
            • Ask the guest to scan their booking QR code{'\n'}
            • The QR token will be extracted automatically{'\n'}
            • The guest's booking details will appear below
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default QRCodeScanner;
