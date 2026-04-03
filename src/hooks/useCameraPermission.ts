import { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';

export function useCameraPermission() {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setPermission(status === 'granted');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[useCameraPermission] Error requesting camera permission:', error);
        setPermission(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { permission, isLoading };
}

export default useCameraPermission;
