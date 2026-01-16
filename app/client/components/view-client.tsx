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

export default function ViewClientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Initialize state with passed parameters
  const initialFirstName = params.name ? params.name.toString().split(' ')[0] : 'Morgan';
  const initialLastName = params.name ? params.name.toString().split(' ').slice(1).join(' ') : 'Lee';

  const [firstName] = useState(initialFirstName);
  const [lastName] = useState(initialLastName);
  const [email] = useState(params.email?.toString() || 'sample@gmail.com');
  const [contact] = useState(params.contact?.toString() || '0999123456');
  const [company] = useState(params.company?.toString() || 'Adidas');
  
  // Extra fields
  const [street] = useState('Blk. 1, Lot 2, Mother Ignacia');
  const [city] = useState('Quezon City');
  const [province] = useState('Province');
  const [postal] = useState('2042');
  const [notes] = useState('Do not do unto others what you don\'t want to do to you');

  // --- Additional Brands State (Mock Data for View) ---
  const [additionalBrands] = useState([
    { id: 1, name: 'Brand # 1', logo: 'logo.png' } 
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D253F" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        {/* Dynamic Title based on Company */}
        <Text style={styles.headerTitle}>{company}</Text>
        <Text style={styles.breadCrumb}>Home / View Clients</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          
          {/* Client Information Header with Edit Button */}
          <View style={styles.sectionHeaderRow}>
             <Text style={styles.sectionTitle}>Client Information</Text>
             <TouchableOpacity 
                style={styles.innerEditBtn}
                onPress={() => {
                    router.push({ pathname: "/edit-client", params: params });
                }}
             >
                <Ionicons name="pencil" size={12} color="#333" style={{marginRight:5}}/>
                <Text style={styles.innerEditText}>Edit</Text>
             </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          
          {/* Read-Only Fields */}
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
              <TextInput style={styles.input} value={contact} editable={false} />
            </View>
          </View>

          {/* Company */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Clothing/Company</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
             <View style={{flex:1}}>
                <TextInput style={styles.input} value={company} editable={false} />
             </View>
          </View>

          {/* Logo Section (View Mode) */}
          <View style={styles.logoRow}>
            <Text style={[styles.label, {width: 40, marginTop:0, marginBottom:0}]}>Logo</Text>
            <View style={styles.disabledFileBtn}>
               <Text style={styles.chooseFileText}>Choose Files</Text>
            </View>
            <Text style={styles.fileNameText}>Logo.png</Text>
            <TouchableOpacity style={{marginLeft: 10}}>
                <Ionicons name="eye-outline" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          {/* --- NEW: Additional Brands (Read Only) --- */}
          <View style={styles.additionalBrandsContainer}>
            <Text style={[styles.label, {fontSize: 10, color:'#888', marginBottom: 5}]}>Additional brands</Text>
            
            {additionalBrands.map((brand) => (
              <View key={brand.id} style={styles.additionalBrandRow}>
                {/* Brand Name Input */}
                <View style={{ flex: 1, marginRight: 10 }}>
                    <TextInput 
                      style={styles.input} 
                      value={brand.name}
                      editable={false}
                    />
                </View>

                {/* File Display */}
                <View style={styles.fileDisplay}>
                    <Ionicons name="document-text-outline" size={14} color="#666" style={{marginRight: 5}}/>
                    <Text style={{fontSize: 12, color:'#333'}}>{brand.logo || 'logo.png'}</Text>
                </View>

                {/* View Action Only */}
                <TouchableOpacity style={{marginLeft: 10}}>
                    <Ionicons name="eye-outline" size={18} color="#666" />
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
              <TextInput style={styles.input} value={street} editable={false} />
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
              <Text style={styles.label}>Postal Code</Text>
              <TextInput style={styles.input} value={postal} editable={false} />
            </View>
          </View>

          {/* Notes */}
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
        </View>

        {/* --- UPDATED FOOTER: DONE BUTTON ONLY --- */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.doneBtn} 
              // Uses router.push('/') to go to the main index page
             onPress={() => router.push('/client')}>
             <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  header: {
    backgroundColor: '#0D253F',
    height: 60 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between',
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10, flex: 1 },
  backButton: { padding: 5 },
  breadCrumb: { color: '#A0A0A0', fontSize: 12 },
  scrollContent: { padding: 15 },
  card: { backgroundColor: '#FFF', borderRadius: 10, padding: 20, borderWidth: 1, borderColor: '#D1D5DB' },
  
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0D253F' },
  innerEditBtn: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      borderWidth: 1, 
      borderColor: '#DDD', 
      paddingHorizontal: 10, 
      paddingVertical: 4, 
      borderRadius: 4 
  },
  innerEditText: { fontSize: 12, color: '#333', fontWeight: '600' },

  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10, marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  halfInputContainer: { width: '48%' },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 5 },
  
  input: { 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 5, 
    paddingHorizontal: 10, 
    paddingVertical: 8, 
    fontSize: 13, 
    backgroundColor: '#FFF', 
    color: '#333',
    height: 38,
  },
  
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  disabledFileBtn: { 
      borderWidth: 1, 
      borderColor: '#CCC', 
      backgroundColor: '#F3F4F6', 
      paddingVertical: 4, 
      paddingHorizontal: 10, 
      borderRadius: 4, 
      marginRight: 0 
  },
  chooseFileText: { fontSize: 11, color: '#888' },
  fileNameText: { 
      fontSize: 11, 
      color: '#888', 
      borderWidth: 1,
      borderLeftWidth: 0,
      borderColor: '#CCC',
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
  },

  // --- Styles for Additional Brands ---
  additionalBrandsContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  additionalBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fileDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: 100, 
    height: 38,
    backgroundColor: '#FFF',
  },

  textArea: { height: 100 },
  
 // Updated Footer for "Done" button
  footer: { 
      marginTop: 25, 
      marginBottom: 20, 
      alignItems: 'center' 
  },
  doneBtn: { 
      backgroundColor: '#0D253F', 
      paddingVertical: 12, 
      paddingHorizontal: 40, 
      borderRadius: 30 
  },
  doneText: { 
      color: '#FFF', 
      fontWeight: '700', 
      fontSize: 14 
  },
});