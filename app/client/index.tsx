import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../../src/components/common/Button';
import ConfirmModal from '../../src/components/common/ConfirmModal';
import type { Column } from '../../src/components/common/DataTable';
import DataTable from '../../src/components/common/DataTable';
import type { DropdownOption } from '../../src/components/common/Dropdown';
import Dropdown from '../../src/components/common/Dropdown';
import GlobalHeader from '../../src/components/common/GlobalHeader';
import Modal from '../../src/components/common/Modal';
import PageTitle from '../../src/components/common/PageTitle';
import Pagination from '../../src/components/common/Pagination';
import NewClientScreen from '../../src/components/specific/Client/new-client';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES, SPACING } from '../../src/constants';
import { usePoppinsFonts } from '../../src/hooks';

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

export default function ClientsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); 
  const fontsLoaded = usePoppinsFonts();

  const [searchText, setSearchText] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const [modalVisible, setModalVisible] = useState(false);
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

  const handleEditPress = (index: number) => {
    setSelectedClient(index);
    setModalVisible(true);
  };

  const filterOptions: DropdownOption[] = [
    { label: 'All Clients', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const columns: Column[] = [
    { key: 'company', header: 'Clothing/Company', width: 120 },
    { key: 'name', header: 'Name', width: 120 },
    { key: 'contact', header: 'Contact No.', width: 130 },
    { key: 'email', header: 'Email', width: 180 },
    {
      key: 'action',
      header: 'Action',
      width: 60,
      render: (_value: any, _item: any, index: number) => (
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleEditPress(index)}>
          <Ionicons name="pencil" size={16} color="#1E3A5F" />
        </TouchableOpacity>
      ),
    },
  ];

  if (!fontsLoaded) return null; 
  if (showNewClient) return <NewClientScreen />;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0D253F" />

      <View style={{ paddingTop: insets.top }}>
        <GlobalHeader />
      </View>

      <PageTitle title="Clients" icon="people-outline" />

      <ScrollView style={styles.contentContainer}>
        <View style={styles.actionButtonsRow}>
          <Button
            title="New client"
            onPress={() => setShowNewClient(true)}
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

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by client name, brand..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color="#666" />
          </View>
        </View>

        <View style={styles.listControlRow}>
          <Text style={styles.listTitle}>List</Text>
          <View style={styles.filterContainer}>
            <Ionicons name="filter" size={14} color="#666" />
            <Text style={styles.filterText}>Filter:</Text>
            <Dropdown
              options={filterOptions}
              selectedValue={selectedFilter}
              onSelect={setSelectedFilter}
              placeholder="All Clients"
            />
          </View>
        </View>

        <DataTable columns={columns} data={currentClients} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          entriesPerPage={entriesPerPage}
          onPageChange={handlePageChange}
          onEntriesChange={handleEntriesChange}
        />
        
        <View style={{height: insets.bottom + 40}} />
      </ScrollView>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title="Actions">
        <TouchableOpacity style={styles.modalBtnDefault} onPress={() => {
          setModalVisible(false);
          if (selectedClient !== null) router.push({ pathname: "/client/edit", params: DATA[selectedClient] });
        }}>
          <Ionicons name="pencil" size={20} color="#0D253F" style={styles.modalIcon} />
          <Text style={styles.modalBtnTextDefault}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modalBtnDefault} onPress={() => {
          if (selectedClient !== null) {
            setModalVisible(false);
            router.push({ pathname: "/client/view", params: DATA[selectedClient] });
          }
        }}>
          <Ionicons name="eye" size={20} color="#0D253F" style={styles.modalIcon} />
          <Text style={styles.modalBtnTextDefault}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modalBtnDanger} onPress={() => {
          setModalVisible(false);
          setRemoveModalVisible(true);
        }}>
          <Ionicons name="trash" size={20} color="#FFF" style={styles.modalIcon} />
          <Text style={styles.modalBtnTextDanger}>Remove</Text>
        </TouchableOpacity>
      </Modal>

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
  actionButtonsRow: { 
    flexDirection: 'row', 
    marginBottom: SPACING.lg,
    gap: SPACING.base,
  },
  searchContainer: { 
    flexDirection: 'row', 
    marginBottom: SPACING.lg 
  },
  searchInput: { 
    flex: 1, 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    borderTopLeftRadius: SIZES.radius.sm, 
    borderBottomLeftRadius: SIZES.radius.sm, 
    paddingHorizontal: SPACING.base, 
    paddingVertical: SPACING.sm, 
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZES.sm,
  },
  searchIconContainer: { 
    width: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: SIZES.border.thin, 
    borderLeftWidth: 0, 
    borderColor: COLORS.border, 
    borderTopRightRadius: SIZES.radius.sm, 
    borderBottomRightRadius: SIZES.radius.sm 
  },
  listControlRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.sm + 2 
  },
  listTitle: { 
    fontSize: FONT_SIZES.base, 
    fontFamily: FONT_FAMILY.bold, 
    color: '#0D253F' 
  },
  filterContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  filterText: { 
    marginHorizontal: SPACING.xs + 1, 
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZES.sm,
  },
  actionBtn: { 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    borderRadius: SIZES.radius.xs, 
    padding: SPACING.xs / 2 
  },
  modalBtnDefault: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.gray[200], 
    paddingVertical: SPACING.sm, 
    paddingHorizontal: SPACING.sm + 4, 
    borderRadius: SIZES.radius.sm, 
    marginBottom: SPACING.sm 
  },
  modalBtnDanger: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.error, 
    paddingVertical: SPACING.sm, 
    paddingHorizontal: SPACING.sm + 4, 
    borderRadius: SIZES.radius.sm 
  },
  modalIcon: { 
    marginRight: SPACING.sm 
  },
  modalBtnTextDefault: { 
    color: COLORS.text, 
    fontFamily: FONT_FAMILY.semiBold, 
    fontSize: FONT_SIZES.sm 
  },
  modalBtnTextDanger: { 
    color: COLORS.white, 
    fontFamily: FONT_FAMILY.semiBold, 
    fontSize: FONT_SIZES.sm 
  },
});