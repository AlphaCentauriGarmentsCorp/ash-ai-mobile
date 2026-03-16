import { uploadApi, UploadResponse } from '@api';
import { Ionicons } from '@expo/vector-icons';
import { FONT_FAMILY } from '@styles';
import { pickDesignFiles, PickedFile, pickPaymentFiles } from '@utils/documentPicker';
import { hp, ms, rfs, wp } from '@utils/responsive';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface FileUploadProps {
  label: string;
  category: 'design' | 'mockup' | 'payment' | 'size_label' | 'freebies';
  allowMultiple?: boolean;
  onFilesUploaded?: (files: UploadResponse[]) => void;
  onError?: (error: string) => void;
  style?: any;
}

interface UploadedFile extends UploadResponse {
  uploading?: boolean;
  progress?: number;
}

export default function FileUpload({
  label,
  category,
  allowMultiple = true,
  onFilesUploaded,
  onError,
  style,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFilePick = async () => {
    try {
      let pickedFiles: PickedFile[] = [];

      // Use appropriate picker based on category
      if (category === 'payment') {
        pickedFiles = await pickPaymentFiles(allowMultiple);
      } else {
        pickedFiles = await pickDesignFiles(allowMultiple);
      }

      if (pickedFiles.length === 0) return;

      setUploading(true);

      // Upload files one by one or all at once
      const uploadPromises = pickedFiles.map(async (file, index) => {
        // Add temporary file to state to show progress
        const tempFile: UploadedFile = {
          url: '',
          filename: file.name,
          size: file.size || 0,
          mime_type: file.type,
          uploading: true,
          progress: 0,
        };

        setUploadedFiles(prev => [...prev, tempFile]);

        try {
          const response = await uploadApi.uploadFile(
            file,
            category,
            (progress) => {
              setUploadedFiles(prev =>
                prev.map((f, i) =>
                  i === prev.length - pickedFiles.length + index
                    ? { ...f, progress }
                    : f
                )
              );
            }
          );

          if (response.success) {
            // Update the temporary file with actual data
            setUploadedFiles(prev =>
              prev.map((f, i) =>
                i === prev.length - pickedFiles.length + index
                  ? { ...response.data, uploading: false }
                  : f
              )
            );
            return response.data;
          } else {
            throw new Error(response.message || 'Upload failed');
          }
        } catch (error: any) {
          // Remove failed upload from state
          setUploadedFiles(prev =>
            prev.filter((_, i) => i !== prev.length - pickedFiles.length + index)
          );
          throw error;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const successful = results
        .filter((result): result is PromiseFulfilledResult<UploadResponse> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value);

      const failed = results.filter(result => result.status === 'rejected');

      if (failed.length > 0) {
        const errorMessage = `${failed.length} file(s) failed to upload`;
        onError?.(errorMessage);
        Alert.alert('Upload Error', errorMessage);
      }

      if (successful.length > 0) {
        onFilesUploaded?.(successful);
      }

    } catch (error: any) {
      console.error('File upload error:', error);
      const errorMessage = error.message || 'Failed to upload files';
      onError?.(errorMessage);
      Alert.alert('Upload Error', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesUploaded?.(newFiles.filter(f => !f.uploading));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleFilePick}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator size="small" color="#001C34" />
        ) : (
          <Ionicons name="cloud-upload-outline" size={20} color="#001C34" />
        )}
        <Text style={styles.uploadButtonText}>
          {uploading ? 'Uploading...' : `Choose ${allowMultiple ? 'Files' : 'File'}`}
        </Text>
      </TouchableOpacity>

      {uploadedFiles.length > 0 && (
        <ScrollView style={styles.filesList} showsVerticalScrollIndicator={false}>
          {uploadedFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <View style={styles.fileInfo}>
                <Ionicons 
                  name={file.mime_type.startsWith('image/') ? 'image-outline' : 'document-outline'} 
                  size={16} 
                  color="#6B7280" 
                />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.filename}
                  </Text>
                  <Text style={styles.fileSize}>
                    {formatFileSize(file.size)}
                  </Text>
                  {file.uploading && file.progress !== undefined && (
                    <View style={styles.progressBar}>
                      <View 
                        style={[styles.progressFill, { width: `${file.progress}%` }]} 
                      />
                    </View>
                  )}
                </View>
              </View>
              
              {!file.uploading && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFile(index)}
                >
                  <Ionicons name="close-circle" size={18} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(1.5),
  },
  label: {
    fontSize: rfs(12),
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
    marginBottom: hp(0.8),
  },
  uploadButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
  },
  uploadButtonText: {
    fontSize: rfs(12),
    fontFamily: FONT_FAMILY.medium,
    color: '#001C34',
  },
  filesList: {
    marginTop: hp(1),
    maxHeight: hp(15),
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    marginBottom: hp(0.5),
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: wp(2),
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: rfs(10),
    fontFamily: FONT_FAMILY.medium,
    color: '#1F2937',
  },
  fileSize: {
    fontSize: rfs(8),
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
  },
  progressBar: {
    height: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
    marginTop: hp(0.3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  removeButton: {
    padding: ms(2),
  },
});