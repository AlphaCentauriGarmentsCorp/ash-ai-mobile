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
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { equipmentApi, equipmentLocationApi, type EquipmentLocation } from '@api/equipment';
import Button from '@components/common/Button';
import Dropdown, { type DropdownOption } from '@components/common/Dropdown';
import FileUpload from '@components/common/FileUpload';
import FormInput from '@components/common/FormInput';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from '@styles';
import { hp, wp } from '@utils/responsive';

export default function AddEquipmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  const locationId = params.locationId?.toString();

  const [formData, setFormData] = useState({
    location_id: locationId || '',
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
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoadingLocations(true);
      const response = await equipmentLocationApi.getAll();
      const locationsData = (response as any).data || response;
      const locationOptions = locationsData.map((loc: EquipmentLocation) => ({
        value: loc.id.toString(),
        label: loc.name,
      }));
      setLocations(locationOptions);
    } catch (error) {
      console.error('Error fetching locations:', error);
      Alert.alert('Error', 'Failed to load locations');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleFilesUploaded = (files: any[]) => {
    setFormData(prev => ({ ...prev, receipt: files }));
  };

  const handleReset = () => {
    setFormData({
      location_id: locationId || '',
      name: '',
      quantity: '',
      color: '',
      model: '',
      material: '',
      price: '',
      penalty: '',
      design: '',
      description: '',
      image: null,
      receipt: [],
    });
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.location_id) {
      Alert.alert('Validation Error', 'Please select a location');
      return;
    }
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Item name is required');
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid quantity');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const submitData = {
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
        image: formData.image,
        receipt: formData.receipt.length > 0 ? formData.receipt : undefined,
      };

      await equipmentApi.store(submitData);
      
      Alert.alert('Success', 'Equipment added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error adding equipment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add equipment';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded || isLoadingLocations) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="Add Equipment" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D253F" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Add Equipment" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Equipment Details Section */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Equipment Details</Text>
          
          <View style={styles.row}>
            <View style={styles.fullWidth}>
              <Text style={styles.label}>
                Item Name <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                placeholder="Enter item name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>
                Quantity <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                placeholder="Enter quantity"
                value={formData.quantity}
                onChangeText={(value) => handleInputChange('quantity', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Color</Text>
              <FormInput
                placeholder="Enter color"
                value={formData.color}
                onChangeText={(value) => handleInputChange('color', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Model / Year</Text>
              <FormInput
                placeholder="Enter model / year"
                value={formData.model}
                onChangeText={(value) => handleInputChange('model', value)}
              />
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Material</Text>
              <FormInput
                placeholder="Enter material"
                value={formData.material}
                onChangeText={(value) => handleInputChange('material', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Price</Text>
              <FormInput
                placeholder="Enter price"
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
              />
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Penalty</Text>
              <FormInput
                placeholder="Enter penalty"
                value={formData.penalty}
                onChangeText={(value) => handleInputChange('penalty', value)}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Design</Text>
            <FormInput
              placeholder="Enter design description"
              value={formData.design}
              onChangeText={(value) => handleInputChange('design', value)}
              multiline
              numberOfLines={3}
              inputStyle={styles.textArea}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <FormInput
              placeholder="Enter equipment description"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={3}
              inputStyle={styles.textArea}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Equipment Location <Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              options={locations}
              selectedValue={formData.location_id}
              onSelect={(value) => handleInputChange('location_id', value)}
              placeholder="Select a location"
            />
          </View>

          {/* Image Upload */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Item Image</Text>
            {imagePreview ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
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
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <FileUpload
            label="Receipt Upload"
            category="payment"
            allowMultiple={true}
            onFilesUploaded={handleFilesUploaded}
          />
        </View>

        <View style={styles.buttonRow}>
          <Button
            title="Reset"
            onPress={handleReset}
            variant="secondary"
            size="base"
            disabled={isSubmitting}
          />
          <Button
            title="Save Equipment"
            onPress={handleSubmit}
            variant="primary"
            size="base"
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
    padding: SPACING.base,
    paddingBottom: hp(4),
  },
  formCard: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#0D253F',
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.base,
    marginBottom: SPACING.base,
  },
  fullWidth: {
    flex: 1,
  },
  halfWidth: {
    flex: 1,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: '#0D253F',
    marginBottom: SPACING.xs,
  },
  required: {
    color: '#EF4444',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.base,
  },
});
