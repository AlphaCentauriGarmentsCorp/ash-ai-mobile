import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supplierApi } from '@api/materialSuppliers';
import Button from '@components/common/Button';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';

const Label = ({ text }: { text: string }) => (
  <Text style={styles.label}>{text}</Text>
);

const Field = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  error,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: any;
  error?: string;
}) => (
  <View style={{ marginBottom: hp(1.8) }}>
    <TextInput
      style={[styles.input, error ? styles.inputError : null]}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export default function AddSupplierScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();

  const [codeName, setCodeName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [province, setProvince] = useState('');
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!codeName.trim()) e.codeName = 'Code name is required';
    if (!contactPerson.trim()) e.contactPerson = 'Contact person is required';
    if (!contactInfo.trim()) e.contactInfo = 'Contact Number is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email format';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await supplierApi.store({
        code_name: codeName.trim(),
        contact_person: contactPerson.trim(),
        contact_information: contactInfo.trim(),
        email: email.trim(),
        street: street.trim(),
        province: province.trim(),
        barangay: barangay.trim(),
        city: city.trim(),
        postal_code: postalCode.trim(),
        notes: notes.trim(),
      });
      Alert.alert('Success', 'Supplier added successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        Alert.alert('Error', err.response?.data?.message || 'Failed to add supplier');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setCodeName(''); setContactPerson(''); setContactInfo('');
    setEmail(''); setStreet(''); setProvince('');
    setBarangay(''); setCity(''); setPostalCode('');
    setNotes(''); setErrors({});
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Add Supplier Form" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>Supplier Form</Text>
        </View>

        <View style={styles.card}>
          {/* Supplier Form */}
          <Text style={styles.sectionTitle}>Supplier Form</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.half}>
              <Label text="Code Name" />
              <Field placeholder="Enter Code Name" value={codeName} onChangeText={setCodeName} error={errors.codeName} />
            </View>
            <View style={styles.half}>
              <Label text="Contact Person" />
              <Field placeholder="Enter Contact Person" value={contactPerson} onChangeText={setContactPerson} error={errors.contactPerson} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Label text="Contact Number" />
              <Field placeholder="Enter Contact Information" value={contactInfo} onChangeText={setContactInfo} keyboardType="phone-pad" error={errors.contactInfo} />
            </View>
            <View style={styles.half}>
              <Label text="Email" />
              <Field placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" error={errors.email} />
            </View>
          </View>

          {/* Address */}
          <Text style={[styles.sectionTitle, { marginTop: hp(1.5) }]}>Address</Text>
          <View style={styles.divider} />

          <Label text="Street" />
          <Field placeholder="Enter Street" value={street} onChangeText={setStreet} />

          <View style={styles.row}>
            <View style={styles.half}>
              <Label text="Province" />
              <Field placeholder="Enter Province" value={province} onChangeText={setProvince} />
            </View>
            <View style={styles.half}>
              <Label text="Barangay" />
              <Field placeholder="Enter Barangay" value={barangay} onChangeText={setBarangay} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Label text="City" />
              <Field placeholder="Enter City" value={city} onChangeText={setCity} />
            </View>
            <View style={styles.half}>
              <Label text="Postal Code" />
              <Field placeholder="Enter Postal Code" value={postalCode} onChangeText={setPostalCode} keyboardType="numeric" />
            </View>
          </View>

          {/* Notes */}
          <Text style={[styles.sectionTitle, { marginTop: hp(1.5) }]}>Notes</Text>
          <View style={styles.divider} />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional notes..."
            placeholderTextColor="#9CA3AF"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>Clear all fields</Text>
          </TouchableOpacity>
          <View style={styles.footerButtons}>
            <Button title="Cancel" onPress={() => router.back()} variant="outline" size="base" style={styles.cancelBtn} textStyle={{ color: '#1F2937' }} disabled={submitting} />
            <Button title={submitting ? 'Submitting...' : 'Submit'} onPress={handleSubmit} variant="primary" size="base" style={styles.submitBtn} disabled={submitting} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: wp(4), paddingBottom: hp(4) },
  breadcrumb: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    marginBottom: hp(2),
  },
  breadcrumbText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#000000ff',
  },
  card: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: wp(5),
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.bold,
    color: '#001C34',
    marginBottom: hp(1),
  },
  divider: { height: 1, backgroundColor: '#D1D5DB', marginBottom: hp(1.8) },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%' },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#001C34',
    marginBottom: hp(0.5),
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    fontSize: FONT_SIZES.sm,
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },
  inputError: { borderColor: '#F87171' },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: '#F87171',
    marginTop: hp(0.3),
    fontFamily: FONT_FAMILY.regular,
  },
  textArea: { height: hp(12), marginBottom: hp(1) },
  footer: { marginTop: hp(3) },
  clearText: {
    textAlign: 'right',
    textDecorationLine: 'underline',
    color: '#4B5563',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    marginBottom: hp(2),
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(4),
  },
  cancelBtn: { backgroundColor: '#E5E7EB', borderColor: '#E5E7EB', minWidth: wp(27) },
  submitBtn: { backgroundColor: '#0D253F', minWidth: wp(27) },
});
