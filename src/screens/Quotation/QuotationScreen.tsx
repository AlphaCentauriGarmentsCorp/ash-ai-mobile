import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import quotationApi from '../../api/quotation';

import Button from '@components/common/Button';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';

interface QuotationItem {
  id: number;
  size_id: number;
  quantity: number;
  tshirt_type_id: number;
  print_type_id: number;
  print_pattern_id: number;
  neckline_id: number;
}

interface Addon {
  id: number;
  category_id: number;
  name: string;
  price_type: 'free' | 'per_piece';
  price: number;
  is_active: boolean;
}

export default function QuotationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Order Information
  const [orderInfo, setOrderInfo] = useState({
    client_name: '',
    client_email: '',
    brand: '',
    shirt_color: '',
    free_items: '',
  });

  // Pricing Data
  const tshirtTypes = [
    { id: 1, name: 'Boxy', base_price: 370 },
    { id: 2, name: 'Standard', base_price: 300 },
  ];

  const necklines = [
    { id: 1, name: 'Standard', base_price: 0 },
    { id: 2, name: 'Proclub', base_price: 20 },
    { id: 3, name: 'Neckline2', base_price: 50 },
  ];

  const sizes = [
    { id: 1, name: 'SMALL' }, { id: 2, name: 'MEDIUM' }, { id: 3, name: 'LARGE' },
    { id: 4, name: 'XL' }, { id: 5, name: '2XL' }, { id: 6, name: '3XL' },
  ];

  const sizePrices = [
    { id: 1, tshirt_type_id: 1, size_id: 1, price: 0 }, { id: 2, tshirt_type_id: 1, size_id: 2, price: 10 },
    { id: 3, tshirt_type_id: 1, size_id: 3, price: 20 }, { id: 4, tshirt_type_id: 1, size_id: 4, price: 30 },
    { id: 5, tshirt_type_id: 1, size_id: 5, price: 40 }, { id: 6, tshirt_type_id: 1, size_id: 6, price: 50 },
    { id: 7, tshirt_type_id: 2, size_id: 1, price: 0 }, { id: 8, tshirt_type_id: 2, size_id: 2, price: 10 },
    { id: 9, tshirt_type_id: 2, size_id: 3, price: 20 }, { id: 10, tshirt_type_id: 2, size_id: 4, price: 30 },
    { id: 11, tshirt_type_id: 2, size_id: 5, price: 40 }, { id: 12, tshirt_type_id: 2, size_id: 6, price: 50 },
    { id: 13, tshirt_type_id: 3, size_id: 1, price: 0 }, { id: 14, tshirt_type_id: 3, size_id: 2, price: 10 },
    { id: 15, tshirt_type_id: 3, size_id: 3, price: 20 }, { id: 16, tshirt_type_id: 3, size_id: 4, price: 30 },
    { id: 17, tshirt_type_id: 3, size_id: 5, price: 40 }, { id: 18, tshirt_type_id: 3, size_id: 6, price: 50 },
  ];

  const printTypes = [
    { id: 1, name: 'SILK SCREEN', base_price: 0 },
    { id: 2, name: 'DTF', base_price: 100 },
  ];

  const printColors = [
    { id: 1, print_type_id: 1, color_count: 1, price: 20 }, { id: 2, print_type_id: 1, color_count: 2, price: 30 },
    { id: 3, print_type_id: 1, color_count: 3, price: 40 }, { id: 4, print_type_id: 1, color_count: 4, price: 60 },
    { id: 5, print_type_id: 1, color_count: 5, price: 80 }, { id: 6, print_type_id: 1, color_count: 6, price: 100 },
    { id: 7, print_type_id: 2, color_count: 1, price: 30 }, { id: 8, print_type_id: 2, color_count: 2, price: 50 },
    { id: 9, print_type_id: 2, color_count: 3, price: 70 }, { id: 10, print_type_id: 2, color_count: 4, price: 90 },
    { id: 11, print_type_id: 2, color_count: 5, price: 110 }, { id: 12, print_type_id: 2, color_count: 6, price: 130 },
    { id: 13, print_type_id: 3, color_count: 1, price: 10 }, { id: 14, print_type_id: 3, color_count: 2, price: 20 },
    { id: 15, print_type_id: 3, color_count: 3, price: 30 }, { id: 16, print_type_id: 3, color_count: 4, price: 40 },
    { id: 17, print_type_id: 3, color_count: 5, price: 50 }, { id: 18, print_type_id: 3, color_count: 6, price: 60 },
    { id: 19, print_type_id: 4, color_count: 1, price: 30 }, { id: 20, print_type_id: 4, color_count: 2, price: 40 },
    { id: 21, print_type_id: 4, color_count: 3, price: 50 }, { id: 22, print_type_id: 4, color_count: 4, price: 60 },
    { id: 23, print_type_id: 4, color_count: 5, price: 70 }, { id: 24, print_type_id: 4, color_count: 6, price: 80 },
  ];

  const printPatterns = [
    { id: 1, name: 'Standard Print', additional_price: 0 },
    { id: 2, name: 'Full Print', additional_price: 20 },
  ];

  const addonCategories = [
    { id: 1, name: 'PACKAGING' },
    { id: 2, name: 'LABELING' },
    { id: 3, name: 'EMBELLISHMENT' },
  ];

  const addons: Addon[] = [
    { id: 1, category_id: 1, name: 'PAPER BAG', price_type: 'per_piece', price: 20, is_active: true },
    { id: 2, category_id: 1, name: 'PLASTIC BAG', price_type: 'per_piece', price: 10, is_active: true },
    { id: 3, category_id: 2, name: 'CUSTOM HANG TAG', price_type: 'per_piece', price: 15, is_active: true },
    { id: 4, category_id: 2, name: 'BRAND LABEL', price_type: 'per_piece', price: 25, is_active: true },
    { id: 5, category_id: 3, name: 'RHINESTONES', price_type: 'per_piece', price: 50, is_active: true },
    { id: 6, category_id: 3, name: 'SEQUINS', price_type: 'per_piece', price: 45, is_active: true },
  ];

  // State
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([
    { id: 1, size_id: 1, quantity: 50, tshirt_type_id: 1, print_type_id: 1, print_pattern_id: 1, neckline_id: 1 },
    { id: 2, size_id: 2, quantity: 50, tshirt_type_id: 1, print_type_id: 1, print_pattern_id: 1, neckline_id: 1 },
    { id: 3, size_id: 3, quantity: 50, tshirt_type_id: 1, print_type_id: 1, print_pattern_id: 1, neckline_id: 1 },
  ]);

  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [selectedTshirtType, setSelectedTshirtType] = useState('');
  const [selectedPrintType, setSelectedPrintType] = useState('');
  const [selectedPrintPattern, setSelectedPrintPattern] = useState('');
  const [selectedNeckline, setSelectedNeckline] = useState('');
  const [selectedColorCount, setSelectedColorCount] = useState('');
  const [discount, setDiscount] = useState({ type: 'percentage', value: 0 });

  // Helper functions
  const getSizePrice = (tshirtTypeId: number, sizeId: number) => {
    const priceRecord = sizePrices.find(sp => sp.tshirt_type_id === tshirtTypeId && sp.size_id === sizeId);
    return priceRecord?.price || 0;
  };

  const getCombinedSizePrice = (tshirtTypeId: number, sizeId: number) => {
    const tshirtBasePrice = tshirtTypes.find(t => t.id === tshirtTypeId)?.base_price || 0;
    const sizePrice = getSizePrice(tshirtTypeId, sizeId);
    return tshirtBasePrice + sizePrice;
  };

  const getPrintColorPrice = (printTypeId: number, colorCount: number) => {
    const colorRecord = printColors.find(pc => pc.print_type_id === printTypeId && pc.color_count === colorCount);
    return colorRecord?.price || 0;
  };

  const calculateItemAmount = (item: QuotationItem) => {
    const combinedSizePrice = getCombinedSizePrice(item.tshirt_type_id, item.size_id);
    const printTypeBasePrice = printTypes.find(t => t.id === item.print_type_id)?.base_price || 0;
    const printColorPrice = getPrintColorPrice(item.print_type_id,selectedColorCount ? parseInt(selectedColorCount) : 0);
    const printPatternPrice = printPatterns.find(p => p.id === item.print_pattern_id)?.additional_price || 0;
    const necklinePrice = necklines.find(n => n.id === item.neckline_id)?.base_price || 0;

    const pricePerPiece = combinedSizePrice + printTypeBasePrice + printColorPrice + printPatternPrice + necklinePrice;
    const total = pricePerPiece * item.quantity;

    return { pricePerPiece, total };
  };

  const calculateTotals = () => {
    const totals = quotationItems.reduce(
      (acc, item) => {
        const { total } = calculateItemAmount(item);
        return {
          totalAmount: acc.totalAmount + total,
          totalQuantity: acc.totalQuantity + item.quantity,
        };
      },
      { totalAmount: 0, totalQuantity: 0 }
    );

    const totalQuantity = quotationItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAddons = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      const addonPrice = addon?.price_type === 'free' ? 0 : addon?.price || 0;
      return sum + addonPrice * totalQuantity;
    }, 0);

    const subtotal = totals.totalAmount + totalAddons;
    const discountAmount = discount.value > 0
      ? discount.type === 'percentage' ? subtotal * (discount.value / 100) : discount.value
      : 0;
    const grandTotal = subtotal - discountAmount;
    const downPayment = grandTotal * 0.6;
    const balance = grandTotal * 0.4;

    return { ...totals, totalAddons, subtotal, discountAmount, grandTotal, downPayment, balance };
  };

  const totals = calculateTotals();

  // Actions
  const addQuotationItem = () => {
    const newId = Math.max(...quotationItems.map(i => i.id), 0) + 1;
    setQuotationItems([
      ...quotationItems,
      {
        id: newId,
        size_id: sizes[0]?.id || 1,
        quantity: 50,
        tshirt_type_id: selectedTshirtType ? parseInt(selectedTshirtType) : 1,
        print_type_id: selectedPrintType ? parseInt(selectedPrintType) : 1,
        print_pattern_id: selectedPrintPattern ? parseInt(selectedPrintPattern) : 1,
        neckline_id: selectedNeckline ? parseInt(selectedNeckline) : 1,
      },
    ]);
  };

  const removeQuotationItem = (id: number) => {
    if (quotationItems.length <= 1) {
      Alert.alert('Error', 'At least one item is required');
      return;
    }
    setQuotationItems(quotationItems.filter(item => item.id !== id));
  };

  const updateItemField = (id: number, field: keyof QuotationItem, value: any) => {
    setQuotationItems(quotationItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const applyToAll = (field: keyof QuotationItem, value: any) => {
    setQuotationItems(quotationItems.map(item => ({ ...item, [field]: value })));
  };

  const toggleAddon = (addonId: number) => {
    setSelectedAddons(prev => prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]);
  };

  const handleSave = async () => {
  if (!orderInfo.client_name.trim()) {
    Alert.alert('Validation Error', 'Client name is required');
    return;
  }

  if (!orderInfo.client_email.trim()) {
    Alert.alert('Validation Error', 'Client email is required');
    return;
  }

  try {
    setLoading(true);

    console.log('quotationApi:', quotationApi);

    await quotationApi.store({
      client_name: orderInfo.client_name,
      client_email: orderInfo.client_email,
      brand: orderInfo.brand,
      shirt_color: orderInfo.shirt_color,
      free_items: orderInfo.free_items,
      tshirt_type_id: selectedTshirtType ? parseInt(selectedTshirtType) : null,
      neckline_id: selectedNeckline ? parseInt(selectedNeckline) : null,
      print_type_id: selectedPrintType ? parseInt(selectedPrintType) : null,
      print_color_count: selectedColorCount ? parseInt(selectedColorCount) : null,
      print_pattern_id: selectedPrintPattern ? parseInt(selectedPrintPattern) : null,
    });

    Alert.alert('Success', 'Quotation saved successfully!');
    router.push('/quotation/all' as any);
  } catch (error: any) {
    Alert.alert('Error', error?.message || 'Failed to save quotation');
  } finally {
    setLoading(false);
  }
};

  const handleClearAll = () => {
    setQuotationItems([
      { id: 1, size_id: 1, quantity: 50, tshirt_type_id: 1, print_type_id: 1, print_pattern_id: 1, neckline_id: 1 },
      { id: 2, size_id: 2, quantity: 50, tshirt_type_id: 1, print_type_id: 1, print_pattern_id: 1, neckline_id: 1 },
      { id: 3, size_id: 3, quantity: 50, tshirt_type_id: 1, print_type_id: 1, print_pattern_id: 1, neckline_id: 1 },
    ]);
    setSelectedAddons([]);
    setDiscount({ type: 'percentage', value: 0 });
    setSelectedTshirtType('');
    setSelectedNeckline('');
    setSelectedPrintType('');
    setSelectedColorCount('');
    setSelectedPrintPattern('');
    setOrderInfo({ client_name: '', client_email: '', brand: '', shirt_color: '', free_items: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Add Quotation" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          
          {/* Section: Order Information */}
      <Text style={styles.sectionTitle}>Order Information</Text>
<View style={styles.divider} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Client Name</Text>
  <TextInput
    style={styles.input}
    placeholder="Enter client name"
    placeholderTextColor="#9CA3AF"
    value={orderInfo.client_name}
    onChangeText={(text) => setOrderInfo({ ...orderInfo, client_name: text })}
  />
</View>

<View style={{ height: hp(1.5) }} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Client Email</Text>
  <TextInput
    style={styles.input}
    placeholder="Enter client email"
    placeholderTextColor="#9CA3AF"
    value={orderInfo.client_email}
    onChangeText={(text) => setOrderInfo({ ...orderInfo, client_email: text })}
  />
</View>

<View style={{ height: hp(1.5) }} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Brand</Text>
  <TextInput
    style={styles.input}
    placeholder="Enter brand name"
    placeholderTextColor="#9CA3AF"
    value={orderInfo.brand}
    onChangeText={(text) => setOrderInfo({ ...orderInfo, brand: text })}
  />
</View>

<View style={{ height: hp(1.5) }} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Shirt Color</Text>
  <TextInput
    style={styles.input}
    placeholder="Enter shirt color"
    placeholderTextColor="#9CA3AF"
    value={orderInfo.shirt_color}
    onChangeText={(text) => setOrderInfo({ ...orderInfo, shirt_color: text })}
  />
</View>

<View style={{ height: hp(1.5) }} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Free Items</Text>
  <TextInput
    style={styles.input}
    placeholder="Enter free items"
    placeholderTextColor="#9CA3AF"
    value={orderInfo.free_items}
    onChangeText={(text) => setOrderInfo({ ...orderInfo, free_items: text })}
  />
</View>

          {/* Section: Global Configuration */}
<Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Global Configuration</Text>
<View style={styles.divider} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Tshirt Type *</Text>
  <FormDropdown
    options={tshirtTypes.map(t => ({
      label: `${t.name} (₱${t.base_price})`,
      value: t.id.toString(),
    }))}
    selectedValue={selectedTshirtType}
    onSelect={(value) => {
      setSelectedTshirtType(value);
    }}
    placeholder="Select Tshirt Type"
    showSearch={false}
  />
</View>

<View style={{ height: hp(1.5) }} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Neckline *</Text>
  <FormDropdown
    options={necklines.map(n => ({
      label: `${n.name} (₱${n.base_price})`,
      value: n.id.toString(),
    }))}
    selectedValue={selectedNeckline}
    onSelect={(value) => {
      setSelectedNeckline(value);
    }}
    placeholder="Select Neckline"
    showSearch={false}
  />
</View>

<View style={{ height: hp(1.5) }} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Print Type *</Text>
  <FormDropdown
    options={printTypes.map(t => ({
      label: `${t.name} (₱${t.base_price})`,
      value: t.id.toString(),
    }))}
    selectedValue={selectedPrintType}
    onSelect={(value) => {
      setSelectedPrintType(value);
      setSelectedColorCount('');
    }}
    placeholder="Select Print Type"
    showSearch={false}
  />
</View>

<View style={{ height: hp(1.5) }} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Print Colors *</Text>
  <FormDropdown
    options={
      selectedPrintType
        ? printColors
            .filter(pc => pc.print_type_id === parseInt(selectedPrintType))
            .map(pc => ({
              label: `${pc.color_count} color${pc.color_count > 1 ? 's' : ''} (₱${pc.price})`,
              value: pc.color_count.toString(),
            }))
        : []
    }
    selectedValue={selectedColorCount}
    onSelect={(value) => setSelectedColorCount(value)}
    placeholder="Select Color Count"
    showSearch={false}
  />
</View>

<View style={{ height: hp(1.5) }} />

<View style={styles.fullInputContainer}>
  <Text style={styles.label}>Print Pattern *</Text>
  <FormDropdown
    options={printPatterns.map(p => ({
      label: `${p.name} (+₱${p.additional_price})`,
      value: p.id.toString(),
    }))}
    selectedValue={selectedPrintPattern}
    onSelect={(value) => {
      setSelectedPrintPattern(value);
    }}
    placeholder="Select Print Pattern"
    showSearch={false}
  />
</View>
          </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButtonContainer} onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear all fields</Text>
          </TouchableOpacity>
          
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              size="base"
              style={styles.cancelBtn}
              textStyle={styles.cancelText}
              disabled={loading}
            />
            
            <Button
              title={loading ? "Saving..." : "Save Quotation"}
              onPress={handleSave}
              variant="primary"
              size="base"
              style={styles.submitBtn}
              disabled={loading}
              loading={loading}
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
  },
  card: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: wp(5.3),
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: 'Poppins_700Bold',
    color: '#001C34',
    marginBottom: hp(1.2),
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: hp(1.9),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.9),
  },
  halfInputContainer: {
    width: '48%',
  },
  fullInputContainer: {
    width: '100%',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
    marginBottom: hp(0.6),
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingHorizontal: wp(2.7),
    paddingVertical: hp(1),
    fontSize: FONT_SIZES.sm,
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },
  textArea: {
    height: hp(12.5),
    textAlignVertical: 'top',
  },
  itemContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: wp(3),
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: hp(1),
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  itemTitle: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
  },
  pricingInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: wp(2.5),
    marginTop: hp(1),
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pricingLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
  },
  pricingValue: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
    color: '#111',
  },
  pricingLabelBold: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
  },
  pricingValueBold: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#001C34',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: hp(1.2),
    marginTop: hp(1),
    gap: 6,
  },
  addItemText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
  },
  addonCategory: {
    marginBottom: hp(1.5),
  },
  addonCategoryTitle: {
    fontSize: FONT_SIZES.xs,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B5563',
    marginBottom: hp(0.8),
  },
  addonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  addonChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    minWidth: '48%',
  },
  addonChipSelected: {
    backgroundColor: '#001C34',
    borderColor: '#001C34',
  },
  addonChipText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
    color: '#374151',
  },
  addonChipTextSelected: {
    color: COLORS.white,
  },
  addonChipPrice: {
    fontSize: 10,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
    marginTop: 2,
  },
  addonChipPriceSelected: {
    color: COLORS.white,
    opacity: 0.9,
  },
  discountApplied: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
    padding: wp(3),
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  discountText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
    color: '#059669',
  },
  discountAmount: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Poppins_600SemiBold',
    color: '#059669',
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: wp(3),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(0.5),
  },
  summaryLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: '#111',
  },
  summaryLabelTotal: {
    fontSize: FONT_SIZES.base,
    fontFamily: 'Poppins_700Bold',
    color: '#001C34',
  },
  summaryValueTotal: {
    fontSize: FONT_SIZES.xl,
    fontFamily: 'Poppins_700Bold',
    color: '#001C34',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: hp(0.8),
  },
  footer: {
    marginTop: hp(3.1),
    marginBottom: hp(2.5),
  },
  clearButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: hp(2.5),
  },
  clearText: {
    color: '#4B5563',
    textDecorationLine: 'underline',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(4),
  },
  cancelBtn: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
    minWidth: wp(26.7),
  },
  cancelText: {
    color: '#1F2937',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#0D253F',
    minWidth: wp(26.7),
  },
  breakdownContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
  },
  breakdownHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: hp(1),
    paddingHorizontal: wp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  breakdownHeaderText: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Poppins_600SemiBold',
    color: '#374151',
    textAlign: 'center',
  },
  breakdownRow: {
    flexDirection: 'row',
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  breakdownCell: {
    flex: 1,
    fontSize: 9,
    fontFamily: FONT_FAMILY.regular,
    color: '#111',
    textAlign: 'center',
  },
  breakdownCellBold: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
  },
  breakdownFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EBF6FF',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  breakdownFooterLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: 'Poppins_600SemiBold',
    color: '#374151',
  },
  breakdownFooterValue: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Poppins_700Bold',
    color: '#001C34',
  },
});

