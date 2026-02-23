import type { ClientBrandInput } from '@api/types';
import Button from '@components/common/Button';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import clientService from '@services/client';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewClientScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [barangay, setBarangay] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [courier, setCourier] = useState('');
  const [method, setMethod] = useState('');
  const [notes, setNotes] = useState('');
  
  // Brand management
  const [brands, setBrands] = useState<ClientBrandInput[]>([{ name: '', logo: null }]);
  
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddBrand = () => {
    // Add new brand to the list
    setBrands([...brands, { name: '', logo: null }]);
  };

  const handleBrandNameChange = (index: number, name: string) => {
    const updatedBrands = [...brands];
    updatedBrands[index].name = name;
    setBrands(updatedBrands);
  };

  const handlePickLogo = async (index: number) => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access photos');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const updatedBrands = [...brands];
        
        // Determine MIME type from URI or filename
        const uri = asset.uri;
        const fileName = asset.fileName || uri.split('/').pop() || `brand_logo_${index}.jpg`;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        
        let mimeType = 'image/jpeg'; // default
        if (fileExtension === 'png') {
          mimeType = 'image/png';
        } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
          mimeType = 'image/jpeg';
        } else if (fileExtension === 'webp') {
          mimeType = 'image/webp';
        }
        
        // Create file object for FormData
        const file = {
          uri: uri,
          type: mimeType,
          name: fileName,
        };
        
        console.log('Selected file:', file);
        updatedBrands[index].logo = file;
        setBrands(updatedBrands);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleRemoveBrand = (index: number) => {
    if (brands.length === 1) {
      Alert.alert('Error', 'At least one brand is required');
      return;
    }
    const updatedBrands = brands.filter((_, i) => i !== index);
    setBrands(updatedBrands);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.first_name = 'First name is required';
    if (!lastName.trim()) newErrors.last_name = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!contactNumber.trim()) newErrors.contact_number = 'Contact number is required';
    else if (contactNumber.length < 10) newErrors.contact_number = 'Contact number must be at least 10 digits';
    
    // Validate brands
    const validBrands = brands.filter(b => b.name.trim());
    if (validBrands.length === 0) {
      newErrors.brands = 'At least one brand is required';
    }

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
      // Filter out empty brands
      const validBrands = brands.filter(b => b.name.trim());

      const clientData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        contact_number: contactNumber.trim(),
        street_address: streetAddress.trim() || '',
        city: city.trim() || '',
        province: province.trim() || '',
        barangay: barangay.trim() || '',
        postal_code: postalCode.trim() || '',
        courier: courier.trim() || '',
        method: method.trim() || '',
        notes: notes.trim() || '',
        brands: validBrands,
      };

      console.log('Submitting client data:', clientData);
      
      const response = await clientService.createClient(clientData);
      
      console.log('Client created successfully:', response);
      Alert.alert('Success', 'Client created successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Error creating client:', error);
      
      // Handle validation errors from API
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        setErrors(apiErrors);
        
        // Show first error message
        const firstError = Object.values(apiErrors)[0];
        Alert.alert('Validation Error', Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create client';
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAll = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setContactNumber('');
    setStreetAddress('');
    setCity('');
    setProvince('');
    setBarangay('');
    setPostalCode('');
    setCourier('');
    setMethod('');
    setNotes('');
    setBrands([{ name: '', logo: null }]);
    setErrors({});
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader 
        title="Add Client" 
        breadcrumbBold= "Home" 
        breadcrumbNormal=" / Add Clients"
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
                style={[styles.input, errors.first_name && styles.inputError]} 
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
              />
              {errors.first_name && (
                <Text style={styles.errorText}>{errors.first_name}</Text>
              )}
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput 
                style={[styles.input, errors.last_name && styles.inputError]} 
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
              />
              {errors.last_name && (
                <Text style={styles.errorText}>{errors.last_name}</Text>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={[styles.input, errors.email && styles.inputError]} 
                placeholder="Enter email" 
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput 
                style={[styles.input, errors.contact_number && styles.inputError]} 
                placeholder="Enter contact number" 
                keyboardType="phone-pad"
                value={contactNumber}
                onChangeText={setContactNumber}
              />
              {errors.contact_number && (
                <Text style={styles.errorText}>{errors.contact_number}</Text>
              )}
            </View>
          </View>

          {/* Section: Clothing/Company */}
          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Clothing/Company</Text>
          <View style={styles.divider} />

          {errors.brands && (
            <Text style={styles.errorText}>{errors.brands}</Text>
          )}

          {brands.map((brand, index) => (
            <View key={index} style={styles.brandItemContainer}>
              
              <TextInput 
                style={[styles.input, errors[`brands.${index}.name`] && styles.inputError, { marginBottom: hp(1.5) }]} 
                placeholder="Enter brand name here..."
                placeholderTextColor="#9CA3AF"
                value={brand.name}
                onChangeText={(text) => handleBrandNameChange(index, text)}
              />
              {errors[`brands.${index}.name`] && (
                <Text style={styles.errorText}>{errors[`brands.${index}.name`]}</Text>
              )}

              {/* Logo and Add Button Row */}
              <View>
                {/* Left: Logo File Picker */}
                <View style={styles.logoSection}>
                  <Text style={styles.logoLabelText}>Logo</Text>
                  <View style={styles.filePickerWrapper}>
                    <TouchableOpacity 
                      style={styles.chooseFileButton}
                      onPress={() => handlePickLogo(index)}
                    >
                      <Text style={styles.chooseFileBtnText}>Choose Files</Text>
                    </TouchableOpacity>
                    <View style={styles.noFileBox}>
                      <Text style={styles.noFileBoxText} numberOfLines={1} ellipsizeMode="tail">
                        {brand.logo ? brand.logo.name || 'File selected' : 'No file chosen'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right: Add Brand Button or Remove Button */}
                <View style={styles.actionSection}>
                  {index === brands.length - 1 ? (
                    <View style={styles.addBrandWrapper}>
                      <TouchableOpacity style={styles.addBrandBtnNew} onPress={handleAddBrand}>
                        <Text style={styles.addBrandTextNew}>+ Add brand</Text>
                      </TouchableOpacity>
                      <Text style={styles.helperTextRed}>* Press if client have additional brands</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.removeBrandBtnNew} onPress={() => handleRemoveBrand(index)}>
                      <Text style={styles.removeBrandTextNew}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {brand.logo && brand.logo.uri && (
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: brand.logo.uri }} 
                    style={styles.imagePreview}
                    contentFit="contain"
                  />
                  <TouchableOpacity 
                    style={styles.removeImageBtn}
                    onPress={() => {
                      const updatedBrands = [...brands];
                      updatedBrands[index].logo = null;
                      setBrands(updatedBrands);
                    }}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              {errors[`brands.${index}.logo`] && (
                <Text style={styles.errorText}>{errors[`brands.${index}.logo`]}</Text>
              )}
            </View>
          ))}

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
              disabled={isSubmitting}
            />
            
            <Button
              title={isSubmitting ? "Submitting..." : "Submit"}
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
    color: '#001C34', // Adjusted to match the deep blue headers in the image
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
  
  // --- NEW STYLES FOR CLOTHING/COMPANY MATCHING IMAGE 1 ---
  brandItemContainer: {
    marginBottom: hp(2),
  },
  // logoAddRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'flex-start',
  // },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: wp(2),
  },
  logoLabelText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: "Poppins_700Bold",
    color: '#001C34',
    marginRight: wp(2),
  },
  filePickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    overflow: 'hidden',
    height: hp(4),
    flex: 1,
    backgroundColor: COLORS.white,
  },
  chooseFileButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  chooseFileBtnText: {
    fontSize: 10,
    fontFamily: FONT_FAMILY.medium,
    color: '#4B5563',
  },
  noFileBox: {
    paddingHorizontal: wp(2),
    justifyContent: 'center',
    flex: 1,
  },
  noFileBoxText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: FONT_FAMILY.regular,
  },
  actionSection: {
    alignItems: 'flex-end',
    minWidth: wp(25),
  },
  addBrandWrapper: {
    alignItems: 'center',
  },
  addBrandBtnNew: {
    backgroundColor: '#1E3A5F', // Dark blue match
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    borderRadius: 6,
    width: '100%',
    marginLeft: wp(11),
    marginTop: hp(1.5),
  
    alignItems: 'center'
  },
  addBrandTextNew: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: "Poppins_600SemiBold",
  },
  helperTextRed: {
    color: '#EF4444',
    fontSize: 8, 
    fontFamily: FONT_FAMILY.regular,
    marginTop: hp(0.5),
    textAlign: 'center',
  },
  removeBrandBtnNew: {
    backgroundColor: '#F87171',
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    borderRadius: 6,
    marginTop: hp(1.9),
    marginRight: wp(2),
  },
  removeBrandTextNew: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontFamily: "Poppins_600SemiBold",
  },
  
  // --- IMAGE PREVIEW ---
  imagePreviewContainer: {
    marginTop: hp(1.2),
    position: 'relative',
    alignSelf: 'flex-start',
  },
  imagePreview: {
    width: wp(30),
    height: hp(15),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  removeImageBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F87171',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  removeImageText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
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