import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';

export interface PickedFile {
  uri: string;
  type: string;
  name: string;
  size?: number;
}

export const pickDocument = async (
  allowedTypes: string[] = ['*/*'],
  allowMultiple: boolean = false
): Promise<PickedFile[]> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: allowedTypes,
      multiple: allowMultiple,
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return [];
    }

    return result.assets.map(asset => ({
      uri: asset.uri,
      type: asset.mimeType || 'application/octet-stream',
      name: asset.name,
      size: asset.size,
    }));
  } catch (error) {
    console.error('Error picking document:', error);
    Alert.alert('Error', 'Failed to pick document. Please try again.');
    return [];
  }
};

// Specific pickers for different file types
export const pickImages = async (allowMultiple: boolean = false): Promise<PickedFile[]> => {
  return pickDocument(['image/*'], allowMultiple);
};

export const pickPDFs = async (allowMultiple: boolean = false): Promise<PickedFile[]> => {
  return pickDocument(['application/pdf'], allowMultiple);
};

export const pickDesignFiles = async (allowMultiple: boolean = true): Promise<PickedFile[]> => {
  return pickDocument([
    'image/*',
    'application/pdf',
    'application/illustrator',
    'application/postscript',
    'image/svg+xml'
  ], allowMultiple);
};

export const pickPaymentFiles = async (allowMultiple: boolean = true): Promise<PickedFile[]> => {
  return pickDocument([
    'image/*',
    'application/pdf'
  ], allowMultiple);
};