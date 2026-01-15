  import { Stack, useRouter } from 'expo-router';
import React from 'react';
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

  export default function NewClientScreen() {
    const router = useRouter();

    return (
      <SafeAreaView style={styles.container}>
        {/* Hide the default header if you want to use your custom one */}
        <Stack.Screen options={{ headerShown: false }} />
        
        {/* --- Custom Header --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Client</Text>
          <Text style={styles.breadCrumb}>Home / New Client</Text>
        </View>

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

          {/* Footer Buttons */}
          {/* Footer */}
          <View style={styles.footer}>
            {/* Top Row: Clear Text aligned to the right */}
            <TouchableOpacity style={styles.clearButtonContainer}>
              <Text style={styles.clearText}>Clear all fields</Text>
            </TouchableOpacity>
            
            {/* Bottom Row: Buttons centered */}
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
      backgroundColor: '#F5F9FF', // Light blue background behind card
      
      
    },
    header: {
      backgroundColor: '#0D253F',
      height: 60 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      justifyContent: 'space-between',
    },
    headerTitle: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
      flex: 1,
    },
    backButton: {
      padding: 5,
    },
    breadCrumb: {
      color: '#A0A0A0',
      fontSize: 12,
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
      color: '#F87171', // Reddish helper text
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
    // ... other styles ...

    footer: {
      marginTop: 25,
      marginBottom: 20,
    },
    clearButtonContainer: {
      alignItems: 'flex-end', // Pushes "Clear all fields" to the right
      marginBottom: 20,      // Adds space between the text and the buttons
    },
    clearText: {
      color: '#4B5563', // Dark grey
      textDecorationLine: 'underline',
      fontSize: 12,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'center', // Centers the buttons horizontally
      alignItems: 'center',
    },
    cancelBtn: {
      backgroundColor: '#E5E7EB', // Light grey background (pill style)
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 30, // Fully rounded corners
      marginRight: 15,  // Space between Cancel and Submit
    },
    cancelText: {
      color: '#1F2937', // Dark text
      fontWeight: '700',
      fontSize: 14,
    },
    submitBtn: {
      backgroundColor: '#0D253F', // Navy background
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 30, // Fully rounded corners
    },
    submitText: {
      color: '#FFF',
      fontWeight: '700',
      fontSize: 14,
    },
  });