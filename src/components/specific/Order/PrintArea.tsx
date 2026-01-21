import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../../constants';

export default function PrintArea() {
  return (
    <View style={styles.card}>
      {/* Section: Print Area */}
<Text style={styles.sectionTitle}>Print Area</Text>
<View style={styles.divider} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Select Print Area</Text>
  <View style={styles.dropdownContainer}>
    <TextInput 
      style={styles.input} 
      placeholder="Select Print Area" 
      editable={false}
    />
    <Text style={styles.dropdownIcon}>▼</Text>
  </View>
</View>

<View style={styles.fullInputContainer}>
  <TextInput 
    style={styles.input} 
    placeholder="Enter print area color" 
  />
</View>

{/* Height and Width Controls */}
<View style={styles.dimensionsCard}>
  <View style={styles.row}>
    <View style={styles.halfInputContainer}>
      <Text style={styles.label}>Height</Text>
      <View style={styles.counterRow}>
        <TouchableOpacity style={styles.counterBtn}>
          <Text style={styles.counterBtnText}>-</Text>
        </TouchableOpacity>
        <TextInput 
          style={styles.counterInput} 
          value="0"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.counterBtn}>
          <Text style={styles.counterBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.halfInputContainer}>
      <Text style={styles.label}>Width</Text>
      <View style={styles.counterRow}>
        <TouchableOpacity style={styles.counterBtn}>
          <Text style={styles.counterBtnText}>-</Text>
        </TouchableOpacity>
        <TextInput 
          style={styles.counterInput} 
          value="0"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.counterBtn}>
          <Text style={styles.counterBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>

  {/* X-offset and Y-offset Controls */}
  <View style={styles.row}>
    <View style={styles.halfInputContainer}>
      <Text style={styles.label}>X-offset</Text>
      <View style={styles.counterRow}>
        <TouchableOpacity style={styles.counterBtn}>
          <Text style={styles.counterBtnText}>-</Text>
        </TouchableOpacity>
        <TextInput 
          style={styles.counterInput} 
          value="0"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.counterBtn}>
          <Text style={styles.counterBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.halfInputContainer}>
      <Text style={styles.label}>Y-offset</Text>
      <View style={styles.counterRow}>
        <TouchableOpacity style={styles.counterBtn}>
          <Text style={styles.counterBtnText}>-</Text>
        </TouchableOpacity>
        <TextInput 
          style={styles.counterInput} 
          value="0"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.counterBtn}>
          <Text style={styles.counterBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</View>

{/* Add Print Location Button */}
<TouchableOpacity style={styles.addPrintLocationBtn}>
  <Text style={styles.addPrintLocationText}>+ Add print location</Text>
</TouchableOpacity>
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
  dropdownContainer: {
    position: 'relative',
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
  dropdownIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
    fontSize: 12,
    color: '#666',
  },
  dimensionsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterBtn: {
    backgroundColor: '#1F2937',
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: FONT_FAMILY.bold,
  },
  counterInput: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    textAlign: 'center',
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
  },
  addPrintLocationBtn: {
    backgroundColor: '#2d3e50',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  addPrintLocationText: {
    color: '#fff',
    fontSize: FONT_SIZES.base,
    fontFamily: FONT_FAMILY.semiBold,
  },
});
