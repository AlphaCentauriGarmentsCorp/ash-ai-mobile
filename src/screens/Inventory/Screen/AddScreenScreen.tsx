import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenApi } from '@api/screens';
import { SectionHeader, ClearFieldsButton, FormCard, ActionButtons, FormRow } from '@components/form';
import { UnifiedInput } from '@components/unified';
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
  ERROR_MESSAGES 
} from '@constants';

export default function AddScreenScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    size: '',
    mesh_count: '',
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
      address: '',
      size: '',
      mesh_count: '',
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.address.trim()) newErrors.address = VALIDATION_MESSAGES.ADDRESS_REQUIRED;
    if (!formData.size.trim()) newErrors.size = VALIDATION_MESSAGES.SIZE_REQUIRED;
    if (!formData.mesh_count) newErrors.mesh_count = VALIDATION_MESSAGES.MESH_COUNT_REQUIRED;
    else if (parseInt(formData.mesh_count) < 0) newErrors.mesh_count = VALIDATION_MESSAGES.MESH_COUNT_POSITIVE;

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
        name: formData.name || undefined,
        address: formData.address,
        size: formData.size,
        mesh_count: parseInt(formData.mesh_count),
      };

      await screenApi.store(submitData);
      
      Alert.alert(ALERTS.SUCCESS_TITLE, SUCCESS_MESSAGES.SCREEN_CREATED, [
        { text: BUTTONS.OK, onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error creating screen:', error);
      const errorMessage = error.response?.data?.message || error.message || ERROR_MESSAGES.FAILED_CREATE_SCREEN;
      Alert.alert(ALERTS.ERROR_TITLE, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Add Screen" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FormCard>
          
          {/* Section: Screen Details */}
          <SectionHeader title="Screen Details" />
          
          <UnifiedInput
            label="Screen Name"
            placeholder={PLACEHOLDERS.SCREEN_NAME}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={errors.name}
          />

          <UnifiedInput
            label="Address"
            required
            placeholder={PLACEHOLDERS.ADDRESS}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            error={errors.address}
          />

          <FormRow>
            <UnifiedInput
              label="Mesh Count"
              required
              placeholder={PLACEHOLDERS.MESH_COUNT}
              value={formData.mesh_count}
              onChangeText={(value) => handleInputChange('mesh_count', value)}
              keyboardType="numeric"
              error={errors.mesh_count}
            />

            <UnifiedInput
              label="Screen Size"
              required
              placeholder={PLACEHOLDERS.SCREEN_SIZE}
              value={formData.size}
              onChangeText={(value) => handleInputChange('size', value)}
              error={errors.size}
            />
          </FormRow>
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
  footer: {
    marginTop: hp(3.1),
    marginBottom: hp(2.5),
  },
});
