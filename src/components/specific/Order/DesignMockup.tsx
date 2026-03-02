import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const DesignMockup = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    clearFields: () => {
      console.log("Fields cleared");
    }
  }));

  // Reusable component for the Upload & Preview boxes that repeat across the design
  const renderUploadSection = (label, subtext = "image/*.ai, .psd (max 10MB)") => (
    <View style={styles.inputGroup}>
      <Text style={styles.labelBold}>{label}</Text>
      <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
        <Image 
          source={require('../../../assets/images/download-solid-full.png')} 
          style={styles.uploadIconImage} 
        />
        <Text style={styles.uploadText}>Upload {label}</Text>
        <Text style={styles.uploadSubtext}>{subtext}</Text>
      </TouchableOpacity>
      
      <View style={styles.uploadedFilesBox}>
        <Text style={styles.uploadedLabel}>Uploaded files</Text>
        <Text style={styles.placeholderText}>Preview will show here</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          
          {/* ==========================================
              SECTION 1: DESIGN FILE & MOCKUPS 
          ========================================== */}
          <Text style={styles.sectionTitle}>Design File & Mockups</Text>
          <View style={styles.divider} />

          {renderUploadSection("Design Files")}
          {renderUploadSection("Design Mockups")}
          {renderUploadSection("Size Label")}

          <View style={styles.inputGroup}>
            <Text style={styles.labelBold}>Placement Measurements</Text>
            <TouchableOpacity style={styles.dropdownInput} activeOpacity={0.7}>
              <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Select Placement Measurements</Text>
              <Ionicons name="chevron-down" size={14} color="#6B7280" />
            </TouchableOpacity>
            
            <TextInput 
              style={[styles.whiteInput, styles.textArea]} 
              placeholder="Enter notes here..." 
              placeholderTextColor="#9CA3AF"
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {/* ==========================================
              SECTION 2: FREEBIES 
          ========================================== */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Freebies</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Text style={styles.labelBold}>Items</Text>
              <TextInput 
                style={styles.whiteInput} 
                placeholder="Enter Items" 
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.halfCol}>
              <Text style={styles.labelBold}>Quantity</Text>
              <TextInput 
                style={styles.whiteInput} 
                placeholder="Enter Quantity" 
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelBold}>Others</Text>
            <TouchableOpacity style={styles.dropdownInput} activeOpacity={0.7}>
              <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Choose freebies package</Text>
              <Ionicons name="chevron-down" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {renderUploadSection("Freebies files")}

          {/* ==========================================
              SECTION 3: PRICING & PAYMENT CONTROL 
          ========================================== */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Pricing & Payment Control</Text>
          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.labelBold}>Payment Plan</Text>
            <TouchableOpacity style={styles.dropdownInput} activeOpacity={0.7}>
              <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Select Payment Plan</Text>
              <Ionicons name="chevron-down" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelBold}>Payment Quantity</Text>
            <TouchableOpacity style={styles.dropdownInput} activeOpacity={0.7}>
              <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Select Payment Method</Text>
              <Ionicons name="chevron-down" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelBold}>Total</Text>
            <TextInput 
              style={styles.blueInputFull} 
              editable={false} 
              placeholder="Estimated Total of Product" 
              placeholderTextColor="#1F2937" 
            />
          </View>

          {renderUploadSection("Receipt and Bank Account Details")}

        </View> 
        {/* === END OF CARD === */}

      </ScrollView>
    </View>
  );
});

DesignMockup.displayName = 'DesignMockup';

export default DesignMockup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 0, 
    paddingTop: 16,
    },
  card: {
    backgroundColor: '#EBF6FF', 
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: '#001C34',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginBottom: 20,
  },
  labelBold: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
    marginBottom: 6,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 16,
  },
  halfCol: {
    flex: 1,
  },

  // --- UPLOAD BOX STYLES ---
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadIconImage: {
    width: 22,
    height: 22,
    marginBottom: 6,
    resizeMode: 'contain',
    tintColor: '#001C34', 
  },
  uploadText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  uploadSubtext: {
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
    color: '#9CA3AF',
  },
  
  // --- PREVIEW BOX STYLES ---
  uploadedFilesBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  uploadedLabel: {
    position: 'absolute',
    top: 6,
    left: 10,
    fontSize: 9,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
  },
  placeholderText: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#9CA3AF',
    marginTop: 8,
  },

  // --- INPUT STYLES ---
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#FFFFFF',
  },
  whiteInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    width: '100%', 
  },
  blueInputFull: {
    backgroundColor: '#DCEAF5', 
    borderWidth: 1,
    borderColor: '#CFE0EE',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12, 
    fontFamily: 'Poppins_400Regular',
    color: '#1F2937',
    width: '100%', 
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    marginTop: 10,
  },
});