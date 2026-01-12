import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { hp, ms, rfs, wp } from "../../../utils/responsive";

interface DesignMockupProps {
  // Add props as needed for state management
}

export default function DesignMockup({}: DesignMockupProps) {
  const FormLabel = ({ text }: { text: string }) => <Text style={styles.label}>{text}</Text>;

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionDivider} />
    </View>
  );

  const UploadBox = ({ title }: { title: string }) => (
    <TouchableOpacity style={styles.uploadBox}>
       <Ionicons name="cloud-download-outline" size={ms(24)} color="#333" />
       <Text style={styles.uploadTitle}>{title}</Text>
       <Text style={styles.uploadSub}>Image/s (jpg, png, 10MB)</Text>
    </TouchableOpacity>
  );

  const SizeInput = ({ label }: { label: string }) => (
     <View style={styles.sizeItem}>
        <Text style={styles.sizeLabel}>{label}</Text>
        <TextInput style={styles.sizeInput} placeholder="0" keyboardType="numeric" textAlign="center" />
     </View>
  );

  return (
    <View style={styles.card}>
       <SectionHeader title="Design Files & Mockups" />
       
       <FormLabel text="Design Files" />
       <UploadBox title="Upload design mockups" />
       <View style={styles.previewBox}><Text style={styles.previewText}>Preview will show here</Text></View>

       <FormLabel text="Design Mockups" />
       <UploadBox title="Upload design mockups" />
       <View style={styles.previewBox}><Text style={styles.previewText}>Preview will show here</Text></View>

       <FormLabel text="Placement Measurements" />
       <UploadBox title="Upload design mockups" />
       <View style={styles.previewBox}><Text style={styles.previewText}>Preview will show here</Text></View>

       <FormLabel text="Additional Notes" />
       <TextInput style={styles.textArea} multiline numberOfLines={4} placeholder="Add notes here..." placeholderTextColor="#999" />

       <FormLabel text="Instruction Files" />
       <View style={styles.fileInputRow}>
          <View style={styles.chooseFileBtn}><Text style={styles.chooseFileText}>Choose File</Text></View>
          <Text style={styles.noFileText}>No file chosen</Text>
       </View>
       <View style={styles.previewBox}><Text style={styles.previewText}>Preview will show here</Text></View>

       <View style={{marginTop:16}}><SectionHeader title="Sizes & Quantities" /></View>
       <FormLabel text="Total Quantity" />
       <View style={styles.disabledInput}><Text style={styles.disabledText}>0</Text></View>

       <View style={styles.sizesContainer}>
           <View style={styles.row}>
               <View style={styles.col}><SizeInput label="XS" /></View>
               <View style={styles.col}><SizeInput label="L" /></View>
           </View>
           <View style={styles.row}>
               <View style={styles.col}><SizeInput label="S" /></View>
               <View style={styles.col}><SizeInput label="XL" /></View>
           </View>
           <View style={styles.row}>
               <View style={styles.col}><SizeInput label="M" /></View>
               <View style={styles.col}><SizeInput label="XXL" /></View>
           </View>
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
  row: {
    flexDirection: 'row',
    gap: wp(3.2),
  },
  col: {
    flex: 1,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    backgroundColor: '#FFF',
    borderRadius: ms(6),
    height: hp(8.6),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  uploadTitle: {
    fontSize: rfs(10),
    fontWeight: '600',
    color: '#333',
    marginTop: hp(0.5),
  },
  uploadSub: {
    fontSize: rfs(8),
    color: '#999',
  },
  previewBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    height: hp(4.9),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(4),
    marginBottom: hp(1.5),
  },
  previewText: {
    fontSize: rfs(10),
    color: '#AAA',
  },
  textArea: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D9E6',
    borderRadius: ms(6),
    padding: wp(2.7),
    textAlignVertical: 'top',
    height: hp(9.9),
    fontSize: rfs(12),
    marginBottom: hp(1.5),
  },
  fileInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D9E6',
    borderRadius: ms(6),
    backgroundColor: '#FFF',
    overflow: 'hidden',
    height: hp(4.4),
    marginBottom: hp(0.7),
  },
  chooseFileBtn: {
    backgroundColor: '#2C3E50',
    height: '100%',
    paddingHorizontal: wp(3.2),
    justifyContent: 'center',
  },
  chooseFileText: {
    color: '#FFF',
    fontSize: rfs(10),
    fontWeight: '600',
  },
  noFileText: {
    fontSize: rfs(10),
    color: '#999',
    marginLeft: wp(2.7),
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
  sizesContainer: {
    backgroundColor: '#DDEAF6',
    borderRadius: ms(8),
    padding: wp(2.7),
    marginTop: hp(1),
  },
  sizeItem: {
    marginBottom: hp(1.2),
  },
  sizeLabel: {
    fontSize: rfs(10),
    fontWeight: '700',
    marginBottom: hp(0.5),
  },
  sizeInput: {
    backgroundColor: '#FFF',
    height: hp(4.4),
    borderRadius: ms(6),
    paddingHorizontal: wp(2.1),
    fontSize: rfs(12),
  },
});
