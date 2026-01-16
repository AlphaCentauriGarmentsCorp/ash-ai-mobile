import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../constants';

export default function PaymentSummary() {
  return (
    <View style={styles.card}>
      {/* Section: Pricing & Payment Control */}
<Text style={styles.sectionTitle}>Pricing & Payment Control</Text>
<View style={styles.divider} />

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Unit Price</Text>
    <TextInput 
      style={styles.input} 
      placeholder="₱0.00" 
      keyboardType="decimal-pad"
    />
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Deposit %</Text>
    <TextInput 
      style={styles.input} 
      placeholder="Enter deposit percent" 
      keyboardType="numeric"
    />
  </View>
</View>

<View style={styles.fullInputContainer}>
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

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Estimated Total</Text>
  <TextInput 
    style={[styles.input, styles.estimatedTotalInput]} 
    value="₱0.00" 
    editable={false}
  />
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
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
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
  },
  halfInputContainer: {
    flex: 1,
    marginHorizontal: 5,
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
