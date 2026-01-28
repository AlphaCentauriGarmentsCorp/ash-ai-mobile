import { Entypo, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

// Types
interface Client {
  company: string;
  name: string;
  contact: string;
  email: string;
  [key: string]: string;
}

const DATA: Client[] = Array(12).fill({
  company: 'NIKE',
  name: 'Morgan Lee',
  contact: '09123456789',
  email: 'morganlee@gmail.com',
});

export default function ClientListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Tracks which row index has the dropdown open
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);
  
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentClients = DATA.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(DATA.length / entriesPerPage);

  const handleEntriesChange = (value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleDropdown = (index: number) => {
    if (activeDropdownIndex === index) {
      setActiveDropdownIndex(null); // Close if clicking the same one
    } else {
      setActiveDropdownIndex(index); // Open the new one
      setSelectedClient(index); 
    }
  };

  const filterOptions: DropdownOption[] = [
    { label: 'All Clients', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // --- OPTIMIZED COLUMNS ---
  const columns: Column[] = useMemo(() => [
    { key: 'company', header: 'Clothing/Company', width: 120 },
    { key: 'name', header: 'Name', width: 120 },
    { key: 'contact', header: 'Contact No.', width: 130 },
    { key: 'email', header: 'Email', width: 180 },
    {
      key: 'action',
      header: '',
      width: 60,
      render: (_value: any, _item: any, index: number) => (
        <View style={{ position: 'relative', zIndex: activeDropdownIndex === index ? 1000 : 1 }}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => toggleDropdown(index)}
          >
            <Entypo name="chevron-down" size={20} color="#1E3A5F" />
          </TouchableOpacity>

          {activeDropdownIndex === index && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                 setActiveDropdownIndex(null);
                 if (selectedClient !== null) router.push({ pathname: "/client/edit", params: DATA[selectedClient] });
              }}>
                <Ionicons name="pencil" size={16} color="#0D253F" style={styles.dropdownIcon} />
                <Text style={styles.dropdownItemText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                 setActiveDropdownIndex(null);
                 if (selectedClient !== null) router.push({ pathname: "/client/view", params: DATA[selectedClient] });
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
      ),
    },
  ], [activeDropdownIndex, selectedClient]);

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

        <DataTable 
          columns={columns} 
          data={currentClients} 
          activeRowIndex={activeDropdownIndex}
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

      <ConfirmModal
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        onConfirm={() => {
          console.log("Deleted");
          setRemoveModalVisible(false);
        }}
        title="Remove Client?"
        message={`Are you sure you want to remove ${selectedClient !== null ? DATA[selectedClient].name : 'this client'}? This action cannot be undone.`}
        confirmText="Remove Client"
        highlightText={selectedClient !== null ? DATA[selectedClient].name : ''}
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
    zIndex: 9999,
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
});
