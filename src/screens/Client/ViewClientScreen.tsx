import Button from '@components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import clientService from '@services/client';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';
import { Image } from 'expo-image';
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

export default function ViewClientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  // Get client ID from params
  const clientId = params.id?.toString();

  // State for client data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [barangay, setBarangay] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [brands, setBrands] = useState<Array<{ name: string; logo?: string }>>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

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
      
      // Extract client data from response (API returns {data: client})
      const client = (response as any).data || response;
      
      console.log('Parsed client:', client);
      
      // Parse name into first and last name
      if (client.name) {
        const nameParts = client.name.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
      }
      
      setEmail(client.email || '');
      setContactNumber(client.contact_number || '');
      
      // Parse address if available
      if (client.address) {
        const addressParts = client.address.split(', ');
        setStreetAddress(addressParts[0] || '');
        setCity(addressParts[1] || '');
        setProvince(addressParts[2] || '');
        setBarangay(addressParts[3] || '');
        setPostalCode(addressParts[4] || '');
      }
      
      setNotes(client.notes || '');
      
      // Set brands if available
      if (client.brands && Array.isArray(client.brands) && client.brands.length > 0) {
        setBrands(client.brands);
        console.log('Brands loaded:', client.brands);
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

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader 
          title="View Client" 
          breadcrumbBold="Home" 
          breadcrumbNormal=" / View Client"
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
        title="View Client" 
        breadcrumbBold="Home" 
        breadcrumbNormal=" / View Client"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          
          {/* Client Information */}
          <View style={styles.sectionHeaderRow}>
             <Text style={styles.sectionTitle}>Client Information</Text>
             <TouchableOpacity 
                style={styles.innerEditBtn}
                onPress={() => router.push({ pathname: "/client/edit", params: { id: clientId } })}
             >
                <Ionicons name="pencil" size={12} color="#333" style={{marginRight:5}}/>
                <Text style={styles.innerEditText}>Edit</Text>
             </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput style={styles.input} value={firstName} editable={false} />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput style={styles.input} value={lastName} editable={false} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={email} editable={false} />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput style={styles.input} value={contactNumber} editable={false} />
            </View>
          </View>

          {/* Brands Section */}
          {brands.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Clothing/Company</Text>
              <View style={styles.divider} />
              
              {brands.map((brand, index) => (
                <View key={index} style={styles.brandContainer}>
                  <Text style={styles.brandLabel}>Brand {index + 1}</Text>
                  
                  <Text style={styles.label}>Brand Name</Text>
                  <TextInput 
                    style={styles.input} 
                    value={brand.name}
                    editable={false}
                  />

                  {brand.logo && (
                    <>
                      <Text style={[styles.label, { marginTop: hp(1.2) }]}>Logo</Text>
                      <View style={styles.logoPreviewContainer}>
                        <Image 
                          source={{ uri: brand.logo }} 
                          style={styles.logoPreview}
                          contentFit="contain"
                        />
                      </View>
                    </>
                  )}
                </View>
              ))}
            </>
          )}

          {/* Address */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Address</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput style={styles.input} value={streetAddress} editable={false} />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} value={city} editable={false} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Province</Text>
              <TextInput style={styles.input} value={province} editable={false} />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Barangay</Text>
              <TextInput style={styles.input} value={barangay} editable={false} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput style={styles.input} value={postalCode} editable={false} />
            </View>
            <View style={styles.halfInputContainer}>
              {/* Empty space for layout */}
            </View>
          </View>

          {/* Notes */}
          {notes && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Notes</Text>
              <View style={styles.divider} />
              <TextInput 
                style={[styles.input, styles.textArea]} 
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                value={notes}
                editable={false}
              />
            </>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Done"
            onPress={() => router.push('/client')}
            variant="primary"
            size="base"
            style={styles.doneBtn}
          />
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
    padding: wp(4) 
  },
  card: { 
    backgroundColor: '#EBF6FF', 
    borderRadius: 10, 
    padding: wp(5.3), 
    borderWidth: 1, 
    borderColor: '#D1D5DB' 
  },
  sectionHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  sectionTitle: { 
    fontSize: FONT_SIZES.lg, 
    fontFamily: FONT_FAMILY.bold, 
    color: COLORS.text 
  },
  innerEditBtn: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      borderWidth: 1, 
      borderColor: '#DDD', 
      paddingHorizontal: wp(2.7), 
      paddingVertical: hp(0.5), 
      borderRadius: 3 
  },
  innerEditText: { 
    fontSize: FONT_SIZES.xs, 
    color: COLORS.text, 
    fontFamily: FONT_FAMILY.semiBold,
  },
  divider: { 
    height: 1, 
    backgroundColor: '#e0e0e0', 
    marginVertical: hp(1.2), 
    marginBottom: hp(1.9) 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: hp(1.9) 
  },
  halfInputContainer: { 
    width: '48%' 
  },
  label: { 
    fontSize: FONT_SIZES.sm, 
    fontFamily: FONT_FAMILY.medium, 
    color: COLORS.text, 
    marginBottom: hp(0.6) 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 5, 
    paddingHorizontal: wp(2.7), 
    paddingVertical: hp(1), 
    fontSize: FONT_SIZES.sm, 
    fontFamily: FONT_FAMILY.regular,
    backgroundColor: '#F9FAFB',
    color: COLORS.text,
  },
  brandContainer: {
    marginBottom: hp(2),
    padding: wp(3),
    backgroundColor: COLORS.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  brandLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text,
    marginBottom: hp(1),
  },
  logoPreviewContainer: {
    marginTop: hp(0.6),
    alignSelf: 'flex-start',
  },
  logoPreview: {
    width: wp(30),
    height: hp(15),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  textArea: { 
    height: hp(12.5),
    textAlignVertical: 'top',
  },
  footer: { 
      marginTop: hp(3.1), 
      marginBottom: hp(2.5), 
      alignItems: 'center' 
  },
  doneBtn: { 
      backgroundColor: '#0D253F', 
      minWidth: wp(26.7),
  },
});
