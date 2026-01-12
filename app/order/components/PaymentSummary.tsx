import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { hp, ms, rfs, wp } from "../../../utils/responsive";

interface PaymentSummaryProps {
  // Add props as needed for state management
}

export default function PaymentSummary({}: PaymentSummaryProps) {
  const FormLabel = ({ text }: { text: string }) => <Text style={styles.label}>{text}</Text>;

  const CustomInput = ({ placeholder }: any) => (
    <View style={styles.inputWrapper}>
      <TextInput style={styles.textInput} placeholder={placeholder} placeholderTextColor="#999" />
    </View>
  );

  const DropdownMock = ({ placeholder }: { placeholder: string }) => (
    <TouchableOpacity style={styles.dropdown}>
      <Text style={styles.dropdownText}>{placeholder}</Text>
      <Ionicons name="chevron-down" size={ms(16)} color="#666" />
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionDivider} />
    </View>
  );

  return (
    <View style={styles.card}>
       <SectionHeader title="Pricing & Payment Control" />
       
       <View style={styles.row}>
          <View style={styles.col}>
             <FormLabel text="Unit Price" />
             <CustomInput placeholder="P 0.00" />
          </View>
          <View style={styles.col}>
             <FormLabel text="Deposit %" />
             <CustomInput placeholder="Enter deposit percent" />
          </View>
       </View>

       <FormLabel text="Payment Method" />
       <DropdownMock placeholder="Select Payment Method" />

       <FormLabel text="Estimated Total" />
       <View style={styles.disabledInput}><Text style={styles.disabledText}>P 0.00</Text></View>

       <View style={{marginTop: 16}}><SectionHeader title="Order Summary" /></View>
       <View style={styles.summaryBox}><Text style={styles.previewText}>Preview will show here</Text></View>
       <View style={styles.summaryBox}><Text style={styles.previewText}>Preview will show here</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EAF4FC',
    borderRadius: ms(12),
    padding: wp(4.3),
    marginBottom: hp(1.2),
  },
  label: {
    fontSize: rfs(12),
    fontWeight: '700',
    color: '#333',
    marginBottom: hp(0.7),
    marginTop: hp(1.5),
  },
  sectionHeaderContainer: {
    marginBottom: hp(1.5),
    marginTop: hp(0.5),
  },
  sectionTitle: {
    fontSize: rfs(16),
    fontWeight: 'bold',
    color: '#0B1C36',
    marginBottom: hp(0.5),
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#CBD5E0',
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D9E6',
    borderRadius: ms(6),
    paddingHorizontal: wp(2.7),
    height: hp(4.9),
  },
  textInput: {
    flex: 1,
    fontSize: rfs(12),
    color: '#333',
    height: '100%',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D9E6',
    borderRadius: ms(6),
    paddingHorizontal: wp(2.7),
    height: hp(4.9),
  },
  dropdownText: {
    fontSize: rfs(12),
    color: '#666',
  },
  disabledInput: {
    backgroundColor: '#DDEAF6',
    borderColor: '#C0D0E0',
    borderWidth: 1,
    borderRadius: ms(6),
    paddingHorizontal: wp(2.7),
    height: hp(4.9),
    justifyContent: 'center',
  },
  disabledText: {
    fontSize: rfs(12),
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    gap: wp(3.2),
  },
  col: {
    flex: 1,
  },
  summaryBox: {
    borderWidth: 1,
    borderColor: '#D1D9E6',
    backgroundColor: '#FFF',
    height: hp(7.4),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(6),
    marginBottom: hp(1.5),
  },
  previewText: {
    fontSize: rfs(10),
    color: '#AAA',
  },
});
