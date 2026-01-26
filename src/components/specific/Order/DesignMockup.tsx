import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SizeCard {
  id: number;
  size: string;
  quantity: string;
  costPrice: string;
  unitPrice: string;
}

export default function DesignMockup() {
  const [sizeCards, setSizeCards] = useState<SizeCard[]>([
    { id: 1, size: '', quantity: '', costPrice: '', unitPrice: '' }
  ]);

  const addSizeCard = () => {
    const newCard: SizeCard = {
      id: Date.now(),
      size: '',
      quantity: '',
      costPrice: '',
      unitPrice: ''
    };
    setSizeCards([...sizeCards, newCard]);
  };

  const removeSizeCard = (id: number) => {
    if (sizeCards.length > 1) {
      setSizeCards(sizeCards.filter(card => card.id !== id));
    }
  };

  return (
    <View style={styles.card}>
      {/* Section: Design Files & Mockups */}
<Text style={styles.sectionTitle}>Design Files & Mockups</Text>
<View style={styles.divider} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Design Files</Text>
  <View style={styles.uploadBox}>
    <Text style={styles.uploadIcon}>⬇</Text>
    <Text style={styles.uploadText}>Upload design mockups</Text>
    <Text style={styles.uploadSubtext}>(image/audio/video/file)</Text>
  </View>
  <View style={styles.uploadedFilesBox}>
    <Text style={styles.uploadedLabel}>Uploaded files</Text>
    <Text style={styles.placeholderText}>*Display all show here</Text>
  </View>
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Design Mockups</Text>
  <View style={styles.uploadBox}>
    <Text style={styles.uploadIcon}>⬇</Text>
    <Text style={styles.uploadText}>Upload design mockups</Text>
    <Text style={styles.uploadSubtext}>(image/audio/video/file)</Text>
  </View>
  <View style={styles.uploadedFilesBox}>
    <Text style={styles.uploadedLabel}>Uploaded files</Text>
    <Text style={styles.placeholderText}>*Display all show here</Text>
  </View>
</View>

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Placement Measurements</Text>
  <View style={styles.uploadBox}>
    <Text style={styles.uploadIcon}>⬇</Text>
    <Text style={styles.uploadText}>Upload design mockups</Text>
    <Text style={styles.uploadSubtext}>(image/audio/video/file)</Text>
  </View>
  <View style={styles.uploadedFilesBox}>
    <Text style={styles.uploadedLabel}>Uploaded files</Text>
    <Text style={styles.placeholderText}>*Display all show here</Text>
  </View>
</View>

{/* Section: Additional Notes */}
<Text style={[styles.sectionTitle, { marginTop: 20 }]}>Additional Notes</Text>
<View style={styles.divider} />

<TextInput 
  style={[styles.input, styles.textArea]} 
  placeholder="Add notes here" 
  multiline={true}
  numberOfLines={6}
  textAlignVertical="top"
/>

{/* Section: Instruction Files */}
<Text style={[styles.sectionTitle, { marginTop: 20 }]}>Instruction Files</Text>
<View style={styles.divider} />

<View style={styles.fileInputContainer}>
  <TouchableOpacity style={styles.chooseFileBtn}>
    <Text style={styles.chooseFileText}>Choose File</Text>
  </TouchableOpacity>
  <Text style={styles.noFileText}>No file chosen</Text>
</View>

<View style={styles.uploadedFilesBox}>
  <Text style={styles.uploadedLabel}>Uploaded files</Text>
  <Text style={styles.placeholderText}>*Display all show here</Text>
</View>

{/* Section: Sizes & Quantities */}
<Text style={[styles.sectionTitle, { marginTop: 20 }]}>Sizes & Quantities</Text>
<View style={styles.divider} />

{/* Render Size Cards */}
{sizeCards.map((card, index) => (
  <View key={card.id} style={styles.sizeCard}>
    {sizeCards.length > 1 && (
      <TouchableOpacity 
        style={styles.removeBtn}
        onPress={() => removeSizeCard(card.id)}
      >
        <Text style={styles.removeBtnText}>−</Text>
      </TouchableOpacity>
    )}
    <View style={styles.sizeRowFirst}>
      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Size</Text>
        <View style={styles.dropdownContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Select Size" 
            editable={false}
          />
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>
      </View>
    </View>
    <View style={styles.sizeRow}>
      <View style={styles.sizeInputContainer}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput 
          style={styles.input} 
          placeholder="0" 
          keyboardType="numeric"
        />
      </View>
      <View style={styles.sizeInputContainer}>
        <Text style={styles.label}>Cost Price</Text>
        <TextInput 
          style={styles.blueInput} 
          placeholder="₱0.00" 
          editable={false}
        />
      </View>
    </View>
    <View style={styles.unitPriceContainer}>
      <Text style={styles.label}>Unit Price</Text>
      <TextInput 
        style={styles.blueInput} 
        placeholder="₱0.00" 
        editable={false}
      />
    </View>
  </View>
))}

{/* Add Size Button */}
<TouchableOpacity style={styles.addSizeBtn} onPress={addSizeCard}>
  <Text style={styles.addSizeBtnText}>+ Add Size</Text>
</TouchableOpacity>

{/* Section: Total Summary */}
<View style={styles.totalRow}>
  <View style={styles.totalInputContainer}>
    <Text style={styles.label}>Total Quantity</Text>
    <TextInput 
      style={styles.blueInput} 
      placeholder="0" 
      editable={false}
    />
  </View>
  <View style={styles.totalInputContainer}>
    <Text style={styles.label}>Unit Price</Text>
    <TextInput 
      style={styles.blueInput} 
      placeholder="₱0.00" 
      editable={false}
    />
  </View>
</View>

<View style={styles.totalAmountContainer}>
  <Text style={styles.label}>Total Amount</Text>
  <TextInput 
    style={styles.blueInput} 
    placeholder="Total amount of the unit" 
    editable={false}
  />
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
    marginBottom: 0,
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
  uploadBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  fileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chooseFileBtn: {
    backgroundColor: '#2d3e50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginRight: 10,
  },
  chooseFileText: {
    color: '#fff',
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
  },
  noFileText: {
    color: '#999',
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
  sizeCard: {
    position: 'relative',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sizeRowFirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  sizeInputContainer: {
    flex: 1,
  },
  unitPriceContainer: {
    marginBottom: 0,
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
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1F2937',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: FONT_FAMILY.bold,
  },
  addSizeBtn: {
    backgroundColor: '#2d3e50',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  addSizeBtnText: {
    color: '#fff',
    fontSize: FONT_SIZES.base,
    fontFamily: FONT_FAMILY.semiBold,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  totalInputContainer: {
    flex: 1,
  },
  totalAmountContainer: {
    marginBottom: 0,
  },
});
