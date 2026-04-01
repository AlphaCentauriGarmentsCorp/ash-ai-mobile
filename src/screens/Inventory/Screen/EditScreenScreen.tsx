import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenApi, type Screen } from '@api/screens';
import Button from '@components/common/Button';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';

export default function EditScreenScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  const screenId = params.id?.toString();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    size: '',
    mesh_count: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (screenId) {
      fetchScreenData();
    } else {
      Alert.alert('Error', 'Screen ID is missing');
      router.back();
    }
  }, [screenId]);

  const fetchScreenData = async () => {
    try {
      setIsLoading(true);
      
      const response = await screenApi.show(Number(screenId));
      const screenData: Screen = (response as any).data || response;
      
      setFormData({
        name: screenData.name || '',
        address: screenData.address || '',
        size: screenData.size || '',
        mesh_count: screenData.mesh_count?.toString() || '',
      });
      
    } catch (error) {
      console.error('Error fetching screen data:', error);
      Alert.alert('Error', 'Failed to load screen data');
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
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.size.trim()) newErrors.size = 'Screen size is required';
    if (!formData.mesh_count) newErrors.mesh_count = 'Mesh count is required';
    else if (parseInt(formData.mesh_count) < 0) newErrors.mesh_count = 'Mesh count must be positive';

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
      
      const submitData = {
        name: formData.name || undefined,
        address: formData.address,
        size: formData.size,
        mesh_count: parseInt(formData.mesh_count),
      };

      await screenApi.update(Number(screenId), submitData);
      
      Alert.alert('Success', 'Screen updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error updating screen:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update screen';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="Edit Screen" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D253F" />
          <Text style={styles.loadingText}>Loading screen data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Edit Screen" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          
          {/* Section: Screen Details */}
          <Text style={styles.sectionTitle}>Screen Details</Text>
          <View style={styles.divider} />
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Screen Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter screen name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              placeholder="Enter address"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Mesh Count <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.mesh_count && styles.inputError]}
                placeholder="Enter mesh count"
                value={formData.mesh_count}
                onChangeText={(value) => handleInputChange('mesh_count', value)}
                keyboardType="numeric"
              />
              {errors.mesh_count && <Text style={styles.errorText}>{errors.mesh_count}</Text>}
            </View>

            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Screen Size <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.size && styles.inputError]}
                placeholder="Enter screen size"
                value={formData.size}
                onChangeText={(value) => handleInputChange('size', value)}
              />
              {errors.size && <Text style={styles.errorText}>{errors.size}</Text>}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
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
              title={isSubmitting ? "Updating..." : "Update"}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.9),
  },
  halfInputContainer: {
    width: '48%',
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
  footer: {
    marginTop: hp(3.1),
    marginBottom: hp(2.5),
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
