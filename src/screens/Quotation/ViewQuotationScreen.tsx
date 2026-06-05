import Header from '@/layouts/Header';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import quotationApi from '../../api/quotation';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending:  { bg: '#FEF9C3', text: '#92400E' },
  Approved: { bg: '#DCFCE7', text: '#166534' },
  Rejected: { bg: '#FEE2E2', text: '#991B1B' },
};

export default function ViewQuotationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await quotationApi.show(id);
        setQuotation(res.data);
      } catch (e) {
        console.error('Failed to fetch quotation:', e);
        Alert.alert('Error', 'Failed to load quotation.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id]);

  const handleDelete = () => {
    Alert.alert('Delete Quotation', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await quotationApi.destroy(id);
            router.replace('/quotation/all' as any);
          } catch (e) {
            Alert.alert('Error', 'Failed to delete.');
          }
        },
      },
    ]);
  };

  const handlePrint = () => Alert.alert('Print', 'Print / Download PDF coming soon.');

  const sc = STATUS_COLORS[quotation?.status] ?? { bg: '#FEF9C3', text: '#92400E' };

  const fmt = (val: any) =>
    val != null && val !== '' && val !== 'N/A' ? String(val) : 'N/A';

  const fmtMoney = (val: any) =>
    val != null ? `₱${Number(val).toFixed(2)}` : '₱0.00';

  const fmtDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading quotation…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!quotation) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Quotation not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const items: any[] = Array.isArray(quotation.items) ? quotation.items : [];
  const subtotal = items.reduce((sum: number, i: any) => sum + Number(i.subtotal ?? i.amount ?? 0), 0);
  const grandTotal = Number(quotation.total_amount ?? subtotal);
  const downpayment = grandTotal * 0.6;
  const balance = grandTotal * 0.4;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      {/* Title bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#0D253F" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>
          Quotation {quotation.quotation_no ? `#${quotation.quotation_no}` : ''}
        </Text>

        {/* Action buttons */}
        <View style={styles.topActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => router.push({ pathname: '/quotation/edit', params: { id } } as any)}
          >
            <Ionicons name="create-outline" size={14} color="#fff" />
            <Text style={styles.actionBtnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={14} color="#fff" />
            <Text style={styles.actionBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* ── Quotation Header Card ── */}
        <View style={styles.headerCard}>
          <View style={styles.headerCardLeft}>
            <Text style={styles.headerTitle}>QUOTATION</Text>
            <Text style={styles.headerSub}>Official Quotation Document</Text>
          </View>
          <View style={styles.headerCardRight}>
            <Text style={styles.headerQuotNo}>{quotation.quotation_no || '—'}</Text>
            <Text style={styles.headerDate}>Date: {fmtDate(quotation.created_at)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
              <Text style={[styles.statusText, { color: sc.text }]}>
                ● {quotation.status || 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Client Information ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person-circle-outline" size={18} color="#0D253F" />
            <Text style={styles.sectionTitle}>Client Information</Text>
          </View>
          <View style={styles.clientGrid}>
            <View style={styles.clientCol}>
              <ClientRow icon="person-outline"  label="Client Name" value={fmt(quotation.client_name)} />
              <ClientRow icon="mail-outline"    label="Email"       value={fmt(quotation.client_email)} />
              <ClientRow icon="pricetag-outline" label="Brand"      value={fmt(quotation.brand)} />
            </View>
            <View style={styles.clientCol}>
              <ClientRow icon="color-palette-outline" label="Shirt Color" value={fmt(quotation.shirt_color)} />
              <ClientRow icon="gift-outline"           label="Free Items"  value={fmt(quotation.free_items) === 'N/A' ? 'None' : fmt(quotation.free_items)} />
            </View>
          </View>
        </View>

        {/* ── Order Items Table ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="shirt-outline" size={18} color="#0D253F" />
            <Text style={styles.sectionTitle}>Order Items</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View>
              {/* Header */}
              <View style={styles.tableHeader}>
                {['Size','Tshirt Type','Neckline','Print Type','Pattern','Qty','Price/Pc','Amount'].map(h => (
                  <Text key={h} style={[styles.th, styles.colItem]}>{h}</Text>
                ))}
              </View>

              {/* Rows */}
              {items.length === 0 ? (
                <Text style={styles.emptyText}>No items found</Text>
              ) : items.map((item: any, idx: number) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
                  <Text style={[styles.td, styles.colItem]}>{item.size        ?? item.size_name   ?? '—'}</Text>
                  <Text style={[styles.td, styles.colItem]}>{item.tshirt_type ?? item.tshirt_name  ?? '—'}</Text>
                  <Text style={[styles.td, styles.colItem]}>{item.neckline    ?? item.neckline_name ?? '—'}</Text>
                  <Text style={[styles.td, styles.colItem]}>{item.print_type  ?? item.print_type_name ?? '—'}</Text>
                  <Text style={[styles.td, styles.colItem]}>{item.pattern     ?? item.print_pattern_name ?? item.print_pattern ?? '—'}</Text>
                  <Text style={[styles.td, styles.colItem, styles.tdCenter]}>{item.quantity ?? '—'}</Text>
                  <Text style={[styles.td, styles.colItem, styles.tdRight]}>{fmtMoney(item.unit_price ?? item.price_per_piece)}</Text>
                  <Text style={[styles.td, styles.colItem, styles.tdRight, styles.tdBold]}>{fmtMoney(item.subtotal ?? item.amount)}</Text>
                </View>
              ))}

              {/* Subtotal row */}
              <View style={styles.subtotalRow}>
                <Text style={[styles.subtotalLabel, { width: COL.item * 6 }]}>Subtotal (Items):</Text>
                <Text style={[styles.subtotalValue, { width: COL.item * 2 }]}>{fmtMoney(subtotal)}</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* ── Detailed Cost Breakdown ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="reader-outline" size={18} color="#0D253F" />
            <Text style={styles.sectionTitle}>Detailed Cost Breakdown</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View>
              <View style={styles.tableHeader}>
                {['Size','Qty','Tshirt','Size+','Neckline','Print Type','Print Color','Pattern','Price/Pc','Total'].map(h => (
                  <Text key={h} style={[styles.th, styles.colBreakdown]}>{h}</Text>
                ))}
              </View>

              {items.length === 0 ? (
                <Text style={styles.emptyText}>No breakdown available</Text>
              ) : items.map((item: any, idx: number) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
                  <Text style={[styles.td, styles.colBreakdown]}>{item.size         ?? '—'}</Text>
                  <Text style={[styles.td, styles.colBreakdown, styles.tdCenter]}>{item.quantity    ?? '—'}</Text>
                  <Text style={[styles.td, styles.colBreakdown, styles.tdRight]}>{fmtMoney(item.tshirt_price  ?? item.base_price)}</Text>
                  <Text style={[styles.td, styles.colBreakdown, styles.tdRight]}>{fmtMoney(item.size_price    ?? 0)}</Text>
                  <Text style={[styles.td, styles.colBreakdown, styles.tdRight]}>{fmtMoney(item.neckline_price ?? 0)}</Text>
                  <Text style={[styles.td, styles.colBreakdown, styles.tdRight]}>{fmtMoney(item.print_type_price ?? 0)}</Text>
                  <Text style={[styles.td, styles.colBreakdown, styles.tdRight]}>{fmtMoney(item.print_color_price ?? 0)}</Text>
                  <Text style={[styles.td, styles.colBreakdown, styles.tdRight]}>{fmtMoney(item.pattern_price ?? 0)}</Text>
                  <Text style={[styles.td, styles.colBreakdown, styles.tdRight]}>{fmtMoney(item.unit_price ?? item.price_per_piece)}</Text>
                  <Text style={[styles.td, styles.colBreakdown, styles.tdRight, styles.tdBold]}>{fmtMoney(item.subtotal ?? item.amount)}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* ── Grand Total Summary ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal (Items):</Text>
            <Text style={styles.summaryValue}>{fmtMoney(subtotal)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>GRAND TOTAL:</Text>
            <Text style={styles.grandTotalValue}>{fmtMoney(grandTotal)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Downpayment (60%):</Text>
            <Text style={styles.summaryValue}>{fmtMoney(downpayment)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Balance (40%):</Text>
            <Text style={styles.summaryValue}>{fmtMoney(balance)}</Text>
          </View>
          <Text style={styles.balanceNote}>● Balance due upon delivery/pickup</Text>
        </View>

        {/* ── Footer note ── */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            This is a computer-generated quotation and requires no signature.
          </Text>
          <Text style={styles.footerText}>
            For inquiries, please contact our customer service.
          </Text>
        </View>

        {/* ── Bottom Buttons ── */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={16} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.downloadButton} onPress={handlePrint}>
            <Ionicons name="download-outline" size={16} color="#fff" />
            <Text style={styles.downloadButtonText}>Download PDF</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Sub-components ── */
function ClientRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.clientRow}>
      <Ionicons name={icon} size={14} color="#64748B" style={{ marginRight: 6 }} />
      <Text style={styles.clientLabel}>{label}: </Text>
      <Text style={styles.clientValue}>{value}</Text>
    </View>
  );
}

/* ── Constants ── */
const COL = { item: 100, breakdown: 90 };

/* ── Styles ── */
const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F1F5F9' },
  centered:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#64748B', fontSize: 14 },
  content:     { padding: 16, paddingBottom: 40 },

  /* top bar */
  topBar:       { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn:      { marginRight: 4 },
  topBarTitle:  { fontSize: 15, fontWeight: '700', color: '#0D253F', flex: 1 },
  topActions:   { flexDirection: 'row', gap: 8 },
  actionBtn:    { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 8 },
  actionBtnText:{ color: '#fff', fontSize: 13, fontWeight: '600' },
  editBtn:      { backgroundColor: '#0D253F' },
  deleteBtn:    { backgroundColor: '#EF4444' },

  /* header card */
  headerCard:      { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderWidth: 1, borderColor: '#E2E8F0' },
  headerCardLeft:  { flex: 1 },
  headerCardRight: { alignItems: 'flex-end' },
  headerTitle:     { fontSize: 22, fontWeight: '900', color: '#0D253F', letterSpacing: 1 },
  headerSub:       { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  headerQuotNo:    { fontSize: 13, fontWeight: '700', color: '#0D253F' },
  headerDate:      { fontSize: 12, color: '#64748B', marginTop: 2 },
  statusBadge:     { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6 },
  statusText:      { fontSize: 12, fontWeight: '700' },

  /* sections */
  section:        { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionTitleRow:{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  sectionTitle:   { fontSize: 15, fontWeight: '700', color: '#0D253F' },

  /* client info */
  clientGrid: { flexDirection: 'row', gap: 16 },
  clientCol:  { flex: 1 },
  clientRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  clientLabel:{ fontSize: 13, color: '#64748B' },
  clientValue:{ fontSize: 13, color: '#0F172A', fontWeight: '600' },

  /* tables */
  tableHeader:  { flexDirection: 'row', backgroundColor: '#F1F5F9', paddingVertical: 10, paddingHorizontal: 4, borderBottomWidth: 2, borderBottomColor: '#E2E8F0' },
  th:           { fontSize: 12, fontWeight: '700', color: '#374151' },
  tableRow:     { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  tableRowAlt:  { backgroundColor: '#F8FAFC' },
  td:           { fontSize: 13, color: '#1E293B' },
  tdCenter:     { textAlign: 'center' },
  tdRight:      { textAlign: 'right' },
  tdBold:       { fontWeight: '700' },
  emptyText:    { color: '#94A3B8', fontSize: 13, padding: 12 },

  colItem:      { width: COL.item },
  colBreakdown: { width: COL.breakdown },

  /* subtotal */
  subtotalRow:   { flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 10, borderTopWidth: 2, borderTopColor: '#E2E8F0' },
  subtotalLabel: { fontSize: 13, fontWeight: '600', color: '#374151', textAlign: 'right' },
  subtotalValue: { fontSize: 13, fontWeight: '700', color: '#0D253F', textAlign: 'right' },

  /* summary */
  summaryCard:    { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  summaryRow:     { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryLabel:   { fontSize: 13, color: '#64748B' },
  summaryValue:   { fontSize: 13, color: '#0F172A', fontWeight: '600' },
  summaryDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 6 },
  grandTotalLabel:{ fontSize: 16, fontWeight: '900', color: '#0D253F' },
  grandTotalValue:{ fontSize: 16, fontWeight: '900', color: '#0D253F' },
  balanceNote:    { fontSize: 11, color: '#94A3B8', marginTop: 8 },

  /* footer */
  footerNote: { alignItems: 'center', marginBottom: 20 },
  footerText: { fontSize: 12, color: '#94A3B8', textAlign: 'center' },

  /* bottom buttons */
  bottomButtons:      { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  backButton:         { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#64748B', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  backButtonText:     { color: '#fff', fontWeight: '700', fontSize: 14 },
  downloadButton:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0D253F', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  downloadButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});