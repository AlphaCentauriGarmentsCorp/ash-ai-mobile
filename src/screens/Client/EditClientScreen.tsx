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

  const clientId = params.id?.toString();

  // Form state
  const [firstName, setFirstName] = useState('Andrew');
  const [lastName, setLastName] = useState('Egido');
  const [email, setEmail] = useState('egidoandrew19@gmail.com');
  const [contactNumber, setContactNumber] = useState('09123456789');
  const [streetAddress, setStreetAddress] = useState('123 Main St');
  const [city, setCity] = useState('Quezon City');
  const [province, setProvince] = useState('Metro Manila');
  const [barangay, setBarangay] = useState('Barangay 1');
  const [postalCode, setPostalCode] = useState('1100');
  const [courier, setCourier] = useState('');
  const [method, setMethod] = useState('');
  const [notes, setNotes] = useState('');
  
  // Brand management
  const [brands, setBrands] = useState<ClientBrandInput[]>([{ name: 'LAPIS DE BLANKO', logo: null }]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (clientId) {
      fetchClientData();
    } else {
      setIsLoading(false);
    }
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      setIsLoading(true);
      const response = await clientService.getClientById(clientId!);
      const client = response.data || response;
      
      if (client.name) {
        const nameParts = client.name.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
      }
      setEmail(client.email || '');
      setContactNumber(client.contact_number || '');
      
      if (client.address) {
        const addressParts = client.address.split(', ');
        setStreetAddress(addressParts[0] || '');
        setCity(addressParts[1] || '');
        setProvince(addressParts[2] || '');
        setBarangay(addressParts[3] || '');
        setPostalCode(addressParts[4] || '');
      }
      setNotes(client.notes || '');
      
      if (client.brands && Array.isArray(client.brands) && client.brands.length > 0) {
        const clientBrands = client.brands.map((brand: any) => ({
          name: brand.name,
          logo: brand.logo ? { uri: brand.logo, name: brand.logo.split('/').pop() } : null,
        }));
        setBrands(clientBrands);
      }
    } catch (error: any) {
      console.error('Error fetching client:', error);
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
        if (fileExtension === 'png') mimeType = 'image/png';
        else if (fileExtension === 'webp') mimeType = 'image/webp';
        
        const file = { uri: uri, type: mimeType, name: fileName };
        updatedBrands[index].logo = file as any;
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
      
      if (clientId) {
        await clientService.updateClient(clientId, clientData);
      }
      
      Alert.alert('Success', 'Client updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Error updating client:', error);
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        setErrors(apiErrors);
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
              
              <Text style={styles.label}>Brand Name</Text>
              <TextInput 
                style={[styles.input, { marginBottom: hp(1.5) }, errors[`brands.${index}.name`] && styles.inputError]} 
                placeholder="Enter brand name here..."
                value={brand.name}
                onChangeText={(text) => handleBrandNameChange(index, text)}
              />
              {errors[`brands.${index}.name`] && (
                <Text style={styles.errorText}>{errors[`brands.${index}.name`]}</Text>
              )}

              {/* Logo Section */}
              <View style={styles.logoRow}>
                <Text style={styles.logoLabel}>Logo</Text>
                
                {/* Full Width File Input */}
                <View style={styles.fileInputWrapper}>
                  <TouchableOpacity 
                    style={styles.chooseFileBtn}
                    onPress={() => handlePickLogo(index)}
                  >
                    <Text style={styles.chooseFileText}>Choose Files</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.fileNameContainer}>
                    <Text style={styles.noFileText} numberOfLines={1} ellipsizeMode="tail">
                      {brand.logo ? brand.logo.name || 'File selected' : 'No file chosen'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Add/Remove Brand Button Below File Input */}
              <View style={styles.brandActionWrapper}>
                {index === 0 ? (
                  <>
                    <TouchableOpacity style={styles.addBrandBtn} onPress={handleAddBrand}>
                      <Text style={styles.addBrandText}>+ Add brand</Text>
                    </TouchableOpacity>
                    <Text style={styles.helperText}>* Press if client have additional brands</Text>
                  </>
                ) : (
                  <TouchableOpacity style={styles.removeBrandBtn} onPress={() => handleRemoveBrand(index)}>
                    <Text style={styles.addBrandText}>- Remove</Text>
                  </TouchableOpacity>
                )}
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
            placeholder="Additional notes about this client..." 
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />

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
    fontFamily: FONT_FAMILY.bold,
    color: '#111827',
    marginBottom: hp(1.2),
  },
  divider: {
    height: 1,
    backgroundColor: '#CFE0EE',
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
    fontFamily: FONT_FAMILY.bold,
    color: '#111827',
    marginBottom: hp(0.6),
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingHorizontal: wp(2.7),
    paddingVertical: hp(1.2),
    fontSize: FONT_SIZES.sm,
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
    color: '#1F2937',
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
  
  // --- BRAND & LOGO STYLES ---
  brandContainer: {
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.bold,
    color: '#111827',
    width: 50, // Fixed width so input stays aligned
  },
  fileInputWrapper: {
    flex: 1, // Takes up the remaining full width of the row
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 38,
  },
  chooseFileBtn: {
    backgroundColor: '#F3F4F6', // Light gray background
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  chooseFileText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#4B5563',
  },
  fileNameContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  noFileText: {
    fontSize: FONT_SIZES.xs,
    color: '#9CA3AF',
    fontFamily: FONT_FAMILY.regular,
  },
  brandActionWrapper: {
    alignItems: 'flex-end', // Aligns the button and text to the right
  },
  addBrandBtn: {
    backgroundColor: '#264660', // Dark navy blue
    paddingHorizontal: 20,
    height: 38,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  removeBrandBtn: {
    backgroundColor: '#F87171', // Red for remove
    paddingHorizontal: 20,
    height: 38,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  addBrandText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.bold,
  },
  helperText: {
    fontSize: 9, 
    color: '#F87171',
    fontFamily: FONT_FAMILY.regular,
    marginTop: 4,
    textAlign: 'right',
  },
  // -------------------------

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
    height: hp(15), 
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
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    minWidth: wp(26.7),
  },
  cancelText: {
    color: '#1F2937',
    fontFamily: FONT_FAMILY.bold,
  },
  submitBtn: {
    backgroundColor: '#0D253F',
    minWidth: wp(26.7),
  },
});