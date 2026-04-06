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
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supplierApi, type Supplier } from '@api/materialSuppliers';
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
  onView: () => void;
  onDelete: () => void;
}

const RowActionMenu = ({ onEdit, onView, onDelete }: RowActionMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

  const toggleDropdown = () => {
    if (visible) {
      setVisible(false);
    } else {
      buttonRef.current?.measure((_fx: number, _fy: number, _w: number, h: number, px: number, py: number) => {
        const windowWidth = Dimensions.get('window').width;
        setDropdownPosition({
          top: py + h, 
          right: windowWidth - (px + _w), 
        });
        setVisible(true);
      });
    }
  };

  return (
    <View>
      <TouchableOpacity 
        ref={buttonRef}
        style={styles.actionBtn} 
        onPress={toggleDropdown}
      >
        <Entypo name="chevron-down" size={20} color="#1E3A5F" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.floatingMenu,
                {
                  top: dropdownPosition.top,
                  right: dropdownPosition.right,
                },
              ]}
            >
              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => { setVisible(false); onEdit(); }}
              >
                <Ionicons name="pencil" size={16} color="#0D253F" style={styles.dropdownIcon} />
                <Text style={styles.dropdownItemText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => { setVisible(false); onView(); }}
              >
                <Ionicons name="eye" size={16} color="#0D253F" style={styles.dropdownIcon} />
                <Text style={styles.dropdownItemText}>View</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.dropdownItem, { borderBottomWidth: 0 }]} 
                onPress={() => { setVisible(false); onDelete(); }}
              >
                <Ionicons name="trash" size={16} color="#0D253F" style={styles.dropdownIcon} />
                <Text style={styles.dropdownItemText}>Remove</Text>
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

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [allSuppliersFromAPI, setAllSuppliersFromAPI] = useState<Supplier[]>([]); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Client-side filtering
  const filteredSuppliers = useMemo(() => {
    if (!Array.isArray(allSuppliersFromAPI)) {
      return [];
    }
    
    if (!searchText.trim()) {
      return allSuppliersFromAPI;
    }

    const searchLower = searchText.toLowerCase().trim();
    return allSuppliersFromAPI.filter(supplier => {
      if (supplier.code_name?.toLowerCase().includes(searchLower)) return true;
      if (supplier.contact_person?.toLowerCase().includes(searchLower)) return true;
      if (supplier.contact_information?.toLowerCase().includes(searchLower)) return true;
      if (supplier.email?.toLowerCase().includes(searchLower)) return true;
      return false;
    });
  }, [allSuppliersFromAPI, searchText]);

  // Calculate pagination
  const totalSuppliers = filteredSuppliers.length;
  const totalPages = Math.ceil(totalSuppliers / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage, searchText]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierApi.getAll({ page: 1, per_page: 9999 });
      console.log('Suppliers response:', response);
      
      let suppliersArray: Supplier[] = [];
      
      if (Array.isArray(response.data)) {
        suppliersArray = response.data;
      } else if (Array.isArray(response)) {
        suppliersArray = response;
      } else {
        console.error('Unexpected response structure:', response);
        suppliersArray = [];
      }
      
      console.log('Setting suppliers array with', suppliersArray.length, 'items');
      setAllSuppliersFromAPI(suppliersArray);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setAllSuppliersFromAPI([]);
      Alert.alert('Error', 'Failed to load suppliers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await supplierApi.getAll({ page: 1, per_page: 9999 });
      
      let suppliersArray: Supplier[] = [];
      
      if (Array.isArray(response.data)) {
        suppliersArray = response.data;
      } else if (Array.isArray(response)) {
        suppliersArray = response;
      } else {
        suppliersArray = [];
      }
      
      setAllSuppliersFromAPI(suppliersArray);
    } catch (error) {
      console.error('Error refreshing suppliers:', error);
      Alert.alert('Error', 'Failed to refresh suppliers');
      setAllSuppliersFromAPI([]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!selectedSupplier) return;
    try {
      console.log('Deleting supplier:', selectedSupplier.id);
      await supplierApi.delete(selectedSupplier.id);
      setRemoveModalVisible(false);
      setSelectedSupplier(null);
      Alert.alert('Success', 'Supplier deleted successfully');
      fetchSuppliers(); 
    } catch (error: any) {
      console.error('Error deleting supplier:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete supplier';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleEntriesChange = (value: number) => {
    setEntriesPerPage(value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filterOptions: DropdownOption[] = [
    { label: 'All Clients', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const columns: Column[] = useMemo(() => [
    { 
      key: 'code_name', 
      header: 'Code Name', 
      width: 120, 
      sortable: true,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={1}>
          {value || 'N/A'}
        </Text>
      )
    },
    { 
      key: 'contact_person', 
      header: 'Contact Person', 
      width: 120, 
      sortable: true,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={1}>
          {value || 'N/A'}
        </Text>
      )
    },
    { 
      key: 'contact_information', 
      header: 'Contact Number', 
      width: 130, 
      sortable: true,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={1}>
          {value || 'N/A'}
        </Text>
      )
    },
    { 
      key: 'email', 
      header: 'Email', 
      width: 180, 
      sortable: true,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={1}>
          {value || 'N/A'}
        </Text>
      )
    },
    {
      key: 'address',
      header: 'Address',
      width: 200,
      sortable: false,
      render: (_value: any, item: Supplier) => {
        const address = [item.street, item.barangay, item.city, item.province]
          .filter(Boolean)
          .join(', ');
        return (
          <Text style={styles.cellText} numberOfLines={2}>
            {address || 'N/A'}
          </Text>
        );
      }
    },
    {
      key: 'notes',
      header: 'Notes',
      width: 150,
      sortable: false,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={2}>
          {value || 'N/A'}
        </Text>
      )
    },
    {
      key: 'action',
      header: '',
      width: 60,
      sortable: false,
      render: (_value: any, item: Supplier) => {
        return (
          <RowActionMenu 
            onEdit={() => router.push({ pathname: "/material-suppliers/edit", params: { id: item.id } })}
            onView={() => router.push({ pathname: "/material-suppliers/view", params: { id: item.id } })}
            onDelete={() => {
              setSelectedSupplier(item);
              setRemoveModalVisible(true);
            }}
          />
        );
      },
    },
  ], [currentSuppliers.length]);

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
            <Ionicons name="person-circle-outline" size={24} color="#0D253F" />
          </View>
          <Text style={styles.pageTitleText}>Supplier</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0D253F']}
            tintColor="#0D253F"
          />
        }
      >
        <View style={styles.actionButtonsRow}>
          <Button
            title="Add Supplier"
            onPress={() => router.push('/material-suppliers/add')}
            variant="primary"
            size="base"
            icon="add-circle-outline"
            iconPosition="left"
          />
        </View>

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by client name, brand..."
        />

        <View style={styles.listControlRow}>
          <Text style={styles.listTitle}>List</Text>
          <View style={styles.filterContainer}>
            <Ionicons name="funnel" size={14} color="#001C34" />
            <Text style={styles.filterText}>Filter:</Text>
            <Dropdown
              options={filterOptions}
              selectedValue={selectedFilter}
              onSelect={setSelectedFilter}
              placeholder="All Clients"
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0D253F" />
            <Text style={styles.loadingText}>Loading suppliers...</Text>
          </View>
        ) : filteredSuppliers.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {searchText.trim() ? 'No suppliers found matching your search.' : 'No suppliers available.'}
            </Text>
          </View>
        ) : (
          <View style={{ paddingBottom: 150, zIndex: 1 }}> 
            <DataTable 
              columns={columns} 
              data={currentSuppliers} 
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              entriesPerPage={entriesPerPage}
              totalEntries={totalSuppliers}
              onPageChange={handlePageChange}
              onEntriesChange={handleEntriesChange}
            />
          </View>
        )}

        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>

      <ConfirmModal
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        onConfirm={handleDeleteSupplier}
        title="Remove Supplier?"
        message={`Are you sure you want to remove ${selectedSupplier ? selectedSupplier.code_name : 'this supplier'}? This action cannot be undone.`}
        confirmText="Remove Supplier"
        highlightText={selectedSupplier ? selectedSupplier.code_name : ''}
      />
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
  actionButtonsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.base,
  },
  listControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm + 2
  },
  listTitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: 'Poppins_500Medium',
    color: '#0D253F'
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterText: {
    marginHorizontal: SPACING.xs + 1,
    color: "COLORS.textSecondary",
    fontFamily: 'Poppins_300Light',
    fontSize: FONT_SIZES.sm,
  },
  actionBtn: {
    borderWidth: SIZES.border.thin + 1,
    borderColor: '#A5B4BF',
    backgroundColor: '#EBF6FF',
    borderRadius: SIZES.radius.xs,
    paddingVertical: SPACING.xs - 2,
    paddingHorizontal: SPACING.xs + 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  floatingMenu: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 150,
    borderWidth: 2,
    borderColor: '#A5B4BF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8, 
    overflow: 'visible', 
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#A5B4BF',
  },
  dropdownIcon: {
    marginRight: 8,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#0D253F',
    fontFamily: 'poppins-regular', 
  },
  cellText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontFamily: 'poppins-regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  loadingText: {
    marginTop: SPACING.base,
    fontSize: FONT_SIZES.base,
    fontFamily: 'Poppins_400Regular',
    color: '#0D253F',
  },
});
