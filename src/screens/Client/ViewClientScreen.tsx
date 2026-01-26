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

export default function ViewClientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  // Initialize state with passed parameters
  const initialFirstName = params.name ? params.name.toString().split(' ')[0] : 'Morgan';
  const initialLastName = params.name ? params.name.toString().split(' ').slice(1).join(' ') : 'Lee';

  const [firstName] = useState(initialFirstName);
  const [lastName] = useState(initialLastName);
  const [email] = useState(params.email?.toString() || 'sample@gmail.com');
  const [contact] = useState(params.contact?.toString() || '0999123456');
  const [company] = useState(params.company?.toString() || 'Adidas');
  
  // Address & Notes
  const [street] = useState('Blk. 1, Lot 2, Mother Ignacia');
  const [city] = useState('Quezon City');
  const [province] = useState('Province');
  const [postal] = useState('2042');
  const [notes] = useState('Do not do unto others what you don\'t want to do to you');

  // --- Additional Brands State (Read-Only) ---
  const [additionalBrands] = useState([
    { id: 1, name: 'Brand # 1', logo: 'logo1.png' } 
  ]);

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
        <Text style={styles.headerTitle}>{company}</Text>
        <Text style={styles.breadCrumb}>Home / View Clients</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          
          {/* Client Information */}
          <View style={styles.sectionHeaderRow}>
             <Text style={styles.sectionTitle}>Client Information</Text>
             <TouchableOpacity 
                style={styles.innerEditBtn}
                onPress={() => router.push({ pathname: "/client/edit", params: params })}
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
              <TextInput style={styles.input} value={contact} editable={false} />
            </View>
          </View>

          {/* Company Section */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Clothing/Company</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
             <View style={{flex:1}}>
                <TextInput style={styles.input} value={company} editable={false} />
             </View>
          </View>

          {/* Main Logo Row */}
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

          {/* --- Additional Brands Section --- */}
          <View style={styles.additionalBrandsContainer}>
            <Text style={styles.smallLabel}>Additional brands</Text>
            
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
                    <Text style={{fontSize: 12, color:'#333'}}>{brand.logo}</Text>
                </View>

                {/* View Icon Only */}
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

        {/* --- UPDATED FOOTER: DONE BUTTON REDIRECTS TO INDEX --- */}
        <View style={styles.footer}>
          <Button
            title="Done"
            onPress={() => router.push('/client')}
            variant="primary"
            size="base"
            style={styles.doneBtn}
          />
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
    justifyContent: 'space-between',
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
      borderRadius: wp(1.1) 
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
    borderRadius: wp(1.3), 
    paddingHorizontal: wp(2.7), 
    paddingVertical: hp(1), 
    fontSize: FONT_SIZES.sm, 
    fontFamily: FONT_FAMILY.regular,
    backgroundColor: COLORS.white, 
    color: COLORS.text,
    height: hp(4.8),
  },
  
  // Logo Section
  logoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: hp(1.2) 
  },
  disabledFileBtn: { 
      borderWidth: 1, 
      borderColor: '#CCC', 
      backgroundColor: '#F3F4F6', 
      paddingVertical: hp(0.5), 
      paddingHorizontal: wp(2.7), 
      borderRadius: wp(1.1), 
      marginRight: 0 
  },
  chooseFileText: { 
    fontSize: FONT_SIZES.xs, 
    fontFamily: FONT_FAMILY.medium,
    color: '#888' 
  },
  fileNameText: { 
      fontSize: FONT_SIZES.xs, 
      fontFamily: FONT_FAMILY.regular,
      color: '#888', 
      borderWidth: 1,
      borderLeftWidth: 0,
      borderColor: '#CCC',
      paddingVertical: hp(0.5),
      paddingHorizontal: wp(2.7),
      borderTopRightRadius: wp(1.1),
      borderBottomRightRadius: wp(1.1),
  },

  // Additional Brands Styles
  additionalBrandsContainer: { 
    marginTop: hp(0.6), 
    marginBottom: hp(1.2) 
  },
  smallLabel: { 
    fontSize: FONT_SIZES.xs, 
    fontFamily: FONT_FAMILY.regular,
    color: '#888', 
    marginBottom: hp(0.6) 
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
    width: wp(26.7), 
    height: hp(4.8),
    backgroundColor: COLORS.white,
  },

  textArea: { 
    height: hp(12.5) 
  },
  
  // Footer
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
