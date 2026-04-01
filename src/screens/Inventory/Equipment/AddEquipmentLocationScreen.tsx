import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { equipmentLocationApi } from '@api/equipment';
import Button from '@components/common/Button';
import Dropdown, { type DropdownOption } from '@components/common/Dropdown';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';

const LOCATION_ICON_OPTIONS: DropdownOption[] = [
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'business', label: 'Production Area' },
  { value: 'radio', label: 'Live Area' },
  { value: 'business-outline', label: 'Office' },
  { value: 'cube', label: 'Stock Room' },
  { value: 'car', label: 'Garage' },
  { value: 'moon', label: 'Dark Room' },
];

export default function AddEquipmentLocationScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClearAll = () => {
    setFormData({
      name: '',
      icon: '',
      description: '',
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Location name is required';
    if (!formData.icon) newErrors.icon = 'Icon is required';

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
      await equipmentLocationApi.store({
        name: formData.name,
        icon: formData.icon,
        description: formData.description || undefined,
      });
      
      Alert.alert('Success', 'Location added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error adding location:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add location';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader title="Add Equipment Location" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          
          {/* Section: Equipment Location Details */}
          <Text style={styles.sectionTitle}>Equipment Location Details</Text>
          <View style={styles.divider} />
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Location Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter location name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Icon <Text style={styles.required}>*</Text></Text>
            <Dropdown
              options={LOCATION_ICON_OPTIONS}
              selectedValue={formData.icon}
              onSelect={(value) => handleInputChange('icon', value)}
              placeholder="Select an icon"
            />
            {errors.icon && <Text style={styles.errorText}>{errors.icon}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter location description"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButtonContainer} onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear all fields</Text>
          </TouchableOpacity>
          
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
              title={isSubmitting ? "Saving..." : "Save"}
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
  scrollContent: {
    padding: wp(4),
  },
  card: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: wp(5.3),
    borderWidth: 1,
    borderColor: '#D1D5DB',
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
    height: hp(12.5),
  },
  footer: {
    marginTop: hp(3.1),
    marginBottom: hp(2.5),
  },
  clearButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: hp(2.5),
  },
  clearText: {
    color: '#4B5563',
    textDecorationLine: 'underline',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
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
