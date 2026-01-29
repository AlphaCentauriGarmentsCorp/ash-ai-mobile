import Checkbox from '@components/common/Checkbox';
import FormDropdown from '@components/common/FormDropdown';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const OrderInfo = forwardRef((props, ref) => {
  const [brand, setBrand] = useState('');
  const [priority, setPriority] = useState('');
  const [apparelType, setApparelType] = useState('');
  const [fabricType, setFabricType] = useState('');
  const [addFreebies, setAddFreebies] = useState(false);
  const [keepSameColor, setKeepSameColor] = useState(false);
  const [options, setOptions] = useState<boolean[]>(Array(8).fill(false));

  useImperativeHandle(ref, () => ({
    clearFields: () => {
      setBrand('');
      setPriority('');
      setApparelType('');
      setFabricType('');
      setAddFreebies(false);
      setKeepSameColor(false);
      setOptions(Array(8).fill(false));
    }
  }));

  const brandOptions = [
    { label: 'Reefer', value: 'reefer' },
    { label: 'Sorbetes', value: 'sorbetes' },
  ];

  const priorityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  const apparelTypeOptions = [
    { label: 'T-shirt', value: 't-shirt' },
    { label: 'Pants', value: 'pants' },
    { label: 'Hoodie', value: 'hoodie' },
    { label: 'Enter new apparel type here', value: 'new' },
  ];

  const fabricTypeOptions = [
    { label: 'CVC', value: 'cvc' },
  ];

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
      <Ionicons name="calendar-outline" size={16} color="#666" style={styles.calendarIcon} />
    </View>
  </View>
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Clothing/Company</Text>
  <TextInput 
    style={[styles.input, styles.freebiesInput]} 
    placeholder="Company or brand will automatically show here" 
    editable={false}
  />
</View>

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Brand</Text>
    <FormDropdown
      options={brandOptions}
      selectedValue={brand}
      onSelect={setBrand}
      placeholder="Select Brand"
    />
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Priority</Text>
    <FormDropdown
      options={priorityOptions}
      selectedValue={priority}
      onSelect={setPriority}
      placeholder="Select Priority"
    />
  </View>
</View>

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Preferred Courier</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Preferred Courier" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Shipping Method</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Shipping Method" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
</View>

{/* Section: Courier */}
<Text style={[styles.sectionTitle, { marginTop: 20 }]}>Courier</Text>
<View style={styles.divider} />

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Preferred Courier</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Courier" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Shipping Method</Text>
    <View style={styles.dropdownContainer}>
      <TextInput 
        style={styles.input} 
        placeholder="Select Shipping Method" 
        editable={false}
      />
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  </View>
</View>

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Receiver's Name</Text>
    <TextInput 
      style={styles.input} 
      placeholder="Enter Receiver's Name" 
      editable={true}
    />
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Contact Number</Text>
    <TextInput 
      style={styles.input} 
      placeholder="Enter Contact Number" 
      editable={true}
    />
  </View>
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Street</Text>
  <TextInput 
    style={styles.input} 
    placeholder="Enter Street Number" 
    editable={true}
  />
</View>

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Barangay</Text>
    <TextInput 
      style={styles.input} 
      placeholder="Enter Barangay" 
      editable={true}
    />
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>City</Text>
    <TextInput 
      style={styles.input} 
      placeholder="Enter City" 
      editable={true}
    />
  </View>
</View>

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Province</Text>
    <TextInput 
      style={styles.input} 
      placeholder="Enter Province" 
      editable={true}
    />
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Postal Code</Text>
    <TextInput 
      style={styles.input} 
      placeholder="Postal Code" 
      editable={true}
    />
  </View>
</View>

{/* Section: Freebies */}
<View style={styles.freebiesHeader}>
  <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Freebies</Text>
  <View style={styles.freebiesCheckbox}>
    <Checkbox 
      checked={addFreebies} 
      onPress={() => setAddFreebies(!addFreebies)}
      size={18}
    />
    <Text style={styles.checkboxLabel}>Add Freebies</Text>
  </View>
</View>
<View style={styles.divider} />

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Items</Text>
    <TextInput 
      style={styles.freebiesInput} 
      placeholder="Enter Items" 
      editable={true}
    />
  </View>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Quantity</Text>
    <TextInput 
      style={styles.freebiesInput} 
      placeholder="Enter Quantity" 
      editable={true}
    />
  </View>
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Preferred Courier</Text>
  <View style={styles.dropdownContainer}>
    <TextInput 
      style={styles.freebiesInput} 
      placeholder="Select Preferred Courier" 
      editable={false}
    />
    <Text style={styles.dropdownIcon}>▼</Text>
  </View>
</View>

{/* Section: Product Details */}
<Text style={[styles.sectionTitle, { marginTop: 20 }]}>Product Details</Text>
<View style={styles.divider} />

<View style={styles.row}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Apparel Type</Text>
    <FormDropdown
      options={apparelTypeOptions}
      selectedValue={apparelType}
      onSelect={setApparelType}
      placeholder="Select Apparel Type"
    />
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
    <Text style={styles.label}>Service Type</Text>
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
    <Text style={styles.label}>Print Method</Text>
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
    <Text style={styles.label}>Size Label</Text>
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
    <Text style={styles.label}>Print Label Placement</Text>
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
  <Text style={styles.label}>Fabric Type</Text>
  <FormDropdown
    options={fabricTypeOptions}
    selectedValue={fabricType}
    onSelect={setFabricType}
    placeholder="Select Fabric Type"
  />
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Fabric Color</Text>
  <TextInput 
    style={styles.input} 
    placeholder="Enter Fabric Color" 
  />
  <View style={styles.checkboxRow}>
    <Checkbox 
      checked={keepSameColor} 
      onPress={() => setKeepSameColor(!keepSameColor)}
      size={18}
    />
    <Text style={styles.checkboxLabel}>keep the same color for the others</Text>
  </View>
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Thread Color</Text>
  <TextInput 
    style={styles.input} 
    placeholder="Enter Ribbing Color" 
  />
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Ribbing Color</Text>
  <TextInput 
    style={styles.input} 
    placeholder="Enter Ribbing Color" 
  />
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Options</Text>
  <View style={styles.optionsGrid}>
    {Array.from({ length: 8 }).map((_, index) => (
      <View key={index} style={styles.checkboxRow}>
        <Checkbox 
          checked={options[index]} 
          onPress={() => {
            const newOptions = [...options];
            newOptions[index] = !newOptions[index];
            setOptions(newOptions);
          }}
          size={18}
        />
        <Text style={styles.checkboxLabel}>with Collar</Text>
      </View>
    ))}
  </View>
</View>
    </View>
  );
});

OrderInfo.displayName = 'OrderInfo';

export default OrderInfo;

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
  freebiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
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
    alignItems: 'flex-end',
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
    backgroundColor: '#fff',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
    fontSize: 12,
    color: '#666',
  },
  calendarIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    width: '48%',
  },
  freebiesCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
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
  freebiesInput: {
    backgroundColor: '#d4e8f0',
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    paddingRight: 35,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
  },
});
