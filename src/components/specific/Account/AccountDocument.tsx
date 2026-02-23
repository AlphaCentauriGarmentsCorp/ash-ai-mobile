import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAccountForm } from '../../../context/AccountFormContext';

interface AccountDocumentProps {
  readOnly?: boolean;
  onEdit?: () => void;
}

export default function AccountDocument({ readOnly = false, onEdit }: AccountDocumentProps) {
  const { formData, updateFormData } = useAccountForm();

  const handleFileUpload = () => {
    console.log('Open file picker');
    // Simulate file upload
    updateFormData({
      uploadedFiles: [...formData.uploadedFiles, 'document.pdf']
    });
  };

  const removeFile = (index: number) => {
    updateFormData({
      uploadedFiles: formData.uploadedFiles.filter((_, i) => i !== index)
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Document</Text>
      <View style={styles.divider} />

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Pag-ibig No.</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter pag-ibig number"
          value={formData.pagIbigNo}
          onChangeText={(text) => updateFormData({ pagIbigNo: text })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>SSS No.</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter SSS number"
          value={formData.sssNo}
          onChangeText={(text) => updateFormData({ sssNo: text })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Philhealth No.</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter philhealth number"
          value={formData.philhealthNo}
          onChangeText={(text) => updateFormData({ philhealthNo: text })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Additional Files</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={handleFileUpload}>
          <Ionicons name="cloud-download" size={40} color="#999" />
          <Text style={styles.uploadText}>Upload Additional Files</Text>
          <Text style={styles.uploadSubtext}>(PNG • JPG • PDF • JPEG • GIF • DOCS • XLSX)</Text>
        </TouchableOpacity>
      </View>

      {formData.uploadedFiles.length > 0 && (
        <View style={styles.uploadedFilesContainer}>
          <Text style={styles.uploadedFilesLabel}>Uploaded files</Text>
          {formData.uploadedFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <Text style={styles.fileName}>{file}</Text>
              <TouchableOpacity onPress={() => removeFile(index)}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          ))}
          <Text style={styles.fileNote}>You can still add more files</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONT_FAMILY.bold,
    color: '#0D253F',
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
  },
  fullInputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#0D253F',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    backgroundColor: COLORS.white,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  uploadText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: '#333',
    marginTop: 10,
  },
  uploadSubtext: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#999',
    marginTop: 5,
  },
  uploadedFilesContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  uploadedFilesLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text,
    marginBottom: 10,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 8,
  },
  fileName: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#333',
  },
  fileNote: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});
