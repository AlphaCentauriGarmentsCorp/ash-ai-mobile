import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { additionalOptionsApi, type AdditionalOption, type UpdateAdditionalOptionRequest } from '@api';
import Button from '@components/common/Button';
import FormInput from '@components/common/FormInput';
import { usePoppinsFonts } from '@hooks';
import { Header } from '@layouts';
import { COLORS, SPACING } from '@styles';

// Label component for form fields
const Label = ({ text, required }: { text: string; required?: boolean }) => (
  <Text style={styles.label}>
    {text}
    {required && <Text style={styles.required}> *</Text>}
  </Text>
);

export default function EditAdditionalOptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const optionId = parseInt(params.id as string);
  console.log('EditAdditionalOptionScreen - params:', params);
  console.log('EditAdditionalOptionScreen - optionId:', optionId);

  const [originalData, setOriginalData] = useState<AdditionalOption | null>(null);
  const [formData, setFormData] = useState<UpdateAdditionalOptionRequest>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      if (optionId && !isNaN(optionId)) {
        try {
          setLoading(true);
          const response = await additionalOptionsApi.show(optionId);
          const option = response?.data || response;
          
          setOriginalData(option);
          setFormData({
            name: option.name || '',
            description: option.description || '',
          });
        } catch (error: any) {
          console.error('Error fetching additional option:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    loadData();
  }, [optionId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = (): boolean => {
    if (!originalData) return false;
    
    return (
      formData.name !== originalData.name ||
      formData.description !== (originalData.description || '')
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting.');
      return;
    }

    if (!hasChanges()) {
      Alert.alert('No Changes', 'No changes were made to save.');
      return;
    }

    try {
      setSaving(true);
      const response = await additionalOptionsApi.update(optionId, formData);
      
      console.log('API Response:', response);
      
      // Handle different response structures
      // If response has success field, use it; otherwise assume success if we got here without error
      const isSuccess = response.success !== undefined ? response.success : true;
      const message = response.message || 'Additional option updated successfully!';
      
      if (isSuccess) {
        Alert.alert('Success', message, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', message || 'Failed to update additional option');
      }
    } catch (error: any) {
      console.error('Error updating additional option:', error);
      
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const errorMessages = Object.entries(serverErrors)
          .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        
        Alert.alert('Validation Error', `Please fix the following issues:\n\n${errorMessages}`);
      } else {
        Alert.alert('Error', error.message || 'Failed to update additional option');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UpdateAdditionalOptionRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log('Rendering form with formData:', JSON.stringify(formData, null, 2));

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0D253F" />

      <View style={{ paddingTop: insets.top }}>
        <Header />
      </View>

      <View style={styles.pageTitleContainer}>
        <View style={styles.titleLeftGroup}>
          <View style={styles.iconCircleWrapper}>
            <Ionicons name="pencil" size={24} color="#0D253F" />
          </View>
          <Text style={styles.pageTitleText}>Edit Additional Option</Text>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Additional Options</Text>
            
            <View style={styles.fieldContainer}>
              <Label text="Label" required />
              <FormInput
                placeholder="Placeholder"
                value={formData.name || ''}
                onChangeText={(value) => handleInputChange('name', value)}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <Label text="Description" />
              <FormInput
                placeholder="Enter description here..."
                value={formData.description || ''}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={6}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              size="base"
              style={styles.cancelButton}
            />
            <Button
              title="Save"
              onPress={handleSubmit}
              variant="primary"
              size="base"
              loading={saving}
              disabled={!hasChanges()}
              style={styles.submitButton}
            />
          </View>
        </View>

        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  pageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.white,
  },
  titleLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#0D253F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  pageTitleText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0D253F',
  },
  formContainer: {
    padding: SPACING.lg,
  },
  formSection: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#D1E7F8',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1E3A8A',
    marginBottom: SPACING.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.base,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  cancelButton: {
    flex: 1,
    maxWidth: 120,
    backgroundColor: 'transparent',
    borderColor: '#6B7280',
    borderWidth: 1,
  },
  submitButton: {
    flex: 1,
    maxWidth: 120,
    backgroundColor: '#1E3A8A',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#374151',
    marginBottom: SPACING.sm,
  },
  required: {
    color: '#EF4444',
  },
  fieldContainer: {
    marginBottom: SPACING.xl,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#EF4444',
    marginTop: 4,
  },
});