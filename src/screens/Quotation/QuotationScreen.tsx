import { Ionicons } from '@expo/vector-icons';
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

import Button from '@components/common/Button';
import { UnifiedDropdown } from '@components/unified';
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
    brand: '',
    shirt_color: '',
    free_items: '',
    notes: '',
  });

  // Pricing Data
  const tshirtTypes = [
    { id: 1, name: 'BOXY', base_price: 350 },
    { id: 2, name: 'REGULAR', base_price: 300 },
    { id: 3, name: 'OVERSIZED', base_price: 400 },
  ];

  const necklines = [
    { id: 1, name: 'STANDARD', base_price: 0 },
    { id: 2, name: 'CREW NECK', base_price: 10 },
    { id: 3, name: 'V-NECK', base_price: 15 },
    { id: 4, name: 'TURTLENECK', base_price: 20 },
    { id: 5, name: 'MOCK NECK', base_price: 12 },
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
    { id: 1, name: 'SILKSCREEN (WATERBASED)', base_price: 50 },
    { id: 2, name: 'SILKSCREEN (PLASTISOL)', base_price: 50 },
    { id: 3, name: 'DTG', base_price: 100 },
    { id: 4, name: 'EMBROIDERY', base_price: 150 },
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
    { id: 1, name: 'STANDARD', additional_price: 0 },
    { id: 2, name: 'ALL-OVER PRINT', additional_price: 200 },
    { id: 3, name: 'SLEEVE PRINT', additional_price: 100 },
    { id: 4, name: 'BACK PRINT', additional_price: 150 },
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
  const [selectedTshirtType, setSelectedTshirtType] = useState(1);
  const [selectedPrintType, setSelectedPrintType] = useState(1);
  const [selectedPrintPattern, setSelectedPrintPattern] = useState(1);
  const [selectedNeckline, setSelectedNeckline] = useState(1);
  const [selectedColorCount, setSelectedColorCount] = useState(2);
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
    const printColorPrice = getPrintColorPrice(item.print_type_id, selectedColorCount);
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
    setQuotationItems([...quotationItems, {
      id: newId, size_id: sizes[0]?.id || 1, quantity: 50,
      tshirt_type_id: selectedTshirtType, print_type_id: selectedPrintType,
      print_pattern_id: selectedPrintPattern, neckline_id: selectedNeckline,
    }]);
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

  const handleSave = () => {
    if (!orderInfo.client_name.trim()) {
      Alert.alert('Validation Error', 'Client name is required');
      return;
    }
    const invalidItems = quotationItems.filter(item => item.quantity > 0 && item.quantity < 50);
    if (invalidItems.length > 0) {
      Alert.alert('Validation Error', 'All items must have a minimum quantity of 50 pieces');
      return;
    }
    Alert.alert('Success', 'Quotation saved successfully!');
  };

  const handleClearAll = () => {
    setQuotationItems([
      { id: 1, size_id: 1, quantity: 50, tshirt_type_id: 1, print_type_id: 1, print_pattern_id: 1, neckline_id: 1 },
      { id: 2, size_id: 2, quantity: 50, tshirt_type_id: 1, print_type_id: 1, print_pattern_id: 1, neckline_id: 1 },
      { id: 3, size_id: 3, quantity: 50, tshirt_type_id: 1, print_type_id: 1, print_pattern_id: 1, neckline_id: 1 },
    ]);
    setSelectedAddons([]);
    setDiscount({ type: 'percentage', value: 0 });
    setOrderInfo({ client_name: '', brand: '', shirt_color: '', free_items: '', notes: '' });
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
          
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Client Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter client name"
                placeholderTextColor="#9CA3AF"
                value={orderInfo.client_name}
                onChangeText={(text) => setOrderInfo({ ...orderInfo, client_name: text })}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Brand</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter brand name"
                placeholderTextColor="#9CA3AF"
                value={orderInfo.brand}
                onChangeText={(text) => setOrderInfo({ ...orderInfo, brand: text })}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Shirt Color</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter shirt color"
                placeholderTextColor="#9CA3AF"
                value={orderInfo.shirt_color}
                onChangeText={(text) => setOrderInfo({ ...orderInfo, shirt_color: text })}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Free Items</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter free items"
                placeholderTextColor="#9CA3AF"
                value={orderInfo.free_items}
                onChangeText={(text) => setOrderInfo({ ...orderInfo, free_items: text })}
              />
            </View>
          </View>

          {/* Section: Global Configuration */}
          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Global Configuration</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <UnifiedDropdown
                variant="searchable"
                label="T-shirt Type"
                options={tshirtTypes.map(t => ({ label: `${t.name} (₱${t.base_price})`, value: t.id.toString() }))}
                selectedValue={selectedTshirtType.toString()}
                onSelect={(value) => {
                  const id = parseInt(value);
                  setSelectedTshirtType(id);
                  applyToAll('tshirt_type_id', id);
                }}
                placeholder="Select T-shirt Type"
                showSearch={false}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <UnifiedDropdown
                variant="searchable"
                label="Neckline"
                options={necklines.map(n => ({ label: `${n.name} (₱${n.base_price})`, value: n.id.toString() }))}
                selectedValue={selectedNeckline.toString()}
                onSelect={(value) => {
                  const id = parseInt(value);
                  setSelectedNeckline(id);
                  applyToAll('neckline_id', id);
                }}
                placeholder="Select Neckline"
                showSearch={false}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <UnifiedDropdown
                variant="searchable"
                label="Print Type"
                options={printTypes.map(t => ({ label: `${t.name} (₱${t.base_price})`, value: t.id.toString() }))}
                selectedValue={selectedPrintType.toString()}
                onSelect={(value) => {
                  const id = parseInt(value);
                  setSelectedPrintType(id);
                  applyToAll('print_type_id', id);
                }}
                placeholder="Select Print Type"
                showSearch={false}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <UnifiedDropdown
                variant="searchable"
                label="Print Colors"
                options={printColors
                  .filter(pc => pc.print_type_id === selectedPrintType)
                  .map(pc => ({ label: `${pc.color_count} color${pc.color_count > 1 ? 's' : ''} (₱${pc.price})`, value: pc.color_count.toString() }))}
                selectedValue={selectedColorCount.toString()}
                onSelect={(value) => setSelectedColorCount(parseInt(value))}
                placeholder="Select Print Colors"
                showSearch={false}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.fullInputContainer}>
              <UnifiedDropdown
                variant="searchable"
                label="Print Pattern"
                options={printPatterns.map(p => ({ label: `${p.name} (₱${p.additional_price})`, value: p.id.toString() }))}
                selectedValue={selectedPrintPattern.toString()}
                onSelect={(value) => {
                  const id = parseInt(value);
                  setSelectedPrintPattern(id);
                  applyToAll('print_pattern_id', id);
                }}
                placeholder="Select Print Pattern"
                showSearch={false}
              />
            </View>
          </View>

          {/* Section: Quotation Items */}
          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Quotation Items</Text>
          <View style={styles.divider} />

          {quotationItems.map((item, index) => {
            const { pricePerPiece, total } = calculateItemAmount(item);
            const sizeName = sizes.find(s => s.id === item.size_id)?.name || '';
            
            return (
              <View key={item.id} style={[styles.itemContainer, index > 0 && { marginTop: hp(1.5) }]}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>Item {index + 1}: {sizeName}</Text>
                  {quotationItems.length > 1 && (
                    <TouchableOpacity onPress={() => removeQuotationItem(item.id)}>
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.row}>
                  <View style={styles.halfInputContainer}>
                    <UnifiedDropdown
                      variant="searchable"
                      label="Size"
                      options={sizes.map(s => ({ label: s.name, value: s.id.toString() }))}
                      selectedValue={item.size_id.toString()}
                      onSelect={(value) => updateItemField(item.id, 'size_id', parseInt(value))}
                      placeholder="Size"
                      showSearch={false}
                    />
                  </View>
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      value={item.quantity.toString()}
                      onChangeText={(text) => updateItemField(item.id, 'quantity', parseInt(text) || 0)}
                    />
                  </View>
                </View>

                <View style={styles.pricingInfo}>
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Price/Piece:</Text>
                    <Text style={styles.pricingValue}>₱{pricePerPiece.toLocaleString()}</Text>
                  </View>
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabelBold}>Total:</Text>
                    <Text style={styles.pricingValueBold}>₱{total.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          <TouchableOpacity style={styles.addItemButton} onPress={addQuotationItem}>
            <Ionicons name="add-circle-outline" size={20} color="#001C34" />
            <Text style={styles.addItemText}>Add Size</Text>
          </TouchableOpacity>

          {/* Section: Size Cost Breakdown */}
          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Size Cost Breakdown</Text>
          <View style={styles.divider} />
          
          <View style={styles.breakdownContainer}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownHeaderText}>Size</Text>
              <Text style={styles.breakdownHeaderText}>Qty</Text>
              <Text style={styles.breakdownHeaderText}>T-shirt</Text>
              <Text style={styles.breakdownHeaderText}>Neckline</Text>
              <Text style={styles.breakdownHeaderText}>Color</Text>
              <Text style={styles.breakdownHeaderText}>Pattern</Text>
              <Text style={styles.breakdownHeaderText}>Print</Text>
              <Text style={styles.breakdownHeaderText}>Price/Pc</Text>
              <Text style={styles.breakdownHeaderText}>Total</Text>
            </View>
            
            {quotationItems.map((item) => {
              const sizeName = sizes.find(s => s.id === item.size_id)?.name || '';
              const { pricePerPiece, total } = calculateItemAmount(item);
              const combinedSizePrice = getCombinedSizePrice(item.tshirt_type_id, item.size_id);
              const printColorPrice = getPrintColorPrice(item.print_type_id, selectedColorCount);
              const printPatternPrice = printPatterns.find(p => p.id === item.print_pattern_id)?.additional_price || 0;
              const printTypeBasePrice = printTypes.find(t => t.id === item.print_type_id)?.base_price || 0;
              const necklinePrice = necklines.find(n => n.id === item.neckline_id)?.base_price || 0;
              
              return (
                <View key={item.id} style={styles.breakdownRow}>
                  <Text style={styles.breakdownCell}>{sizeName}</Text>
                  <Text style={styles.breakdownCell}>{item.quantity}</Text>
                  <Text style={styles.breakdownCell}>₱{combinedSizePrice}</Text>
                  <Text style={styles.breakdownCell}>₱{necklinePrice}</Text>
                  <Text style={styles.breakdownCell}>₱{printColorPrice}</Text>
                  <Text style={styles.breakdownCell}>₱{printPatternPrice}</Text>
                  <Text style={styles.breakdownCell}>₱{printTypeBasePrice}</Text>
                  <Text style={[styles.breakdownCell, styles.breakdownCellBold]}>₱{pricePerPiece.toLocaleString()}</Text>
                  <Text style={[styles.breakdownCell, styles.breakdownCellBold]}>₱{total.toLocaleString()}</Text>
                </View>
              );
            })}
            
            <View style={styles.breakdownFooter}>
              <Text style={styles.breakdownFooterLabel}>Subtotal (Sizes)</Text>
              <Text style={styles.breakdownFooterValue}>₱{totals.totalAmount.toLocaleString()}</Text>
            </View>
          </View>

          {/* Section: Addons */}
          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Addons</Text>
          <View style={styles.divider} />

          {addonCategories.map(category => (
            <View key={category.id} style={styles.addonCategory}>
              <Text style={styles.addonCategoryTitle}>{category.name}</Text>
              <View style={styles.addonGrid}>
                {addons.filter(a => a.category_id === category.id && a.is_active).map(addon => (
                  <TouchableOpacity
                    key={addon.id}
                    style={[styles.addonChip, selectedAddons.includes(addon.id) && styles.addonChipSelected]}
                    onPress={() => toggleAddon(addon.id)}
                  >
                    <Text style={[styles.addonChipText, selectedAddons.includes(addon.id) && styles.addonChipTextSelected]}>
                      {addon.name}
                    </Text>
                    <Text style={[styles.addonChipPrice, selectedAddons.includes(addon.id) && styles.addonChipPriceSelected]}>
                      {addon.price_type === 'free' ? 'Free' : `₱${addon.price}/pc`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Section: Discount */}
          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Discount</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <UnifiedDropdown
                variant="searchable"
                label="Discount Type"
                options={[
                  { label: 'Percentage (%)', value: 'percentage' },
                  { label: 'Fixed Amount (₱)', value: 'fixed' },
                ]}
                selectedValue={discount.type}
                onSelect={(value) => setDiscount({ ...discount, type: value })}
                placeholder="Discount Type"
                showSearch={false}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Discount Value</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={discount.type === 'percentage' ? 'e.g., 10' : 'e.g., 500'}
                placeholderTextColor="#9CA3AF"
                value={discount.value.toString()}
                onChangeText={(text) => setDiscount({ ...discount, value: parseFloat(text) || 0 })}
              />
            </View>
          </View>

          {discount.value > 0 && (
            <View style={styles.discountApplied}>
              <Text style={styles.discountText}>Discount Applied:</Text>
              <Text style={styles.discountAmount}>- ₱{totals.discountAmount.toLocaleString()}</Text>
            </View>
          )}

          {/* Section: Payment Summary */}
          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Payment Summary</Text>
          <View style={styles.divider} />

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal (Sizes)</Text>
              <Text style={styles.summaryValue}>₱{totals.totalAmount.toLocaleString()}</Text>
            </View>
            {totals.totalAddons > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Addons</Text>
                <Text style={styles.summaryValue}>₱{totals.totalAddons.toLocaleString()}</Text>
              </View>
            )}
            {totals.discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Discount ({discount.type === 'percentage' ? `${discount.value}%` : 'Fixed'})
                </Text>
                <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
                  - ₱{totals.discountAmount.toLocaleString()}
                </Text>
              </View>
            )}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelTotal}>TOTAL</Text>
              <Text style={styles.summaryValueTotal}>₱{totals.grandTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Downpayment (60%)</Text>
              <Text style={styles.summaryValue}>₱{totals.downPayment.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Balance (40%)</Text>
              <Text style={styles.summaryValue}>₱{totals.balance.toLocaleString()}</Text>
            </View>
          </View>

          {/* Section: Notes */}
          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Notes</Text>
          <View style={styles.divider} />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Additional notes or special instructions..." 
            placeholderTextColor="#9CA3AF"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            value={orderInfo.notes}
            onChangeText={(text) => setOrderInfo({ ...orderInfo, notes: text })}
          />

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

