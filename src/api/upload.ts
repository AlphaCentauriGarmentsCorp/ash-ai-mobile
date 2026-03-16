import apiClient from './client';
import { ApiResponse } from './types';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mime_type: string;
  path?: string;
}

export interface FileUpload {
  uri: string;
  type: string;
  name: string;
}

export const uploadApi = {
  // Upload single file
  uploadFile: async (
    file: FileUpload,
    category: 'design' | 'mockup' | 'payment' | 'size_label' | 'freebies' = 'design',
    onUploadProgress?: (progress: number) => void
  ): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    
    // Append file to FormData
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);
    
    formData.append('category', category);

    return await apiClient.uploadFile<ApiResponse<UploadResponse>>(
      '/upload',
      formData,
      'POST',
      (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      }
    );
  },

  // Upload multiple files
  uploadMultipleFiles: async (
    files: FileUpload[],
    category: 'design' | 'mockup' | 'payment' | 'size_label' | 'freebies' = 'design',
    onUploadProgress?: (progress: number) => void
  ): Promise<ApiResponse<UploadResponse[]>> => {
    const formData = new FormData();
    
    // Append all files to FormData
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);
    });
    
    formData.append('category', category);

    return await apiClient.uploadFile<ApiResponse<UploadResponse[]>>(
      '/upload/multiple',
      formData,
      'POST',
      (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      }
    );
  },
};