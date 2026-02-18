import { Entypo, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
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

export default function ClientListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // API state
  const [allClientsFromAPI, setAllClientsFromAPI] = useState<Client[]>([]); // Store all clients from API
  const [loading, setLoading] = useState(true);

  // Tracks which row index has the dropdown open
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);
  
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [selectedClientForBrands, setSelectedClientForBrands] = useState<Client | null>(null);

  // Client-side filtering
  const filteredClients = useMemo(() => {
    if (!searchText.trim()) {
      return allClientsFromAPI;
    }

    const searchLower = searchText.toLowerCase().trim();
    return allClientsFromAPI.filter(client => {
      // Search in client name
      if (client.name?.toLowerCase().includes(searchLower)) return true;
      
      // Search in email
      if (client.email?.toLowerCase().includes(searchLower)) return true;
      
      // Search in contact number
      if (client.contact_number?.toLowerCase().includes(searchLower)) return true;
      
      // Search in brands
      if (client.brands && client.brands.length > 0) {
        return client.brands.some(brand => 
          brand.name?.toLowerCase().includes(searchLower)
        );
      }
      
      return false;
    });
  }, [allClientsFromAPI, searchText]);

  // Calculate pagination on the frontend
  const totalClients = filteredClients.length;
  const totalPages = Math.ceil(totalClients / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  // Fetch all clients from API once on mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Reset to page 1 when entries per page changes or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage, searchText]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Fetch all clients without search parameter (backend doesn't support it)
      const response = await clientService.getClients(1, 9999);
      console.log('Received clients:', response.data.length);
      setAllClientsFromAPI(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    
    try {
      await clientService.deleteClient(String(selectedClient.id));
      setRemoveModalVisible(false);
      fetchClients(); // Refresh the list
    } catch (error) {
      console.error('Error deleting client:', error);
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

  const toggleDropdown = (index: number) => {
    if (activeDropdownIndex === index) {
      setActiveDropdownIndex(null);
    } else {
      setActiveDropdownIndex(index);
      setSelectedClient(currentClients[index]); 
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

  // --- OPTIMIZED COLUMNS ---
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
      render: (_value: any, item: Client, index: number) => {
        // Open dropdown upward only if it's the last row AND there are at least 3 rows
        // Otherwise, always open downward
        const shouldOpenUpward = index === currentClients.length - 1 && currentClients.length >= 3;
        
        return (
          <View style={{ position: 'relative' }}>
            <TouchableOpacity 
              style={styles.actionBtn} 
              onPress={() => toggleDropdown(index)}
            >
              <Entypo name="chevron-down" size={20} color="#1E3A5F" />
            </TouchableOpacity>

            {activeDropdownIndex === index && (
              <View style={[
                styles.dropdownMenu,
                shouldOpenUpward && styles.dropdownMenuUp
              ]}>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                   setActiveDropdownIndex(null);
                   router.push({ pathname: "/client/edit", params: { id: item.id } });
                }}>
                  <Ionicons name="pencil" size={16} color="#0D253F" style={styles.dropdownIcon} />
                  <Text style={styles.dropdownItemText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                   setActiveDropdownIndex(null);
                   router.push({ pathname: "/client/view", params: { id: item.id } });
                }}>
                  <Ionicons name="eye" size={16} color="#0D253F" style={styles.dropdownIcon} />
                  <Text style={styles.dropdownItemText}>View</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dropdownItem, { borderBottomWidth: 0 }]} 
                  onPress={() => {
                    setActiveDropdownIndex(null);
                    setRemoveModalVisible(true);
                  }}
                >
                  <Ionicons name="trash" size={16} color="#0D253F" style={styles.dropdownIcon} />
                  <Text style={styles.dropdownItemText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      },
    },
  ], [activeDropdownIndex, selectedClient, currentClients.length]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0D253F" />

      <View style={{ paddingTop: insets.top }}>
        <Header />
      </View>

      {/* --- TITLE BAR START --- */}
      <View style={styles.pageTitleContainer}>
        
        {/* LEFT SIDE: Icon + Title */}
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

        {/* RIGHT SIDE: Breadcrumbs (Home / Clients) */}
        <View style={styles.breadcrumbGroup}>
          <Text style={styles.breadcrumbBold}>Home</Text>
          <Text style={styles.breadcrumbNormal}> / Clients</Text>
        </View>
      </View>
      {/* --- TITLE BAR END --- */}

      <ScrollView style={styles.contentContainer}>
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
          <View style={{ paddingBottom: 150 }}>
            <DataTable 
              columns={columns} 
              data={currentClients} 
              activeRowIndex={activeDropdownIndex}
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

      {/* Brand Modal */}
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
  
  // --- CUSTOM HEADER STYLES ---
  pageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes Left group and Right group apart
    paddingHorizontal: SPACING.base, 
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.white, // White background like the image
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
  
  // Breadcrumb Styles
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
    color: '#001C34', // Slate-500 equivalent
  },
  // -----------------------------

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
  
  // Dropdown Styles
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 150,
    borderWidth: 2,
    borderColor: '#A5B4BF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownMenuUp: {
    top: undefined,
    bottom: 40,
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
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
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
