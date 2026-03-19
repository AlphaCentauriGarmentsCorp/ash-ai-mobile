import { Entypo, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Supplier, supplierApi } from '@api/materialSuppliers';
import Button from '@components/common/Button';
import ConfirmModal from '@components/common/ConfirmModal';
import type { Column } from '@components/common/DataTable';
import DataTable from '@components/common/DataTable';
import type { DropdownOption } from '@components/common/Dropdown';
import Dropdown from '@components/common/Dropdown';
import Pagination from '@components/common/Pagination';
import SearchBar from '@components/common/SearchBar';
import { usePoppinsFonts } from '@hooks';
import { Header } from '@layouts';
import { COLORS, FONT_SIZES, SIZES, SPACING } from '@styles';

interface RowActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const RowActionMenu = ({ onEdit, onDelete }: RowActionMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

  const toggle = () => {
    if (visible) { setVisible(false); return; }
    btnRef.current?.measure((_fx: number, _fy: number, w: number, h: number, px: number, py: number) => {
      setPos({ top: py + h, right: Dimensions.get('window').width - (px + w) });
      setVisible(true);
    });
  };

  return (
    <View>
      <TouchableOpacity ref={btnRef} style={styles.actionBtn} onPress={toggle}>
        <Entypo name="chevron-down" size={20} color="#1E3A5F" />
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.floatingMenu, { top: pos.top, right: pos.right }]}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setVisible(false); onEdit(); }}>
                <Ionicons name="pencil" size={16} color="#0D253F" style={styles.menuIcon} />
                <Text style={styles.menuItemText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => { setVisible(false); onDelete(); }}>
                <Ionicons name="trash" size={16} color="#0D253F" style={styles.menuIcon} />
                <Text style={styles.menuItemText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default function AllSuppliersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const filtered = useMemo(() => {
    if (!searchText.trim()) return suppliers;
    const q = searchText.toLowerCase();
    return suppliers.filter(s =>
      s.code_name?.toLowerCase().includes(q) ||
      s.contact_person?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.contact_information?.toLowerCase().includes(q)
    );
  }, [suppliers, searchText]);

  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const paginated = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  useEffect(() => { fetchSuppliers(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchText, entriesPerPage]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await supplierApi.getAll({ per_page: 9999 });
      setSuppliers(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.message || 'Unknown error';
      Alert.alert('Failed to load suppliers', `${status ? `HTTP ${status}: ` : ''}${message}`);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSuppliers();
    setRefreshing(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await supplierApi.delete(deleteTarget.id);
      setConfirmVisible(false);
      setDeleteTarget(null);
      Alert.alert('Success', 'Supplier removed');
      fetchSuppliers();
    } catch {
      Alert.alert('Error', 'Failed to remove supplier');
    }
  };

  const filterOptions: DropdownOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const columns: Column[] = useMemo(() => [
    { key: 'status', header: 'Status', width: 60, sortable: false,
      render: (_v: any, item: Supplier) => (
        <Text style={[styles.cellText, { color: item.status === 'active' ? '#16A34A' : '#6B7280' }]}>
          {item.status ?? 'N/A'}
        </Text>
      )
    },
    { key: 'code_name', header: 'Code Name', width: 110, sortable: true },
    { key: 'contact_person', header: 'Contact Person', width: 120, sortable: true },
    { key: 'contact_information', header: 'Contact Number', width: 130, sortable: false },
    {
      key: 'action', header: '', width: 50, sortable: false,
      render: (_v: any, item: Supplier) => (
        <RowActionMenu
          onEdit={() => router.push({ pathname: '/material-suppliers/edit', params: { id: item.id } } as any)}
          onDelete={() => { setDeleteTarget(item); setConfirmVisible(true); }}
        />
      ),
    },
  ], [paginated.length]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0D253F" />
      <View style={{ paddingTop: insets.top }}>
        <Header />
      </View>

      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-circle-outline" size={20} color="#0D253F" />
          </View>
          <Text style={styles.titleText}>Suppliers</Text>
        </View>
        <Text style={styles.breadcrumbText}>Home / Suppliers</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D253F']} />}
      >
        <View style={styles.actionRow}>
          <Button title="Add Supplier" onPress={() => router.push('/material-suppliers/add' as any)} variant="primary" size="base" icon="add-circle-outline" />
        </View>

        <SearchBar value={searchText} onChangeText={setSearchText} placeholder="Search suppliers..." />

        <View style={styles.listControlRow}>
          <Text style={styles.listTitle}>List</Text>
          <View style={styles.filterRow}>
            <Ionicons name="funnel" size={14} color="#001C34" />
            <Text style={styles.filterLabel}>Filter:</Text>
            <Dropdown options={filterOptions} selectedValue={selectedFilter} onSelect={setSelectedFilter} placeholder="All" />
          </View>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0D253F" />
            <Text style={styles.loadingText}>Loading suppliers...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.loadingText}>{searchText ? 'No suppliers found.' : 'No suppliers available.'}</Text>
          </View>
        ) : (
          <View style={{ paddingBottom: 150 }}>
            <DataTable columns={columns} data={paginated} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              entriesPerPage={entriesPerPage}
              totalEntries={filtered.length}
              onPageChange={setCurrentPage}
              onEntriesChange={setEntriesPerPage}
            />
          </View>
        )}
        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>

      <ConfirmModal
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleDelete}
        title="Remove Supplier?"
        message={`Are you sure you want to remove ${deleteTarget?.code_name ?? 'this supplier'}?`}
        confirmText="Remove"
        highlightText={deleteTarget?.code_name ?? ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { flex: 1, padding: SPACING.base, backgroundColor: COLORS.white },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.white,
  },
  titleLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1.5, borderColor: '#0D253F',
    justifyContent: 'center', alignItems: 'center',
    marginRight: SPACING.sm,
  },
  titleText: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: '#0D253F' },
  breadcrumbText: { fontSize: FONT_SIZES.xs, fontFamily: 'Poppins_400Regular', color: '#6B7280' },
  actionRow: { flexDirection: 'row', marginBottom: SPACING.lg },
  listControlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  listTitle: { fontSize: FONT_SIZES.base, fontFamily: 'Poppins_500Medium', color: '#0D253F' },
  filterRow: { flexDirection: 'row', alignItems: 'center' },
  filterLabel: { marginHorizontal: SPACING.xs, fontFamily: 'Poppins_300Light', fontSize: FONT_SIZES.sm, color: '#6B7280' },
  actionBtn: {
    borderWidth: SIZES.border.thin + 1, borderColor: '#A5B4BF',
    backgroundColor: '#EBF6FF', borderRadius: SIZES.radius.xs,
    paddingVertical: SPACING.xs - 2, paddingHorizontal: SPACING.xs + 1,
  },
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  floatingMenu: {
    position: 'absolute', backgroundColor: '#FFF',
    borderRadius: 10, width: 140,
    borderWidth: 2, borderColor: '#A5B4BF',
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 12,
    borderBottomWidth: 2, borderBottomColor: '#A5B4BF',
  },
  menuIcon: { marginRight: 8 },
  menuItemText: { fontSize: 15, color: '#0D253F', fontFamily: 'Poppins_400Regular' },
  cellText: { fontSize: FONT_SIZES.xs, color: COLORS.text, fontFamily: 'Poppins_400Regular' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xl * 2 },
  loadingText: { marginTop: SPACING.base, fontSize: FONT_SIZES.base, fontFamily: 'Poppins_400Regular', color: '#0D253F' },
});
