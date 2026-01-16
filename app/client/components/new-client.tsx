import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '../../components/PageHeader';

export default function NewClientScreen() {
  const router = useRouter();

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
              <TextInput style={styles.input} placeholder="Enter first name" />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput style={styles.input} placeholder="Enter last name" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="Enter email" keyboardType="email-address" />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput style={styles.input} placeholder="Enter contact number" keyboardType="phone-pad" />
            </View>
          </View>

          {/* Section: Clothing/Company */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Clothing/Company</Text>
          <View style={styles.divider} />

          <View style={styles.brandRow}>
            <TextInput style={[styles.input, { flex: 1, marginRight: 10 }]} placeholder="Enter brand name here..." />
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
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Address</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput style={styles.input} placeholder="Enter street address" />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} placeholder="Enter city" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Province</Text>
              <TextInput style={styles.input} placeholder="Enter province" />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput style={styles.input} placeholder="Enter postal code" />
            </View>
          </View>

          {/* Section: Notes */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Notes</Text>
          <View style={styles.divider} />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Additional notes about this brand" 
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D253F',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInputContainer: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#FFF',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBrandBtn: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addBrandText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  helperTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 15,
  },
  helperText: {
    fontSize: 10,
    color: '#F87171',
    flex: 1,
    marginRight: 5,
  },
  fileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 5,
  },
  chooseFileBtn: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  chooseFileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  noFileText: {
    marginLeft: 10,
    fontSize: 12,
    color: '#666',
  },
  textArea: {
    height: 100,
  },
  footer: {
    marginTop: 25,
    marginBottom: 20,
  },
  clearButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  clearText: {
    color: '#4B5563',
    textDecorationLine: 'underline',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginRight: 15,
  },
  cancelText: {
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: '#0D253F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  submitText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});