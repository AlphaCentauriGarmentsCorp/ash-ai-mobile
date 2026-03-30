import Button from '@components/common/Button';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';
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

import { supplierApi, type CreateSupplierRequest } from '@api/materialSuppliers';

export default function EditSupplierScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  const supplierId = params.id?.toString();

  const [codeName, setCodeName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [province, setProvince] = useState('');
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (supplierId) {
      fetchSupplierData();
    } else {
      Alert.alert('Error', 'Supplier ID is missing');
      router.back();
    }
  }, [supplierId]);

  const fetchSupplierData = async () => {
    try {
      setIsLoading(true);
      const response = await supplierApi.show(Number(supplierId));
      
      const supplier = (response as any).data || response;
      
      setCodeName(supplier.code_name || '');
      setContactPerson(supplier.contact_person || '');
      setContactNumber(supplier.contact_information || '');
      setEmail(supplier.email || '');
      setStreet(supplier.street || '');
      setProvince(supplier.province || '');
      setBarangay(supplier.barangay || '');
      setCity(supplier.city || '');
      setPostalCode(supplier.postal_code || '');
      setNotes(supplier.notes || '');
      
    } catch (error: any) {
      console.error('Error fetching supplier:', error);
      Alert.alert('Error', 'Failed to load supplier data');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!codeName.trim()) newErrors.code_name = 'Code name is required';
    if (!contactPerson.trim()) newErrors.contact_person = 'Contact person is required';
    if (!contactNumber.trim()) newErrors.contact_information = 'Contact number is required';
    else if (contactNumber.length < 10) newErrors.contact_information = 'Contact number must be at least 10 digits';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const supplierData: Partial<CreateSupplierRequest> = {
        code_name: codeName.trim(),
        contact_person: contactPerson.trim(),
        contact_information: contactNumber.trim(),
        email: email.trim(),
        street: street.trim(),
        province: province.trim(),
        barangay: barangay.trim(),
        city: city.trim(),
        postal_code: postalCode.trim(),
        notes: notes.trim(),
      };

      console.log('Updating supplier data:', supplierData);
      
      await supplierApi.update(Number(supplierId), supplierData);
      
      Alert.alert('Success', 'Supplier updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Error updating supplier:', error);
      
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        setErrors(apiErrors);
        
        const firstError = Object.values(apiErrors)[0];
        Alert.alert('Validation Error', Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update supplier';
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="Edit Supplier" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D253F" />
          <Text style={styles.loadingText}>Loading supplier data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader title="Edit Supplier" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          
          <Text style={styles.sectionTitle}>Supplier Form</Text>
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Code Name</Text>
              <TextInput 
                style={[styles.input, errors.code_name && styles.inputError]} 
                placeholder="Enter Code Name"
                value={codeName}
                onChangeText={setCodeName}
              />
              {errors.code_name && (
                <Text style={styles.errorText}>{errors.code_name}</Text>
              )}
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Contact Person</Text>
              <TextInput 
                style={[styles.input, errors.contact_person && styles.inputError]} 
                placeholder="Enter Contact Person"
                value={contactPerson}
                onChangeText={setContactPerson}
              />
              {errors.contact_person && (
                <Text style={styles.errorText}>{errors.contact_person}</Text>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput 
                style={[styles.input, errors.contact_information && styles.inputError]} 
                placeholder="Enter Contact Number" 
                keyboardType="phone-pad"
                value={contactNumber}
                onChangeText={setContactNumber}
              />
              {errors.contact_information && (
                <Text style={styles.errorText}>{errors.contact_information}</Text>
              )}
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={[styles.input, errors.email && styles.inputError]} 
                placeholder="Enter Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Address</Text>
          <View style={styles.divider} />

          <View style={styles.fullInputContainer}>
            <Text style={styles.label}>Street</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter Street"
              value={street}
              onChangeText={setStreet}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Province</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter Province"
                value={province}
                onChangeText={setProvince}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Barangay</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter Barangay"
                value={barangay}
                onChangeText={setBarangay}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter City"
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter Postal Code"
                keyboardType="number-pad"
                value={postalCode}
                onChangeText={setPostalCode}
              />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Notes</Text>
          <View style={styles.divider} />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Additional notes about this supplier" 
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />

        </View>

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
    fontFamily: "Poppins_700Bold",
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
  fullInputContainer: {
    width: '100%',
    marginBottom: hp(1.9),
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: "Poppins_600SemiBold",
    color: '#001C34',
    marginBottom: hp(0.6),
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
