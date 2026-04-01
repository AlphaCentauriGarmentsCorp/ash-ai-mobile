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

import { patternTypeApi, type UpdatePatternTypeRequest } from '@api';
import Button from '@components/common/Button';
import { UnifiedInput } from '@components/unified';
import { usePoppinsFonts } from '@hooks';
import { Header } from '@layouts';
import { COLORS, SPACING } from '@styles';

const Label = ({ text, required }: { text: string; required?: boolean }) => (
  <Text style={styles.label}>
    {text}
    {required && <Text style={styles.required}> *</Text>}
  </Text>
);

export default function EditPatternTypeScreen() {
  const params = useLocalSearchParams();
  const itemId = parseInt(params.id as string);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [formData, setFormData] = useState<UpdatePatternTypeRequest>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchPatternType();
  }, [itemId]);

  const fetchPatternType = async () => {
    try {
      setInitialLoading(true);
      const response = await patternTypeApi.show(itemId);
      
      if (response.success) {
        setFormData({
          name: response.data.name,
          description: response.data.description || '',
        });
      } else {
        Alert.alert('Error', 'Failed to load pattern type data');
        router.back();
      }
    } catch (error: any) {
      console.error('Error fetching pattern type:', error);
      Alert.alert('Error', 'Failed to load pattern type data');
      router.back();
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdatePatternTypeRequest, value: string) => {
    setFormData((prev: UpdatePatternTypeRequest) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await patternTypeApi.update(itemId, formData);
      
      console.log('API Response:', response);
      
      // Handle different response structures
      // If response has success field, use it; otherwise assume success if we got here without error
      const isSuccess = response.success !== undefined ? response.success : true;
      const message = response.message || 'Pattern type updated successfully!';
      
      if (isSuccess) {
        Alert.alert('Success', message, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', message || 'Failed to update pattern type');
      }
    } catch (error: any) {
      console.error('Error updating pattern type:', error);
      
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const errorMessages = Object.entries(serverErrors)
          .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        
        Alert.alert('Validation Error', `Please fix the following issues:\n\n${errorMessages}`);
      } else {
        Alert.alert('Error', error.message || 'Failed to update pattern type. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!fontsLoaded || initialLoading) return null;

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
          <Text style={styles.pageTitleText}>Edit Pattern Type</Text>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Label text="Name" required />
            <UnifiedInput
              variant="styled"
              placeholder="Enter pattern type name"
              value={formData.name || ''}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Label text="Description" />
            <UnifiedInput
              variant="styled"
              placeholder="Enter description (optional)"
              value={formData.description || ''}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="outline"
              size="base"
              style={styles.cancelButton}
            />
            <Button
              title="Update"
              onPress={handleSave}
              variant="primary"
              size="base"
              loading={loading}
              style={styles.saveButton}
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
  contentContainer: {
    flex: 1,
    padding: SPACING.base,
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
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#374151',
    marginBottom: SPACING.xs,
  },
  required: {
    color: '#EF4444',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.base,
    marginTop: SPACING.xl,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});