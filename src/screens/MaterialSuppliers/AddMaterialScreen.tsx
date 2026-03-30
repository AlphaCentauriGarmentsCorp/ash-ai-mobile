import Button from '@components/common/Button';
import Dropdown from '@components/common/Dropdown';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { materialApi, supplierApi, type CreateMaterialRequest } from '@api/materialSuppliers';

const MaterialOptions = [
  { value: "Fabric", label: "Fabric" },
  { value: "Threads", label: "Threads" },
  { value: "Interfacing", label: "Interfacing" },
  { value: "Labels Tags", label: "Labels Tags" },
  { value: "Plastisol Ink", label: "Plastisol Ink" },
  { value: "Water-Based Ink", label: "Water-Based Ink" },
  { value: "Discharge Ink", label: "Discharge Ink" },
  { value: "Fabric Paints", label: "Fabric Paints" },
  { value: "Heat Transfer Powder", label: "Heat Transfer Powder" },
  { value: "Foil Glitter Material", label: "Foil Glitter Material" },
  { value: "Screen Mesh", label: "Screen Mesh" },
  { value: "Aluminum Screen Frame", label: "Aluminum Screen Frame" },
  { value: "Squeegee Rubber", label: "Squeegee Rubber" },
  { value: "Squeegee Handle", label: "Squeegee Handle" },
  { value: "Screen Tape", label: "Screen Tape" },
  { value: "Heat Press", label: "Heat Press" },
  { value: "Stencil Masking Materials", label: "Stencil Masking Materials" },
  { value: "Photo Emulsion", label: "Photo Emulsion" },
  { value: "Emulsion Remover", label: "Emulsion Remover" },
  { value: "Screen Cleaner Degreaser", label: "Screen Cleaner Degreaser" },
  { value: "Adhesive Spray", label: "Adhesive Spray" },
  { value: "Packaging Materials", label: "Packaging Materials" },
  { value: "Protective Gloves", label: "Protective Gloves" },
  { value: "Aprons Workwear", label: "Aprons Workwear" },
];

export default function AddMaterialScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();

  const [name, setName] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [minimum, setMinimum] = useState('');
  const [lead, setLead] = useState('');
  const [notes, setNotes] = useState('');
  
  const [supplierOptions, setSupplierOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await supplierApi.getAll({ page: 1, per_page: 9999 });
      const suppliersArray = Array.isArray(response.data) ? response.data : [];
      
      const options = suppliersArray.map(supplier => ({
        label: supplier.code_name,
        value: supplier.id.toString(),
      }));
      
      setSupplierOptions(options);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      Alert.alert('Error', 'Failed to load suppliers');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Material name is required';
    if (!materialType) newErrors.material_type = 'Material type is required';
    if (!supplierId) newErrors.supplier_id = 'Supplier is required';
    if (!price.trim()) newErrors.price = 'Price is required';
    if (!unit.trim()) newErrors.unit = 'Unit is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const materialData: CreateMaterialRequest = {
        supplier_id: Number(supplierId),
        name: name.trim(),
        material_type: materialType,
        unit: unit.trim(),
        price: price.trim(),
        minimum: minimum.trim(),
        lead: lead.trim(),
        notes: notes.trim(),
      };

      console.log('Submitting material data:', materialData);
      
      await materialApi.store(materialData);
      
      Alert.alert('Success', 'Material added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error adding material:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add material';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setMaterialType('');
    setSupplierId('');
    setPrice('');
    setUnit('');
    setMinimum('');
    setLead('');
    setNotes('');
    setErrors({});
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader title="Add Material" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Material Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Material Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Enter material name"
              placeholderTextColor="#9CA3AF"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Material Type <Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              options={MaterialOptions}
              selectedValue={materialType}
              onSelect={setMaterialType}
              placeholder="Select material type"
            />
            {errors.material_type && <Text style={styles.errorText}>{errors.material_type}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Supplier <Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              options={supplierOptions}
              selectedValue={supplierId}
              onSelect={setSupplierId}
              placeholder="Select supplier"
            />
            {errors.supplier_id && <Text style={styles.errorText}>{errors.supplier_id}</Text>}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>
                Price <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.price && styles.inputError]}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>
                Unit <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.unit && styles.inputError]}
                value={unit}
                onChangeText={setUnit}
                placeholder="e.g., yards, kg"
                placeholderTextColor="#9CA3AF"
              />
              {errors.unit && <Text style={styles.errorText}>{errors.unit}</Text>}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Minimum Units</Text>
              <TextInput
                style={styles.input}
                value={minimum}
                onChangeText={setMinimum}
                placeholder="Min order quantity"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Lead Time</Text>
              <TextInput
                style={styles.input}
                value={lead}
                onChangeText={setLead}
                placeholder="e.g., 2 weeks"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional notes..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Reset"
              onPress={handleReset}
              variant="secondary"
              size="base"
              disabled={isSubmitting}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title={isSubmitting ? "Saving..." : "Save Material"}
              onPress={handleSubmit}
              variant="primary"
              size="base"
              disabled={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.white,
  },
  scrollContent: { 
    padding: wp(4),
    paddingBottom: hp(4),
  },
  formCard: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: wp(5),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#0D253F',
    marginBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#A5B4BF',
    paddingBottom: hp(1),
  },
  inputGroup: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: '#0D253F',
    marginBottom: hp(0.5),
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    minHeight: hp(12),
    paddingTop: hp(1.2),
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#EF4444',
    marginTop: hp(0.5),
  },
  row: {
    flexDirection: 'row',
    gap: wp(3),
  },
  halfWidth: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: wp(3),
    marginTop: hp(2),
  },
  buttonWrapper: {
    flex: 1,
  },
});
