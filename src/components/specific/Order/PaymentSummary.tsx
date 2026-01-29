import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import React, { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const PaymentSummary = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    clearFields: () => {
      // PaymentSummary doesn't have state yet, but we'll add this for future use
      console.log('Clear PaymentSummary fields');
    }
  }));

  return (
    <View style={styles.card}>
      {/* Section: Pricing & Payment Control */}
<Text style={styles.sectionTitle}>Pricing & Payment Control</Text>
<View style={styles.divider} />

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Payment Method</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Payment Method" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Deposit %</Text>
    <TextInput 
      style={styles.blueInput} 
      placeholder="60%" 
      editable={false}
    />
  </View>
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Total Left</Text>
  <TextInput 
    style={styles.blueInput} 
    placeholder="₱0.00" 
    editable={false}
  />
</View>

{/* Section: Receipt and Bank Account Details */}
<Text style={[styles.sectionTitle, { marginTop: 20 }]}>Receipt and Bank Account Details</Text>
<View style={styles.divider} />

<View style={styles.uploadBox}>
  <Text style={styles.uploadIcon}>⬇</Text>
  <Text style={styles.uploadText}>Upload Receipt and Bank Account Details</Text>
  <Text style={styles.uploadSubtext}>image/*.ai.psd (max 10MB)</Text>
</View>

<View style={styles.uploadedFilesBox}>
  <Text style={styles.uploadedLabel}>Uploaded files</Text>
  <Text style={styles.placeholderText}>Preview will show here</Text>
</View>

{/* Section: Order Summary */}
<Text style={[styles.sectionTitle, { marginTop: 20 }]}>Order Summary</Text>
<View style={styles.divider} />

<View style={styles.summaryBox}>
  <Text style={styles.summaryPlaceholder}>*Please add show here</Text>
</View>

<View style={styles.summaryBox}>
  <Text style={styles.summaryPlaceholder}>*Please add show here</Text>
</View>
    </View>
  );
});

PaymentSummary.displayName = 'PaymentSummary';

export default PaymentSummary;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.text,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  halfInputContainer: {
    flex: 1,
  },
  fullInputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    paddingRight: 35,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
    fontSize: 12,
    color: '#666',
  },
  blueInput: {
    backgroundColor: '#d4e8f0',
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
  },
  uploadBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
    color: '#333',
  },
  uploadText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#999',
    marginBottom: 2,
  },
  uploadSubtext: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#bbb',
  },
  uploadedFilesBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  uploadedLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
    color: '#999',
    marginBottom: 5,
  },
  placeholderText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#ccc',
    fontStyle: 'italic',
  },
  estimatedTotalInput: {
    backgroundColor: '#d4e8f0',
    color: '#333',
    fontFamily: FONT_FAMILY.semiBold,
  },
  summaryBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 40,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryPlaceholder: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#ccc',
    fontStyle: 'italic',
  },
});
