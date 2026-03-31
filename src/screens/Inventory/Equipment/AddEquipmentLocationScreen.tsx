import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { equipmentLocationApi } from '@api/equipment';
import Button from '@components/common/Button';
import FormInput from '@components/common/FormInput';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from '@styles';
import { hp } from '@utils/responsive';

export default function AddEquipmentLocationScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Location name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await equipmentLocationApi.store({
        name: formData.name,
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
            title="Save"
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
