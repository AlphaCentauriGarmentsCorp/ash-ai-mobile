import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@components/common/Button';
import type { Step } from '@components/common/Stepper';
import Stepper from '@components/common/Stepper';
import DesignMockup from '@components/specific/Order/DesignMockup';
import PaymentSummary from '@components/specific/Order/PaymentSummary';
import PrintArea from '@components/specific/Order/PrintArea';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { FONT_FAMILY } from '@styles';
import { hp, ms, rfs, wp } from "@utils/responsive";

// --- REUSABLE COMPONENTS FOR FORM ---
const Label = ({ text }: { text: string }) => (
  <Text style={styles.label}>{text}</Text>
);

const InputField = ({ placeholder, width = '100%', icon }: { placeholder: string, width?: any, icon?: string }) => (
  <View style={[styles.inputWrapper, { width }]}>
    <TextInput 
      style={styles.input} 
      placeholder={placeholder} 
      placeholderTextColor="#9CA3AF"
    />
    {icon && <Ionicons name={icon as any} size={18} color="#6B7280" style={styles.inputIcon} />}
  </View>
);

const DropdownField = ({ placeholder, width = '100%' }: { placeholder: string, width?: any }) => (
  <View style={[styles.inputWrapper, { width }]}>
    <Text style={[styles.input, { color: '#9CA3AF', paddingTop: ms(12) }]}>{placeholder}</Text>
    <Ionicons name="chevron-down" size={14} color="#6B7280" style={styles.inputIcon} />
  </View>
);

const CheckboxLabel = ({ text }: { text: string }) => (
  <TouchableOpacity style={styles.checkboxContainer} activeOpacity={0.7}>
    <View style={styles.checkbox} />
    <Text style={styles.checkboxText}>{text}</Text>
  </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionDivider} />
  </View>
);

// --- ORDER INFO SECTION ---
const OrderInfoSection = () => {
  return (
    <View style={styles.stepContainer}>
      
      {/* 1. ORDER INFORMATION */}
      <SectionHeader title="Order Information" />
      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Client" />
          <DropdownField placeholder="Select Client" />
        </View>
        <View style={styles.colHalf}>
          <Label text="Requested Deadline" />
          <InputField placeholder="Choose Date" icon="calendar-outline" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colFull}>
          <Label text="Clothing/Company" />
          <View style={[styles.inputWrapper, styles.disabledInput]}>
            <Text style={styles.disabledText}>Company or brand will automatically show here</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Brand" />
          <DropdownField placeholder="Select Brand" />
        </View>
        <View style={styles.colHalf}>
          <Label text="Priority" />
          <DropdownField placeholder="Select Priority" />
        </View>
      </View>

      {/* 2. COURIER SECTION */}
      <SectionHeader title="Courier" />
      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Preferred Courier" />
          <DropdownField placeholder="Select Preferred Courier" />
        </View>
        <View style={styles.colHalf}>
          <Label text="Shipping Method" />
          <DropdownField placeholder="Select Shipping Method" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Receiver's Name" />
          <InputField placeholder="Enter Receiver Name" />
        </View>
        <View style={styles.colHalf}>
          <Label text="Contact Number" />
          <InputField placeholder="Enter Contact Number" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colFull}>
          <Label text="Street" />
          <InputField placeholder="Enter Street" />
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Province" />
          <InputField placeholder="Enter Province" />
        </View>
        <View style={styles.colHalf}>
          <Label text="Barangay" />
          <InputField placeholder="Enter Barangay" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="City" />
          <InputField placeholder="Enter City" />
        </View>
        <View style={styles.colHalf}>
          <Label text="Postal Code" />
          <InputField placeholder="Enter Postal Code" />
        </View>
      </View>

      {/* 3. PRODUCT DETAILS */}
      <SectionHeader title="Product Details" />
      
      <View style={styles.row}>
        <View style={styles.colFull}>
          <Label text="Design Name" />
          <InputField placeholder="Enter Design Name" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Apparel Type" />
          <DropdownField placeholder="Select Apparel Type" />
        </View>
        <View style={styles.colHalf}>
          <Label text="Pattern Type" />
          <DropdownField placeholder="Select Pattern Type" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colFull}>
          <Label text="Service Type" />
          <DropdownField placeholder="Select Service Type" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Print Method" />
          <DropdownField placeholder="Select Print Method" />
        </View>
        <View style={styles.colHalf}>
          <Label text="Print Service" />
          <DropdownField placeholder="Select Print Service" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Size Label" />
          <DropdownField placeholder="Select Size Label" />
        </View>
        <View style={styles.colHalf}>
          <Label text="Print Label Placement" />
          <DropdownField placeholder="Select Label Placement" />
        </View>
      </View>

      {/* 4. FABRIC DETAILS */}
      <SectionHeader title="Fabric Details" />
      
      <View style={styles.row}>
        <View style={styles.colFull}>
          <Label text="Fabric Type" />
          <DropdownField placeholder="Select Fabric Type" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Fabric Supplier" />
          <DropdownField placeholder="Select Fabric Supplier" />
        </View>
        <View style={styles.colHalf}>
           {/* CHANGED: Fabric Order -> Fabric Color */}
           <Label text="Fabric Color" />
           <InputField placeholder="Enter Fabric Color" />
           {/* ADDED: Checkbox */}
           <CheckboxLabel text="Keep the same color for others" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Thread Color" />
          <InputField placeholder="Enter Thread Color" />
        </View>
        <View style={styles.colHalf}>
          <Label text="Ribbing Color" />
          <InputField placeholder="Enter Ribbing Color" />
        </View>
      </View>

      {/* 5. ADD OPTIONS */}
      <SectionHeader title="Add options" />
      
      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Options" />
          <DropdownField placeholder="Select Option" />
        </View>
        <View style={styles.colHalf}>
          {/* CHANGED: Value -> Color */}
          <Label text="Color" />
          <InputField placeholder="Enter Color" />
          {/* ADDED: Checkbox */}
          <CheckboxLabel text="Keep the same color for others" />
        </View>
      </View>

      {/* CHANGED: + Add Filter -> + Add Size (Full Width) */}
      <Button 
        title="+ Add Size" 
        variant="primary" 
        size="base" 
        style={styles.addSizeBtn}
        textStyle={{ fontSize: 16, fontFamily: "Poppins_600SemiBold" }}
      />
    </View>
  );
};

export default function AddOrderScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();
  const [currentStep, setCurrentStep] = useState(0);
  
  const orderInfoRef = useRef<any>(null);
  const printAreaRef = useRef<any>(null);
  const designMockupRef = useRef<any>(null);
  const paymentSummaryRef = useRef<any>(null);

  const steps: Step[] = [
    { title: 'Info', id: 0 },
    { title: 'Print', id: 1 },
    { title: 'Design & Mockups', id: 2 },
    { title: 'Payment & Summary', id: 3 },
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else router.back();
  };

  const handleClear = () => {
    switch (currentStep) {
      case 0: break;
      case 1: printAreaRef.current?.clearFields(); break;
      case 2: designMockupRef.current?.clearFields(); break;
      case 3: paymentSummaryRef.current?.clearFields(); break;
    }
  };

  const handleSave = () => console.log('Save');
  const handleSaveAsDraft = () => console.log('Save as draft');

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#0a2540" 
        translucent={false}
      />
      <SafeAreaView style={styles.topSafeArea} />
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <PageHeader 
          title="Add New Order" 
          breadcrumbBold= "Home" 
          breadcrumbNormal=" / Add New Order"
        />

        <View style={styles.stepperWrapper}>
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepPress={setCurrentStep}
            chevronSize={ms(12)}
          />
        </View>

        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {currentStep === 0 && <OrderInfoSection/>}
            {currentStep === 1 && <PrintArea ref={printAreaRef} />}
            {currentStep === 2 && <DesignMockup ref={designMockupRef} />}
            {currentStep === 3 && <PaymentSummary ref={paymentSummaryRef} />}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButtonContainer} onPress={handleClear}>
              <Text style={styles.clearText}>Clear all fields</Text>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              {currentStep < 3 ? (
                <>
                  <Button
                    title="Back"
                    onPress={handleBack}
                    variant="outline"
                    size="base"
                    style={StyleSheet.flatten([styles.navBtn, styles.backBtn])}
                    textStyle={styles.backBtnText}
                  />
                  <Button
                    title="Next"
                    onPress={handleNext}
                    variant="primary"
                    size="base"
                    style={styles.navBtn}
                  />
                </>
              ) : (
                <>
                  <Button
                    title="Back"
                    onPress={handleBack}
                    variant="outline"
                    size="sm"
                    style={StyleSheet.flatten([styles.navBtnSmall, styles.backBtn])}
                    textStyle={styles.backBtnText}
                  />
                  <Button
                    title="Save"
                    onPress={handleSave}
                    variant="primary"
                    size="sm"
                    style={styles.navBtnSmall}
                  />
                  <Button
                    title="Save as Draft"
                    onPress={handleSaveAsDraft}
                    variant="outline"
                    size="sm"
                    style={StyleSheet.flatten([styles.navBtnSmall, styles.backBtn])}
                    textStyle={styles.backBtnText}
                  />
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSafeArea: {
    flex: 0,
    backgroundColor: '#0B1C36',
  },
  stepperWrapper: {
    backgroundColor: '#FFFFFF',
    // Ensure padding matches the form container below for alignment
    marginLeft: 20,
    marginRight: 20,
    paddingVertical: 20
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    // Matches the padding of the stepper wrapper above
    paddingHorizontal: wp(5.3),
    paddingBottom: hp(1),
    
  },
  footer: {
    paddingHorizontal: wp(4.3),
    paddingBottom: hp(2.5),
    backgroundColor: '#ffffff',
  },
  clearButtonContainer: {
    alignSelf: 'flex-end',
    marginBottom: hp(1.5),
    marginRight: wp(3),
  },
  clearText: {
    fontSize: rfs(10),
    textDecorationLine: 'underline',
    color: "#001C34",
    fontFamily: "Poppins_300Light",
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(2.7),
  },
  navBtn: {
    minWidth: wp(26.7),
    height: ms(25),
  },
  backBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  backBtnText: {
    color: '#001C34',
    fontFamily: "Poppins_600SemiBold"
  },
  navBtnSmall: {
    paddingHorizontal: wp(4.3),
  },
  stepContainer: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: wp(5.3),
    borderWidth: 1,
    borderColor: '#D1D5DB',
    // --- ADDED TOP MARGIN to create spacing from tabs ---
  },
  sectionHeader: {
    marginBottom: hp(2),
    marginTop: hp(1),
  },

  

  sectionTitle: {
    fontSize: rfs(16),
    fontFamily: "Poppins_600SemiBold",
    color: '#111827',
    marginBottom: hp(0.5),
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#B8CDDF',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
    marginBottom: hp(1.8),
  },
  colHalf: {
    flex: 1,
  },
  colFull: {
    width: '100%',
  },
  label: {
    fontSize: rfs(12),
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
    marginBottom: hp(0.8),
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB', 
    height: ms(45),
    paddingHorizontal: ms(12),
    justifyContent: 'center',
  },
  input: {
    fontSize: rfs(10),
    fontFamily: FONT_FAMILY.regular,
    color: '#1F2937',
    flex: 1,
  },
  inputIcon: {
    position: 'absolute',
    right: ms(12),
  },
  disabledInput: {
    backgroundColor: '#D4E6F4',
    borderColor: '#B9CDDF',
  },
  disabledText: {
    color: '#224665',
    fontFamily: FONT_FAMILY.regular,
    fontSize: 10,
  },
  
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(6),
  },
  checkbox: {
    width: ms(16),
    height: ms(16),
    borderWidth: 1,
    borderColor: '#C5D7E7',
    backgroundColor: '#FFFFFF',
    marginRight: ms(8),
  },
  checkboxText: {
    fontSize: rfs(8),
    color: '#8D8D8D',
    fontFamily: FONT_FAMILY.regular,
  },
  addSizeBtn: {
    backgroundColor: '#264660', 
    width: '90%', 
    marginTop: -1,
    borderRadius: 8,
    height:ms(35),
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});