import { Entypo, Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { employeeService, type Account } from '@api';
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

// --- NEW COMPONENT: RowActionMenu ---
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

export default function AccountListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // API state
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tracks which row has role dropdown open
  const [activeRoleDropdownIndex, setActiveRoleDropdownIndex] = useState<number | null>(null);
  
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Calculate pagination on the frontend
  const totalAccounts = allAccounts.length;
  const totalPages = Math.ceil(totalAccounts / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentAccounts = allAccounts.slice(startIndex, endIndex);

  // Fetch all accounts from API
  useEffect(() => {
    fetchAccounts();
  }, [searchText]);

  // Refresh accounts when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [])
  );

  // Reset to page 1 when entries per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getEmployees(1, 9999, searchText);
      setAllAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;
    
    try {
      console.log('Deleting account:', selectedAccount.id);
      await employeeService.deleteEmployee(String(selectedAccount.id));
      setRemoveModalVisible(false);
      setSelectedAccount(null);
      Alert.alert('Success', 'Account deleted successfully');
      fetchAccounts();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete account';
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
    { 
      key: 'id', 
      header: 'ID', 
      width: 60, 
      sortable: true,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={1}>
          {value || 'N/A'}
        </Text>
      )
    },
    { 
      key: 'name', 
      header: 'Name', 
      width: 140, 
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
      key: 'role',
      header: 'Role',
      width: 140,
      sortable: false,
      render: (_value: any, item: Account, index: number) => {
        const roleValue = item.role || 'developer';
        return (
          <RoleDropdown
            options={roleOptions}
            selectedValue={roleValue}
            onSelect={(role) => {
              employeeService.updateEmployee(String(item.id), { role })
                .then(() => fetchAccounts())
                .catch((error) => console.error('Error updating role:', error));
            }}
            onOpenChange={(isOpen) => setActiveRoleDropdownIndex(isOpen ? index : null)}
          />
        );
      },
    },
    {
      key: 'action',
      header: '',
      width: 60,
      sortable: false,
      render: (_value: any, item: Account) => {
        return (
          <RowActionMenu 
            onEdit={() => router.push({ pathname: "/Account/edit", params: { id: item.id } })}
            onView={() => router.push({ pathname: "/Account/view", params: { id: item.id } })}
            onDelete={() => {
              setSelectedAccount(item);
              setRemoveModalVisible(true);
            }}
          />
        );
      },
    },
  ], [activeRoleDropdownIndex, fetchAccounts]);

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

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0D253F" />
            <Text style={styles.loadingText}>Loading accounts...</Text>
          </View>
        ) : currentAccounts.length > 0 ? (
          <View style={{ paddingBottom: 150, zIndex: 1 }}>
            <DataTable 
              columns={columns} 
              data={currentAccounts} 
              activeRowIndex={activeRoleDropdownIndex}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              entriesPerPage={entriesPerPage}
              totalEntries={totalAccounts}
              onPageChange={handlePageChange}
              onEntriesChange={handleEntriesChange}
            />
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>No accounts found</Text>
          </View>
        )}

        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>

      <ConfirmModal
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        onConfirm={handleDeleteAccount}
        title="Remove Account?"
        message={`Are you sure you want to remove ${selectedAccount ? selectedAccount.name : 'this account'}? This action cannot be undone.`}
        confirmText="Remove Account"
        highlightText={selectedAccount ? selectedAccount.name : ''}
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
  
  // Modal Dropdown Styles
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
