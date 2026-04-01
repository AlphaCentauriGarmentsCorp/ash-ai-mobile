import { MIME_TYPES } from '@constants/imagePicker';

/**
 * Get MIME type based on file extension
 */
export const getMimeType = (fileExtension: string | undefined): string => {
  if (!fileExtension) return 'image/jpeg';
  
  const ext = fileExtension.toLowerCase();
  return MIME_TYPES[ext] || 'image/jpeg';
};

/**
 * Generate a unique filename with timestamp
 */
export const generateFileName = (prefix: string = 'image'): string => {
  return `${prefix}_${Date.now()}.jpg`;
};

/**
 * Extract filename from URI
 */
export const extractFileName = (uri: string, defaultName?: string): string => {
  return uri.split('/').pop() || defaultName || generateFileName();
};
