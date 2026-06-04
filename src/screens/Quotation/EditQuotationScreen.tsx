import Header from '@/layouts/Header';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

import Dropdown from '@components/common/Dropdown';
import { hp } from '@utils/responsive';
import quotationApi from '../../api/quotation';

/* ── static data ── */
const tshirtTypes   = [{ id: 1, name: 'Boxy', base_price: 370 }, { id: 2, name: 'Standard', base_price: 300 }, { id: 3, name: 'Hoodie', base_price: 650 }];
const necklines     = [{ id: 1, name: 'Standard', base_price: 0 }, { id: 2, name: 'Proclub', base_price: 20 }, { id: 3, name: 'Neckline2', base_price: 50 }];
const sizes         = [{ id: 1, name: 'S' }, { id: 2, name: 'XS' }, { id: 3, name: 'M' }, { id: 4, name: 'L' }, { id: 5, name: 'XL' }, { id: 6, name: '3XL' }];
const printTypes    = [{ id: 1, name: 'SILK SCREEN', base_price: 0 }, { id: 2, name: 'DTF', base_price: 100 }];
const printColors   = [
  { id: 1, print_type_id: 1, color_count: 1, price: 20 }, { id: 2, print_type_id: 1, color_count: 2, price: 30 },
  { id: 3, print_type_id: 1, color_count: 3, price: 40 }, { id: 4, print_type_id: 1, color_count: 4, price: 60 },
  { id: 5, print_type_id: 1, color_count: 5, price: 80 }, { id: 6, print_type_id: 1, color_count: 6, price: 100 },
  { id: 7, print_type_id: 2, color_count: 1, price: 30 }, { id: 8, print_type_id: 2, color_count: 2, price: 50 },
  { id: 9, print_type_id: 2, color_count: 3, price: 70 }, { id: 10, print_type_id: 2, color_count: 4, price: 90 },
  { id: 11, print_type_id: 2, color_count: 5, price: 110 }, { id: 12, print_type_id: 2, color_count: 6, price: 130 },
];
const printPatterns = [{ id: 1, name: 'Standard Print', additional_price: 0 }, { id: 2, name: 'Full Print', additional_price: 20 }];
const discountTypes = [{ label: 'Percentage (%)', value: 'percentage' }, { label: 'Fixed Amount', value: 'fixed' }];

interface QuotationItem {
  id: number;
  size_id: number;
  quantity: number;
  tshirt_type_id: number;
  print_type_id: number;
  print_pattern_id: number;
  neckline_id: number;
  unit_price?: number;
  subtotal?: number;
}

export default function EditQuotationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  const [orderInfo, setOrderInfo] = useState({
    client_name: '', client_email: '', brand: '', shirt_color: '', free_items: '',
  });

  const [selectedTshirtType,   setSelectedTshirtType]   = useState('');
  const [selectedNeckline,     setSelectedNeckline]     = useState('');
  const [selectedPrintType,    setSelectedPrintType]    = useState('');
  const [selectedColorCount,   setSelectedColorCount]   = useState('');
  const [selectedPrintPattern, setSelectedPrintPattern] = useState('');
  const [discountType,         setDiscountType]         = useState('percentage');
  const [discountValue,        setDiscountValue]        = useState('0.00');
  const [notes,                setNotes]                = useState('');
  const [costBreakdownOpen,    setCostBreakdownOpen]    = useState(false);

  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([
    { id: 1, size_id: 1, quantity: 1, tshirt_type_id: 1, print_type_id: 1, print_pattern_id: 1, neckline_id: 1 },
  ]);

  /* ── computed prices ── */
  const getTshirtPrice  = () => tshirtTypes.find(t => t.id === parseInt(selectedTshirtType))?.base_price ?? 0;
  const getNecklinePrice= () => necklines.find(n => n.id === parseInt(selectedNeckline))?.base_price ?? 0;
  const getPrintPrice   = () => printTypes.find(p => p.id === parseInt(selectedPrintType))?.base_price ?? 0;
  const getColorPrice   = () => printColors.find(c => c.print_type_id === parseInt(selectedPrintType) && c.color_count === parseInt(selectedColorCount))?.price ?? 0;
  const getPatternPrice = () => printPatterns.find(p => p.id === parseInt(selectedPrintPattern))?.additional_price ?? 0;

  const getUnitPrice = () => getTshirtPrice() + getNecklinePrice() + getPrintPrice() + getColorPrice() + getPatternPrice();

  const subtotal = quotationItems.reduce((sum, item) => sum + (getUnitPrice() * item.quantity), 0);
  const discountAmount = discountType === 'percentage'
    ? subtotal * (parseFloat(discountValue) / 100)
    : parseFloat(discountValue) || 0;
  const total       = subtotal - discountAmount;
  const downpayment = total * 0.6;
  const balance     = total * 0.4;

  const fmtMoney = (val: number) => `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  /* ── fetch existing data ── */
  useEffect(() => {
    const fetch = async () => {
      try {
        setFetching(true);
        const res = await quotationApi.show(id);
        const q   = res.data;

        setOrderInfo({
          client_name:  q.client_name  ?? '',
          client_email: q.client_email ?? '',
          brand:        q.brand        ?? '',
          shirt_color:  q.shirt_color  ?? '',
          free_items:   q.free_items   ?? '',
        });

        if (q.tshirt_type_id)    setSelectedTshirtType(String(q.tshirt_type_id));
        if (q.neckline_id)       setSelectedNeckline(String(q.neckline_id));
        if (q.print_type_id)     setSelectedPrintType(String(q.print_type_id));
        if (q.print_color_count) setSelectedColorCount(String(q.print_color_count));
        if (q.print_pattern_id)  setSelectedPrintPattern(String(q.print_pattern_id));
        if (q.notes)             setNotes(q.notes);
        if (q.discount_type)     setDiscountType(q.discount_type);
        if (q.discount_value)    setDiscountValue(String(q.discount_value));

        if (Array.isArray(q.items) && q.items.length > 0) {
          setQuotationItems(q.items.map((item: any, index: number) => ({
            id:               index + 1,
            size_id:          item.size_id          ?? 1,
            quantity:         item.quantity         ?? 1,
            tshirt_type_id:   item.tshirt_type_id   ?? q.tshirt_type_id  ?? 1,
            print_type_id:    item.print_type_id    ?? q.print_type_id   ?? 1,
            print_pattern_id: item.print_pattern_id ?? q.print_pattern_id ?? 1,
            neckline_id:      item.neckline_id      ?? q.neckline_id     ?? 1,
            unit_price:       item.unit_price,
            subtotal:         item.subtotal,
          })));
        }
      } catch (e) {
        console.error('Failed to load quotation:', e);
        Alert.alert('Error', 'Failed to load quotation data.');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetch();
  }, [id]);

  /* ── item helpers ── */
  const applyToAll = (field: keyof QuotationItem, value: number) =>
    setQuotationItems(prev => prev.map(item => ({ ...item, [field]: value })));

  const addSize = () => {
    const newId = Math.max(...quotationItems.map(i => i.id), 0) + 1;
    setQuotationItems(prev => [...prev, {
      id: newId, size_id: 1, quantity: 1,
      tshirt_type_id:   selectedTshirtType   ? parseInt(selectedTshirtType)   : 1,
      print_type_id:    selectedPrintType     ? parseInt(selectedPrintType)    : 1,
      print_pattern_id: selectedPrintPattern  ? parseInt(selectedPrintPattern) : 1,
      neckline_id:      selectedNeckline      ? parseInt(selectedNeckline)     : 1,
    }]);
  };

  const removeItem = (itemId: number) => {
    if (quotationItems.length <= 1) { Alert.alert('Error', 'At least one item is required'); return; }
    setQuotationItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateItem = (itemId: number, field: keyof QuotationItem, value: number) =>
    setQuotationItems(prev => prev.map(i => i.id === itemId ? { ...i, [field]: value } : i));

  /* ── validate ── */
  const allConfigSelected = selectedTshirtType && selectedNeckline && selectedPrintType && selectedColorCount && selectedPrintPattern;

  /* ── save ── */
  const handleUpdate = async () => {
    if (!orderInfo.client_name.trim()) return Alert.alert('Validation', 'Client name is required');
    if (!allConfigSelected)            return Alert.alert('Validation', 'Please select all configuration options');

    try {
      setLoading(true);
      const itemConfig = {
        tshirt_type_id: parseInt(selectedTshirtType), neckline_id: parseInt(selectedNeckline),
        print_type_id: parseInt(selectedPrintType), print_color_count: parseInt(selectedColorCount),
        print_pattern_id: parseInt(selectedPrintPattern), apparel_pattern_price_id: parseInt(selectedPrintPattern),
      };
      const items = quotationItems.map(item => ({
        size_id: item.size_id, quantity: item.quantity,
        tshirt_type_id: item.tshirt_type_id, neckline_id: item.neckline_id,
        print_type_id: item.print_type_id, print_color_count: parseInt(selectedColorCount),
        print_pattern_id: item.print_pattern_id, apparel_pattern_price_id: item.print_pattern_id,
      }));

      await quotationApi.update(id, {
        ...orderInfo,
        tshirt_type_id: parseInt(selectedTshirtType), neckline_id: parseInt(selectedNeckline),
        print_type_id: parseInt(selectedPrintType), print_color_count: parseInt(selectedColorCount),
        print_pattern_id: parseInt(selectedPrintPattern),
        item_config_json: JSON.stringify(itemConfig),
        items_json: JSON.stringify(items),
      });

      Alert.alert('Success', 'Quotation updated!', [
        { text: 'OK', onPress: () => router.replace('/quotation/all' as any) },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update quotation');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centered}><Text style={styles.loadingText}>Loading…</Text></View>
      </SafeAreaView>
    );
  }

  const unitPrice = getUnitPrice();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#0D253F" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Edit Quotation</Text>
        <Text style={styles.topBarTotal}>Total: {fmtMoney(total)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* ── Edit Quotation header ── */}
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderLeft}>
            <Ionicons name="create-outline" size={18} color="#0D253F" />
            <View>
              <Text style={styles.pageHeaderTitle}>Edit Quotation #{id}</Text>
              <Text style={styles.pageHeaderSub}>Modify quotation details and pricing</Text>
            </View>
          </View>
          <Text style={styles.pageHeaderTotal}>Total: {fmtMoney(total)}</Text>
        </View>

        {/* ── Order Information + Global Configuration (side by side on wider screens, stacked on mobile) ── */}
        <View style={styles.twoColRow}>
          {/* Order Information */}
          <View style={[styles.card, styles.flex1]}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="information-circle-outline" size={16} color="#0D253F" />
              <Text style={styles.sectionTitle}>Order Information</Text>
            </View>

            <LabeledInput label="Client Name *"  value={orderInfo.client_name}  placeholder="Enter client name"  onChangeText={t => setOrderInfo(p => ({ ...p, client_name: t }))} />
            <LabeledInput label="Client Email"   value={orderInfo.client_email} placeholder="Enter client email" onChangeText={t => setOrderInfo(p => ({ ...p, client_email: t }))} />
            <LabeledInput label="Brand"          value={orderInfo.brand}        placeholder="Enter brand name"   onChangeText={t => setOrderInfo(p => ({ ...p, brand: t }))} />
            <LabeledInput label="Shirt Color"    value={orderInfo.shirt_color}  placeholder="Enter shirt color"  onChangeText={t => setOrderInfo(p => ({ ...p, shirt_color: t }))} />
            <LabeledInput label="Free Items"     value={orderInfo.free_items}   placeholder="Enter free items"   onChangeText={t => setOrderInfo(p => ({ ...p, free_items: t }))} />
          </View>

          {/* Global Configuration */}
          <View style={[styles.card, styles.flex1]}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="options-outline" size={16} color="#0D253F" />
              <Text style={styles.sectionTitle}>Global Configuration</Text>
            </View>

            <Text style={styles.label}>Tshirt Type *</Text>
            <Dropdown
              options={tshirtTypes.map(i => ({ label: `${i.name} (₱${i.base_price})`, value: i.id.toString() }))}
              selectedValue={selectedTshirtType}
              onSelect={(v: string) => { setSelectedTshirtType(v); applyToAll('tshirt_type_id', parseInt(v)); }}
              placeholder="Select Tshirt Type"
            />
            <View style={styles.spacing} />

            <Text style={styles.label}>Neckline *</Text>
            <Dropdown
              options={necklines.map(i => ({ label: `${i.name} (₱${i.base_price})`, value: i.id.toString() }))}
              selectedValue={selectedNeckline}
              onSelect={(v: string) => { setSelectedNeckline(v); applyToAll('neckline_id', parseInt(v)); }}
              placeholder="Select Neckline"
            />
            <View style={styles.spacing} />

            <Text style={styles.label}>Print Type *</Text>
            <Dropdown
              options={printTypes.map(i => ({ label: `${i.name} (₱${i.base_price})`, value: i.id.toString() }))}
              selectedValue={selectedPrintType}
              onSelect={(v: string) => { setSelectedPrintType(v); setSelectedColorCount(''); applyToAll('print_type_id', parseInt(v)); }}
              placeholder="Select Print Type"
            />
            <View style={styles.spacing} />

            <Text style={styles.label}>Print Colors *</Text>
            <Dropdown
              options={selectedPrintType
                ? printColors.filter(c => c.print_type_id === parseInt(selectedPrintType))
                    .map(c => ({ label: `${c.color_count} color${c.color_count > 1 ? 's' : ''} (₱${c.price})`, value: c.color_count.toString() }))
                : []}
              selectedValue={selectedColorCount}
              onSelect={(v: string) => setSelectedColorCount(v)}
              placeholder="Select Color Count"
            />
            <View style={styles.spacing} />

            <Text style={styles.label}>Print Pattern *</Text>
            <Dropdown
              options={printPatterns.map(i => ({ label: `${i.name} (+₱${i.additional_price})`, value: i.id.toString() }))}
              selectedValue={selectedPrintPattern}
              onSelect={(v: string) => { setSelectedPrintPattern(v); applyToAll('print_pattern_id', parseInt(v)); }}
              placeholder="Select Print Pattern"
            />
          </View>
        </View>

        {/* ── Quotation Items ── */}
        <View style={styles.card}>
          <View style={styles.itemsHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="shirt-outline" size={16} color="#0D253F" />
              <Text style={styles.sectionTitle}>Quotation Items</Text>
            </View>
            <TouchableOpacity style={styles.addSizeBtn} onPress={addSize}>
              <Ionicons name="add" size={14} color="#fff" />
              <Text style={styles.addSizeBtnText}>Add Size</Text>
            </TouchableOpacity>
          </View>

          {/* Items table header */}
          <View style={styles.itemTableHeader}>
            <Text style={[styles.itemTh, styles.colSize]}>Size</Text>
            <Text style={[styles.itemTh, styles.colQty]}>Qty</Text>
            <Text style={[styles.itemTh, styles.colPrice]}>Price/Pc</Text>
            <Text style={[styles.itemTh, styles.colAmount]}>Amount</Text>
            <View style={styles.colDel} />
          </View>

          {quotationItems.map((item) => {
            const itemAmount = unitPrice * item.quantity;
            const sizeName = sizes.find(s => s.id === item.size_id)?.name ?? 'S';
            return (
              <View key={item.id} style={styles.itemRow}>
                {/* Size dropdown */}
                <View style={styles.colSize}>
                  <Dropdown
                    options={sizes.map(s => ({ label: s.name, value: s.id.toString() }))}
                    selectedValue={item.size_id.toString()}
                    onSelect={(v: string) => updateItem(item.id, 'size_id', parseInt(v))}
                    placeholder="Size"
                  />
                </View>

                {/* Qty */}
                <TextInput
                  style={[styles.qtyInput, styles.colQty]}
                  value={item.quantity.toString()}
                  keyboardType="numeric"
                  onChangeText={t => updateItem(item.id, 'quantity', parseInt(t) || 1)}
                />

                {/* Price/Pc */}
                <Text style={[styles.itemTd, styles.colPrice, styles.tdMuted]}>
                  {allConfigSelected ? fmtMoney(unitPrice) : 'None'}
                </Text>

                {/* Amount */}
                <Text style={[styles.itemTd, styles.colAmount, styles.tdBold]}>
                  {allConfigSelected ? fmtMoney(itemAmount) : 'None'}
                </Text>

                {/* Delete */}
                <TouchableOpacity style={styles.colDel} onPress={() => removeItem(item.id)}>
                  <Ionicons name="trash-outline" size={16} color="#CBD5E1" />
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Items total */}
          <View style={styles.itemsTotalRow}>
            <Text style={styles.itemsTotalLabel}>Total:</Text>
            <Text style={styles.itemsTotalValue}>{fmtMoney(subtotal)}</Text>
          </View>
        </View>

        {/* ── Addons ── */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="add-circle-outline" size={16} color="#0D253F" />
            <Text style={styles.sectionTitle}>Addons (Applied to all sizes)</Text>
          </View>
          <Text style={styles.emptyText}>No addons available</Text>
        </View>

        {/* ── Cost Breakdown (collapsible) ── */}
        <TouchableOpacity
          style={styles.collapsibleHeader}
          onPress={() => setCostBreakdownOpen(p => !p)}
        >
          <View style={styles.sectionTitleRow}>
            <Ionicons name="chevron-forward" size={14} color="#0D253F"
              style={{ transform: [{ rotate: costBreakdownOpen ? '90deg' : '0deg' }] }}
            />
            <Ionicons name="reader-outline" size={16} color="#0D253F" />
            <Text style={styles.sectionTitle}>Cost Breakdown</Text>
          </View>
          <Text style={styles.collapsibleTotal}>{fmtMoney(subtotal)}</Text>
        </TouchableOpacity>

        {/* ── Discount ── */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="pricetag-outline" size={16} color="#0D253F" />
            <Text style={styles.sectionTitle}>Discount</Text>
          </View>
          <View style={styles.discountRow}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Discount Type</Text>
              <Dropdown
                options={discountTypes}
                selectedValue={discountType}
                onSelect={(v: string) => setDiscountType(v)}
                placeholder="Select type"
              />
            </View>
            <View style={[styles.flex1, { marginLeft: 12 }]}>
              <Text style={styles.label}>Discount Value</Text>
              <TextInput
                style={styles.input}
                value={discountValue}
                keyboardType="decimal-pad"
                onChangeText={setDiscountValue}
              />
            </View>
          </View>
        </View>

        {/* ── Payment Summary ── */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="receipt-outline" size={16} color="#0D253F" />
            <Text style={styles.sectionTitle}>Payment Summary</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal (Items)</Text>
            <Text style={styles.summaryValue}>{fmtMoney(subtotal)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.grandLabel}>TOTAL</Text>
            <Text style={styles.grandValue}>{fmtMoney(total)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <View style={styles.dotRow}>
              <View style={[styles.dot, { backgroundColor: '#374151' }]} />
              <Text style={styles.summaryLabel}>Downpayment (60%)</Text>
            </View>
            <Text style={styles.summaryValue}>{fmtMoney(downpayment)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.dotRow}>
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.summaryLabel}>Balance (40%)</Text>
            </View>
            <Text style={styles.summaryValue}>{fmtMoney(balance)}</Text>
          </View>
          <Text style={styles.balanceNote}>● Balance due upon delivery/pickup</Text>
        </View>

        {/* ── Notes ── */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="pencil-outline" size={16} color="#0D253F" />
            <Text style={styles.sectionTitle}>Notes</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes or special instructions..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* ── Warning banner ── */}
        {!allConfigSelected && (
          <View style={styles.warningBanner}>
            <Ionicons name="information-circle-outline" size={16} color="#92400E" />
            <Text style={styles.warningText}>
              Please select all configuration options above to edit the quotation.
            </Text>
          </View>
        )}

        {/* ── Footer buttons ── */}
        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={14} color="#374151" />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.updateBtn, (!allConfigSelected || loading) && styles.updateBtnDisabled]}
            onPress={handleUpdate}
            disabled={!allConfigSelected || loading}
          >
            <Ionicons name="save-outline" size={14} color="#fff" />
            <Text style={styles.updateText}>{loading ? 'Updating…' : 'Update Quotation'}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Sub-components ── */
function LabeledInput({ label, value, placeholder, onChangeText }: {
  label: string; value: string; placeholder: string; onChangeText: (t: string) => void;
}) {
  return (
    <View style={{ marginBottom: hp(1.2) }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} placeholder={placeholder}
        placeholderTextColor="#9CA3AF" onChangeText={onChangeText} />
    </View>
  );
}

/* ── Styles ── */
const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F1F5F9' },
  centered:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#64748B', fontSize: 14 },
  content:     { padding: 16, paddingBottom: 40 },
  flex1:       { flex: 1 },

  /* top bar */
  topBar:      { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center' },
  backBtn:     { marginRight: 10 },
  topBarTitle: { fontSize: 15, fontWeight: '700', color: '#0D253F', flex: 1 },
  topBarTotal: { fontSize: 13, fontWeight: '600', color: '#0D253F' },

  /* page header */
  pageHeader:      { backgroundColor: '#EBF6FF', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#D1D5DB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageHeaderLeft:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, flex: 1 },
  pageHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#0D253F' },
  pageHeaderSub:   { fontSize: 12, color: '#64748B', marginTop: 2 },
  pageHeaderTotal: { fontSize: 13, fontWeight: '600', color: '#0D253F' },

  /* two-col layout */
  twoColRow: { flexDirection: 'column', gap: 12, marginBottom: 12 },

  /* cards */
  card:           { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionTitleRow:{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  sectionTitle:   { fontSize: 14, fontWeight: '700', color: '#0D253F' },

  /* inputs */
  label:   { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 4 },
  input:   { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, backgroundColor: '#fff', color: '#1E293B' },
  spacing: { height: hp(1.2) },

  /* items table */
  itemsHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addSizeBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#0D253F', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 8 },
  addSizeBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  itemTableHeader: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  itemTh:          { fontSize: 12, fontWeight: '700', color: '#374151' },
  itemRow:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemTd:          { fontSize: 13, color: '#1E293B' },
  tdMuted:         { color: '#94A3B8' },
  tdBold:          { fontWeight: '700' },

  colSize:   { flex: 1, marginRight: 8 },
  colQty:    { width: 50, textAlign: 'center' },
  colPrice:  { width: 70, textAlign: 'right' },
  colAmount: { width: 80, textAlign: 'right' },
  colDel:    { width: 30, alignItems: 'center' },

  qtyInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 8, fontSize: 13, textAlign: 'center', backgroundColor: '#fff' },

  itemsTotalRow:  { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingTop: 10, gap: 16 },
  itemsTotalLabel:{ fontSize: 13, fontWeight: '600', color: '#374151' },
  itemsTotalValue:{ fontSize: 14, fontWeight: '700', color: '#0D253F' },

  /* addons */
  emptyText: { fontSize: 13, color: '#94A3B8', textAlign: 'center', paddingVertical: 8 },

  /* collapsible */
  collapsibleHeader: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  collapsibleTotal:  { fontSize: 14, fontWeight: '700', color: '#0D253F' },

  /* discount */
  discountRow: { flexDirection: 'row', gap: 12 },

  /* summary */
  summaryRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  summaryLabel:  { fontSize: 13, color: '#64748B' },
  summaryValue:  { fontSize: 13, color: '#0F172A', fontWeight: '600' },
  summaryDivider:{ height: 1, backgroundColor: '#E2E8F0', marginVertical: 4 },
  grandLabel:    { fontSize: 16, fontWeight: '900', color: '#0D253F' },
  grandValue:    { fontSize: 18, fontWeight: '900', color: '#0D253F' },
  dotRow:        { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot:           { width: 8, height: 8, borderRadius: 4 },
  balanceNote:   { fontSize: 11, color: '#94A3B8', marginTop: 4 },

  /* notes */
  notesInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#1E293B', minHeight: 100, textAlignVertical: 'top' },

  /* warning */
  warningBanner: { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FCD34D', borderRadius: 10, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  warningText:   { fontSize: 13, color: '#92400E', flex: 1 },

  /* footer */
  footerButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E5E7EB', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  cancelText:    { fontSize: 14, fontWeight: '600', color: '#374151' },
  updateBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0D253F', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  updateBtnDisabled: { opacity: 0.5 },
  updateText:    { fontSize: 14, fontWeight: '600', color: '#fff' },
});