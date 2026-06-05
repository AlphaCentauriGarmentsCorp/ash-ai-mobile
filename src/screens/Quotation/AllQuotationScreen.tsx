import Header from '@/layouts/Header';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
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

const STATUS_OPTIONS = ['All', 'Pending', 'Approved', 'Rejected'];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending:  { bg: '#FEF9C3', text: '#92400E' },
  Approved: { bg: '#DCFCE7', text: '#166534' },
  Rejected: { bg: '#FEE2E2', text: '#991B1B' },
};

export default function AllQuotationScreen() {
  const router = useRouter();

  const [search, setSearch]             = useState('');
  const [quotations, setQuotations]     = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  /* ── data fetching ── */
  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await quotationApi.index();
      setQuotations(res.data || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => { fetchQuotations(); }, [])
  );

  /* ── filtered list ── */
  const filteredQuotations = useMemo(() => {
    return quotations.filter((item) => {
      const matchesSearch = item.client_name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' ||
        item.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [quotations, search, statusFilter]);

  /* ── actions ── */
  const handleView = (item: any) => {
    router.push({ pathname: '/quotation/view', params: { id: item.id } } as any);
  };

  const handleEdit = (item: any) => {
    router.push({ pathname: '/quotation/edit', params: { id: item.id } } as any);
  };

  const handleDelete = (item: any) => {
    Alert.alert(
      'Delete Quotation',
      `Are you sure you want to delete ${item.quotation_no || 'this quotation'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await quotationApi.destroy(item.id);
              fetchQuotations();
            } catch (e) {
              console.error('Delete failed:', e);
            }
          },
        },
      ]
    );
  };

  /* ── helpers ── */
  const statusStyle = (status: string) =>
    STATUS_COLORS[status] ?? { bg: '#F3F4F6', text: '#374151' };

  /* ── render ── */
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {/* Page title bar */}
      <View style={styles.topTitleBar}>
        <View style={styles.topTitleContent}>
          <View style={styles.titleIconCircle}>
            <Ionicons name="document-text-outline" size={22} color="#0D253F" />
          </View>
          <Text style={styles.topTitleText}>All Quotations</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* toolbar row */}
        <View style={styles.toolbarRow}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/quotation' as any)}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add Quotation</Text>
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {STATUS_OPTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.filterChip,
                  statusFilter === s && styles.filterChipActive,
                ]}
                onPress={() => setStatusFilter(s)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    statusFilter === s && styles.filterChipTextActive,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* search */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by client name…"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* table */}
        {loading ? (
          <Text style={styles.loadingText}>Loading…</Text>
        ) : filteredQuotations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="document-outline" size={40} color="#CBD5E1" />
            <Text style={styles.emptyText}>No quotations found</Text>
          </View>
        ) : (
          <View style={styles.tableWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <View>
                {/* Table header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.th, styles.colNo]}>#</Text>
                  <Text style={[styles.th, styles.colQuotNo]}>Quotation #</Text>
                  <Text style={[styles.th, styles.colCreated]}>Created By</Text>
                  <Text style={[styles.th, styles.colClient]}>Client Name</Text>
                  <Text style={[styles.th, styles.colEmail]}>Client Email</Text>
                  <Text style={[styles.th, styles.colBrand]}>Brand</Text>
                  <Text style={[styles.th, styles.colAmount]}>Total Amount</Text>
                  <Text style={[styles.th, styles.colStatus]}>Status</Text>
                  <Text style={[styles.th, styles.colDate]}>Date Created</Text>
                  <Text style={[styles.th, styles.colActions]}>Actions</Text>
                </View>

                {/* Table rows */}
                {filteredQuotations.map((item: any, index: number) => {
                  const sc = statusStyle(item.status);
                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.tableRow,
                        index % 2 === 1 && styles.tableRowAlt,
                      ]}
                    >
                      <Text style={[styles.td, styles.colNo]}>
                        {index + 1}
                      </Text>

                      <Text style={[styles.td, styles.colQuotNo, styles.tdBold]}>
                        {item.quotation_no || '—'}
                      </Text>

                      <Text style={[styles.td, styles.colCreated]}>
                        {item.created_by || 'Admin User'}
                      </Text>

                      <Text style={[styles.td, styles.colClient]}>
                        {item.client_name || '—'}
                      </Text>

                      <Text
                        style={[styles.td, styles.colEmail, styles.tdMuted]}
                        numberOfLines={1}
                      >
                        {item.client_email || 'No Client Email'}
                      </Text>

                      <Text style={[styles.td, styles.colBrand, styles.tdMuted]}>
                        {item.brand || 'No Brand'}
                      </Text>

                      <Text style={[styles.td, styles.colAmount, styles.tdBold]}>
                        ₱{Number(item.total_amount || 0).toLocaleString()}
                      </Text>

                      {/* ✅ FIX: View only gets colStatus (ViewStyle), not styles.td (TextStyle) */}
                      <View style={styles.colStatus}>
                        <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                          <Text style={[styles.statusText, { color: sc.text }]}>
                            {item.status || 'Pending'}
                          </Text>
                        </View>
                      </View>

                      <Text style={[styles.td, styles.colDate]}>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: '2-digit', year: 'numeric' }
                            )
                          : '—'}
                      </Text>

                      {/* ✅ FIX: View only gets colActions + actionsRow (ViewStyle), not styles.td (TextStyle) */}
                      <View style={[styles.colActions, styles.actionsRow]}>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.viewBtn]}
                          onPress={() => handleView(item)}
                        >
                          <Ionicons name="eye-outline" size={15} color="#0D253F" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionBtn, styles.editBtn]}
                          onPress={() => handleEdit(item)}
                        >
                          <Ionicons name="create-outline" size={15} color="#0D253F" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionBtn, styles.deleteBtn]}
                          onPress={() => handleDelete(item)}
                        >
                          <Ionicons name="trash-outline" size={15} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            {/* Entry count */}
            <Text style={styles.entryCount}>
              Showing {filteredQuotations.length} of {quotations.length}{' '}
              {quotations.length === 1 ? 'entry' : 'entries'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── styles ── */
const COL = {
  no:      44,
  quotNo:  140,
  created: 110,
  client:  120,
  email:   160,
  brand:   100,
  amount:  110,
  status:  100,
  date:    110,
  actions: 110,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content:   { padding: 16, paddingBottom: 32 },

  /* title bar */
  topTitleBar:     { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  topTitleContent: { flexDirection: 'row', alignItems: 'center' },
  titleIconCircle: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: '#64748B', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  topTitleText:    { fontSize: 18, fontWeight: '700', color: '#0F172A' },

  /* toolbar */
  toolbarRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' },
  addButton:     { backgroundColor: '#0D253F', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 6 },
  addButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  /* filter chips */
  filterRow:            { flexDirection: 'row', gap: 8, alignItems: 'center' },
  filterChip:           { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#fff' },
  filterChipActive:     { backgroundColor: '#0D253F', borderColor: '#0D253F' },
  filterChipText:       { fontSize: 13, color: '#374151' },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },

  /* search */
  searchBox:   { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  searchInput: { flex: 1, fontSize: 14 },

  /* loading / empty */
  loadingText: { textAlign: 'center', color: '#64748B', marginTop: 32 },
  emptyCard:   { backgroundColor: '#fff', borderRadius: 12, padding: 40, alignItems: 'center', gap: 12 },
  emptyText:   { color: '#64748B', fontSize: 15 },

  /* table */
  tableWrapper: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  tableHeader:  { flexDirection: 'row', backgroundColor: '#0D253F', paddingVertical: 12, paddingHorizontal: 8 },
  th:           { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'left' },

  tableRow:    { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9', alignItems: 'center' },
  tableRowAlt: { backgroundColor: '#F8FAFC' },

  /* TextStyle only — never apply to View */
  td:      { fontSize: 13, color: '#1E293B' },
  tdBold:  { fontWeight: '600' },
  tdMuted: { color: '#94A3B8', fontStyle: 'italic' },

  /* column widths — safe for both Text and View */
  colNo:      { width: COL.no },
  colQuotNo:  { width: COL.quotNo },
  colCreated: { width: COL.created },
  colClient:  { width: COL.client },
  colEmail:   { width: COL.email },
  colBrand:   { width: COL.brand },
  colAmount:  { width: COL.amount },
  colStatus:  { width: COL.status },
  colDate:    { width: COL.date },
  colActions: { width: COL.actions },

  /* status badge */
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  statusText:  { fontSize: 12, fontWeight: '600' },

  /* action buttons */
  actionsRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  actionBtn:  { width: 30, height: 30, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  viewBtn:    { backgroundColor: '#E2E8F0' },
  editBtn:    { backgroundColor: '#E2E8F0' },
  deleteBtn:  { backgroundColor: '#EF4444' },

  /* entry count */
  entryCount: { fontSize: 12, color: '#64748B', padding: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
});