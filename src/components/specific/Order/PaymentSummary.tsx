import { Ionicons } from '@expo/vector-icons';
import { FONT_FAMILY } from '@styles';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PaymentSummary = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    clearFields: () => {
      console.log('Clear PaymentSummary fields');
    }
  }));

  return (
    <View style={styles.card}>
      {/* --- NEW SECTION: Freebies --- */}
      <Text style={styles.sectionTitle}>Freebies</Text>
      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Items</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Select Client" 
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter Quantity" 
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Others</Text>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownPlaceholder}>Choose Freebies package</Text>
          <Ionicons name="chevron-down" size={16} color="#6B7280" />
        </View>
      </View>

      {/* Section: Pricing & Payment Control */}
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Pricing & Payment Control</Text>
      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownPlaceholder}>Select Payment Method</Text>
            <Ionicons name="chevron-down" size={16} color="#6B7280" />
          </View>
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Deposit %</Text>
          <TextInput 
            style={styles.blueInput} 
            placeholder="60%" 
            placeholderTextColor="#1F2937"
            editable={false}
          />
        </View>
      </View>

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Total Left</Text>
        <TextInput 
          style={styles.blueInput} 
          placeholder="₱0.00" 
          placeholderTextColor="#1F2937"
          editable={false}
        />
      </View>

      {/* Section: Receipt and Bank Account Details */}
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Receipt and Bank Account Details</Text>
      <View style={styles.divider} />

      <TouchableOpacity style={styles.uploadBox}>
        <Image 
          source={require('../../../assets/images/download-solid-full.png')} 
          style={styles.uploadIconImage} 
        />
        <Text style={styles.uploadText}>Upload Receipt and Bank Account Details</Text>
        <Text style={styles.uploadSubtext}>image/*.ai, .psd (max 10MB)</Text>
      </TouchableOpacity>

      <View style={styles.uploadedFilesBox}>
        <Text style={styles.uploadedLabel}>Uploaded files</Text>
        <Text style={styles.placeholderText}>Preview will show here</Text>
      </View>

      {/* Section: Order Summary */}
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Order Summary</Text>
      <View style={styles.divider} />

      <View style={styles.summaryBox}>
        <Text style={styles.summaryPlaceholder}>Preview will show here</Text>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryPlaceholder}>Preview will show here</Text>
      </View>

     
    </View>
  );
});

PaymentSummary.displayName = 'PaymentSummary';

export default PaymentSummary;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EBF6FF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.bold,
    color: '#111827',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  halfInputContainer: {
    flex: 1,
  },
  fullInputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.bold,
    color: '#1F2937',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  dropdownPlaceholder: {
    fontSize: 10,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
  },
  blueInput: {
    backgroundColor: '#DCEAF5',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#CFE0EE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadIconImage: {
    width: 24,
    height: 24,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  uploadText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.medium,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  uploadSubtext: {
    fontSize: 11,
    fontFamily: FONT_FAMILY.regular,
    color: '#D1D5DB',
    marginTop: 2,
  },
  uploadedFilesBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 15,
    minHeight: 60,
    justifyContent: 'center',
    marginBottom: 15,
  },
  uploadedLabel: {
    position: 'absolute',
    top: 8,
    left: 12,
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    color: '#9CA3AF',
  },
  placeholderText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    color: '#D1D5DB',
    textAlign: 'center',
    marginTop: 12,
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 30,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryPlaceholder: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    color: '#D1D5DB',
  },
  clearAllText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    textAlign: 'right',
    textDecorationLine: 'underline',
    marginTop: 5,
  }
});