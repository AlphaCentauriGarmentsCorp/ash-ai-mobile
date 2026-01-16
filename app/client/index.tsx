import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePoppinsFonts } from '../../hooks';
import Button from '../components/Button';
import GlobalHeader from '../components/GlobalHeader';
import PageTitle from '../components/PageTitle';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES, SPACING } from '../constants';
import NewClientScreen from './components/new-client';

// Types
interface Client {
  company: string;
  name: string;
  contact: string;
  email: string;
}

const DATA: Client[] = Array(12).fill({
  company: 'NIKE',
  name: 'Morgan Lee',
  contact: '09123456789',
  email: 'morganlee@gmail.com',
});

const ClientsScreen = () => {
  const router = useRouter();
  
  // 2. Get the safe area insets (top, bottom, etc.)
  const insets = useSafeAreaInsets(); 

  const fontsLoaded = usePoppinsFonts();

  const [searchText, setSearchText] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  
  // Scrollbar Logic
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(1);
  const [visibleWidth, setVisibleWidth] = useState(0);
  
  const trackWidth = 350; 
  const thumbWidth = 120; 
  const scrollableWidth = contentWidth - visibleWidth;
  
  const thumbTranslateX = scrollX.interpolate({
    inputRange: [0, scrollableWidth > 0 ? scrollableWidth : 1],
    outputRange: [0, trackWidth - thumbWidth],
    extrapolate: 'clamp',
  });
  
  // --- Modal States ---
  const [modalVisible, setModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  
  // Pagination Helpers
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentClients = DATA.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(DATA.length / entriesPerPage);
  
  const handleEntriesChange = (value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
    setShowEntriesDropdown(false);
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const toggleEntriesDropdown = () => {
    setShowEntriesDropdown(!showEntriesDropdown);
  };

  const handleEditPress = (index: number) => {
    setSelectedClient(index);
    setModalVisible(true);
  };

  if (!fontsLoaded) return null; 
  if (showNewClient) return <NewClientScreen onBack={() => setShowNewClient(false)} />;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0D253F" />

      {/* Global Header with padding for safe area */}
      <View style={{ paddingTop: insets.top }}>
        <GlobalHeader />
      </View>

      {/* Page Title */}
      <PageTitle title="Clients" icon="people-outline" />

      <ScrollView style={styles.contentContainer}>
        {/* Buttons */}
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

        {/* Search */}
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

        {/* List Header */}
        <View style={styles.listControlRow}>
          <Text style={styles.listTitle}>List</Text>
          <View style={styles.filterContainer}>
            <Ionicons name="filter" size={14} color="#666" />
            <Text style={styles.filterText}>Filter:</Text>
            <TouchableOpacity style={styles.dropdownBtn}>
              <Text style={styles.dropdownText}>All Clients</Text>
              <Ionicons name="chevron-down" size={14} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onContentSizeChange={(w, h) => setContentWidth(w)}
            onLayout={(e) => setVisibleWidth(e.nativeEvent.layout.width)}
          >
            <View>
              <View style={styles.tableHeader}>
                <Text style={[styles.columnHeader, { width: 120 }]}>Clothing/Company</Text>
                <Text style={[styles.columnHeader, { width: 120 }]}>Name</Text>
                <Text style={[styles.columnHeader, { width: 130 }]}>Contact No.</Text>
                <Text style={[styles.columnHeader, { width: 180 }]}>Email</Text>
                <Text style={[styles.columnHeader, { width: 60 }]}>Action</Text>
              </View>

              {currentClients.map((item, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                  <Text style={[styles.cellText, { width: 120 }]}>{item.company}</Text>
                  <Text style={[styles.cellText, { width: 120 }]}>{item.name}</Text>
                  <Text style={[styles.cellText, { width: 130 }]}>{item.contact}</Text>
                  <Text style={[styles.cellText, { width: 180 }]} numberOfLines={1}>{item.email}</Text>
                  <View style={{ width: 60, alignItems: 'center' }}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleEditPress(index)}>
                      <Ionicons name="pencil" size={16} color="#1E3A5F" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.customScrollContainer}>
            <View style={styles.scrollTrack}>
              <Animated.View 
                style={[
                  styles.scrollThumb, 
                  { transform: [{ translateX: thumbTranslateX }] }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Pagination */}
        <View style={styles.paginationWrapper}>
          <View style={styles.entriesContainer}>
            <Text style={styles.showText}>Show</Text>
            <View style={styles.dropdownWrapperPagination}>
              <TouchableOpacity style={styles.dropdownBox} onPress={toggleEntriesDropdown}>
                <Text style={styles.dropdownText}>{entriesPerPage === 9999 ? 'All' : entriesPerPage}</Text>
                <Ionicons name="chevron-down" size={12} color="#999" />
              </TouchableOpacity>
              {showEntriesDropdown && (
                <View style={styles.dropdownMenuAbove}>
                   <TouchableOpacity style={styles.dropdownItemBtn} onPress={() => handleEntriesChange(5)}><Text style={styles.dropdownItemText}>5</Text></TouchableOpacity>
                   <TouchableOpacity style={styles.dropdownItemBtn} onPress={() => handleEntriesChange(10)}><Text style={styles.dropdownItemText}>10</Text></TouchableOpacity>
                   <TouchableOpacity style={styles.dropdownItemBtn} onPress={() => handleEntriesChange(15)}><Text style={styles.dropdownItemText}>15</Text></TouchableOpacity>
                   <TouchableOpacity style={styles.dropdownItemBtn} onPress={() => handleEntriesChange(9999)}><Text style={styles.dropdownItemText}>All</Text></TouchableOpacity>
                </View>
              )}
            </View>
            <Text style={styles.showText}>entries</Text>
          </View>
          
          {entriesPerPage !== 9999 && (
            <View style={styles.pageControls}>
               <TouchableOpacity style={styles.navArrow} onPress={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><Ionicons name="chevron-back" size={18} color={currentPage === 1 ? "#ccc" : "#999"} /></TouchableOpacity>
               <TouchableOpacity style={[styles.pageNum, styles.activePage]}><Text style={styles.activePageText}>{currentPage}</Text></TouchableOpacity>
               <TouchableOpacity style={styles.navArrow} onPress={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><Ionicons name="chevron-forward" size={18} color={currentPage === totalPages ? "#ccc" : "#999"} /></TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={{height: insets.bottom + 40}} />
      </ScrollView>

      {/* --- ACTIONS MODAL --- */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Actions</Text></View>
            <View style={styles.modalBody}>
              <TouchableOpacity style={styles.modalBtnDefault} onPress={() => {
                setModalVisible(false);
                if (selectedClient !== null) router.push({ pathname: "/client/components/edit-client", params: DATA[selectedClient] });
              }}>
                <Ionicons name="pencil" size={20} color="#0D253F" style={styles.modalIcon} />
                <Text style={styles.modalBtnTextDefault}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalBtnDefault} onPress={() => {
                if (selectedClient !== null) {
                    setModalVisible(false);
                    router.push({ pathname: "/client/components/view-client", params: DATA[selectedClient] });
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
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- CONFIRMATION MODAL --- */}
      <Modal animationType="fade" transparent={true} visible={removeModalVisible} onRequestClose={() => setRemoveModalVisible(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.removeModalContent}>
                <View style={styles.removeModalHeader}><Text style={styles.removeModalTitle}>Remove Client?</Text></View>
                <View style={styles.removeModalBody}>
                    <Text style={styles.removeModalText}>Are you sure you want to remove <Text style={{fontWeight:'bold', color: '#000'}}>{selectedClient !== null ? DATA[selectedClient].name : 'this client'}</Text>? This action cannot be undone.</Text>
                    <View style={styles.removeModalButtons}>
                        <TouchableOpacity style={styles.btnCancelRemove} onPress={() => setRemoveModalVisible(false)}><Text style={styles.btnCancelRemoveText}>Cancel</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.btnConfirmRemove} onPress={() => { console.log("Deleted"); setRemoveModalVisible(false); }}><Text style={styles.btnConfirmRemoveText}>Remove Client</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
      </Modal>

    </View>
  );
};

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
  dropdownBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    borderRadius: SIZES.radius.full, 
    paddingVertical: SPACING.xs + 1, 
    paddingHorizontal: SPACING.sm + 4 
  },
  dropdownText: { 
    fontSize: FONT_SIZES.sm, 
    color: COLORS.text, 
    fontFamily: FONT_FAMILY.medium 
  },
  actionBtn: { 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    borderRadius: SIZES.radius.xs, 
    padding: SPACING.xs / 2 
  },
  tableWrapper: { 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    borderRadius: SIZES.radius.base, 
    overflow: 'hidden', 
    marginBottom: SPACING.lg 
  },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#E6F0F8', 
    paddingVertical: SPACING.sm + 4, 
    paddingHorizontal: SPACING.sm + 2, 
    borderBottomWidth: SIZES.border.thin, 
    borderBottomColor: COLORS.divider 
  },
  columnHeader: { 
    fontSize: FONT_SIZES.xs, 
    fontFamily: FONT_FAMILY.bold, 
    color: COLORS.textSecondary 
  },
  tableRow: { 
    flexDirection: 'row', 
    paddingVertical: SPACING.sm + 4, 
    paddingHorizontal: SPACING.sm + 2, 
    borderBottomWidth: SIZES.border.thin, 
    borderBottomColor: COLORS.borderLight, 
    alignItems: 'center' 
  },
  rowEven: { backgroundColor: COLORS.white },
  rowOdd: { backgroundColor: COLORS.surface },
  cellText: { 
    fontSize: FONT_SIZES.xs, 
    color: COLORS.text,
    fontFamily: FONT_FAMILY.regular,
  },
  customScrollContainer: { 
    paddingHorizontal: SPACING.sm + 2, 
    paddingTop: SPACING.sm + 2 
  },
  scrollTrack: { 
    height: 6, 
    backgroundColor: COLORS.border, 
    borderRadius: SIZES.radius.xs, 
    width: '100%', 
    overflow: 'hidden' 
  },
  scrollThumb: { 
    height: '100%', 
    width: 120, 
    backgroundColor: '#0B1C36', 
    borderRadius: SIZES.radius.xs 
  },
  paginationWrapper: { 
    alignItems: 'center', 
    marginTop: SPACING.lg, 
    marginBottom: SPACING.sm + 2, 
    gap: SPACING.base 
  },
  entriesContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.sm 
  },
  showText: { 
    fontSize: FONT_SIZES.sm, 
    color: COLORS.textSecondary, 
    fontFamily: FONT_FAMILY.regular 
  },
  dropdownWrapperPagination: { position: 'relative' },
  dropdownBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    paddingHorizontal: SPACING.sm + 4, 
    paddingVertical: SPACING.xs + 2, 
    borderRadius: SIZES.radius.sm, 
    gap: SPACING.xs + 2, 
    minWidth: 60, 
    backgroundColor: COLORS.white 
  },
  dropdownMenuAbove: { 
    position: 'absolute', 
    bottom: '100%', 
    left: 0, 
    marginBottom: SPACING.xs + 1, 
    backgroundColor: COLORS.white, 
    borderRadius: SIZES.radius.base, 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    ...SIZES.shadow.md,
    overflow: 'hidden', 
    minWidth: 80, 
    zIndex: 2000 
  },
  dropdownItemBtn: { 
    paddingVertical: SPACING.sm + 2, 
    paddingHorizontal: SPACING.sm + 4, 
    backgroundColor: '#0B1C36', 
    borderTopWidth: SIZES.border.thin, 
    borderTopColor: '#1e3a5f' 
  },
  dropdownItemText: { 
    fontSize: FONT_SIZES.sm, 
    color: COLORS.white, 
    fontFamily: FONT_FAMILY.regular 
  },
  pageControls: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.sm 
  },
  navArrow: { 
    width: SIZES.icon.lg, 
    height: SIZES.icon.lg, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: SIZES.radius.xs 
  },
  pageNum: { 
    minWidth: 36, 
    height: 36, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: SIZES.radius.sm, 
    paddingHorizontal: SPACING.sm 
  },
  activePage: { backgroundColor: '#0B1C36' },
  activePageText: { 
    color: COLORS.white, 
    fontSize: FONT_SIZES.sm, 
    fontFamily: FONT_FAMILY.semiBold 
  },
  pageText: { 
    fontSize: FONT_SIZES.sm, 
    color: COLORS.textSecondary, 
    fontFamily: FONT_FAMILY.medium 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: COLORS.overlay, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: 180, 
    backgroundColor: COLORS.white, 
    borderRadius: SIZES.radius.md, 
    overflow: 'hidden', 
    ...SIZES.shadow.md,
  },
  modalHeader: { 
    backgroundColor: '#0D253F', 
    paddingVertical: SPACING.sm + 2, 
    alignItems: 'center' 
  },
  modalTitle: { 
    color: COLORS.white, 
    fontSize: FONT_SIZES.lg, 
    fontFamily: FONT_FAMILY.light 
  },
  modalBody: { 
    padding: SPACING['2xl'] - 5 
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
  removeModalContent: { 
    width: 320, 
    backgroundColor: COLORS.white, 
    borderRadius: SIZES.radius.md, 
    overflow: 'hidden', 
    ...SIZES.shadow.lg,
  },
  removeModalHeader: { 
    backgroundColor: '#0D253F', 
    paddingVertical: SPACING.lg, 
    alignItems: 'center' 
  },
  removeModalTitle: { 
    color: COLORS.white, 
    fontSize: FONT_SIZES.xl, 
    fontFamily: FONT_FAMILY.bold 
  },
  removeModalBody: { 
    padding: SPACING.xl - 7, 
    alignItems: 'center' 
  },
  removeModalText: { 
    textAlign: 'center', 
    fontSize: FONT_SIZES.base, 
    color: COLORS.text, 
    marginBottom: SPACING.xl - 7, 
    lineHeight: 22,
    fontFamily: FONT_FAMILY.regular,
  },
  removeModalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: SPACING.base 
  },
  btnCancelRemove: { 
    backgroundColor: COLORS.gray[400], 
    paddingVertical: SPACING.sm + 2, 
    paddingHorizontal: SPACING.xl - 7, 
    borderRadius: SIZES.radius.base 
  },
  btnCancelRemoveText: { 
    color: COLORS.black, 
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZES.sm,
  },
  btnConfirmRemove: { 
    backgroundColor: COLORS.error, 
    paddingVertical: SPACING.sm + 2, 
    paddingHorizontal: SPACING.lg, 
    borderRadius: SIZES.radius.base 
  },
  btnConfirmRemoveText: { 
    color: COLORS.white, 
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZES.sm,
  },
});

export default ClientsScreen;