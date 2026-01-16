import {
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
    useFonts
} from "@expo-google-fonts/poppins";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
<<<<<<< HEAD
  Animated,
  Modal,
  Platform,
  ScrollView, // Removed SafeAreaView from here
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
=======
    Animated,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
>>>>>>> 1bd60fb825dc61fe3af3b2b16ecece642974e547
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import GlobalHeader from '../components/GlobalHeader';
import PageTitle from '../components/PageTitle';
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

  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

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
          <TouchableOpacity 
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => setShowNewClient(true)}
          >
            <Ionicons name="add-circle-outline" size={18} color="#FFF" style={{marginRight: 5}}/>
            <Text style={styles.btnTextPrimary}>New client</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.btn, styles.btnOutline]}>
            <Text style={styles.btnTextOutline}>Remove Clients</Text>
          </TouchableOpacity>
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
    backgroundColor: '#F5F7FA',
  },

  contentContainer: { flex: 1, padding: 15, backgroundColor: '#FFF' },
  actionButtonsRow: { flexDirection: 'row', marginBottom: 20 },
  btn: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, alignItems: 'center', marginRight: 15 },
  btnPrimary: { backgroundColor: '#1E3A5F' },
  btnOutline: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FFC0CB' },
  btnTextPrimary: { color: '#FFF', fontWeight: '600' },
  btnTextOutline: { color: '#E05D5D', fontWeight: '600' },
  searchContainer: { flexDirection: 'row', marginBottom: 20 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#CCC', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#FFF' },
  searchIconContainer: { width: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderLeftWidth: 0, borderColor: '#CCC', borderTopRightRadius: 5, borderBottomRightRadius: 5 },
  listControlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#0D253F' },
  filterContainer: { flexDirection: 'row', alignItems: 'center' },
  filterText: { marginHorizontal: 5, color: '#666' },
  dropdownBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CCC', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12 },
  dropdownText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  actionBtn: { borderWidth: 1, borderColor: '#CCC', borderRadius: 4, padding: 2 },
  tableWrapper: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, overflow: 'hidden', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#E6F0F8', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#D1D9E0' },
  columnHeader: { fontSize: 12, fontWeight: 'bold', color: '#4A5568' },
  tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  rowEven: { backgroundColor: '#FFF' },
  rowOdd: { backgroundColor: '#F9FAFB' },
  cellText: { fontSize: 12, color: '#333' },
  customScrollContainer: { paddingHorizontal: 10, paddingTop: 10 },
  scrollTrack: { height: 6, backgroundColor: '#E0E0E0', borderRadius: 4, width: '100%', overflow: 'hidden' },
  scrollThumb: { height: '100%', width: 120, backgroundColor: '#0B1C36', borderRadius: 4 },
  paginationWrapper: { alignItems: 'center', marginTop: 20, marginBottom: 10, gap: 15 },
  entriesContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  showText: { fontSize: 13, color: '#9CA3AF', fontWeight: '400' },
  dropdownWrapperPagination: { position: 'relative' },
  dropdownBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, gap: 6, minWidth: 60, backgroundColor: '#FFF' },
  dropdownMenuAbove: { position: 'absolute', bottom: '100%', left: 0, marginBottom: 5, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, overflow: 'hidden', minWidth: 80, zIndex: 2000 },
  dropdownItemBtn: { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#0B1C36', borderTopWidth: 1, borderTopColor: '#1e3a5f' },
  dropdownItemText: { fontSize: 13, color: '#FFF', fontWeight: '400' },
  pageControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navArrow: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  pageNum: { minWidth: 36, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 6, paddingHorizontal: 8 },
  activePage: { backgroundColor: '#0B1C36' },
  activePageText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  pageText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 180, backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3.84, shadowOffset: { width: 0, height: 2 } },
  modalHeader: { backgroundColor: '#0D253F', paddingVertical: 10, alignItems: 'center' },
  modalTitle: { color: '#FFF', fontSize: 18, fontFamily: "Poppins_300Light" },
  modalBody: { padding: 35 },
  modalBtnDefault: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E7EB', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginBottom: 8 },
  modalBtnDanger: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF4D4D', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  modalIcon: { marginRight: 8 },
  modalBtnTextDefault: { color: '#333', fontWeight: '600', fontSize: 13 },
  modalBtnTextDanger: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  removeModalContent: { width: 320, backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', elevation: 10, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3.84, shadowOffset: { width: 0, height: 2 } },
  removeModalHeader: { backgroundColor: '#0D253F', paddingVertical: 20, alignItems: 'center' },
  removeModalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  removeModalBody: { padding: 25, alignItems: 'center' },
  removeModalText: { textAlign: 'center', fontSize: 15, color: '#333', marginBottom: 25, lineHeight: 22 },
  removeModalButtons: { flexDirection: 'row', justifyContent: 'center', gap: 15 },
  btnCancelRemove: { backgroundColor: '#B0B0B0', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 },
  btnCancelRemoveText: { color: '#000', fontWeight: '600' },
  btnConfirmRemove: { backgroundColor: '#FF5A5F', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  btnConfirmRemoveText: { color: '#FFF', fontWeight: '600' },
});

export default ClientsScreen;