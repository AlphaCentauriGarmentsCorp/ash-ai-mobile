import FormDropdown, { FormDropdownOption } from '@components/common/FormDropdown';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface DesignMockupProps {
  dropdownData?: {
    placementMeasurements: FormDropdownOption[];
    freebies: FormDropdownOption[];
    loading?: boolean;
  };
}

const DesignMockup = forwardRef<any, DesignMockupProps>(({ dropdownData }, ref) => {
  const [selectedPlacementMeasurement, setSelectedPlacementMeasurement] = useState('');
  const [selectedFreebie, setSelectedFreebie] = useState('');
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Use database data if available, otherwise fallback to static options
  const placementMeasurementOptions: FormDropdownOption[] = dropdownData?.placementMeasurements || [
    { label: 'Center Chest', value: 'center-chest' },
    { label: 'Left Chest', value: 'left-chest' },
    { label: 'Full Front', value: 'full-front' },
    { label: 'Center Back', value: 'center-back' },
    { label: 'Upper Back', value: 'upper-back' },
    { label: 'Short Sleeve', value: 'short-sleeve' },
    { label: 'Long Sleeve', value: 'long-sleeve' },
    { label: 'Neck Label', value: 'neck-label' },
    { label: 'Side Seam Label', value: 'side-seam-label' },
    { label: 'Hem Label', value: 'hem-label' },
  ];

  const freebieOptions: FormDropdownOption[] = dropdownData?.freebies || [
    { label: 'Tote Bag', value: 'tote-bag' },
    { label: 'Stickers', value: 'stickers' },
    { label: 'Keychain', value: 'keychain' },
    { label: 'Pen', value: 'pen' },
    { label: 'Notebook', value: 'notebook' },
    { label: 'Mug', value: 'mug' },
    { label: 'T-Shirt', value: 't-shirt' },
    { label: 'Cap', value: 'cap' },
  ];

  const paymentPlanOptions: FormDropdownOption[] = [
    { label: 'Full Payment', value: 'full-payment' },
    { label: 'Down Payment', value: 'down-payment' },
  ];

  const paymentMethodOptions: FormDropdownOption[] = [
    { label: 'Cash', value: 'cash' },
    { label: 'Credit Card', value: 'credit-card' },
    { label: 'Debit Card', value: 'debit-card' },
    { label: 'Bank Transfer', value: 'bank-transfer' },
    { label: 'GCash', value: 'gcash' },
    { label: 'Maya', value: 'maya' },
    { label: 'PayPal', value: 'paypal' },
  ];

  useImperativeHandle(ref, () => ({
    clearFields: () => {
      setSelectedPlacementMeasurement('');
      setSelectedFreebie('');
      setSelectedPaymentPlan('');
      setSelectedPaymentMethod('');
      console.log("Fields cleared");
    },
    getData: () => ({
      placementMeasurement: selectedPlacementMeasurement,
      freebie: selectedFreebie,
      paymentPlan: selectedPaymentPlan,
      paymentMethod: selectedPaymentMethod,
      notes: `Payment Plan: ${selectedPaymentPlan}, Payment Method: ${selectedPaymentMethod}, Placement: ${selectedPlacementMeasurement}, Freebie: ${selectedFreebie}`
    })
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
    <View style={styles.stepContainer}>
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
            <FormDropdown
              options={placementMeasurementOptions}
              selectedValue={selectedPlacementMeasurement}
              onSelect={setSelectedPlacementMeasurement}
              placeholder={dropdownData?.loading ? "Loading..." : "Select Placement Measurements"}
              showSearch={false}
            />
            
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
              <Text style={styles.labelBold}>Freebie</Text>
              <FormDropdown
                options={freebieOptions}
                selectedValue={selectedFreebie}
                onSelect={setSelectedFreebie}
                placeholder={dropdownData?.loading ? "Loading..." : "Select other freebies"}
                showSearch={false}
              />
            </View>
            <View style={styles.halfCol}>
              <Text style={styles.labelBold}>Color</Text>
              <TextInput 
                style={styles.whiteInput} 
                placeholder="Enter freebie color" 
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelBold}>Others</Text>
            <TextInput 
              style={styles.whiteInput} 
              placeholder="Enter freebie items" 
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {renderUploadSection("Freebies files")}

          {/* ==========================================
              SECTION 3: PRICING & PAYMENT CONTROL 
          ========================================== */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Pricing & Payment Control</Text>
          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.labelBold}>Payment Plan</Text>
            <FormDropdown
              options={paymentPlanOptions}
              selectedValue={selectedPaymentPlan}
              onSelect={setSelectedPaymentPlan}
              placeholder="Select Payment Plan"
              showSearch={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelBold}>Payment Method</Text>
            <FormDropdown
              options={paymentMethodOptions}
              selectedValue={selectedPaymentMethod}
              onSelect={setSelectedPaymentMethod}
              placeholder="Select Payment Method"
              showSearch={false}
            />
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
  stepContainer: {
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 0, 
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