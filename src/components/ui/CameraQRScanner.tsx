import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useCameraPermission } from '../../hooks/useCameraPermission';

interface CameraQRScannerProps {
  onScan: (qrToken: string) => void;
  onSwitchToManual: () => void;
  isLoading?: boolean;
}

export const CameraQRScanner: React.FC<CameraQRScannerProps> = ({
  onScan,
  onSwitchToManual,
  isLoading = false,
}) => {
  const { permission, isLoading: permissionLoading } = useCameraPermission();
  const cameraRef = useRef<CameraView>(null);
  const [scanned, setScanned] = useState(false);
  const lastScannedTimeRef = useRef(0);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    const now = Date.now();
    // Debounce: ignore if we scanned the same code within 1 second
    if (now - lastScannedTimeRef.current < 1000) {
      return;
    }

    lastScannedTimeRef.current = now;
    setScanned(true);

    // Extract QR token and send to parent
    onScan(data.trim());

    // Re-enable scanning after 2 seconds
    setTimeout(() => setScanned(false), 2000);
  };

  if (permissionLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
        <Text className="text-sm text-muted dark:text-muted-dark">Loading camera...</Text>
      </View>
    );
  }

  if (permission === false) {
    return (
      <View className="mb-6 items-center">
        <View className="w-64 h-64 rounded-xl bg-red-100 dark:bg-red-900 items-center justify-center border-2 border-red-300 dark:border-red-700 p-4">
          <Ionicons name="close-circle" size={64} color="#dc2626" />
          <Text className="mt-4 text-sm font-semibold text-red-900 dark:text-red-100 text-center">
            Camera Access Denied
          </Text>
          <Text className="mt-2 text-xs text-red-800 dark:text-red-200 text-center">
            Please enable camera permissions in settings to use QR scanning.
          </Text>
        </View>
        <TouchableOpacity
          onPress={onSwitchToManual}
          className="mt-4 px-4 py-2 rounded-lg border border-primary"
        >
          <Text className="text-primary font-semibold">Use Manual Input Instead</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="mb-6 items-center">
      <View className="w-64 h-64 rounded-xl overflow-hidden border-2 border-primary">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          {/* Camera overlay guide */}
          <View className="flex-1 items-center justify-center">
            <View
              className="h-48 w-48 border-2 border-white rounded-lg"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            />
            {scanned && (
              <View className="absolute inset-0 bg-green-500/20 items-center justify-center rounded-lg">
                <Ionicons name="checkmark-circle" size={48} color="#16a34a" />
              </View>
            )}
          </View>
        </CameraView>
      </View>

      <View className="mt-4 w-64 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
        <Text className="text-xs text-blue-900 dark:text-blue-50 text-center">
          Position QR code within the frame to scan automatically
        </Text>
      </View>

      <TouchableOpacity
        onPress={onSwitchToManual}
        className="mt-4 px-4 py-2 rounded-lg border border-muted"
      >
        <Text className="text-muted font-semibold">Use Manual Input Instead</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraQRScanner;
