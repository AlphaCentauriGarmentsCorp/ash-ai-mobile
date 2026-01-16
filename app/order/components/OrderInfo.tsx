import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../constants';

export default function OrderInfo() {
  return (
    <View style={styles.card}>
      {/* Section: Order Information */}
<Text style={styles.sectionTitle}>Order Information</Text>
<View style={styles.divider} />

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Client</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Client" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label} numberOfLines={1}>Requested Deadline</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Choose Date" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>📅</Text>
    </View>
  </View>
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Clothing/Company</Text>
  <TextInput 
    style={[styles.input, styles.disabledInput]} 
    placeholder="Company or brand will automatically show here" 
    editable={false}
  />
</View>

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Brand</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Brand" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Priority</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Priority" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
</View>

{/* Section: Product Details */}
<Text style={[styles.sectionTitle, { marginTop: 20 }]}>Product Details</Text>
<View style={styles.divider} />

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Apparel Type</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Apparel Type" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Pattern Type</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Pattern Type" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
</View>

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Fabric Type</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Fabric Type" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Service Type</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Service Type" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
</View>

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Print Method</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Print Method" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Size Label</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Size Label" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Fabric Color</Text>
  <TextInput 
    style={styles.input} 
    placeholder="Enter Fabric Color" 
  />
  <View style={styles.checkboxRow}>
    <View style={styles.checkbox} />
    <Text style={styles.checkboxLabel}>keep the same color for everybody</Text>
  </View>
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Ribbing Color</Text>
  <TextInput 
    style={styles.input} 
    placeholder="Enter Ribbing Color" 
  />
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Needle Color</Text>
  <TextInput 
    style={styles.input} 
    placeholder="Enter Needle Color" 
  />
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Options</Text>
  <View style={styles.optionsGrid}>
    <View style={styles.checkboxRow}>
      <View style={styles.checkbox} />
      <Text style={styles.checkboxLabel}>with Collar</Text>
    </View>
    <View style={styles.checkboxRow}>
      <View style={styles.checkbox} />
      <Text style={styles.checkboxLabel}>with Collar</Text>
    </View>
    <View style={styles.checkboxRow}>
      <View style={styles.checkbox} />
      <Text style={styles.checkboxLabel}>with Collar</Text>
    </View>
    <View style={styles.checkboxRow}>
      <View style={styles.checkbox} />
      <Text style={styles.checkboxLabel}>with Collar</Text>
    </View>
    <View style={styles.checkboxRow}>
      <View style={styles.checkbox} />
      <Text style={styles.checkboxLabel}>with Collar</Text>
    </View>
    <View style={styles.checkboxRow}>
      <View style={styles.checkbox} />
      <Text style={styles.checkboxLabel}>with Collar</Text>
    </View>
    <View style={styles.checkboxRow}>
      <View style={styles.checkbox} />
      <Text style={styles.checkboxLabel}>with Collar</Text>
    </View>
    <View style={styles.checkboxRow}>
      <View style={styles.checkbox} />
      <Text style={styles.checkboxLabel}>with Collar</Text>
    </View>
  </View>
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
    alignItems: 'flex-start',
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
    minHeight: 20,
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
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    borderRadius: 3,
  },
  checkboxLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#666',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
