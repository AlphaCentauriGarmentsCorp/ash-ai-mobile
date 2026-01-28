import Button from '@components/common/Button';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewClientScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [brandName, setBrandName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  const handleClearAll = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setContactNumber('');
    setBrandName('');
    setStreetAddress('');
    setCity('');
    setProvince('');
    setPostalCode('');
    setNotes('');
  };

  const handleSubmit = () => {
    console.log('Submit client');
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader 
        title="Add Client" 
        breadcrumb="Home / New Client"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          
          {/* Section: Client Information */}
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter email" 
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter contact number" 
                keyboardType="phone-pad"
                value={contactNumber}
                onChangeText={setContactNumber}
              />
            </View>
          </View>

          {/* Section: Clothing/Company */}
          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Clothing/Company</Text>
          <View style={styles.divider} />

          <View style={styles.brandRow}>
            <TextInput 
              style={[styles.input, { flex: 1, marginRight: wp(2.7) }]} 
              placeholder="Enter brand name here..."
              value={brandName}
              onChangeText={setBrandName}
            />
            <TouchableOpacity style={styles.addBrandBtn}>
              <Text style={styles.addBrandText}>+ Add brand</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.helperTextContainer}>
            <Text style={styles.helperText}>* Press <Text style={{fontWeight:'bold'}}>enter</Text> to confirm the brand name</Text>
            <Text style={styles.helperText}>* Press <Text style={{fontWeight:'bold'}}>add brand</Text> button if company has additional brands</Text>
          </View>

          <Text style={styles.label}>Logo</Text>
          <View style={styles.fileInputContainer}>
            <TouchableOpacity style={styles.chooseFileBtn}>
              <Text style={styles.chooseFileText}>Choose files</Text>
            </TouchableOpacity>
            <Text style={styles.noFileText}>No file chosen</Text>
          </View>

          {/* Section: Address */}
          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Address</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter street address"
                value={streetAddress}
                onChangeText={setStreetAddress}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter city"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Province</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter province"
                value={province}
                onChangeText={setProvince}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter postal code"
                value={postalCode}
                onChangeText={setPostalCode}
              />
            </View>
          </View>

          {/* Section: Notes */}
          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Notes</Text>
          <View style={styles.divider} />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Additional notes about this brand" 
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButtonContainer} onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear all fields</Text>
          </TouchableOpacity>
          
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              size="base"
              style={styles.cancelBtn}
              textStyle={styles.cancelText}
            />
            
            <Button
              title="Submit"
              onPress={handleSubmit}
              variant="primary"
              size="base"
              style={styles.submitBtn}
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
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.text,
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
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBrandBtn: {
    backgroundColor: '#1E3A5F',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderRadius: 5,
  },
  addBrandText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.semiBold,
  },
  helperTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(0.6),
    marginBottom: hp(1.9),
  },
  helperText: {
    fontSize: FONT_SIZES.xs,
    color: '#F87171',
    flex: 1,
    marginRight: wp(1.3),
    fontFamily: FONT_FAMILY.regular,
  },
  fileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: hp(0.6),
    backgroundColor: '#fff',
  },
  chooseFileBtn: {
    backgroundColor: '#E5E7EB',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  chooseFileText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
  },
  noFileText: {
    marginLeft: wp(2.7),
    fontSize: FONT_SIZES.xs,
    color: '#666',
    fontFamily: FONT_FAMILY.regular,
  },
  textArea: {
    height: hp(12.5),
  },
  footer: {
    marginTop: hp(3.1),
    marginBottom: hp(2.5),
  },
  clearButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: hp(2.5),
  },
  clearText: {
    color: '#4B5563',
    textDecorationLine: 'underline',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
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
