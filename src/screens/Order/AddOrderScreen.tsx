import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Client, clientsApi, CreateOrderRequest, orderApi } from '@api';
import Button from '@components/common/Button';
import DatePickerField from '@components/common/DatePickerField';
import FormDropdown, { FormDropdownOption } from '@components/common/FormDropdown';
import type { Step } from '@components/common/Stepper';
import Stepper from '@components/common/Stepper';
import DesignMockup from '@components/specific/Order/DesignMockup';
import PrintArea from '@components/specific/Order/PrintArea';
import { useDropdownData, usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { ms } from "@utils/responsive";

// Import enhanced dropdown options
import {
    brandOptions,
    courierOptions,
    fabricSupplierOptions,
    fabricTypeOptions,
    paymentMethodOptions,
    paymentPlanOptions,
    printServiceOptions,
    priorityOptions,
    shippingMethodOptions
} from '@constants/dropdownOptions';
import { convertToFormOptions } from '@utils/dropdownHelpers';

// --- REUSABLE COMPONENTS FOR FORM ---
const Label = ({ text }: { text: string }) => (
  <Text style={styles.labelCard}>{text}</Text>
);

const InputField = ({ placeholder, width = '100%', icon, value, onChangeText }: { 
  placeholder: string, 
  width?: any, 
  icon?: string,
  value?: string,
  onChangeText?: (text: string) => void
}) => (
  <View style={[styles.inputWrapperCard, { width }]}>
    <TextInput 
      style={styles.inputCard} 
      placeholder={placeholder} 
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
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

const CheckboxLabel = ({ text, checked, onToggle }: { text: string, checked?: boolean, onToggle?: () => void }) => (
  <TouchableOpacity style={styles.checkboxContainerCard} activeOpacity={0.7} onPress={onToggle}>
    <View style={styles.checkboxCard}>
      {checked && <Ionicons name="checkmark" size={12} color="#001C34" />}
    </View>
    <Text style={styles.checkboxTextCard}>{text}</Text>
  </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeaderCard}>
    <Text style={styles.sectionTitleCard}>{title}</Text>
    <View style={styles.sectionDividerCard} />
  </View>
);

// --- ORDER INFO SECTION ---
const OrderInfoSection = ({ 
  clientOptions, 
  selectedClient, 
  onClientSelect,
  clientBrands,
  requestedDeadline,
  onDeadlineChange,
  selectedBrand,
  onBrandSelect,
  selectedPriority,
  onPrioritySelect,
  selectedShippingMethod,
  onShippingMethodSelect,
  selectedApparelType,
  onApparelTypeSelect,
  selectedPatternType,
  onPatternTypeSelect,
  selectedServiceType,
  onServiceTypeSelect,
  selectedPrintMethod,
  onPrintMethodSelect,
  selectedPrintService,
  onPrintServiceSelect,
  selectedSizeLabel,
  onSizeLabelSelect,
  selectedPrintLabelPlacement,
  onPrintLabelPlacementSelect,
  selectedFabricType,
  onFabricTypeSelect,
  selectedFabricSupplier,
  onFabricSupplierSelect,
  selectedAdditionalOption,
  onAdditionalOptionSelect,
  // Additional form fields
  preferredCourier,
  onPreferredCourierChange,
  receiverName,
  onReceiverNameChange,
  contactNumber,
  onContactNumberChange,
  street,
  onStreetChange,
  province,
  onProvinceChange,
  barangay,
  onBarangayChange,
  city,
  onCityChange,
  postalCode,
  onPostalCodeChange,
  designName,
  onDesignNameChange,
  fabricColor,
  onFabricColorChange,
  threadColor,
  onThreadColorChange,
  ribbingColor,
  onRibbingColorChange,
  optionColor,
  onOptionColorChange,
  fabricColorKeepSame,
  onFabricColorKeepSameChange,
  optionColorKeepSame,
  onOptionColorKeepSameChange,
  // Dropdown data from API
  dropdownData,
  // Static dropdown options
  brandOptions,
  priorityOptions,
  courierOptions,
  shippingMethodOptions,
  printServiceOptions,
  fabricTypeOptions,
  fabricSupplierOptions
}: { 
  clientOptions: FormDropdownOption[];
  selectedClient: string;
  onClientSelect: (value: string) => void;
  clientBrands: string;
  requestedDeadline: Date | null;
  onDeadlineChange: (date: Date | null) => void;
  selectedBrand: string;
  onBrandSelect: (value: string) => void;
  selectedPriority: string;
  onPrioritySelect: (value: string) => void;
  selectedShippingMethod: string;
  onShippingMethodSelect: (value: string) => void;
  selectedApparelType: string;
  onApparelTypeSelect: (value: string) => void;
  selectedPatternType: string;
  onPatternTypeSelect: (value: string) => void;
  selectedServiceType: string;
  onServiceTypeSelect: (value: string) => void;
  selectedPrintMethod: string;
  onPrintMethodSelect: (value: string) => void;
  selectedPrintService: string;
  onPrintServiceSelect: (value: string) => void;
  selectedSizeLabel: string;
  onSizeLabelSelect: (value: string) => void;
  selectedPrintLabelPlacement: string;
  onPrintLabelPlacementSelect: (value: string) => void;
  selectedFabricType: string;
  onFabricTypeSelect: (value: string) => void;
  selectedFabricSupplier: string;
  onFabricSupplierSelect: (value: string) => void;
  selectedAdditionalOption: string;
  onAdditionalOptionSelect: (value: string) => void;
  // Additional form fields
  preferredCourier: string;
  onPreferredCourierChange: (value: string) => void;
  receiverName: string;
  onReceiverNameChange: (value: string) => void;
  contactNumber: string;
  onContactNumberChange: (value: string) => void;
  street: string;
  onStreetChange: (value: string) => void;
  province: string;
  onProvinceChange: (value: string) => void;
  barangay: string;
  onBarangayChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  postalCode: string;
  onPostalCodeChange: (value: string) => void;
  designName: string;
  onDesignNameChange: (value: string) => void;
  fabricColor: string;
  onFabricColorChange: (value: string) => void;
  threadColor: string;
  onThreadColorChange: (value: string) => void;
  ribbingColor: string;
  onRibbingColorChange: (value: string) => void;
  optionColor: string;
  onOptionColorChange: (value: string) => void;
  fabricColorKeepSame: boolean;
  onFabricColorKeepSameChange: (value: boolean) => void;
  optionColorKeepSame: boolean;
  onOptionColorKeepSameChange: (value: boolean) => void;
  // Dropdown data from API
  dropdownData: any;
  // Static dropdown options
  brandOptions: FormDropdownOption[];
  priorityOptions: FormDropdownOption[];
  courierOptions: FormDropdownOption[];
  shippingMethodOptions: FormDropdownOption[];
  printServiceOptions: FormDropdownOption[];
  fabricTypeOptions: FormDropdownOption[];
  fabricSupplierOptions: FormDropdownOption[];
}) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.card}>
        
        {/* 1. ORDER INFORMATION */}
        <SectionHeader title="Order Information" />
        <View style={styles.row}>
          <View style={styles.colHalf}>
            <Label text="Client" />
            <FormDropdown
              options={clientOptions}
              selectedValue={selectedClient}
              onSelect={onClientSelect}
              placeholder="Select Client"
            />
          </View>
          <View style={styles.colHalf}>
            <Label text="Requested Deadline" />
            <DatePickerField
              value={requestedDeadline}
              onChange={onDeadlineChange}
              placeholder="Choose Date"
              minimumDate={new Date()}
            />
          </View>
        </View>

      <View style={styles.row}>
        <View style={styles.colFull}>
          <Label text="Clothing/Company" />
          <View style={[styles.inputWrapperCard, styles.disabledInputCard]}>
            <Text style={styles.disabledTextCard}>
              {clientBrands || 'Company or brand will automatically show here'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Brand" />
          <FormDropdown
            options={brandOptions}
            selectedValue={selectedBrand}
            onSelect={onBrandSelect}
            placeholder="Select Brand"
            showSearch={false}
          />
        </View>
        <View style={styles.colHalf}>
          <Label text="Priority" />
          <FormDropdown
            options={priorityOptions}
            selectedValue={selectedPriority}
            onSelect={onPrioritySelect}
            placeholder="Select Priority"
            showSearch={false}
          />
        </View>
      </View>

      {/* 2. COURIER SECTION */}
      <SectionHeader title="Courier" />
      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Preferred Courier" />
          <FormDropdown
            options={courierOptions}
            selectedValue={preferredCourier}
            onSelect={onPreferredCourierChange}
            placeholder="Select Preferred Courier"
          />
        </View>
        <View style={styles.colHalf}>
          <Label text="Shipping Method" />
          <FormDropdown
            options={shippingMethodOptions}
            selectedValue={selectedShippingMethod}
            onSelect={onShippingMethodSelect}
            placeholder="Select Shipping Method"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Receiver's Name" />
          <InputField 
            placeholder="Enter Receiver Name" 
            value={receiverName}
            onChangeText={onReceiverNameChange}
          />
        </View>
        <View style={styles.colHalf}>
          <Label text="Contact Number" />
          <InputField 
            placeholder="Enter Contact Number" 
            value={contactNumber}
            onChangeText={onContactNumberChange}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colFull}>
          <Label text="Street" />
          <InputField 
            placeholder="Enter Street" 
            value={street}
            onChangeText={onStreetChange}
          />
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Province" />
          <InputField 
            placeholder="Enter Province" 
            value={province}
            onChangeText={onProvinceChange}
          />
        </View>
        <View style={styles.colHalf}>
          <Label text="Barangay" />
          <InputField 
            placeholder="Enter Barangay" 
            value={barangay}
            onChangeText={onBarangayChange}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="City" />
          <InputField 
            placeholder="Enter City" 
            value={city}
            onChangeText={onCityChange}
          />
        </View>
        <View style={styles.colHalf}>
          <Label text="Postal Code" />
          <InputField 
            placeholder="Enter Postal Code" 
            value={postalCode}
            onChangeText={onPostalCodeChange}
          />
        </View>
      </View>

      {/* 3. PRODUCT DETAILS */}
      <SectionHeader title="Product Details" />
      
      <View style={styles.row}>
        <View style={styles.colFull}>
          <Label text="Design Name" />
          <InputField 
            placeholder="Enter Design Name" 
            value={designName}
            onChangeText={onDesignNameChange}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Apparel Type" />
          <FormDropdown
            options={dropdownData.apparelTypes}
            selectedValue={selectedApparelType}
            onSelect={onApparelTypeSelect}
            placeholder="Select Apparel Type"
          />
        </View>
        <View style={styles.colHalf}>
          <Label text="Pattern Type" />
          <FormDropdown
            options={dropdownData.patternTypes}
            selectedValue={selectedPatternType}
            onSelect={onPatternTypeSelect}
            placeholder="Select Pattern Type"
            showSearch={false}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colFull}>
          <Label text="Service Type" />
          <FormDropdown
            options={dropdownData.serviceTypes}
            selectedValue={selectedServiceType}
            onSelect={onServiceTypeSelect}
            placeholder="Select Service Type"
            showSearch={false}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Print Method" />
          <FormDropdown
            options={dropdownData.printMethods}
            selectedValue={selectedPrintMethod}
            onSelect={onPrintMethodSelect}
            placeholder="Select Print Method"
            showSearch={false}
          />
        </View>
        <View style={styles.colHalf}>
          <Label text="Print Service" />
          <FormDropdown
            options={printServiceOptions}
            selectedValue={selectedPrintService}
            onSelect={onPrintServiceSelect}
            placeholder="Select Print Service"
            showSearch={false}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Size Label" />
          <FormDropdown
            options={dropdownData.sizeLabels}
            selectedValue={selectedSizeLabel}
            onSelect={onSizeLabelSelect}
            placeholder="Select Size Label"
            showSearch={false}
          />
        </View>
        <View style={styles.colHalf}>
          <Label text="Print Label Placement" />
          <FormDropdown
            options={dropdownData.printLabelPlacements}
            selectedValue={selectedPrintLabelPlacement}
            onSelect={onPrintLabelPlacementSelect}
            placeholder="Select Label Placement"
          />
        </View>
      </View>

      {/* 4. FABRIC DETAILS */}
      <SectionHeader title="Fabric Details" />
      
      <View style={styles.row}>
        <View style={styles.colFull}>
          <Label text="Fabric Type" />
          <FormDropdown
            options={fabricTypeOptions}
            selectedValue={selectedFabricType}
            onSelect={onFabricTypeSelect}
            placeholder="Select Fabric Type"
            showSearch={false}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Fabric Supplier" />
          <FormDropdown
            options={fabricSupplierOptions}
            selectedValue={selectedFabricSupplier}
            onSelect={onFabricSupplierSelect}
            placeholder="Select Fabric Supplier"
            showSearch={false}
          />
        </View>
        <View style={styles.colHalf}>
           {/* CHANGED: Fabric Order -> Fabric Color */}
           <Label text="Fabric Color" />
           <InputField 
             placeholder="Enter Fabric Color" 
             value={fabricColor}
             onChangeText={onFabricColorChange}
           />
           {/* ADDED: Checkbox */}
           <CheckboxLabel 
             text="Keep the same color for others" 
             checked={fabricColorKeepSame}
             onToggle={() => onFabricColorKeepSameChange(!fabricColorKeepSame)}
           />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Thread Color" />
          <InputField 
            placeholder="Enter Thread Color" 
            value={threadColor}
            onChangeText={onThreadColorChange}
          />
        </View>
        <View style={styles.colHalf}>
          <Label text="Ribbing Color" />
          <InputField 
            placeholder="Enter Ribbing Color" 
            value={ribbingColor}
            onChangeText={onRibbingColorChange}
          />
        </View>
      </View>

      {/* 5. ADD OPTIONS */}
      <SectionHeader title="Add options" />
      
      <View style={styles.row}>
        <View style={styles.colHalf}>
          <Label text="Options" />
          <FormDropdown
            options={dropdownData.additionalOptions}
            selectedValue={selectedAdditionalOption}
            onSelect={onAdditionalOptionSelect}
            placeholder="Select Option"
          />
        </View>
        <View style={styles.colHalf}>
          {/* CHANGED: Value -> Color */}
          <Label text="Color" />
          <InputField 
            placeholder="Enter Color" 
            value={optionColor}
            onChangeText={onOptionColorChange}
          />
          {/* ADDED: Checkbox */}
          <CheckboxLabel 
            text="Keep the same color for others" 
            checked={optionColorKeepSame}
            onToggle={() => onOptionColorKeepSameChange(!optionColorKeepSame)}
          />
        </View>
      </View>

        {/* CHANGED: + Add Filter -> + Add Size (Full Width) */}
        <Button 
          title="+ Add Option" 
          variant="primary" 
          size="base" 
          style={styles.addSizeBtn}
          textStyle={{ fontSize: 16, fontFamily: "Poppins_600SemiBold" }}
          onPress={() => {
            // TODO: Implement add option functionality
            console.log('Add option pressed');
          }}
        />
      </View>
      {/* === END OF CARD === */}
    </View>
  );
};

export default function AddOrderScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();
  const dropdownData = useDropdownData();
  const [currentStep, setCurrentStep] = useState(0);
  const [clients, setClients] = useState<FormDropdownOption[]>([]);
  const [clientsData, setClientsData] = useState<Client[]>([]); // Store full client data
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedClientBrands, setSelectedClientBrands] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('');
  const [selectedApparelType, setSelectedApparelType] = useState('');
  const [selectedPatternType, setSelectedPatternType] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedPrintMethod, setSelectedPrintMethod] = useState('');
  const [selectedPrintService, setSelectedPrintService] = useState('');
  const [selectedSizeLabel, setSelectedSizeLabel] = useState('');
  const [selectedPrintLabelPlacement, setSelectedPrintLabelPlacement] = useState('');
  const [selectedFabricType, setSelectedFabricType] = useState('');
  const [selectedFabricSupplier, setSelectedFabricSupplier] = useState('');
  const [selectedAdditionalOption, setSelectedAdditionalOption] = useState('');
  const [requestedDeadline, setRequestedDeadline] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Additional form fields state
  const [preferredCourier, setPreferredCourier] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [street, setStreet] = useState('');
  const [province, setProvince] = useState('');
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [designName, setDesignName] = useState('');
  const [fabricColor, setFabricColor] = useState('');
  const [threadColor, setThreadColor] = useState('');
  const [ribbingColor, setRibbingColor] = useState('');
  const [optionColor, setOptionColor] = useState('');
  const [fabricColorKeepSame, setFabricColorKeepSame] = useState(false);
  const [optionColorKeepSame, setOptionColorKeepSame] = useState(false);
  
  const orderInfoRef = useRef<any>(null);
  const printAreaRef = useRef<any>(null);
  const designMockupRef = useRef<any>(null);

  // Convert enhanced dropdown options to FormDropdown format
  const brandFormOptions = convertToFormOptions(brandOptions);
  const priorityFormOptions = convertToFormOptions(priorityOptions);
  const courierFormOptions = convertToFormOptions(courierOptions);
  const shippingMethodFormOptions = convertToFormOptions(shippingMethodOptions);
  const printServiceFormOptions = convertToFormOptions(printServiceOptions);
  const fabricTypeFormOptions = convertToFormOptions(fabricTypeOptions);
  const fabricSupplierFormOptions = convertToFormOptions(fabricSupplierOptions);
  const paymentMethodFormOptions = convertToFormOptions(paymentMethodOptions);
  const paymentPlanFormOptions = convertToFormOptions(paymentPlanOptions);

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Update brands when client is selected
  useEffect(() => {
    if (selectedClient) {
      const client = clientsData.find(c => c.id.toString() === selectedClient);
      if (client && client.brands && client.brands.length > 0) {
        const brandNames = client.brands.map(b => b.name).join(', ');
        setSelectedClientBrands(brandNames);
      } else {
        setSelectedClientBrands('No brands available');
      }
    } else {
      setSelectedClientBrands('');
    }
  }, [selectedClient, clientsData]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientsApi.getAll();
      setClientsData(response.data); // Store full client data
      const clientOptions = response.data.map(client => ({
        label: client.name,
        value: client.id.toString(),
      }));
      setClients(clientOptions);
    } catch (error: any) {
      console.error('Failed to fetch clients:', error);
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        console.log('User not authenticated, redirecting to login...');
        // Optionally redirect to login
        // router.replace('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps: Step[] = [
    { title: 'Info', id: 0 },
    { title: 'Quotation', id: 1 },
    { title: 'Design & Mockups', id: 2 },
  ];

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else router.back();
  };

  const handleClear = () => {
    switch (currentStep) {
      case 0: 
        // Clear all form fields for step 0
        setSelectedClient('');
        setSelectedClientBrands('');
        setSelectedBrand('');
        setSelectedPriority('');
        setSelectedShippingMethod('');
        setSelectedApparelType('');
        setSelectedPatternType('');
        setSelectedServiceType('');
        setSelectedPrintMethod('');
        setSelectedPrintService('');
        setSelectedSizeLabel('');
        setSelectedPrintLabelPlacement('');
        setSelectedFabricType('');
        setSelectedFabricSupplier('');
        setSelectedAdditionalOption('');
        setRequestedDeadline(null);
        setPreferredCourier('');
        setReceiverName('');
        setContactNumber('');
        setStreet('');
        setProvince('');
        setBarangay('');
        setCity('');
        setPostalCode('');
        setDesignName('');
        setFabricColor('');
        setThreadColor('');
        setRibbingColor('');
        setOptionColor('');
        setFabricColorKeepSame(false);
        setOptionColorKeepSame(false);
        break;
      case 1: 
        printAreaRef.current?.clearFields(); 
        break;
      case 2: 
        designMockupRef.current?.clearFields(); 
        break;
    }
  };

  const handleSave = async () => {
    try {
      const orderData = await collectOrderData();
      if (!orderData) return;

      console.log('Sending order data:', orderData); // Add logging to debug

      setLoading(true);
      const response = await orderApi.store(orderData);
      
      console.log('API Response:', response); // Add logging to debug
      
      // The API client returns response.data directly, so response should have success property
      if (response && response.success) {
        Alert.alert('Success', 'Order saved successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else if (response && response.success === false) {
        const errorMessage = response.message || 'Failed to save order';
        Alert.alert('Error', `Failed to save order: ${errorMessage}`);
      } else {
        // If response doesn't have success property, assume it's successful if we got here without error
        Alert.alert('Success', 'Order saved successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      console.error('Error saving order:', error);
      console.error('Error response:', error.response); // Add more detailed logging
      
      // Handle API validation errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        
        Alert.alert('Validation Error', `Please fix the following issues:\n\n${errorMessages}`);
      } else if (error.response?.data?.message) {
        // Handle API error messages
        Alert.alert('Error', `Error saving order: ${error.response.data.message}`);
      } else if (error.response?.status) {
        // Handle HTTP status errors
        Alert.alert('Error', `Error saving order: HTTP ${error.response.status} - ${error.response.statusText || 'Server Error'}`);
      } else {
        // Handle network or other errors
        Alert.alert('Error', `Error saving order: ${error.message || 'Network error or unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      const orderData = await collectOrderData();
      if (!orderData) return;

      // Add draft status to the order data
      const draftOrderData = {
        ...orderData,
        status: 'draft'
      };

      setLoading(true);
      const response = await orderApi.store(draftOrderData);
      
      if (response.success) {
        Alert.alert('Success', 'Order saved as draft successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', `Failed to save order as draft: ${response.message}`);
      }
    } catch (error: any) {
      console.error('Error saving order as draft:', error);
      
      // Handle API validation errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        
        Alert.alert('Validation Error', `Please fix the following issues:\n\n${errorMessages}`);
      } else {
        Alert.alert('Error', `Error saving order as draft: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const collectOrderData = async (): Promise<CreateOrderRequest | null> => {
    // Helper function to get label from enhanced dropdown options
    const getLabelFromValue = (enhancedOptions: any[], value: string): string => {
      if (!enhancedOptions || !Array.isArray(enhancedOptions) || !value) {
        console.log('getLabelFromValue: Invalid input', { options: enhancedOptions?.length, value });
        return value;
      }
      
      const option = enhancedOptions.find(opt => opt.value === value);
      const result = option ? option.label : value;
      
      console.log('getLabelFromValue:', { 
        value, 
        optionsCount: enhancedOptions.length, 
        foundOption: !!option, 
        result 
      });
      
      return result;
    };

    // Validate required fields
    if (!selectedClient) {
      Alert.alert('Validation Error', 'Please select a client before saving the order.');
      return null;
    }

    if (!receiverName.trim()) {
      Alert.alert('Validation Error', 'Please enter receiver name before saving the order.');
      return null;
    }

    if (!contactNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter contact number before saving the order.');
      return null;
    }

    if (!designName.trim()) {
      Alert.alert('Validation Error', 'Please enter design name before saving the order.');
      return null;
    }

    if (!fabricColor.trim()) {
      Alert.alert('Validation Error', 'Please enter fabric color before saving the order.');
      return null;
    }

    if (!threadColor.trim()) {
      Alert.alert('Validation Error', 'Please enter thread color before saving the order.');
      return null;
    }

    if (!ribbingColor.trim()) {
      Alert.alert('Validation Error', 'Please enter ribbing color before saving the order.');
      return null;
    }

    // Get data from child components
    const printAreaData = printAreaRef.current?.getData?.() || {};
    const designMockupData = designMockupRef.current?.getData?.() || {};

    console.log('Collecting order data:', {
      printAreaData,
      designMockupData,
      selectedClient
    });

    // Create order items from print area data
    const items = printAreaData.items || [];
    
    if (items.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one item with size and quantity in the Quotation step before saving.');
      return null;
    }

    // Calculate totals
    const totalQuantity = items.reduce((sum: number, item: any) => sum + (parseInt(item.quantity) || 0), 0);
    const totalAmount = items.reduce((sum: number, item: any) => sum + ((parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0)), 0);
    const averageUnitPrice = totalQuantity > 0 ? totalAmount / totalQuantity : 0;

    // Create sizes array (array of objects with name, quantity, and costPrice)
    const sizesArray = items.map((item: any) => ({
      name: item.size, // API expects 'name' instead of 'size'
      quantity: parseInt(item.quantity) || 0,
      costPrice: parseFloat(item.price) || 0 // Add costPrice field (using price for now)
    }));

    // Find the selected client name
    const selectedClientData = clientsData.find(c => c.id.toString() === selectedClient);
    const clientName = selectedClientData?.name || '';

    return {
      // Required fields
      client: selectedClient, // Send client ID instead of name
      company: selectedClientBrands || clientName,
      contact_number: contactNumber,
      receiver_name: receiverName,
      design_name: designName,
      fabric_color: fabricColor,
      thread_color: threadColor,
      ribbing_color: ribbingColor,
      sizes: sizesArray, // Send array instead of string
      total_quantity: totalQuantity,
      average_unit_price: averageUnitPrice,
      total_amount: totalAmount,
      
      // Optional fields
      client_id: selectedClient,
      client_brand: getLabelFromValue(brandOptions, selectedBrand),
      deadline: requestedDeadline?.toISOString() || '',
      priority: getLabelFromValue(priorityOptions, selectedPriority),
      brand: getLabelFromValue(brandOptions, selectedBrand),
      courier: getLabelFromValue(courierOptions, preferredCourier) || getLabelFromValue(shippingMethodOptions, selectedShippingMethod),
      method: getLabelFromValue(shippingMethodOptions, selectedShippingMethod),
      
      // Shipping address
      street_address: street || '',
      city: city || '',
      province: province || '',
      barangay: barangay || '',
      postal_code: postalCode || '',
      
      // Product details
      apparel_type: getLabelFromValue(dropdownData.apparelTypes, selectedApparelType),
      pattern_type: getLabelFromValue(dropdownData.patternTypes, selectedPatternType),
      service_type: getLabelFromValue(dropdownData.serviceTypes, selectedServiceType),
      print_method: getLabelFromValue(dropdownData.printMethods, selectedPrintMethod),
      print_service: getLabelFromValue(printServiceOptions, selectedPrintService),
      size_label: getLabelFromValue(dropdownData.sizeLabels, selectedSizeLabel),
      print_label_placement: getLabelFromValue(dropdownData.printLabelPlacements, selectedPrintLabelPlacement),
      
      // Fabric details
      fabric_type: getLabelFromValue(fabricTypeOptions, selectedFabricType),
      fabric_supplier: getLabelFromValue(fabricSupplierOptions, selectedFabricSupplier),
      placement_measurements: getLabelFromValue(dropdownData.placementMeasurements, designMockupData.placementMeasurement || ''),
      
      // Additional options
      additional_options: getLabelFromValue(dropdownData.additionalOptions, selectedAdditionalOption),
      freebie_items: getLabelFromValue(dropdownData.freebies, designMockupData.freebie || ''),
      freebie_color: optionColor || '',
      freebie_others: '', // Add missing field expected by backend
      
      // Payment information
      payment_method: getLabelFromValue(paymentMethodOptions, designMockupData.paymentMethod || ''),
      payment_plan: getLabelFromValue(paymentPlanOptions, designMockupData.paymentPlan || ''),
      deposit_percentage: 60, // Add missing field expected by backend (default 60% downpayment)
      
      // Additional fields that might be expected
      status: 'pending', // Default order status
      order_type: 'regular', // Default order type
      
      // Additional fields
      notes: [
        printAreaData.notes && `Print Area Notes: ${printAreaData.notes}`,
        designMockupData.notes && `Design Notes: ${designMockupData.notes}`
      ].filter(Boolean).join('\n') || '',
      items: items.map((item: any) => ({
        product_name: item.product_name || item.name || 'Unnamed Product',
        color: item.color || '',
        size: item.size || '',
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0
      }))
    };
  };

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
            <View style={currentStep === 0 ? styles.stepVisible : styles.stepHidden}>
              <OrderInfoSection
                clientOptions={clients}
                selectedClient={selectedClient}
                onClientSelect={setSelectedClient}
                clientBrands={selectedClientBrands}
                requestedDeadline={requestedDeadline}
                onDeadlineChange={setRequestedDeadline}
                selectedBrand={selectedBrand}
                onBrandSelect={setSelectedBrand}
                selectedPriority={selectedPriority}
                onPrioritySelect={setSelectedPriority}
                selectedShippingMethod={selectedShippingMethod}
                onShippingMethodSelect={setSelectedShippingMethod}
                selectedApparelType={selectedApparelType}
                onApparelTypeSelect={setSelectedApparelType}
                selectedPatternType={selectedPatternType}
                onPatternTypeSelect={setSelectedPatternType}
                selectedServiceType={selectedServiceType}
                onServiceTypeSelect={setSelectedServiceType}
                selectedPrintMethod={selectedPrintMethod}
                onPrintMethodSelect={setSelectedPrintMethod}
                selectedPrintService={selectedPrintService}
                onPrintServiceSelect={setSelectedPrintService}
                selectedSizeLabel={selectedSizeLabel}
                onSizeLabelSelect={setSelectedSizeLabel}
                selectedPrintLabelPlacement={selectedPrintLabelPlacement}
                onPrintLabelPlacementSelect={setSelectedPrintLabelPlacement}
                selectedFabricType={selectedFabricType}
                onFabricTypeSelect={setSelectedFabricType}
                selectedFabricSupplier={selectedFabricSupplier}
                onFabricSupplierSelect={setSelectedFabricSupplier}
                selectedAdditionalOption={selectedAdditionalOption}
                onAdditionalOptionSelect={setSelectedAdditionalOption}
                // Additional form fields
                preferredCourier={preferredCourier}
                onPreferredCourierChange={setPreferredCourier}
                receiverName={receiverName}
                onReceiverNameChange={setReceiverName}
                contactNumber={contactNumber}
                onContactNumberChange={setContactNumber}
                street={street}
                onStreetChange={setStreet}
                province={province}
                onProvinceChange={setProvince}
                barangay={barangay}
                onBarangayChange={setBarangay}
                city={city}
                onCityChange={setCity}
                postalCode={postalCode}
                onPostalCodeChange={setPostalCode}
                designName={designName}
                onDesignNameChange={setDesignName}
                fabricColor={fabricColor}
                onFabricColorChange={setFabricColor}
                threadColor={threadColor}
                onThreadColorChange={setThreadColor}
                ribbingColor={ribbingColor}
                onRibbingColorChange={setRibbingColor}
                optionColor={optionColor}
                onOptionColorChange={setOptionColor}
                fabricColorKeepSame={fabricColorKeepSame}
                onFabricColorKeepSameChange={setFabricColorKeepSame}
                optionColorKeepSame={optionColorKeepSame}
                onOptionColorKeepSameChange={setOptionColorKeepSame}
                // Dropdown data from API
                dropdownData={dropdownData}
                // Static dropdown options
                brandOptions={brandFormOptions}
                priorityOptions={priorityFormOptions}
                courierOptions={courierFormOptions}
                shippingMethodOptions={shippingMethodFormOptions}
                printServiceOptions={printServiceFormOptions}
                fabricTypeOptions={fabricTypeFormOptions}
                fabricSupplierOptions={fabricSupplierFormOptions}
              />
            </View>
            <View style={currentStep === 1 ? styles.stepVisible : styles.stepHidden}>
              <PrintArea ref={printAreaRef} />
            </View>
            <View style={currentStep === 2 ? styles.stepVisible : styles.stepHidden}>
              <DesignMockup 
                ref={designMockupRef} 
                dropdownData={{
                  placementMeasurements: dropdownData.placementMeasurements,
                  freebies: dropdownData.freebies,
                  loading: dropdownData.loading
                }}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButtonContainer} onPress={handleClear}>
              <Text style={styles.clearText}>Clear all fields</Text>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              {currentStep < 2 ? (
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
  topSafeArea: {
    flex: 0,
    backgroundColor: '#0a2540',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  stepperWrapper: {
    backgroundColor: '#ffffff',
    paddingHorizontal: ms(20),
    paddingVertical: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  mainContent: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
  stepContainer: {
    padding: ms(20),
  },
  stepVisible: {
    display: 'flex',
  },
  stepHidden: {
    display: 'none',
  },
  sectionHeader: {
    marginBottom: ms(16),
    marginTop: ms(24),
  },
  sectionTitle: {
    fontSize: ms(18),
    fontFamily: 'Poppins_600SemiBold',
    color: '#1e293b',
    marginBottom: ms(8),
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  row: {
    flexDirection: 'row',
    marginBottom: ms(16),
    gap: ms(12),
  },
  colFull: {
    flex: 1,
  },
  colHalf: {
    flex: 0.5,
  },
  label: {
    fontSize: ms(14),
    fontFamily: 'Poppins_500Medium',
    color: '#374151',
    marginBottom: ms(6),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: ms(8),
    paddingHorizontal: ms(12),
    minHeight: ms(44),
  },
  input: {
    flex: 1,
    fontSize: ms(14),
    fontFamily: 'Poppins_400Regular',
    color: '#111827',
    paddingVertical: ms(12),
  },
  inputIcon: {
    marginLeft: ms(8),
  },
  disabledInput: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  disabledText: {
    fontSize: ms(14),
    fontFamily: 'Poppins_400Regular',
    color: '#9ca3af',
    paddingVertical: ms(12),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(8),
  },
  checkbox: {
    width: ms(16),
    height: ms(16),
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: ms(3),
    marginRight: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxText: {
    fontSize: ms(12),
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
  },
  addSizeBtn: {
    marginTop: ms(16),
    marginBottom: ms(8),
  },
  footer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: ms(20),
    paddingVertical: ms(16),
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  clearButtonContainer: {
    alignItems: 'center',
    marginBottom: ms(16),
  },
  clearText: {
    fontSize: ms(14),
    fontFamily: 'Poppins_400Regular',
    color: '#ef4444',
    textDecorationLine: 'underline',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ms(12),
  },
  navBtn: {
    flex: 1,
    minHeight: ms(48),
  },
  navBtnSmall: {
    flex: 1,
    minHeight: ms(44),
  },
  backBtn: {
    borderColor: '#d1d5db',
  },
  backBtnText: {
    color: '#6b7280',
    fontFamily: 'Poppins_500Medium',
  },
  
  // Card-based styles for Step 1 to match Steps 2 & 3
  card: {
    backgroundColor: '#EBF6FF', 
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 16,
  },
  sectionHeaderCard: {
    marginBottom: ms(20),
  },
  sectionTitleCard: {
    fontSize: ms(16),
    fontFamily: 'Poppins_600SemiBold',
    color: '#111827',
    marginBottom: ms(8),
  },
  sectionDividerCard: {
    height: 1,
    backgroundColor: '#cbd5e1',
  },
  labelCard: {
    fontSize: ms(12),
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
    marginBottom: ms(6),
  },
  inputWrapperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: ms(6),
    paddingHorizontal: ms(12),
    minHeight: ms(40),
  },
  inputCard: {
    flex: 1,
    fontSize: ms(13),
    fontFamily: 'Poppins_400Regular',
    color: '#1F2937',
    paddingVertical: ms(10),
  },
  disabledInputCard: {
    backgroundColor: '#DCEAF5',
    borderColor: '#CFE0EE',
  },
  disabledTextCard: {
    fontSize: ms(13),
    fontFamily: 'Poppins_400Regular',
    color: '#1F2937',
    paddingVertical: ms(10),
  },
  checkboxContainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(4),
  },
  checkboxCard: {
    width: ms(14),
    height: ms(14),
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: ms(3),
    marginRight: ms(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxTextCard: {
    fontSize: ms(9),
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
  },
});