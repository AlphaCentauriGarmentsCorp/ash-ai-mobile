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

import { equipmentLocationApi, type EquipmentLocation } from '@api/equipment';
import { SectionHeader, LoadingScreen, FormCard, ActionButtons } from '@components/form';
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
  ERROR_MESSAGES,
  LOCATION_ICON_OPTIONS 
} from '@constants';

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (locationId) {
      fetchLocationData();
    } else {
      Alert.alert(ALERTS.ERROR_TITLE, ERROR_MESSAGES.LOCATION_ID_MISSING);
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
      Alert.alert(ALERTS.ERROR_TITLE, ERROR_MESSAGES.FAILED_LOAD_LOCATION);
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = VALIDATION_MESSAGES.LOCATION_NAME_REQUIRED;
    if (!formData.icon) newErrors.icon = VALIDATION_MESSAGES.ICON_REQUIRED;

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
      await equipmentLocationApi.update(Number(locationId), {
        name: formData.name,
        icon: formData.icon,
        description: formData.description || undefined,
      });
      
      Alert.alert(ALERTS.SUCCESS_TITLE, SUCCESS_MESSAGES.LOCATION_UPDATED, [
        { text: BUTTONS.OK, onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error updating location:', error);
      const errorMessage = error.response?.data?.message || error.message || ERROR_MESSAGES.FAILED_UPDATE_LOCATION;
      Alert.alert(ALERTS.ERROR_TITLE, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="Edit Equipment Location" />
        <LoadingScreen message={LOADING_MESSAGES.LOADING_LOCATION} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader title="Edit Equipment Location" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FormCard>
          
          {/* Section: Equipment Location Details */}
          <SectionHeader title="Equipment Location Details" />
          
          <UnifiedInput
            label="Location Name"
            required
            placeholder={PLACEHOLDERS.LOCATION_NAME}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={errors.name}
          />

          <UnifiedDropdown
            label="Icon"
            required
            options={LOCATION_ICON_OPTIONS}
            selectedValue={formData.icon}
            onSelect={(value) => handleInputChange('icon', value)}
            placeholder={PLACEHOLDERS.SELECT_ICON}
            error={errors.icon}
          />

          <UnifiedInput
            label="Description"
            placeholder={PLACEHOLDERS.LOCATION_DESCRIPTION}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            isTextArea
            numberOfLines={4}
          />
        </FormCard>

        {/* Footer */}
        <View style={styles.footer}>
          <ActionButtons
            onCancel={() => router.back()}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitTitle={BUTTONS.UPDATE}
            submitLoadingTitle={BUTTONS.UPDATING}
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
  input: {
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.borderGray,
    borderRadius: SIZES.radius.sm,
    paddingHorizontal: wp(2.7),
    paddingVertical: hp(1),
    fontSize: FONT_SIZES.sm,
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.errorLight,
  },
  textArea: {
    height: hp(12.5),
  },
  footer: {
    marginTop: hp(3.1),
    marginBottom: hp(2.5),
  },
});
