import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import API_CONFIG from '@api/config';
import { equipmentApi, equipmentLocationApi, type Equipment, type EquipmentLocation } from '@api/equipment';
import Button from '@components/common/Button';
import Dropdown, { type DropdownOption } from '@components/common/Dropdown';
import FileUpload from '@components/common/FileUpload';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';

export default function EditEquipmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  const equipmentId = params.id?.toString();

  const [formData, setFormData] = useState({
    location_id: '',
    name: '',
    quantity: '',
    color: '',
    model: '',
    material: '',
    price: '',
    penalty: '',
    design: '',
    description: '',
    image: null as any,
    receipt: [] as any[],
  });

  const [locations, setLocations] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (equipmentId) {
      fetchData();
    } else {
      Alert.alert('Error', 'Equipment ID is missing');
      router.back();
    }
  }, [equipmentId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch locations
      const locationsResponse = await equipmentLocationApi.getAll();
      const locationsData = (locationsResponse as any).data || locationsResponse;
      const locationOptions = locationsData.map((loc: EquipmentLocation) => ({
        value: loc.id.toString(),
        label: loc.name,
      }));
      setLocations(locationOptions);

      // Fetch equipment data
      const equipmentResponse = await equipmentApi.show(Number(equipmentId));
      const equipmentData: Equipment = (equipmentResponse as any).data || equipmentResponse;
      
      setFormData({
        location_id: equipmentData.location_id?.toString() || '',
        name: equipmentData.name || '',
        quantity: equipmentData.quantity?.toString() || '',
        color: equipmentData.color || '',
        model: equipmentData.model || '',
        material: equipmentData.material || '',
        price: equipmentData.price || '',
        penalty: equipmentData.penalty || '',
        design: equipmentData.design || '',
        description: equipmentData.description || '',
        image: null,
        receipt: [],
      });

      if (equipmentData.image) {
        setExistingImage(`${API_CONFIG.STORAGE_BASE_URL}${equipmentData.image}`);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load equipment data');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const fileName = asset.fileName || uri.split('/').pop() || `equipment_${Date.now()}.jpg`;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      
      let mimeType = 'image/jpeg';
      if (fileExtension === 'png') {
        mimeType = 'image/png';
      } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
        mimeType = 'image/jpeg';
      } else if (fileExtension === 'webp') {
        mimeType = 'image/webp';
      }
      
      const file = {
        uri: uri,
        type: mimeType,
        name: fileName,
      };
      
      setImagePreview(asset.uri);
      setExistingImage(null);
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setExistingImage(null);
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleFilesUploaded = (files: any[]) => {
    setFormData(prev => ({ ...prev, receipt: files }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.location_id) newErrors.location_id = 'Location is required';
    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    else if (parseInt(formData.quantity) < 0) newErrors.quantity = 'Quantity must be positive';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const submitData: any = {
        location_id: parseInt(formData.location_id),
        name: formData.name,
        quantity: parseInt(formData.quantity),
        color: formData.color || undefined,
        model: formData.model || undefined,
        material: formData.material || undefined,
        price: formData.price || undefined,
        penalty: formData.penalty || undefined,
        design: formData.design || undefined,
        description: formData.description || undefined,
      };

      // Only include image if a new one was selected
      if (formData.image) {
        submitData.image = formData.image;
      }

      // Only include receipt if files were uploaded
      if (formData.receipt.length > 0) {
        submitData.receipt = formData.receipt;
      }

      await equipmentApi.update(Number(equipmentId), submitData);
      
      Alert.alert('Success', 'Equipment updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error updating equipment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update equipment';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="Edit Equipment" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D253F" />
          <Text style={styles.loadingText}>Loading equipment data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Edit Equipment" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Equipment Details Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Equipment Details</Text>
          <View style={styles.divider} />
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Item Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter item name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Quantity <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.quantity && styles.inputError]}
                placeholder="Enter quantity"
                value={formData.quantity}
                onChangeText={(value) => handleInputChange('quantity', value)}
                keyboardType="numeric"
              />
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
            </View>

            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter color"
                value={formData.color}
                onChangeText={(value) => handleInputChange('color', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Model / Year</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter model / year"
                value={formData.model}
                onChangeText={(value) => handleInputChange('model', value)}
              />
            </View>

            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Material</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter material"
                value={formData.material}
                onChangeText={(value) => handleInputChange('material', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
              />
            </View>

            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Penalty</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter penalty"
                value={formData.penalty}
                onChangeText={(value) => handleInputChange('penalty', value)}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Design</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter design description"
              value={formData.design}
              onChangeText={(value) => handleInputChange('design', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter equipment description"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Equipment Location <Text style={styles.required}>*</Text></Text>
            <Dropdown
              options={locations}
              selectedValue={formData.location_id}
              onSelect={(value) => handleInputChange('location_id', value)}
              placeholder="Select a location"
            />
            {errors.location_id && <Text style={styles.errorText}>{errors.location_id}</Text>}
          </View>

          {/* Image Upload */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Item Image</Text>
            {imagePreview || existingImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: imagePreview || existingImage || '' }} 
                  style={styles.imagePreview} 
                />
                <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePick}>
                <Ionicons name="cloud-upload-outline" size={32} color="#6B7280" />
                <Text style={styles.imageUploadText}>Tap to upload image</Text>
                <Text style={styles.imageUploadHint}>JPEG, PNG (Max 2MB)</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Documents Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <View style={styles.divider} />
          <FileUpload
            label="Receipt Upload"
            category="payment"
            allowMultiple={true}
            onFilesUploaded={handleFilesUploaded}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              size="base"
              style={styles.cancelBtn}
              textStyle={styles.cancelText}
              disabled={isSubmitting}
            />
            
            <Button
              title={isSubmitting ? "Updating..." : "Update"}
              onPress={handleSubmit}
              variant="primary"
              size="base"
              style={styles.submitBtn}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(4),
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },
  scrollContent: {
    padding: wp(4),
  },
  card: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: wp(5.3),
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: 'Poppins_700Bold',
    color: '#001C34',
    marginBottom: hp(1.2),
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: hp(1.9),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.9),
  },
  halfInputContainer: {
    width: '48%',
  },
  formGroup: {
    marginBottom: hp(1.9),
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
    marginBottom: hp(0.6),
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingHorizontal: wp(2.7),
    paddingVertical: hp(1),
    fontSize: FONT_SIZES.sm,
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },
  inputError: {
    borderColor: '#F87171',
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: '#F87171',
    marginTop: hp(0.3),
    fontFamily: FONT_FAMILY.regular,
  },
  textArea: {
    height: hp(10),
  },
  imageUploadButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: '#4B5563',
    marginTop: hp(1),
  },
  imageUploadHint: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#9CA3AF',
    marginTop: hp(0.5),
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: hp(25),
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  footer: {
    marginTop: hp(1),
    marginBottom: hp(2.5),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(4),
  },
  cancelBtn: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
    minWidth: wp(26.7),
  },
  cancelText: {
    color: '#1F2937',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#0D253F',
    minWidth: wp(26.7),
  },
});
