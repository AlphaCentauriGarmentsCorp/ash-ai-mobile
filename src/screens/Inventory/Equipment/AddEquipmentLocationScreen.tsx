import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { equipmentLocationApi } from '@api/equipment';
import { SectionHeader, ClearFieldsButton, FormCard, ActionButtons } from '@components/form';
import { UnifiedInput, UnifiedDropdown } from '@components/unified';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS } from '@styles';
import { hp, wp } from '@utils/responsive';
import { 
  ALERTS, 
  BUTTONS, 
  PLACEHOLDERS, 
  VALIDATION_MESSAGES, 
  SUCCESS_MESSAGES, 
  ERROR_MESSAGES,
  LOCATION_ICON_OPTIONS 
} from '@constants';

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
      await equipmentLocationApi.store({
        name: formData.name,
        icon: formData.icon,
        description: formData.description || undefined,
      });
      
      Alert.alert(ALERTS.SUCCESS_TITLE, SUCCESS_MESSAGES.LOCATION_ADDED, [
        { text: BUTTONS.OK, onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error adding location:', error);
      const errorMessage = error.response?.data?.message || error.message || ERROR_MESSAGES.FAILED_ADD_LOCATION;
      Alert.alert(ALERTS.ERROR_TITLE, errorMessage);
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
  scrollContent: {
    padding: wp(4),
  },
  formGroup: {
    marginBottom: hp(1.9),
  },
  footer: {
    marginTop: hp(3.1),
    marginBottom: hp(2.5),
  },
});
