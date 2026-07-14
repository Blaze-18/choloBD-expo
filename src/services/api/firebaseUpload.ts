import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

export interface UploadableImage {
  uri: string;
  name?: string | null;
  type?: string | null;
}

/**
 * Upload a single image to Firebase Storage and return its public URL.
 * Uploads are stored in the `community-images/` folder with a timestamp-based filename.
 */
export async function uploadCommunityImageToFirebase(file: UploadableImage): Promise<string> {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = file.name || `image-${timestamp}.jpg`;
    const filenameWithTimestamp = `${timestamp}-${filename}`;
    
    // Create a reference to Firebase Storage
    const storageRef = ref(storage, `community-images/${filenameWithTimestamp}`);

    // Fetch the file from the local URI
    const response = await fetch(file.uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URI: ${response.statusText}`);
    }
    
    const blob = await response.blob();

    // Upload the blob to Firebase Storage
    await uploadBytes(storageRef, blob, {
      contentType: file.type || 'image/jpeg',
    });

    // Get the public download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    if (__DEV__) {
      console.error('[firebaseUpload] uploadCommunityImageToFirebase error:', error);
    }
    throw new Error(error?.message || 'Failed to upload image to Firebase Storage');
  }
}
