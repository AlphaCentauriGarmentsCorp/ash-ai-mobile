import { Entypo, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
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
import type { RoleOption } from '@components/common/RoleDropdown';
import RoleDropdown from '@components/common/RoleDropdown';
import SearchBar from '@components/common/SearchBar';
import { usePoppinsFonts } from '@hooks';
import { Header } from '@layouts';
import { COLORS, FONT_SIZES, SIZES, SPACING } from '@styles';

// Types
interface Account {
  id: string;
  name: string;
  username: string;
  role: string;
  contact: string;
  email: string;
  [key: string]: string;
}

const names = ['Joedemar Rosero', 'Harres Uba', 'Jayvin Andeza'];
const usernames = ['joedemar', 'harres', 'jayvin'];
const emails = ['joedemar@gmail.com', 'harres@gmail.com', 'jayvin@gmail.com'];

const DATA: Account[] = Array(15).fill(null).map((_, i) => ({
  id: `${i + 1}`,
  name: names[i % 3],
  username: usernames[i % 3],
  role: 'developer',
  contact: '0999-999-9999',
  email: emails[i % 3],
}));

export default function AccountListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Tracks which row index has the dropdown open
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);
  
  // Tracks which row has role dropdown open
  const [activeRoleDropdownIndex, setActiveRoleDropdownIndex] = useState<number | null>(null);
  
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  // Role state for each account
  const [accountRoles, setAccountRoles] = useState<Record<number, string>>(
    DATA.reduce((acc, _, index) => ({ ...acc, [index]: 'developer' }), {})
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentAccounts = DATA.slice(indexOfFirstEntry, indexOfLastEntry);
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
      setActiveDropdownIndex(null);
    } else {
      setActiveDropdownIndex(index);
      setSelectedAccount(index); 
    }
  };

  const handleRoleChange = (index: number, role: string) => {
    setAccountRoles(prev => ({ ...prev, [index]: role }));
  };

  const filterOptions: DropdownOption[] = [
    { label: 'All Accounts', value: 'all' },
    { label: 'Admin', value: 'admin' },
    { label: 'Developer', value: 'developer' },
    { label: 'General Manager', value: 'general_manager' },
  ];

  const roleOptions: RoleOption[] = [
    { label: 'Developer', value: 'developer', color: '#2ECC71' },
    { label: 'Admin', value: 'admin', color: '#E74C3C' },
    { label: 'General Manager', value: 'general_manager', color: '#3498DB' },
  ];

  // --- OPTIMIZED COLUMNS ---
  const columns: Column[] = useMemo(() => [
    { key: 'id', header: 'ID', width: 60, sortable: true },
    { key: 'name', header: 'Name', width: 140, sortable: true },
    { key: 'username', header: 'Username', width: 120, sortable: true },
    {
      key: 'role',
      header: 'Role',
      width: 140,
      sortable: false,
      render: (_value: any, _item: any, index: number) => (
        <RoleDropdown
          options={roleOptions}
          selectedValue={accountRoles[index] || 'developer'}
          onSelect={(role) => handleRoleChange(index, role)}
          onOpenChange={(isOpen) => setActiveRoleDropdownIndex(isOpen ? index : null)}
        />
      ),
    },
    { key: 'contact', header: 'Contact Number', width: 140, sortable: true },
    { key: 'email', header: 'Email', width: 180, sortable: true },
    {
      key: 'action',
      header: '',
      width: 60,
      sortable: false,
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
                 if (selectedAccount !== null) router.push({ pathname: "/Account/edit", params: DATA[selectedAccount] });
              }}>
                <Ionicons name="pencil" size={16} color="#0D253F" style={styles.dropdownIcon} />
                <Text style={styles.dropdownItemText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                 setActiveDropdownIndex(null);
                 if (selectedAccount !== null) router.push({ pathname: "/Account/view", params: DATA[selectedAccount] });
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
  ], [activeDropdownIndex, selectedAccount, accountRoles, activeRoleDropdownIndex]);

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
            <Ionicons name="person-circle" size={24} color="#0D253F" />
          </View>
          <Text style={styles.pageTitleText}>Accounts</Text>
        </View>

        {/* RIGHT SIDE: Breadcrumbs (Home / Accounts) */}
        <View style={styles.breadcrumbGroup}>
          <Text style={styles.breadcrumbBold}>Home</Text>
          <Text style={styles.breadcrumbNormal}> / Accounts</Text>
        </View>
      </View>
      {/* --- TITLE BAR END --- */}

      <ScrollView style={styles.contentContainer}>
        <View style={styles.actionButtonsRow}>
          <Button
            title="New Account"
            onPress={() => router.push('/Account/add')}
            variant="primary"
            size="base"
            icon="add-circle-outline"
            iconPosition="left"
          />
        </View>

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by name, username, email..."
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
              placeholder="All Accounts"
            />
          </View>
        </View>

        <DataTable 
          columns={columns} 
          data={currentAccounts} 
          activeRowIndex={activeRoleDropdownIndex !== null ? activeRoleDropdownIndex : activeDropdownIndex}
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
        title="Remove Account?"
        message={`Are you sure you want to remove ${selectedAccount !== null ? DATA[selectedAccount].name : 'this account'}? This action cannot be undone.`}
        confirmText="Remove Account"
        highlightText={selectedAccount !== null ? DATA[selectedAccount].name : ''}
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
