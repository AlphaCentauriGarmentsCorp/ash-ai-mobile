import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FormLabel } from './FormLabel';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';
import { ALERTS, VALIDATION_MESSAGES, UI_TEXT, IMAGE_PICKER_OPTIONS } from '@constants';
import { getMimeType, extractFileName, generateFileName } from '@utils/imageHelpers';

interface ImageUploadProps {
  label?: string;
  value?: string | null;
  existingImage?: string | null;
  onImageSelected: (file: any) => void;
  onImageRemoved: () => void;
  uploadText?: string;
  hintText?: string;
  containerStyle?: ViewStyle;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Item Image',
  value,
  existingImage,
  onImageSelected,
  onImageRemoved,
  uploadText = UI_TEXT.TAP_TO_UPLOAD,
  hintText = UI_TEXT.IMAGE_FORMAT_HINT,
  containerStyle,
}) => {
  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(ALERTS.PERMISSION_REQUIRED, VALIDATION_MESSAGES.GRANT_PERMISSIONS);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const fileName = asset.fileName || extractFileName(uri, generateFileName('equipment'));
      const fileExtension = fileName.split('.').pop();
      const mimeType = getMimeType(fileExtension);
      
      const file = {
        uri: uri,
        type: mimeType,
        name: fileName,
      };
      
      onImageSelected(file);
    }
  };

  const handleRemoveImage = () => {
    onImageRemoved();
  };

  const imageUri = value || existingImage;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <FormLabel>{label}</FormLabel>}
      {imageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
            <Ionicons name="close-circle" size={SIZES.icon.base} color={COLORS.errorRed} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePick}>
          <Ionicons name="cloud-upload-outline" size={SIZES.icon.lg} color={COLORS.grayScale[500]} />
          <Text style={styles.imageUploadText}>{uploadText}</Text>
          <Text style={styles.imageUploadHint}>{hintText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(1.9),
  },
  imageUploadButton: {
    backgroundColor: COLORS.gray[50],
    borderWidth: SIZES.border.base,
    borderColor: COLORS.grayScale[200],
    borderStyle: 'dashed',
    borderRadius: SIZES.radius.lg,
    paddingVertical: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.grayScale[600],
    marginTop: hp(1),
  },
  imageUploadHint: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.grayScale[400],
    marginTop: hp(0.5),
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: hp(25),
    borderRadius: SIZES.radius.lg,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.overlayWhite,
    borderRadius: SIZES.radius.lg,
  },
});