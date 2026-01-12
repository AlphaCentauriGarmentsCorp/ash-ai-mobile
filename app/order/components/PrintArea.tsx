import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { hp, ms, rfs, wp } from "../../../utils/responsive";

interface PrintAreaProps {
  // Add props as needed for state management
}

export default function PrintArea({}: PrintAreaProps) {
  const FormLabel = ({ text }: { text: string }) => <Text style={styles.label}>{text}</Text>;

  const CustomInput = ({ placeholder, value }: any) => (
    <View style={styles.inputWrapper}>
      <TextInput style={styles.textInput} placeholder={placeholder} placeholderTextColor="#999" value={value} />
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

  const CounterInput = ({ label, value }: { label: string, value: number }) => (
    <View style={styles.counterContainer}>
      <Text style={styles.counterLabel}>{label}</Text>
      <View style={styles.counterWrapper}>
        <TouchableOpacity style={styles.counterBtn}><Text style={styles.counterBtnText}>-</Text></TouchableOpacity>
        <TextInput style={styles.counterInput} value={value.toString()} editable={false} />
        <TouchableOpacity style={styles.counterBtn}><Text style={styles.counterBtnText}>+</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
       <SectionHeader title="Print Area" />
       <FormLabel text="Select Print Area" />
       <DropdownMock placeholder="Select Print Area" />
       
       <View style={{marginTop: 12}}>
         <CustomInput placeholder="Enter print area color" />
       </View>

       <View style={styles.grayBox}>
          <View style={styles.row}>
             <View style={styles.col}><CounterInput label="Height" value={0} /></View>
             <View style={styles.col}><CounterInput label="Width" value={0} /></View>
          </View>
          <View style={styles.row}>
             <View style={styles.col}><CounterInput label="X-offset" value={0} /></View>
             <View style={styles.col}><CounterInput label="Y-offset" value={0} /></View>
          </View>
       </View>

       <TouchableOpacity style={styles.darkButton}>
          <Text style={styles.darkButtonText}>+ Add print location</Text>
       </TouchableOpacity>
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
  row: {
    flexDirection: 'row',
    gap: wp(3.2),
  },
  col: {
    flex: 1,
  },
  grayBox: {
    backgroundColor: '#DDEAF6',
    padding: wp(3.2),
    borderRadius: ms(8),
    marginTop: hp(1.5),
  },
  counterContainer: {
    marginBottom: hp(1),
  },
  counterLabel: {
    fontSize: rfs(11),
    fontWeight: '600',
    marginBottom: hp(0.5),
    color: '#333',
  },
  counterWrapper: {
    flexDirection: 'row',
    height: hp(4.4),
  },
  counterBtn: {
    backgroundColor: '#0B1C36',
    width: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(4),
  },
  counterBtnText: {
    color: '#FFF',
    fontSize: rfs(16),
    fontWeight: 'bold',
  },
  counterInput: {
    flex: 1,
    backgroundColor: '#FFF',
    textAlign: 'center',
    fontSize: rfs(12),
    marginHorizontal: wp(1.1),
    borderRadius: ms(4),
  },
  darkButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: hp(1.5),
    borderRadius: ms(20),
    alignItems: 'center',
    marginTop: hp(2),
  },
  darkButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: rfs(12),
  },
});
