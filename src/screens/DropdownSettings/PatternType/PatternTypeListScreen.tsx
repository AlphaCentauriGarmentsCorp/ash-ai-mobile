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

import { patternTypeApi, type PatternType } from '@api';
import Button from '@components/common/Button';
import type { Column } from '@components/common/DataTable';
import DataTable from '@components/common/DataTable';
import Pagination from '@components/common/Pagination';
import SearchBar from '@components/common/SearchBar';
import { usePoppinsFonts } from '@hooks';
import { Header } from '@layouts';
import { COLORS, SIZES, SPACING } from '@styles';

export default function PatternTypeListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [patternTypes, setPatternTypes] = useState<PatternType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPatternTypes = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const response = await patternTypeApi.index({
        page,
        per_page: entriesPerPage,
        search: search || undefined,
      });

      // Ensure response.data is always an array
      setPatternTypes(Array.isArray(response.data) ? response.data : []);
      setTotalPages(response.last_page || 1);
      setTotalItems(response.total || 0);
      setCurrentPage(response.current_page || 1);
    } catch (error: any) {
      console.error('Failed to fetch pattern types:', error);
      // Set empty array on error to prevent undefined data
      setPatternTypes([]);
      setTotalPages(1);
      setTotalItems(0);
      setCurrentPage(1);
      Alert.alert('Error', 'Failed to load pattern types. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [entriesPerPage]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPatternTypes(1, searchText);
    setRefreshing(false);
  }, [fetchPatternTypes, searchText]);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    setCurrentPage(1);
    fetchPatternTypes(1, text);
  }, [fetchPatternTypes]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchPatternTypes(page, searchText);
    }
  }, [totalPages, searchText, fetchPatternTypes]);

  const handleEntriesChange = useCallback((value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
    fetchPatternTypes(1, searchText);
  }, [searchText, fetchPatternTypes]);

  const handleDelete = useCallback(async (id: number, name: string) => {
    Alert.alert(
      'Delete Pattern Type',
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await patternTypeApi.delete(id);
              Alert.alert('Success', 'Pattern type deleted successfully');
              handleRefresh();
            } catch (error: any) {
              console.error('Failed to delete pattern type:', error);
              Alert.alert('Error', 'Failed to delete pattern type. Please try again.');
            }
          },
        },
      ]
    );
  }, [handleRefresh]);

  useEffect(() => {
    fetchPatternTypes();
  }, [fetchPatternTypes]);

  const columns: Column[] = useMemo(() => [
    { key: 'id', header: '#', width: 60, sortable: true },
    { key: 'name', header: 'Name', width: 200, sortable: true },
    { key: 'description', header: 'Description', width: 300, sortable: true },
    {
      key: 'action',
      header: 'Actions',
      width: 100,
      sortable: false,
      render: (_value: any, item: PatternType) => (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => router.push(`/dropdown-settings/pattern-type/edit/${item.id}` as any)}
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
            <Ionicons name="shapes-outline" size={24} color="#0D253F" />
          </View>
          <Text style={styles.pageTitleText}>Pattern Type</Text>
        </View>

        <View style={styles.breadcrumbGroup}>
          <Text style={styles.breadcrumbBold}>Home</Text>
          <Text style={styles.breadcrumbNormal}> / Dropdown Settings / Pattern Type</Text>
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
            title="Add Pattern Type"
            onPress={() => router.push('/dropdown-settings/pattern-type/add' as any)}
            variant="primary"
            size="base"
            icon="add-circle-outline"
            iconPosition="left"
          />
        </View>

        <SearchBar
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search pattern types..."
        />

        <DataTable 
          columns={columns} 
          data={patternTypes}
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