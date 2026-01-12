import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { hp, ms, rfs, wp } from "../../../utils/responsive";

interface OrderInfoProps {
  // Add props as needed for state management
}

export default function OrderInfo({}: OrderInfoProps) {
  const FormLabel = ({ text }: { text: string }) => <Text style={styles.label}>{text}</Text>;

  const CustomInput = ({ placeholder, value, icon, alignIconRight }: any) => (
    <View style={styles.inputWrapper}>
      {!alignIconRight && icon && <View style={styles.inputIconLeft}>{icon}</View>}
      <TextInput style={styles.textInput} placeholder={placeholder} placeholderTextColor="#999" value={value} />
      {alignIconRight && icon && <View style={styles.inputIconRight}>{icon}</View>}
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
      <SectionHeader title="Order Information" />
      <View style={styles.row}>
        <View style={styles.col}><FormLabel text="Client" /><DropdownMock placeholder="Select Client" /></View>
        <View style={styles.col}>
          <FormLabel text="Requested Deadline" />
          <CustomInput placeholder="Choose Date" alignIconRight icon={<Ionicons name="calendar-outline" size={ms(16)} color="#333" />} />
        </View>
      </View>
      <FormLabel text="Clothing/Company" />
      <View style={styles.disabledInput}><Text style={styles.disabledText}>Company or brand will automatically show here</Text></View>
      <View style={styles.row}>
        <View style={styles.col}><FormLabel text="Brand" /><DropdownMock placeholder="Select Brand" /></View>
        <View style={styles.col}><FormLabel text="Priority" /><DropdownMock placeholder="Select Priority" /></View>
      </View>

      <View style={{marginTop: 10}}><SectionHeader title="Product Details" /></View>
      <View style={styles.row}>
        <View style={styles.col}><FormLabel text="Apparel Type" /><DropdownMock placeholder="Select Apparel Type" /></View>
        <View style={styles.col}><FormLabel text="Pattern Type" /><DropdownMock placeholder="Select Pattern Type" /></View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}><FormLabel text="Fabric Type" /><DropdownMock placeholder="Select Fabric Type" /></View>
        <View style={styles.col}><FormLabel text="Service Type" /><DropdownMock placeholder="Select Service Type" /></View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}><FormLabel text="Print Method" /><DropdownMock placeholder="Select Print Method" /></View>
        <View style={styles.col}><FormLabel text="Size Label" /><DropdownMock placeholder="Select Size Label" /></View>
      </View>
      <FormLabel text="Fabric Color" /><CustomInput placeholder="Enter Fabric Color" />
      <TouchableOpacity style={styles.checkboxRow}>
        <View style={styles.checkbox} />
        <Text style={styles.checkboxLabel}>keep the same color for everybody</Text>
      </TouchableOpacity>
      <FormLabel text="Ribbing Color" /><CustomInput placeholder="Enter Ribbing Color" />
      <FormLabel text="Needle Color" /><CustomInput placeholder="Enter Needle Color" />
      <FormLabel text="Options" />
      <View style={styles.optionsGrid}>
        {[1,2,3,4,5,6,7,8].map((_, i) => (
          <TouchableOpacity key={i} style={styles.optionItem}>
             <View style={styles.checkbox} />
             <Text style={styles.optionText}>with Collar</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  inputIconRight: {
    marginLeft: wp(2.1),
  },
  inputIconLeft: {
    marginRight: wp(2.1),
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
  },
  checkbox: {
    width: ms(16),
    height: ms(16),
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: ms(3),
    marginRight: wp(2.1),
    backgroundColor: '#FFF',
  },
  checkboxLabel: {
    fontSize: rfs(10),
    color: '#666',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '25%',
    marginBottom: hp(1),
  },
  optionText: {
    fontSize: rfs(10),
    color: '#333',
  },
});
