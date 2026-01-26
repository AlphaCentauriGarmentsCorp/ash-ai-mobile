import Button from '@components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { usePoppinsFonts } from '@hooks';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditClientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  // Initialize state
  const initialFirstName = params.name ? params.name.toString().split(' ')[0] : 'Morgan';
  const initialLastName = params.name ? params.name.toString().split(' ').slice(1).join(' ') : 'Lee';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(params.email?.toString() || 'sample@gmail.com');
  const [contact, setContact] = useState(params.contact?.toString() || '0999123456');
  
  // This is the input next to the "+ Add Brand" button
  const [company, setCompany] = useState(params.company?.toString() || 'Adidas');
  
  // Extra fields
  const [street, setStreet] = useState('Blk. 1, Lot 2, Mother Ignacia');
  const [city, setCity] = useState('Quezon City');
  const [province, setProvince] = useState('Province');
  const [postal, setPostal] = useState('2042');
  const [notes, setNotes] = useState('');

  // --- Additional Brands State ---
  const [additionalBrands, setAdditionalBrands] = useState([
    { id: 1, name: 'Brand # 1', logo: 'logo.png' } 
  ]);

  const handleAddBrand = () => {
    if (!company.trim()) return;

    const newBrand = { 
      id: Date.now(),
      name: company,
      logo: '' 
    };

    setAdditionalBrands([...additionalBrands, newBrand]);
  };

  const handleRemoveBrand = (id: number) => {
    setAdditionalBrands(additionalBrands.filter(brand => brand.id !== id));
  };

  const handleClearAll = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setContact('');
    setCompany('');
    setStreet('');
    setCity('');
    setProvince('');
    setPostal('');
    setNotes('');
    setAdditionalBrands([]);
  };

  const handleSubmit = () => {
    console.log('Submit edit');
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D253F" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Client</Text>
        <Text style={styles.breadCrumb}>Home / Edit Client</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          
          {/* Client Information */}
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
             <Text style={styles.sectionTitle}>Client Information</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
                <Ionicons name="pencil" size={14} color="#666" style={styles.inputIcon} />
              </View>
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
                <Ionicons name="pencil" size={14} color="#666" style={styles.inputIcon} />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
                <Ionicons name="pencil" size={14} color="#666" style={styles.inputIcon} />
              </View>
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Contact Number</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} value={contact} onChangeText={setContact} keyboardType="phone-pad" />
                <Ionicons name="pencil" size={14} color="#666" style={styles.inputIcon} />
              </View>
            </View>
          </View>

          {/* --- Clothing/Company Section --- */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Clothing/Company</Text>
          <View style={styles.divider} />
          
          {/* Main Brand Input */}
          <View style={styles.brandRow}>
            <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
               <TextInput 
                 style={styles.input} 
                 value={company} 
                 onChangeText={setCompany}
                 placeholder="Enter brand name here..."
                 onSubmitEditing={handleAddBrand} 
                 returnKeyType="done"
               />
               <Ionicons name="pencil" size={14} color="#666" style={styles.inputIcon} />
            </View>
            <TouchableOpacity style={styles.addBrandBtn} onPress={handleAddBrand}>
              <Text style={styles.addBrandText}>+ Add brand</Text>
            </TouchableOpacity>
          </View>

          {/* Helper Text */}
          <View style={styles.helperTextContainer}>
             <Text style={styles.helperText}>* Press <Text style={{fontWeight:'bold', color:'#F87171'}}>enter</Text> to confirm the brand name</Text>
             <Text style={[styles.helperText, {textAlign:'right'}]}>* Press <Text style={{fontWeight:'bold', color:'#F87171'}}>add brand</Text> button if company has{'\n'}additional brands</Text>
          </View>

          {/* Main Logo Row */}
          <View style={styles.logoRow}>
            <Text style={[styles.label, {width: 40, marginTop:0, marginBottom:0}]}>Logo</Text>
            <TouchableOpacity style={styles.chooseFileBtn}>
               <Text style={styles.chooseFileText}>Choose files</Text>
            </TouchableOpacity>
            <Text style={styles.fileNameText}>logo.png</Text>
            
            <View style={{flex:1}}/>
            
            <TouchableOpacity style={{marginRight: 10}}>
                <Ionicons name="globe-outline" size={18} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons name="remove-circle" size={18} color="#0D253F" />
            </TouchableOpacity>
          </View>

          {/* --- Additional Brands List --- */}
          <View style={styles.additionalBrandsContainer}>
            <Text style={[styles.label, {fontSize: 10, color:'#888', marginBottom: 5}]}>Additional brands</Text>
            
            {additionalBrands.map((brand, index) => (
              <View key={brand.id} style={styles.additionalBrandRow}>
                {/* Brand Name Input */}
                <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                    <TextInput 
                      style={styles.input} 
                      value={brand.name}
                      onChangeText={(text) => {
                        const newBrands = [...additionalBrands];
                        newBrands[index].name = text;
                        setAdditionalBrands(newBrands);
                      }}
                    />
                    <Ionicons name="pencil" size={14} color="#666" style={styles.inputIcon} />
                </View>

                {/* File Display */}
                <View style={styles.fileDisplay}>
                    <Ionicons name="document-text-outline" size={14} color="#666" style={{marginRight: 5}}/>
                    <Text style={{fontSize: 12, color:'#333'}}>{brand.logo || 'logo.png'}</Text>
                </View>

                {/* Actions */}
                <TouchableOpacity style={{marginHorizontal: 8}}>
                    <Ionicons name="globe-outline" size={18} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveBrand(brand.id)}>
                    <Ionicons name="remove-circle" size={18} color="#0D253F" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Address */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Address</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Street Address</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} value={street} onChangeText={setStreet} />
                <Ionicons name="pencil" size={14} color="#666" style={styles.inputIcon} />
              </View>
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>City</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} value={city} onChangeText={setCity} />
                <Ionicons name="pencil" size={14} color="#666" style={styles.inputIcon} />
              </View>
            </View>
          </View>
          
          <View style={styles.row}>
             <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Province</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} value={province} onChangeText={setProvince} />
                <Ionicons name="pencil" size={14} color="#666" style={styles.inputIcon} />
              </View>
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Postal Code</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} value={postal} onChangeText={setPostal} />
                <Ionicons name="pencil" size={14} color="#666" style={styles.inputIcon} />
              </View>
            </View>
          </View>

          {/* Notes */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Notes</Text>
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
        
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF'
  },
  header: {
    backgroundColor: '#0D253F',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    justifyContent: 'space-between'
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.bold,
    marginLeft: wp(2.7),
    flex: 1
  },
  backButton: {
    padding: wp(1.3)
  },
  breadCrumb: {
    color: '#A0A0A0',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
  },
  scrollContent: {
    padding: wp(4)
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: wp(2.7),
    padding: wp(5.3),
    borderWidth: 1,
    borderColor: '#D1D5DB'
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.text,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: wp(1.3),
    backgroundColor: COLORS.white,
    paddingRight: wp(2.7)
  },
  input: {
    flex: 1,
    paddingHorizontal: wp(2.7),
    paddingVertical: hp(1),
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
    height: hp(4.8),
    borderWidth: 0
  },
  inputIcon: {
    marginLeft: wp(1.3)
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addBrandBtn: {
    backgroundColor: '#1E3A5F',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderRadius: wp(1.3)
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
    marginBottom: hp(1.9)
  },
  helperText: {
    fontSize: FONT_SIZES.xs,
    color: '#F87171',
    flex: 1,
    marginRight: wp(1.3),
    lineHeight: hp(1.5),
    fontFamily: FONT_FAMILY.regular,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.2)
  },
  chooseFileBtn: {
    borderWidth: 1,
    borderColor: '#CCC',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2.7),
    borderRadius: wp(1.1),
    marginRight: wp(2.7)
  },
  chooseFileText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
  },
  fileNameText: {
    fontSize: FONT_SIZES.xs,
    color: '#888',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingHorizontal: wp(1.3),
    fontFamily: FONT_FAMILY.regular,
  },
  additionalBrandsContainer: {
    marginTop: hp(0.6)
  },
  additionalBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.2)
  },
  fileDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: wp(1.3),
    paddingVertical: hp(1),
    paddingHorizontal: wp(2.7),
    marginRight: wp(1.3),
    width: wp(26.7),
    height: hp(4.8)
  },
  textArea: {
    height: hp(12.5),
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: wp(1.3)
  },
  footer: {
    marginTop: hp(3.1),
    marginBottom: hp(2.5)
  },
  clearButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: hp(2.5)
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
  },
  submitBtn: {
    backgroundColor: '#0D253F',
    minWidth: wp(26.7),
  },
});
