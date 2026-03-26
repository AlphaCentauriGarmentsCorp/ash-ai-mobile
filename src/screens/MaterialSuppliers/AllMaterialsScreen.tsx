import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Material, materialApi } from '@api/materialSuppliers';
import Button from '@components/common/Button';
import type { Column } from '@components/common/DataTable';
import DataTable from '@components/common/DataTable';
import type { DropdownOption } from '@components/common/Dropdown';
import Dropdown from '@components/common/Dropdown';
import Pagination from '@components/common/Pagination';
import SearchBar from '@components/common/SearchBar';
import { usePoppinsFonts } from '@hooks';
import { Header } from '@layouts';
import { COLORS, FONT_SIZES, SPACING } from '@styles';

export default function AllMaterialsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filtered = useMemo(() => {
    if (!searchText.trim()) return materials;
    const q = searchText.toLowerCase();
    return materials.filter(m =>
      m.material_type?.toLowerCase().includes(q) ||
      m.name?.toLowerCase().includes(q) ||
      m.supplier_name?.toLowerCase().includes(q) ||
      m.finishing?.toLowerCase().includes(q)
    );
  }, [materials, searchText]);

  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const paginated = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  useEffect(() => { fetchMaterials(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchText, entriesPerPage]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await materialApi.getAll({ per_page: 9999 });
      setMaterials(Array.isArray(res.data) ? res.data : []);
    } catch {
      Alert.alert('Error', 'Failed to load materials');
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMaterials();
    setRefreshing(false);
  };

  const filterOptions: DropdownOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const columns: Column[] = useMemo(() => [
    { key: 'status', header: 'Status', width: 60, sortable: false,
      render: (_v: any, item: Material) => (
        <Text style={[styles.cellText, { color: item.status === 'active' ? '#16A34A' : '#6B7280' }]}>
          {item.status ?? 'N/A'}
        </Text>
      )
    },
    { key: 'material_type', header: 'Material Type', width: 120, sortable: true },
    { key: 'name', header: 'Name', width: 130, sortable: true },
    { key: 'supplier_name', header: 'Supplier Name', width: 130, sortable: true },
    { key: 'finishing', header: 'Finishing', width: 110, sortable: false },
    { key: 'unit_price', header: 'Unit Price', width: 90, sortable: false },
    { key: 'address', header: 'Address', width: 160, sortable: false },
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
            <Ionicons name="cube-outline" size={20} color="#0D253F" />
          </View>
          <Text style={styles.titleText}>Materials</Text>
        </View>
        <Text style={styles.breadcrumbText}>Home / Materials</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D253F']} />}
      >
        <View style={styles.actionRow}>
          <Button title="Add Material" onPress={() => router.push('/material-suppliers/add-material' as any)} variant="primary" size="base" icon="add-circle-outline" />
        </View>

        <SearchBar value={searchText} onChangeText={setSearchText} placeholder="Search materials, supplier, type..." />

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
            <Text style={styles.loadingText}>Loading materials...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.loadingText}>{searchText ? 'No materials found.' : 'No materials available.'}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { flex: 1, padding: SPACING.base, backgroundColor: COLORS.white },
  titleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.base, paddingVertical: SPACING.base,
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
  cellText: { fontSize: FONT_SIZES.xs, color: COLORS.text, fontFamily: 'Poppins_400Regular' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xl * 2 },
  loadingText: { marginTop: SPACING.base, fontSize: FONT_SIZES.base, fontFamily: 'Poppins_400Regular', color: '#0D253F' },
});
