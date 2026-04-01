import { UnifiedDropdown, type UnifiedDropdownOption } from '@components/unified';
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

// Import payment control system
import { DEFAULT_DEPOSIT_PERCENTAGE, paymentMethodOptions, paymentPlanOptions } from '@constants/paymentOptions';

interface DesignMockupProps {
  dropdownData?: {
    placementMeasurements: UnifiedDropdownOption[];
    freebies: UnifiedDropdownOption[];
    loading?: boolean;
  };
  orderSummary?: {
    totalAmount: number;
    estimatedTotal: string;
    remainingBalance: number;
  };
}

const DesignMockup = forwardRef<any, DesignMockupProps>(({ dropdownData, orderSummary }, ref) => {
  const [selectedPlacementMeasurement, setSelectedPlacementMeasurement] = useState('');
  const [selectedFreebie, setSelectedFreebie] = useState('');
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [depositPercentage, setDepositPercentage] = useState(DEFAULT_DEPOSIT_PERCENTAGE);
  const [freebieColor, setFreebieColor] = useState('');
  const [freebieOthers, setFreebieOthers] = useState('');
  const [placementNotes, setPlacementNotes] = useState('');

  // Payment control calculations
  const totalAmount = orderSummary?.totalAmount || 0;
  const depositAmount = (totalAmount * depositPercentage) / 100;
  const remainingBalance = totalAmount - depositAmount;

  // Special handler for deposit percentage with validation
  const handleDepositPercentageChange = useCallback((value: string) => {
    // Ensure percentage is between 0-100
    const percentage = Math.min(100, Math.max(0, parseFloat(value) || 0));
    setDepositPercentage(percentage);
  }, []);

  // Convert payment options to UnifiedDropdown format
  const paymentPlanFormOptions: UnifiedDropdownOption[] = paymentPlanOptions.map(option => ({
    label: option.label,
    value: option.value
  }));

  const paymentMethodFormOptions: UnifiedDropdownOption[] = paymentMethodOptions.map(option => ({
    label: option.label,
    value: option.value
  }));
  // Use database data if available, otherwise fallback to static options
  const placementMeasurementOptions: UnifiedDropdownOption[] = dropdownData?.placementMeasurements || [
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

  const freebieOptions: UnifiedDropdownOption[] = dropdownData?.freebies || [
    { label: 'Tote Bag', value: 'tote-bag' },
    { label: 'Stickers', value: 'stickers' },
    { label: 'Keychain', value: 'keychain' },
    { label: 'Pen', value: 'pen' },
    { label: 'Notebook', value: 'notebook' },
    { label: 'Mug', value: 'mug' },
    { label: 'T-Shirt', value: 't-shirt' },
    { label: 'Cap', value: 'cap' },
  ];

  useImperativeHandle(ref, () => ({
    clearFields: () => {
      setSelectedPlacementMeasurement('');
      setSelectedFreebie('');
      setSelectedPaymentPlan('');
      setSelectedPaymentMethod('');
      setDepositPercentage(DEFAULT_DEPOSIT_PERCENTAGE);
      setFreebieColor('');
      setFreebieOthers('');
      setPlacementNotes('');
      console.log("Fields cleared");
    },
    getData: () => ({
      // Placement and freebies
      placementMeasurement: selectedPlacementMeasurement,
      placementNotes: placementNotes,
      freebie: selectedFreebie,
      freebieColor: freebieColor,
      freebieOthers: freebieOthers,
      
      // Payment control data following the architecture
      paymentPlan: selectedPaymentPlan,
      paymentMethod: selectedPaymentMethod,
      depositPercentage: depositPercentage,
      estimatedTotal: totalAmount,
      
      // Calculated payment values
      depositAmount: depositAmount,
      remainingBalance: remainingBalance,
      
      // Notes for submission
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
            <UnifiedDropdown
              variant="searchable"
              options={placementMeasurementOptions}
              selectedValue={selectedPlacementMeasurement}
              onSelect={setSelectedPlacementMeasurement}
              placeholder={dropdownData?.loading ? "Loading..." : "Select Placement Measurements"}
              showSearch={false}
            />
            
            <TextInput 
              style={[styles.whiteInput, styles.textArea]} 
              placeholder="Enter placement notes here..." 
              placeholderTextColor="#9CA3AF"
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
              value={placementNotes}
              onChangeText={setPlacementNotes}
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
              <UnifiedDropdown
                variant="searchable"
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
                value={freebieColor}
                onChangeText={setFreebieColor}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelBold}>Others</Text>
            <TextInput 
              style={styles.whiteInput} 
              placeholder="Enter other freebie items" 
              placeholderTextColor="#9CA3AF"
              value={freebieOthers}
              onChangeText={setFreebieOthers}
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
            <UnifiedDropdown
              variant="searchable"
              options={paymentPlanFormOptions}
              selectedValue={selectedPaymentPlan}
              onSelect={setSelectedPaymentPlan}
              placeholder="Select Payment Plan"
              showSearch={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelBold}>Payment Method</Text>
            <UnifiedDropdown
              variant="searchable"
              options={paymentMethodFormOptions}
              selectedValue={selectedPaymentMethod}
              onSelect={setSelectedPaymentMethod}
              placeholder="Select Payment Method"
              showSearch={false}
            />
          </View>

          {/* Conditional rendering based on payment plan */}
          {selectedPaymentPlan === "downpayment" && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.labelBold}>Deposit %</Text>
                <TextInput 
                  style={styles.whiteInput} 
                  placeholder="Enter deposit percentage (0-100)" 
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={depositPercentage.toString()}
                  onChangeText={handleDepositPercentageChange}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.labelBold}>Deposit Amount</Text>
                <TextInput 
                  style={styles.blueInputFull} 
                  editable={false} 
                  value={`₱${depositAmount.toFixed(2)}`}
                  placeholderTextColor="#1F2937" 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.labelBold}>Remaining Balance</Text>
                <TextInput 
                  style={styles.blueInputFull} 
                  editable={false} 
                  value={`₱${remainingBalance.toFixed(2)}`}
                  placeholderTextColor="#1F2937" 
                />
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.labelBold}>Estimated Total</Text>
            <TextInput 
              style={styles.blueInputFull} 
              editable={false} 
              value={`₱${totalAmount.toFixed(2)}`}
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