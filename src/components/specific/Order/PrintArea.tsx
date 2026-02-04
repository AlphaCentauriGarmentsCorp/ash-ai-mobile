import { Ionicons } from '@expo/vector-icons';
import { FONT_FAMILY } from '@styles';
import { ms } from "@utils/responsive";

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PrintArea = forwardRef((props, ref) => {
  // --- STATE MANAGEMENT FOR COUNTERS ---
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
    xOffset: 0,
    yOffset: 0,
  });

  // --- HANDLERS ---
  const handleIncrement = (field) => {
    setDimensions(prev => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const handleDecrement = (field) => {
    setDimensions(prev => ({ ...prev, [field]: Math.max(0, prev[field] - 1) })); // Prevent negative values
  };

  const handleChangeText = (field, value) => {
    const numValue = parseInt(value, 10);
    setDimensions(prev => ({ ...prev, [field]: isNaN(numValue) ? 0 : numValue }));
  };

  useImperativeHandle(ref, () => ({
    clearFields: () => {
      // Reset all counters to 0
      setDimensions({ height: 0, width: 0, xOffset: 0, yOffset: 0 });
      console.log('Clear PrintArea fields');
    }
  }));

  return (
    <View style={styles.card}>
      {/* Section: Print Area */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Print Area</Text>
      </View>
      <View style={styles.divider} />

      {/* Select Print Area Dropdown */}
      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Select Print Area</Text>
        <View style={styles.dropdownContainer}>
           <Text style={[styles.dropdownInput, { color: '#9CA3AF', paddingTop: ms(5) }]}>
             Select Print Area
           </Text>
           <Ionicons name="chevron-down" size={14} color="#6B7280" style={styles.dropdownIcon} />
        </View>
      </View>

      {/* Print Area Color Input */}
      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Print Area Color</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter print area color" 
          placeholderTextColor="#9CA3AF"
        />
        {/* Checkbox */}
        <TouchableOpacity style={styles.checkboxRow} activeOpacity={0.7}>
            <View style={styles.checkbox} />
            <Text style={styles.checkboxText}>Keep the same fabric color</Text>
        </TouchableOpacity>
      </View>

      {/* Height, Width, Offsets Container - Darker Inner Card */}
      <View style={styles.dimensionsCard}>
        {/* Row 1: Height & Width */}
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.dimLabel}>Height</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity 
                style={styles.counterBtnLeft} 
                onPress={() => handleDecrement('height')}
              >
                <Text style={styles.counterBtnText}>-</Text>
              </TouchableOpacity>
              <View style={styles.counterInputWrapper}>
                <TextInput 
                    style={styles.counterInput} 
                    value={dimensions.height.toString()}
                    onChangeText={(text) => handleChangeText('height', text)}
                    keyboardType="numeric"
                />
              </View>
              <TouchableOpacity 
                style={styles.counterBtnRight}
                onPress={() => handleIncrement('height')}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.halfInputContainer}>
            <Text style={styles.dimLabel}>Width</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity 
                style={styles.counterBtnLeft}
                onPress={() => handleDecrement('width')}
              >
                <Text style={styles.counterBtnText}>-</Text>
              </TouchableOpacity>
              <View style={styles.counterInputWrapper}>
                <TextInput 
                    style={styles.counterInput} 
                    value={dimensions.width.toString()}
                    onChangeText={(text) => handleChangeText('width', text)}
                    keyboardType="numeric"
                />
              </View>
              <TouchableOpacity 
                style={styles.counterBtnRight}
                onPress={() => handleIncrement('width')}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Row 2: X-offset & Y-offset */}
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.dimLabel}>X-offset</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity 
                style={styles.counterBtnLeft}
                onPress={() => handleDecrement('xOffset')}
              >
                <Text style={styles.counterBtnText}>-</Text>
              </TouchableOpacity>
              <View style={styles.counterInputWrapper}>
                <TextInput 
                    style={styles.counterInput} 
                    value={dimensions.xOffset.toString()}
                    onChangeText={(text) => handleChangeText('xOffset', text)}
                    keyboardType="numeric"
                />
              </View>
              <TouchableOpacity 
                style={styles.counterBtnRight}
                onPress={() => handleIncrement('xOffset')}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.halfInputContainer}>
            <Text style={styles.dimLabel}>Y-offset</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity 
                style={styles.counterBtnLeft}
                onPress={() => handleDecrement('yOffset')}
              >
                <Text style={styles.counterBtnText}>-</Text>
              </TouchableOpacity>
              <View style={styles.counterInputWrapper}>
                <TextInput 
                    style={styles.counterInput} 
                    value={dimensions.yOffset.toString()}
                    onChangeText={(text) => handleChangeText('yOffset', text)}
                    keyboardType="numeric"
                />
              </View>
              <TouchableOpacity 
                style={styles.counterBtnRight}
                onPress={() => handleIncrement('yOffset')}
              >
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
});

PrintArea.displayName = 'PrintArea';

export default PrintArea;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EBF6FF', // Light Blue Card Background
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: '#001C34',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 15,
  },
  halfInputContainer: {
    flex: 1,
  },
  fullInputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: '#001C34', // Darker text for labels
    marginBottom: 8,
    marginLeft:8
  },
  dimLabel: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: '#1F2937',
    marginBottom: 6,
  },
  
  // --- INPUTS ---
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // Light grey border
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  dropdownContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    textAlignVertical: 'center', 
  },
  dropdownIcon: {
    position: 'absolute',
    right: 15,
    fontSize: 10,
    color: '#6B7280',
  },

  // --- CHECKBOX ---
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFF',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxText: {
    fontSize: 12,
    color: '#8D8D8D',
    fontFamily: "Poppins_400Regular",
  },

  // --- DIMENSIONS CARD (Inner Container) ---
  dimensionsCard: {
    backgroundColor: '#DCEAF5', // Matches the inner darker blue area in image
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CFE0EE',
  },
  
  // --- MERGED COUNTER STYLES ---
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 6, // Rounded corners for the whole group
    overflow: 'hidden', // Clips content to border radius
    backgroundColor: '#FFFFFF', // White background for the input area
    borderWidth: 2,
    borderColor: '#808D99', // Border matching the button color
  },
  counterBtnLeft: {
    backgroundColor: '#264660', // Dark Navy
    width: 35,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 2,
    borderColor: '#808D99'
  },
  counterBtnRight: {
    backgroundColor: '#264660', // Dark Navy
    width: 35,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 2,
    borderColor: '#808D99'
  },
  counterBtnText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FONT_FAMILY.medium,
    lineHeight: 22,
  },
  counterInputWrapper: {
    flex: 1,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  counterInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: '#808D99',
    marginBottom: -7,
  
  },

  // --- ADD BUTTON ---
  addPrintLocationBtn: {
    backgroundColor: '#264660', // Dark Navy
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 5,
    width: '100%',
  },
  addPrintLocationText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});