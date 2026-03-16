import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { placementMeasurementApi, type PlacementMeasurement } from '@api';
import Button from '@components/common/Button';
import type { Column } from '@components/common/DataTable';
import DataTable from '@components/common/DataTable';
import Pagination from '@components/common/Pagination';
import SearchBar from '@components/common/SearchBar';
import { usePoppinsFonts } from '@hooks';
import { Header } from '@layouts';
import { COLORS, SIZES, SPACING } from '@styles';

export default function PlacementMeasurementsListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [placementMeasurements, setPlacementMeasurements] = useState<PlacementMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPlacementMeasurements = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const response = await placementMeasurementApi.index({
        page,
        per_page: entriesPerPage,
        search: search || undefined,
      });

      setPlacementMeasurements(response.data);
      setTotalPages(response.last_page);
      setTotalItems(response.total);
      setCurrentPage(response.current_page);
    } catch (error: any) {
      console.error('Failed to fetch placement measurements:', error);
      Alert.alert('Error', 'Failed to load placement measurements. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [entriesPerPage]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPlacementMeasurements(1, searchText);
    setRefreshing(false);
  }, [fetchPlacementMeasurements, searchText]);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    setCurrentPage(1);
    fetchPlacementMeasurements(1, text);
  }, [fetchPlacementMeasurements]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchPlacementMeasurements(page, searchText);
    }
  }, [totalPages, searchText, fetchPlacementMeasurements]);

  const handleEntriesChange = useCallback((value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
    fetchPlacementMeasurements(1, searchText);
  }, [searchText, fetchPlacementMeasurements]);

  const handleDelete = useCallback(async (id: number, name: string) => {
    Alert.alert(
      'Delete Placement Measurement',
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await placementMeasurementApi.delete(id);
              Alert.alert('Success', 'Placement measurement deleted successfully');
              handleRefresh();
            } catch (error: any) {
              console.error('Failed to delete placement measurement:', error);
              Alert.alert('Error', 'Failed to delete placement measurement. Please try again.');
            }
          },
        },
      ]
    );
  }, [handleRefresh]);

  useEffect(() => {
    fetchPlacementMeasurements();
  }, [fetchPlacementMeasurements]);

  const columns: Column[] = useMemo(() => [
    { key: 'id', header: '#', width: 60, sortable: true },
    { key: 'name', header: 'Name', width: 200, sortable: true },
    { key: 'description', header: 'Description', width: 300, sortable: true },
    {
      key: 'action',
      header: 'Actions',
      width: 100,
      sortable: false,
      render: (_value: any, item: PlacementMeasurement) => (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => router.push(`/dropdown-settings/placement-measurements/edit/${item.id}` as any)}
          >
            <Ionicons name="pencil" size={16} color="#0D253F" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDelete(item.id, item.name)}
          >
            <Ionicons name="trash-outline" size={16} color="#F44336" />
          </TouchableOpacity>
        </View>
      ),
    },
  ], [router, handleDelete]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0D253F" />

      <View style={{ paddingTop: insets.top }}>
        <Header />
      </View>

      <View style={styles.pageTitleContainer}>
        <View style={styles.titleLeftGroup}>
          <View style={styles.iconCircleWrapper}>
            <Ionicons name="resize-outline" size={24} color="#0D253F" />
          </View>
          <Text style={styles.pageTitleText}>Placement Measurements</Text>
        </View>

        <View style={styles.breadcrumbGroup}>
          <Text style={styles.breadcrumbBold}>Home</Text>
          <Text style={styles.breadcrumbNormal}> / Dropdown Settings / Placement Measurements</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.actionButtonsRow}>
          <Button
            title="Add Placement Measurement"
            onPress={() => router.push('/dropdown-settings/placement-measurements/add' as any)}
            variant="primary"
            size="base"
            icon="add-circle-outline"
            iconPosition="left"
          />
        </View>

        <SearchBar
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search placement measurements..."
        />

        <DataTable 
          columns={columns} 
          data={placementMeasurements}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          entriesPerPage={entriesPerPage}
          onPageChange={handlePageChange}
          onEntriesChange={handleEntriesChange}
        />

        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  contentContainer: {
    flex: 1,
    padding: SPACING.base,
    backgroundColor: COLORS.white 
  },
  pageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base, 
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.white,
  },
  titleLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#0D253F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  pageTitleText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0D253F',
  },
  breadcrumbGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbBold: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#001C34',
  },
  breadcrumbNormal: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#001C34',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.base,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    borderWidth: SIZES.border.thin + 1,
    borderColor: '#A5B4BF',
    backgroundColor: '#EBF6FF',
    borderRadius: SIZES.radius.xs,
    paddingVertical: SPACING.xs - 2,
    paddingHorizontal: SPACING.xs + 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF5350',
  },
});