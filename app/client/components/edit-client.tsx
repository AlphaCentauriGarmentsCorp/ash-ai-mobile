import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function EditClientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

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

  // UPDATE: This function now takes the text from the 'company' input 
  // and creates a new brand with that name.
  const handleAddBrand = () => {
    // 1. Validate if input is empty
    if (!company.trim()) return;

    // 2. Create new brand using the value from the 'company' input
    const newId = additionalBrands.length + 1;
    const newBrand = { 
      id: Date.now(), // Use unique ID
      name: company,  // <--- Uses the text you typed
      logo: '' 
    };

    setAdditionalBrands([...additionalBrands, newBrand]);

    // 3. Optional: Clear the input field after adding, so you can type a new one?
    // If 'company' represents the Main Client Name, you might NOT want to clear it.
    // If you want to clear it, uncomment the line below:
    // setCompany(''); 
  };

  const handleRemoveBrand = (id: number) => {
    setAdditionalBrands(additionalBrands.filter(brand => brand.id !== id));
  };

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
                 // UPDATE: Pressing Enter triggers the add function
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
          <TouchableOpacity style={styles.clearButtonContainer}>
             <Text style={styles.clearText}>Clear all fields</Text>
          </TouchableOpacity>
          <View style={styles.actionButtons}>
             <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                <Text style={styles.cancelText}>Cancel</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.submitBtn}>
                <Text style={styles.submitText}>Submit</Text>
             </TouchableOpacity>
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
    height: 60 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between'
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1
  },
  backButton: {
    padding: 5
  },
  breadCrumb: {
    color: '#A0A0A0',
    fontSize: 12
  },
  scrollContent: {
    padding: 15
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D253F'
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
    marginBottom: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  halfInputContainer: {
    width: '48%'
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    backgroundColor: '#FFF',
    paddingRight: 10
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#333',
    height: 38,
    borderWidth: 0
  },
  inputIcon: {
    marginLeft: 5
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addBrandBtn: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5
  },
  addBrandText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  helperTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 15
  },
  helperText: {
    fontSize: 9,
    color: '#F87171',
    flex: 1,
    marginRight: 5,
    lineHeight: 12
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  chooseFileBtn: {
    borderWidth: 1,
    borderColor: '#CCC',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 10
  },
  chooseFileText: {
    fontSize: 11,
    color: '#333'
  },
  fileNameText: {
    fontSize: 11,
    color: '#888',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingHorizontal: 5
  },
  additionalBrandsContainer: {
    marginTop: 5
  },
  additionalBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  fileDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 5,
    width: 100,
    height: 38
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5
  },
  footer: {
    marginTop: 25,
    marginBottom: 20
  },
  clearButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20
  },
  clearText: {
    color: '#4B5563',
    textDecorationLine: 'underline',
    fontSize: 12
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelBtn: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginRight: 15
  },
  cancelText: {
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 14
  },
  submitBtn: {
    backgroundColor: '#0D253F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30
  },
  submitText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14
  }
});