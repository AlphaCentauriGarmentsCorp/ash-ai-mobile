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

import { equipmentLocationApi, type EquipmentLocation } from '@api/equipment';
import Button from '@components/common/Button';
import Dropdown, { type DropdownOption } from '@components/common/Dropdown';
import FormInput from '@components/common/FormInput';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from '@styles';
import { hp } from '@utils/responsive';

const LOCATION_ICON_OPTIONS: DropdownOption[] = [
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'business', label: 'Production Area' },
  { value: 'radio', label: 'Live Area' },
  { value: 'business-outline', label: 'Office' },
  { value: 'cube', label: 'Stock Room' },
  { value: 'car', label: 'Garage' },
  { value: 'moon', label: 'Dark Room' },
];

export default function EditEquipmentLocationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  const locationId = params.id?.toString();

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (locationId) {
      fetchLocationData();
    } else {
      Alert.alert('Error', 'Location ID is missing');
      router.back();
    }
  }, [locationId]);

  const fetchLocationData = async () => {
    try {
      setIsLoading(true);
      const response = await equipmentLocationApi.show(Number(locationId));
      const locationData: EquipmentLocation = (response as any).data || response;
      
      setFormData({
        name: locationData.name || '',
        icon: locationData.icon || '',
        description: locationData.description || '',
      });
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Failed to load location data');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    fetchLocationData();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Location name is required');
      return;
    }

    if (!formData.icon) {
      Alert.alert('Validation Error', 'Icon is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await equipmentLocationApi.update(Number(locationId), {
        name: formData.name,
        icon: formData.icon,
        description: formData.description || undefined,
      });
      
      Alert.alert('Success', 'Location updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error updating location:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update location';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="Edit Equipment Location" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D253F" />
          <Text style={styles.loadingText}>Loading location data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader title="Edit Equipment Location" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Equipment Location Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Location Name <Text style={styles.required}>*</Text>
            </Text>
            <FormInput
              placeholder="Enter location name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Icon <Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              options={LOCATION_ICON_OPTIONS}
              selectedValue={formData.icon}
              onSelect={(value) => handleInputChange('icon', value)}
              placeholder="Select an icon"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <FormInput
              placeholder="Enter location description"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
              inputStyle={styles.textArea}
            />
          </View>
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
            title="Update"
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
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.base,
  },
});
