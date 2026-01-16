import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../constants';

export default function DesignMockup() {
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

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Total Quantity</Text>
  <TextInput 
    style={styles.input} 
    placeholder="0" 
    keyboardType="numeric"
    editable={false}
  />
</View>

<View style={styles.sizesGrid}>
  <View style={styles.row}>
    <View style={styles.halfInputContainer}>
      <Text style={styles.sizeLabel}>XS</Text>
      <TextInput 
        style={styles.input} 
        placeholder="0" 
        keyboardType="numeric"
      />
    </View>
    <View style={styles.halfInputContainer}>
      <Text style={styles.sizeLabel}>L</Text>
      <TextInput 
        style={styles.input} 
        placeholder="0" 
        keyboardType="numeric"
      />
    </View>
  </View>

  <View style={styles.row}>
    <View style={styles.halfInputContainer}>
      <Text style={styles.sizeLabel}>S</Text>
      <TextInput 
        style={styles.input} 
        placeholder="0" 
        keyboardType="numeric"
      />
    </View>
    <View style={styles.halfInputContainer}>
      <Text style={styles.sizeLabel}>XL</Text>
      <TextInput 
        style={styles.input} 
        placeholder="0" 
        keyboardType="numeric"
      />
    </View>
  </View>

  <View style={styles.row}>
    <View style={styles.halfInputContainer}>
      <Text style={styles.sizeLabel}>M</Text>
      <TextInput 
        style={styles.input} 
        placeholder="0" 
        keyboardType="numeric"
      />
    </View>
    <View style={styles.halfInputContainer}>
      <Text style={styles.sizeLabel}>XXL</Text>
      <TextInput 
        style={styles.input} 
        placeholder="0" 
        keyboardType="numeric"
      />
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
  sizesGrid: {
    backgroundColor: '#e8f4f8',
    borderRadius: 8,
    padding: 15,
  },
  sizeLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#333',
    marginBottom: 8,
  },
});
