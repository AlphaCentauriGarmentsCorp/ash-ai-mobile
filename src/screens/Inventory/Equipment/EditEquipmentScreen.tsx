import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import API_CONFIG from '@api/config';
import { equipmentApi, equipmentLocationApi, type Equipment, type EquipmentLocation } from '@api/equipment';
import FileUpload from '@components/common/FileUpload';
import { SectionHeader, LoadingScreen, FormCard, ActionButtons, FormRow, ImageUpload } from '@components/form';
import { UnifiedInput, UnifiedDropdown } from '@components/unified';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';
import { 
  ALERTS, 
  BUTTONS, 
  PLACEHOLDERS, 
  VALIDATION_MESSAGES, 
  LOADING_MESSAGES, 
  SUCCESS_MESSAGES, 
  ERROR_MESSAGES 
} from '@constants';

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

  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (equipmentId) {
      fetchData();
    } else {
      Alert.alert(ALERTS.ERROR_TITLE, ERROR_MESSAGES.EQUIPMENT_ID_MISSING);
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
      Alert.alert(ALERTS.ERROR_TITLE, ERROR_MESSAGES.FAILED_LOAD_EQUIPMENT);
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

  const handleFilesUploaded = (files: any[]) => {
    setFormData(prev => ({ ...prev, receipt: files }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.location_id) newErrors.location_id = VALIDATION_MESSAGES.LOCATION_REQUIRED;
    if (!formData.name.trim()) newErrors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
    if (!formData.quantity) newErrors.quantity = VALIDATION_MESSAGES.QUANTITY_REQUIRED;
    else if (parseInt(formData.quantity) < 0) newErrors.quantity = VALIDATION_MESSAGES.QUANTITY_POSITIVE;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(ALERTS.VALIDATION_ERROR, VALIDATION_MESSAGES.FILL_REQUIRED_FIELDS);
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
      
      Alert.alert(ALERTS.SUCCESS_TITLE, SUCCESS_MESSAGES.EQUIPMENT_UPDATED, [
        { text: BUTTONS.OK, onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error updating equipment:', error);
      const errorMessage = error.response?.data?.message || error.message || ERROR_MESSAGES.FAILED_UPDATE_EQUIPMENT;
      Alert.alert(ALERTS.ERROR_TITLE, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="Edit Equipment" />
        <LoadingScreen message={LOADING_MESSAGES.LOADING_EQUIPMENT} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Edit Equipment" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Equipment Details Section */}
        <FormCard>
          <SectionHeader title="Equipment Details" />
          
          <UnifiedInput
            label="Item Name"
            required
            placeholder="Enter item name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={errors.name}
          />

          <FormRow>
            <UnifiedInput
              label="Quantity"
              required
              placeholder="Enter quantity"
              value={formData.quantity}
              onChangeText={(value) => handleInputChange('quantity', value)}
              keyboardType="numeric"
              error={errors.quantity}
            />

            <UnifiedInput
              label="Color"
              placeholder="Enter color"
              value={formData.color}
              onChangeText={(value) => handleInputChange('color', value)}
            />
          </FormRow>

          <FormRow>
            <UnifiedInput
              label="Model / Year"
              placeholder="Enter model / year"
              value={formData.model}
              onChangeText={(value) => handleInputChange('model', value)}
            />

            <UnifiedInput
              label="Material"
              placeholder="Enter material"
              value={formData.material}
              onChangeText={(value) => handleInputChange('material', value)}
            />
          </FormRow>

          <FormRow>
            <UnifiedInput
              label="Price"
              placeholder="Enter price"
              value={formData.price}
              onChangeText={(value) => handleInputChange('price', value)}
            />

            <UnifiedInput
              label="Penalty"
              placeholder="Enter penalty"
              value={formData.penalty}
              onChangeText={(value) => handleInputChange('penalty', value)}
            />
          </FormRow>

          <UnifiedInput
            label="Design"
            placeholder="Enter design description"
            value={formData.design}
            onChangeText={(value) => handleInputChange('design', value)}
            isTextArea
            numberOfLines={3}
          />

          <UnifiedInput
            label="Description"
            placeholder="Enter equipment description"
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            isTextArea
            numberOfLines={3}
          />

          <UnifiedDropdown
            label="Equipment Location"
            required
            options={locations}
            selectedValue={formData.location_id}
            onSelect={(value) => handleInputChange('location_id', value)}
            placeholder="Select a location"
            error={errors.location_id}
          />

          <ImageUpload
            label="Item Image"
            value={imagePreview}
            existingImage={existingImage}
            onImageSelected={(file) => {
              setImagePreview(file.uri);
              setExistingImage(null);
              setFormData(prev => ({ ...prev, image: file }));
            }}
            onImageRemoved={() => {
              setImagePreview(null);
              setExistingImage(null);
              setFormData(prev => ({ ...prev, image: null }));
            }}
            uploadText="Tap to upload image"
            hintText="JPEG, PNG (Max 2MB)"
          />
        </FormCard>

        {/* Documents Section */}
        <FormCard>
          <SectionHeader title="Documents" />
          <FileUpload
            label="Receipt Upload"
            category="payment"
            allowMultiple={true}
            onFilesUploaded={handleFilesUploaded}
          />
        </FormCard>

        {/* Footer */}
        <View style={styles.footer}>
          <ActionButtons
            onCancel={() => router.back()}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            cancelTitle="Cancel"
            submitTitle="Update"
            submitLoadingTitle="Updating..."
          />
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
  scrollContent: {
    padding: wp(4),
  },
  formGroup: {
    marginBottom: hp(1.9),
  },
  footer: {
    marginTop: hp(1),
    marginBottom: hp(2.5),
  },
});
