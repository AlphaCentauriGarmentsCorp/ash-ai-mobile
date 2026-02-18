import type { ClientBrandInput } from '@api/types';
import Button from '@components/common/Button';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import clientService from '@services/client';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditClientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  // Get client ID from params
  const clientId = params.id?.toString();

  // Form state
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch client data on mount
  useEffect(() => {
    if (clientId) {
      fetchClientData();
    } else {
      Alert.alert('Error', 'Client ID is missing');
      router.back();
    }
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      setIsLoading(true);
      const response = await clientService.getClientById(clientId!);
      
      console.log('Client data received:', response);
      
      // Extract client data from response (handle both direct and nested data)
      const client = response.data || response;
      
      console.log('Parsed client:', client);
      
      // Parse name into first and last name (handle if name doesn't exist)
      if (client.name) {
        const nameParts = client.name.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
      }
      
      setEmail(client.email || '');
      setContactNumber(client.contact_number || '');
      
      // Parse address if available (it's a comma-separated string)
      if (client.address) {
        const addressParts = client.address.split(', ');
        setStreetAddress(addressParts[0] || '');
        setCity(addressParts[1] || '');
        setProvince(addressParts[2] || '');
        setBarangay(addressParts[3] || '');
        setPostalCode(addressParts[4] || '');
      }
      
      setNotes(client.notes || '');
      
      // Set brands - check if brands exist in response
      if (client.brands && Array.isArray(client.brands) && client.brands.length > 0) {
        const clientBrands = client.brands.map(brand => ({
          name: brand.name,
          logo: brand.logo ? { uri: brand.logo, name: brand.logo.split('/').pop() } : null,
        }));
        setBrands(clientBrands);
        console.log('Brands loaded:', clientBrands);
      } else {
        // If no brands in response, keep at least one empty brand for the form
        console.log('No brands in response, using default empty brand');
        setBrands([{ name: '', logo: null }]);
      }
      
      console.log('Client data loaded successfully');
    } catch (error: any) {
      console.error('Error fetching client:', error);
      Alert.alert('Error', 'Failed to load client data');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBrand = () => {
    setBrands([...brands, { name: '', logo: null }]);
  };

  const handleBrandNameChange = (index: number, name: string) => {
    const updatedBrands = [...brands];
    updatedBrands[index].name = name;
    setBrands(updatedBrands);
  };

  const handlePickLogo = async (index: number) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const updatedBrands = [...brands];
        
        const uri = asset.uri;
        const fileName = asset.fileName || uri.split('/').pop() || `brand_logo_${index}.jpg`;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        
        let mimeType = 'image/jpeg';
        if (fileExtension === 'png') {
          mimeType = 'image/png';
        } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
          mimeType = 'image/jpeg';
        } else if (fileExtension === 'webp') {
          mimeType = 'image/webp';
        }
        
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

    if (!clientId) {
      Alert.alert('Error', 'Client ID is missing');
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

      console.log('Updating client with ID:', clientId);
      console.log('Updating client data:', {
        ...clientData,
        brands: clientData.brands.map(b => ({
          name: b.name,
          hasLogo: !!b.logo,
          logoUri: b.logo?.uri
        }))
      });
      
      const response = await clientService.updateClient(clientId, clientData);
      
      console.log('Client updated successfully:', response);
      Alert.alert('Success', 'Client updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Error updating client:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle validation errors from API
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        setErrors(apiErrors);
        
        // Show first error message
        const firstError = Object.values(apiErrors)[0];
        Alert.alert('Validation Error', Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update client';
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

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader 
          title="Edit Client" 
          breadcrumbBold="Home" 
          breadcrumbNormal=" / Edit Client"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D253F" />
          <Text style={styles.loadingText}>Loading client data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader 
        title="Edit Client" 
        breadcrumbBold="Home" 
        breadcrumbNormal=" / Edit Client"
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
            <View key={index} style={styles.brandContainer}>
              <View style={styles.brandHeader}>
                <Text style={styles.brandLabel}>Brand {index + 1}</Text>
                {brands.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveBrand(index)}>
                    <Text style={styles.removeBrandText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Brand Name</Text>
              <TextInput 
                style={[styles.input, errors[`brands.${index}.name`] && styles.inputError]} 
                placeholder="Enter brand name"
                value={brand.name}
                onChangeText={(text) => handleBrandNameChange(index, text)}
              />
              {errors[`brands.${index}.name`] && (
                <Text style={styles.errorText}>{errors[`brands.${index}.name`]}</Text>
              )}

              <Text style={[styles.label, { marginTop: hp(1.2) }]}>Logo</Text>
              <View style={styles.fileInputContainer}>
                <TouchableOpacity 
                  style={styles.chooseFileBtn}
                  onPress={() => handlePickLogo(index)}
                >
                  <Text style={styles.chooseFileText}>Choose file</Text>
                </TouchableOpacity>
                <Text style={styles.noFileText}>
                  {brand.logo ? (brand.logo.name || 'File selected') : 'No file chosen'}
                </Text>
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

          <TouchableOpacity style={styles.addBrandBtn} onPress={handleAddBrand}>
            <Text style={styles.addBrandText}>+ Add another brand</Text>
          </TouchableOpacity>

          <View style={styles.helperTextContainer}>
            <Text style={styles.helperText}>* Fill in brand name and optionally upload a logo</Text>
            <Text style={styles.helperText}>* Click <Text style={{fontWeight:'bold'}}>Add another brand</Text> if company has multiple brands</Text>
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
              <Text style={styles.label}>Barangay</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter barangay"
                value={barangay}
                onChangeText={setBarangay}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter postal code"
                value={postalCode}
                onChangeText={setPostalCode}
              />
            </View>
            <View style={styles.halfInputContainer}>
              {/* Empty space for layout */}
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
  inputError: {
    borderColor: '#F87171',
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: '#F87171',
    marginTop: hp(0.3),
    fontFamily: FONT_FAMILY.regular,
  },
  brandContainer: {
    marginBottom: hp(2),
    padding: wp(3),
    backgroundColor: COLORS.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  brandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  brandLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text,
  },
  removeBrandText: {
    fontSize: FONT_SIZES.xs,
    color: '#F87171',
    fontFamily: FONT_FAMILY.medium,
  },
  addBrandBtn: {
    backgroundColor: '#1E3A5F',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: hp(1),
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
