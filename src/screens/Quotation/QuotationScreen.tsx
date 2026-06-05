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
import Dropdown from '@components/common/Dropdown';
import Header from '@layouts/Header';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';
import quotationApi from '../../api/quotation';

interface QuotationItem {
  id: number;
  size_id: number;
  quantity: number;
  tshirt_type_id: number;
  print_type_id: number;
  print_pattern_id: number;
  neckline_id: number;
}

export default function QuotationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [orderInfo, setOrderInfo] = useState({
    client_name: '',
    client_email: '',
    brand: '',
    shirt_color: '',
    free_items: '',
  });

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
    { id: 1, name: 'SMALL' },
    { id: 2, name: 'MEDIUM' },
    { id: 3, name: 'LARGE' },
    { id: 4, name: 'XL' },
    { id: 5, name: '2XL' },
    { id: 6, name: '3XL' },
  ];

  const printTypes = [
    { id: 1, name: 'SILK SCREEN', base_price: 0 },
    { id: 2, name: 'DTF', base_price: 100 },
  ];

  const printColors = [
    { id: 1, print_type_id: 1, color_count: 1, price: 20 },
    { id: 2, print_type_id: 1, color_count: 2, price: 30 },
    { id: 3, print_type_id: 1, color_count: 3, price: 40 },
    { id: 4, print_type_id: 1, color_count: 4, price: 60 },
    { id: 5, print_type_id: 1, color_count: 5, price: 80 },
    { id: 6, print_type_id: 1, color_count: 6, price: 100 },
    { id: 7, print_type_id: 2, color_count: 1, price: 30 },
    { id: 8, print_type_id: 2, color_count: 2, price: 50 },
    { id: 9, print_type_id: 2, color_count: 3, price: 70 },
    { id: 10, print_type_id: 2, color_count: 4, price: 90 },
    { id: 11, print_type_id: 2, color_count: 5, price: 110 },
    { id: 12, print_type_id: 2, color_count: 6, price: 130 },
  ];

  const printPatterns = [
    { id: 1, name: 'Standard Print', additional_price: 0 },
    { id: 2, name: 'Full Print', additional_price: 20 },
  ];

  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([
    {
      id: 1,
      size_id: 1,
      quantity: 50,
      tshirt_type_id: 1,
      print_type_id: 1,
      print_pattern_id: 1,
      neckline_id: 1,
    },
  ]);

  const [selectedTshirtType, setSelectedTshirtType] = useState('');
  const [selectedNeckline, setSelectedNeckline] = useState('');
  const [selectedPrintType, setSelectedPrintType] = useState('');
  const [selectedColorCount, setSelectedColorCount] = useState('');
  const [selectedPrintPattern, setSelectedPrintPattern] = useState('');

  const applyToAll = (field: keyof QuotationItem, value: number) => {
    setQuotationItems(prev =>
      prev.map(item => ({
        ...item,
        [field]: value,
      }))
    );
  };

  const addQuotationItem = () => {
    const newId = Math.max(...quotationItems.map(item => item.id), 0) + 1;

    setQuotationItems(prev => [
      ...prev,
      {
        id: newId,
        size_id: 1,
        quantity: 50,
        tshirt_type_id: selectedTshirtType ? parseInt(selectedTshirtType) : 1,
        print_type_id: selectedPrintType ? parseInt(selectedPrintType) : 1,
        print_pattern_id: selectedPrintPattern ? parseInt(selectedPrintPattern) : 1,
        neckline_id: selectedNeckline ? parseInt(selectedNeckline) : 1,
      },
    ]);
  };

  const updateItemField = (
    id: number,
    field: keyof QuotationItem,
    value: number
  ) => {
    setQuotationItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeQuotationItem = (id: number) => {
    if (quotationItems.length <= 1) {
      Alert.alert('Error', 'At least one item is required');
      return;
    }

    setQuotationItems(prev => prev.filter(item => item.id !== id));
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

    if (!selectedTshirtType) {
      Alert.alert('Validation Error', 'T-shirt type is required');
      return;
    }

    if (!selectedNeckline) {
      Alert.alert('Validation Error', 'Neckline is required');
      return;
    }

    if (!selectedPrintType) {
      Alert.alert('Validation Error', 'Print type is required');
      return;
    }

    if (!selectedColorCount) {
      Alert.alert('Validation Error', 'Print color count is required');
      return;
    }

    if (!selectedPrintPattern) {
      Alert.alert('Validation Error', 'Print pattern is required');
      return;
    }

    try {
      setLoading(true);

      const itemConfig = {
  tshirt_type_id: parseInt(selectedTshirtType),
  neckline_id: parseInt(selectedNeckline),
  print_type_id: parseInt(selectedPrintType),
  print_color_count: parseInt(selectedColorCount),
  print_pattern_id: parseInt(selectedPrintPattern),

  // required by backend
  apparel_pattern_price_id: parseInt(selectedPrintPattern),
};

      const items = quotationItems.map(item => ({
  size_id: item.size_id,
  quantity: item.quantity,
  tshirt_type_id: item.tshirt_type_id,
  neckline_id: item.neckline_id,
  print_type_id: item.print_type_id,
  print_color_count: parseInt(selectedColorCount),
  print_pattern_id: item.print_pattern_id,
  apparel_pattern_price_id: item.print_pattern_id,
}));

      await quotationApi.store({
        client_name: orderInfo.client_name,
        client_email: orderInfo.client_email,
        brand: orderInfo.brand,
        shirt_color: orderInfo.shirt_color,
        free_items: orderInfo.free_items,

        tshirt_type_id: parseInt(selectedTshirtType),
        neckline_id: parseInt(selectedNeckline),
        print_type_id: parseInt(selectedPrintType),
        print_color_count: parseInt(selectedColorCount),
        print_pattern_id: parseInt(selectedPrintPattern),

        item_config_json: JSON.stringify(itemConfig),
        items_json: JSON.stringify(items),
      });

      Alert.alert('Success', 'Quotation saved successfully!');
      router.push('/quotation/all' as any);
    } catch (error: any) {
      console.log('Save quotation error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || error?.message || 'Failed to save quotation'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setOrderInfo({
      client_name: '',
      client_email: '',
      brand: '',
      shirt_color: '',
      free_items: '',
    });

    setQuotationItems([
      {
        id: 1,
        size_id: 1,
        quantity: 50,
        tshirt_type_id: 1,
        print_type_id: 1,
        print_pattern_id: 1,
        neckline_id: 1,
      },
    ]);

    setSelectedTshirtType('');
    setSelectedNeckline('');
    setSelectedPrintType('');
    setSelectedColorCount('');
    setSelectedPrintPattern('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.divider} />

          <InputField
            label="Client Name"
            value={orderInfo.client_name}
            placeholder="Enter client name"
            onChangeText={text =>
              setOrderInfo(prev => ({ ...prev, client_name: text }))
            }
          />

          <InputField
            label="Client Email"
            value={orderInfo.client_email}
            placeholder="Enter client email"
            onChangeText={text =>
              setOrderInfo(prev => ({ ...prev, client_email: text }))
            }
          />

          <InputField
            label="Brand"
            value={orderInfo.brand}
            placeholder="Enter brand name"
            onChangeText={text =>
              setOrderInfo(prev => ({ ...prev, brand: text }))
            }
          />

          <InputField
            label="Shirt Color"
            value={orderInfo.shirt_color}
            placeholder="Enter shirt color"
            onChangeText={text =>
              setOrderInfo(prev => ({ ...prev, shirt_color: text }))
            }
          />

          <InputField
            label="Free Items"
            value={orderInfo.free_items}
            placeholder="Enter free items"
            onChangeText={text =>
              setOrderInfo(prev => ({ ...prev, free_items: text }))
            }
          />

          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>
            Global Configuration
          </Text>
          <View style={styles.divider} />

          <Dropdown
            options={tshirtTypes.map(item => ({
              label: `${item.name} (₱${item.base_price})`,
              value: item.id.toString(),
            }))}
            selectedValue={selectedTshirtType}
            onSelect={(value: string) => {
              setSelectedTshirtType(value);
              applyToAll('tshirt_type_id', parseInt(value));
            }}
            placeholder="Select T-shirt Type"
          />

          <View style={styles.spacing} />

          <Dropdown
            options={necklines.map(item => ({
              label: `${item.name} (₱${item.base_price})`,
              value: item.id.toString(),
            }))}
            selectedValue={selectedNeckline}
            onSelect={(value: string) => {
              setSelectedNeckline(value);
              applyToAll('neckline_id', parseInt(value));
            }}
            placeholder="Select Neckline"
          />

          <View style={styles.spacing} />

          <Dropdown
            options={printTypes.map(item => ({
              label: `${item.name} (₱${item.base_price})`,
              value: item.id.toString(),
            }))}
            selectedValue={selectedPrintType}
            onSelect={(value: string) => {
              setSelectedPrintType(value);
              setSelectedColorCount('');
              applyToAll('print_type_id', parseInt(value));
            }}
            placeholder="Select Print Type"
          />

          <View style={styles.spacing} />

          <Dropdown
            options={
              selectedPrintType
                ? printColors
                    .filter(
                      item => item.print_type_id === parseInt(selectedPrintType)
                    )
                    .map(item => ({
                      label: `${item.color_count} color${
                        item.color_count > 1 ? 's' : ''
                      } (₱${item.price})`,
                      value: item.color_count.toString(),
                    }))
                : []
            }
            selectedValue={selectedColorCount}
            onSelect={(value: string) => setSelectedColorCount(value)}
            placeholder="Select Print Colors"
          />

          <View style={styles.spacing} />

          <Dropdown
            options={printPatterns.map(item => ({
              label: `${item.name} (+₱${item.additional_price})`,
              value: item.id.toString(),
            }))}
            selectedValue={selectedPrintPattern}
            onSelect={(value: string) => {
              setSelectedPrintPattern(value);
              applyToAll('print_pattern_id', parseInt(value));
            }}
            placeholder="Select Print Pattern"
          />

          <Text style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>
            Quotation Items
          </Text>
          <View style={styles.divider} />

          {quotationItems.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Item {index + 1}</Text>

                {quotationItems.length > 1 && (
                  <TouchableOpacity onPress={() => removeQuotationItem(item.id)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Size</Text>
              <Dropdown
                options={sizes.map(size => ({
                  label: size.name,
                  value: size.id.toString(),
                }))}
                selectedValue={item.size_id.toString()}
                onSelect={(value: string) =>
                  updateItemField(item.id, 'size_id', parseInt(value))
                }
                placeholder="Select Size"
              />

              <View style={styles.spacing} />

              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={item.quantity.toString()}
                keyboardType="numeric"
                placeholder="Enter quantity"
                placeholderTextColor="#9CA3AF"
                onChangeText={text =>
                  updateItemField(item.id, 'quantity', parseInt(text) || 0)
                }
              />
            </View>
          ))}

          <TouchableOpacity style={styles.addItemButton} onPress={addQuotationItem}>
            <Text style={styles.addItemText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.clearButtonContainer}
            onPress={handleClearAll}
          >
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
              title={loading ? 'Saving...' : 'Save Quotation'}
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

function InputField({
  label,
  value,
  placeholder,
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={{ marginBottom: hp(1.5) }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        onChangeText={onChangeText}
      />
    </View>
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
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
    marginBottom: hp(0.6),
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: wp(2.7),
    paddingVertical: hp(1.2),
    fontSize: FONT_SIZES.sm,
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },
  spacing: {
    height: hp(1.5),
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: wp(3),
    marginBottom: hp(1.5),
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  itemTitle: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Poppins_700Bold',
    color: '#001C34',
  },
  removeText: {
    color: '#EF4444',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
  },
  addItemButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#001C34',
    borderRadius: 8,
    paddingVertical: hp(1.2),
    alignItems: 'center',
    marginTop: hp(1),
  },
  addItemText: {
    color: '#001C34',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: FONT_SIZES.sm,
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
});