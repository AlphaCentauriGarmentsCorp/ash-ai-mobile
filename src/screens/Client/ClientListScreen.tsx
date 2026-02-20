import { Entypo, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
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

import { clientService, type Client } from '@api';
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

// --- NEW COMPONENT: RowActionMenu ---
interface RowActionMenuProps {
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

const RowActionMenu = ({ onEdit, onView, onDelete }: RowActionMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  
  // FIX 1: Correctly type the useRef for TouchableOpacity
  const buttonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

  const toggleDropdown = () => {
    if (visible) {
      setVisible(false);
    } else {
      // FIX 2: Explicitly type the measure callback parameters as numbers
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

export default function ClientListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [allClientsFromAPI, setAllClientsFromAPI] = useState<Client[]>([]); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [selectedClientForBrands, setSelectedClientForBrands] = useState<Client | null>(null);

  // Client-side filtering
  const filteredClients = useMemo(() => {
    // Ensure allClientsFromAPI is an array
    if (!Array.isArray(allClientsFromAPI)) {
      return [];
    }
    
    if (!searchText.trim()) {
      return allClientsFromAPI;
    }

    const searchLower = searchText.toLowerCase().trim();
    return allClientsFromAPI.filter(client => {
      if (client.name?.toLowerCase().includes(searchLower)) return true;
      if (client.email?.toLowerCase().includes(searchLower)) return true;
      if (client.contact_number?.toLowerCase().includes(searchLower)) return true;
      if (client.brands && client.brands.length > 0) {
        return client.brands.some(brand => 
          brand.name?.toLowerCase().includes(searchLower)
        );
      }
      return false;
    });
  }, [allClientsFromAPI, searchText]);

  // Calculate pagination
  const totalClients = filteredClients.length;
  const totalPages = Math.ceil(totalClients / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage, searchText]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getClients(1, 9999);
      console.log('Clients response:', response);
      console.log('Clients data:', response.data);
      console.log('Is array?', Array.isArray(response.data));
      
      // Handle different response structures
      let clientsArray: Client[] = [];
      
      if (Array.isArray(response.data)) {
        // Standard case: response.data is an array
        clientsArray = response.data;
      } else if (Array.isArray(response)) {
        // Alternative case: response itself is an array
        clientsArray = response;
      } else if (response.data && typeof response.data === 'object') {
        // Edge case: response.data is a single object (backend error)
        console.warn('API returned a single object instead of array. This is likely a backend issue.');
        clientsArray = [];
      } else {
        console.error('Unexpected response structure:', response);
        clientsArray = [];
      }
      
      console.log('Setting clients array with', clientsArray.length, 'items');
      setAllClientsFromAPI(clientsArray);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setAllClientsFromAPI([]);
      Alert.alert('Error', 'Failed to load clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await clientService.getClients(1, 9999);
      
      // Handle different response structures
      let clientsArray: Client[] = [];
      
      if (Array.isArray(response.data)) {
        clientsArray = response.data;
      } else if (Array.isArray(response)) {
        clientsArray = response;
      } else if (response.data && typeof response.data === 'object') {
        console.warn('API returned a single object instead of array during refresh.');
        clientsArray = [];
      } else {
        clientsArray = [];
      }
      
      setAllClientsFromAPI(clientsArray);
    } catch (error) {
      console.error('Error refreshing clients:', error);
      Alert.alert('Error', 'Failed to refresh clients');
      setAllClientsFromAPI([]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      console.log('Deleting client:', selectedClient.id);
      await clientService.deleteClient(String(selectedClient.id));
      setRemoveModalVisible(false);
      setSelectedClient(null);
      Alert.alert('Success', 'Client deleted successfully');
      fetchClients(); 
    } catch (error: any) {
      console.error('Error deleting client:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete client';
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

  const handleRowPress = (client: Client, index: number) => {
    setSelectedClientForBrands(client);
    setBrandModalVisible(true);
  };

  const filterOptions: DropdownOption[] = [
    { label: 'All Clients', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // --- UPDATED COLUMNS ---
  const columns: Column[] = useMemo(() => [
    { 
      key: 'brands', 
      header: 'Clothing/Company', 
      width: 120, 
      sortable: false,
      render: (value: any, item: Client) => (
        <Text style={styles.cellText} numberOfLines={1}>
          {item.brands && item.brands.length > 0 ? item.brands[0].name : 'N/A'}
        </Text>
      )
    },
    { 
      key: 'name', 
      header: 'Name', 
      width: 120, 
      sortable: true
    },
    { 
      key: 'contact_number', 
      header: 'Contact No.', 
      width: 130, 
      sortable: true
    },
    { 
      key: 'email', 
      header: 'Email', 
      width: 180, 
      sortable: true 
    },
    {
      key: 'action',
      header: '',
      width: 60,
      sortable: false,
      render: (_value: any, item: Client) => {
        // Use the new RowActionMenu component here
        return (
          <RowActionMenu 
            onEdit={() => router.push({ pathname: "/client/edit", params: { id: item.id } })}
            onView={() => router.push({ pathname: "/client/view", params: { id: item.id } })}
            onDelete={() => {
              setSelectedClient(item);
              setRemoveModalVisible(true);
            }}
          />
        );
      },
    },
  ], [currentClients.length]);

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
             <Image 
               source={require('../../assets/images/people-group-solid-full (1).png')} 
               style={styles.pageTitleIcon}
               resizeMode="contain"
             />
          </View>
          <Text style={styles.pageTitleText}>Clients</Text>
        </View>

        <View style={styles.breadcrumbGroup}>
          <Text style={styles.breadcrumbBold}>Home</Text>
          <Text style={styles.breadcrumbNormal}> / Clients</Text>
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
            title="New client"
            onPress={() => router.push('/client/add')}
            variant="primary"
            size="base"
            icon="add-circle-outline"
            iconPosition="left"
          />

          <Button
            title="Remove Clients"
            onPress={() => console.log('Remove clients')}
            variant="outline"
            size="base"
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
            <Text style={styles.loadingText}>Loading clients...</Text>
          </View>
        ) : filteredClients.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {searchText.trim() ? 'No clients found matching your search.' : 'No clients available.'}
            </Text>
          </View>
        ) : (
          <View style={{ paddingBottom: 150, zIndex: 1 }}> 
            <DataTable 
              columns={columns} 
              data={currentClients} 
              onRowPress={handleRowPress}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              entriesPerPage={entriesPerPage}
              totalEntries={totalClients}
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
        onConfirm={handleDeleteClient}
        title="Remove Client?"
        message={`Are you sure you want to remove ${selectedClient ? selectedClient.name : 'this client'}? This action cannot be undone.`}
        confirmText="Remove Client"
        highlightText={selectedClient ? selectedClient.name : ''}
      />

      <Modal
        visible={brandModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setBrandModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setBrandModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Clothing/Company</Text>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedClientForBrands?.brands && selectedClientForBrands.brands.length > 0 ? (
                selectedClientForBrands.brands.map((brand, index) => (
                  <View key={index} style={styles.brandItem}>
                    <Text style={styles.brandName}>{brand.name}</Text>
                    <Text style={styles.ownerName}>{selectedClientForBrands.name}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noBrandsText}>No brands available</Text>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setBrandModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  pageTitleIcon: {
    width: 20, 
    height: 20,
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
  // --- UPDATED Styles for Modal Menu ---
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
  // Modal Content Styles (For Brand Modal)
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    margin: 19.5,
    marginTop: 275,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0D253F',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxHeight: 280,
  },
  brandItem: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 4,
  },
  brandName: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#0D253F',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  noBrandsText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  closeModalButton: {
    backgroundColor: '#0D253F',
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});