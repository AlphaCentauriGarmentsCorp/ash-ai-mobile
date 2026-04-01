import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { equipmentApi, equipmentLocationApi, type EquipmentLocation } from '@api/equipment';
import FileUpload from '@components/common/FileUpload';
import { SectionHeader, ClearFieldsButton, FormCard, ActionButtons, FormRow, ImageUpload } from '@components/form';
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

  const [locations, setLocations] = useState<any[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      Alert.alert(ALERTS.ERROR_TITLE, ERROR_MESSAGES.FAILED_LOAD_LOCATIONS);
    } finally {
      setIsLoadingLocations(false);
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

  const handleClearAll = () => {
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
    setErrors({});
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
      
      Alert.alert(ALERTS.SUCCESS_TITLE, SUCCESS_MESSAGES.EQUIPMENT_ADDED, [
        { text: BUTTONS.OK, onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error adding equipment:', error);
      const errorMessage = error.response?.data?.message || error.message || ERROR_MESSAGES.FAILED_ADD_EQUIPMENT;
      Alert.alert(ALERTS.ERROR_TITLE, errorMessage);
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
          <ActivityIndicator size="large" color={COLORS.primaryDark} />
          <Text style={styles.loadingText}>{LOADING_MESSAGES.LOADING}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Add Equipment" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Equipment Details Section */}
        <FormCard>
          <SectionHeader title="Equipment Details" />
          
          <UnifiedInput
            label="Item Name"
            required
            placeholder={PLACEHOLDERS.ITEM_NAME}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={errors.name}
          />

          <FormRow>
            <UnifiedInput
              label="Quantity"
              required
              placeholder={PLACEHOLDERS.QUANTITY}
              value={formData.quantity}
              onChangeText={(value) => handleInputChange('quantity', value)}
              keyboardType="numeric"
              error={errors.quantity}
            />

            <UnifiedInput
              label="Color"
              placeholder={PLACEHOLDERS.COLOR}
              value={formData.color}
              onChangeText={(value) => handleInputChange('color', value)}
            />
          </FormRow>

          <FormRow>
            <UnifiedInput
              label="Model / Year"
              placeholder={PLACEHOLDERS.MODEL_YEAR}
              value={formData.model}
              onChangeText={(value) => handleInputChange('model', value)}
            />

            <UnifiedInput
              label="Material"
              placeholder={PLACEHOLDERS.MATERIAL}
              value={formData.material}
              onChangeText={(value) => handleInputChange('material', value)}
            />
          </FormRow>

          <FormRow>
            <UnifiedInput
              label="Price"
              placeholder={PLACEHOLDERS.PRICE}
              value={formData.price}
              onChangeText={(value) => handleInputChange('price', value)}
            />

            <UnifiedInput
              label="Penalty"
              placeholder={PLACEHOLDERS.PENALTY}
              value={formData.penalty}
              onChangeText={(value) => handleInputChange('penalty', value)}
            />
          </FormRow>

          <UnifiedInput
            label="Design"
            placeholder={PLACEHOLDERS.DESIGN}
            value={formData.design}
            onChangeText={(value) => handleInputChange('design', value)}
            isTextArea
            numberOfLines={3}
          />

          <UnifiedInput
            label="Description"
            placeholder={PLACEHOLDERS.DESCRIPTION}
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
            placeholder={PLACEHOLDERS.SELECT_LOCATION}
            error={errors.location_id}
          />

          <ImageUpload
            label="Item Image"
            value={imagePreview}
            onImageSelected={(file) => {
              setImagePreview(file.uri);
              setFormData(prev => ({ ...prev, image: file }));
            }}
            onImageRemoved={() => {
              setImagePreview(null);
              setFormData(prev => ({ ...prev, image: null }));
            }}
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
          <ClearFieldsButton onPress={handleClearAll} />
          
          <ActionButtons
            onCancel={() => router.back()}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitTitle={BUTTONS.SAVE}
            submitLoadingTitle={BUTTONS.SAVING}
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
  formGroup: {
    marginBottom: hp(1.9),
  },
  footer: {
    marginTop: hp(1),
    marginBottom: hp(2.5),
  },
});
