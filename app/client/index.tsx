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
    Animated,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Sidebar from '../sidebar';
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
  
  // 1. Move font loading inside the main component
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
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  
  // Scrollbar Logic
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(1);
  const [visibleWidth, setVisibleWidth] = useState(0);
  
  // Calculate scrollbar thumb position
  const trackWidth = 350; // Approximate track width
  const thumbWidth = 120; // Fixed thumb width
  const scrollableWidth = contentWidth - visibleWidth;
  
  const thumbTranslateX = scrollX.interpolate({
    inputRange: [0, scrollableWidth > 0 ? scrollableWidth : 1],
    outputRange: [0, trackWidth - thumbWidth],
    extrapolate: 'clamp',
  });
  
  // --- Modal State ---
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  
  // Calculate pagination
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

  // Optional: Return null or a loader until fonts are ready
  if (!fontsLoaded) {
    return null; 
  }
  
  // Show NewClientScreen if state is true
  if (showNewClient) {
    return <NewClientScreen onBack={() => setShowNewClient(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0D253F" />

      {/* --- Top Header --- */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="list" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      <ScrollView style={styles.contentContainer}>
        {/* Title */}
        <View style={styles.pageTitleRow}>
          <View style={styles.circleIcon}>
            <Ionicons name="people" size={16} color="#0D253F" />
          </View>
          <Text style={styles.pageTitle}>Clients</Text>
        </View>

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
              {/* Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.columnHeader, { width: 120 }]}>Clothing/Company</Text>
                <Text style={[styles.columnHeader, { width: 120 }]}>Name</Text>
                <Text style={[styles.columnHeader, { width: 130 }]}>Contact No.</Text>
                <Text style={[styles.columnHeader, { width: 180 }]}>Email</Text>
                <Text style={[styles.columnHeader, { width: 60 }]}>Action</Text>
              </View>

              {/* Rows */}
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
          
          {/* Animated Scrollbar */}
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
          {/* Top: Show entries */}
          <View style={styles.entriesContainer}>
            <Text style={styles.showText}>Show</Text>
            <View style={styles.dropdownWrapperPagination}>
              <TouchableOpacity 
                style={styles.dropdownBox}
                onPress={toggleEntriesDropdown}
              >
                <Text style={styles.dropdownText}>{entriesPerPage === 9999 ? 'All' : entriesPerPage}</Text>
                <Ionicons name="chevron-down" size={12} color="#999" />
              </TouchableOpacity>
              {showEntriesDropdown && (
                <View style={styles.dropdownMenuAbove}>
                  <TouchableOpacity 
                    style={styles.dropdownItemBtn}
                    onPress={() => handleEntriesChange(5)}
                  >
                    <Text style={styles.dropdownItemText}>5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dropdownItemBtn}
                    onPress={() => handleEntriesChange(10)}
                  >
                    <Text style={styles.dropdownItemText}>10</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dropdownItemBtn}
                    onPress={() => handleEntriesChange(15)}
                  >
                    <Text style={styles.dropdownItemText}>15</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dropdownItemBtn}
                    onPress={() => handleEntriesChange(20)}
                  >
                    <Text style={styles.dropdownItemText}>20</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dropdownItemBtn}
                    onPress={() => handleEntriesChange(9999)}
                  >
                    <Text style={styles.dropdownItemText}>All</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Text style={styles.showText}>entries</Text>
          </View>
          
          {/* Bottom: Pagination Controls */}
          {entriesPerPage !== 9999 && (
            <View style={styles.pageControls}>
              <TouchableOpacity 
                style={styles.navArrow}
                onPress={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Ionicons name="chevron-back" size={18} color={currentPage === 1 ? "#ccc" : "#999"} />
              </TouchableOpacity>
              
              {currentPage > 1 && (
                <TouchableOpacity 
                  style={styles.pageNum}
                  onPress={() => handlePageChange(1)}
                >
                  <Text style={styles.pageText}>1</Text>
                </TouchableOpacity>
              )}
              
              {currentPage > 2 && <Text style={styles.pageText}>...</Text>}
              
              <TouchableOpacity style={[styles.pageNum, styles.activePage]}>
                <Text style={styles.activePageText}>{currentPage}</Text>
              </TouchableOpacity>
              
              {currentPage < totalPages - 1 && <Text style={styles.pageText}>...</Text>}
              
              {currentPage < totalPages && (
                <TouchableOpacity 
                  style={styles.pageNum}
                  onPress={() => handlePageChange(totalPages)}
                >
                  <Text style={styles.pageText}>Last</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.navArrow}
                onPress={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Ionicons name="chevron-forward" size={18} color={currentPage === totalPages ? "#ccc" : "#999"} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Spacing for bottom */}
        <View style={{height: 40}} />
      </ScrollView>

      {/* --- ACTIONS MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Actions</Text>
            </View>

            {/* Modal Body */}
            <View style={styles.modalBody}>
              
              {/* Edit Button */}
              <TouchableOpacity style={styles.modalBtnDefault} onPress={() => {
                setModalVisible(false);
                // Add navigation logic here if needed
              }}>
                <Ionicons name="pencil" size={20} color="#0D253F" style={styles.modalIcon} />
                <Text style={styles.modalBtnTextDefault}>Edit</Text>
              </TouchableOpacity>

              {/* View Button */}
              <TouchableOpacity style={styles.modalBtnDefault}>
                <Ionicons name="eye" size={20} color="#0D253F" style={styles.modalIcon} />
                <Text style={styles.modalBtnTextDefault}>View</Text>
              </TouchableOpacity>

              {/* Remove Button */}
              <TouchableOpacity style={styles.modalBtnDanger}>
                <Ionicons name="trash" size={20} color="#FFF" style={styles.modalIcon} />
                <Text style={styles.modalBtnTextDanger}>Remove</Text>
              </TouchableOpacity>

            </View>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  topHeader: {
    height: 60 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    backgroundColor: '#0D253F',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerIcons: { flexDirection: 'row' },
  iconBtn: {
    marginLeft: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 5,
  },
  contentContainer: { flex: 1, padding: 15, backgroundColor: '#FFF' },
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  circleIcon: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#0D253F',
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  pageTitle: { fontSize: 18, fontWeight: 'bold', color: '#0D253F' },
  actionButtonsRow: { flexDirection: 'row', marginBottom: 20 },
  btn: {
    flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 20, alignItems: 'center', marginRight: 15,
  },
  btnPrimary: { backgroundColor: '#1E3A5F' },
  btnOutline: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FFC0CB' },
  btnTextPrimary: { color: '#FFF', fontWeight: '600' },
  btnTextOutline: { color: '#E05D5D', fontWeight: '600' },
  searchContainer: { flexDirection: 'row', marginBottom: 20 },
  searchInput: {
    flex: 1, borderWidth: 1, borderColor: '#CCC', borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5, paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#FFF',
  },
  searchIconContainer: {
    width: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 1,
    borderLeftWidth: 0, borderColor: '#CCC', borderTopRightRadius: 5, borderBottomRightRadius: 5,
  },
  listControlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#0D253F' },
  filterContainer: { flexDirection: 'row', alignItems: 'center' },
  filterText: { marginHorizontal: 5, color: '#666' },
  dropdownBtn: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CCC',
    borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12,
  },
  actionBtn: { borderWidth: 1, borderColor: '#CCC', borderRadius: 4, padding: 2 },

  // --- NEW SLIM MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 180,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowOffset: { width: 0, height: 2 },
  },
  modalHeader: {
    backgroundColor: '#0D253F',
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: "Poppins_300Light",
    
  },
  modalBody: {
    padding: 35,
  },
  modalBtnDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  modalBtnDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4D4D',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  modalIcon: {
    marginRight: 8,
  },
  modalBtnTextDefault: {
    color: '#333',
    fontWeight: '600',
    fontSize: 13,
  },
  modalBtnTextDanger: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  
  // New Table Styles
  tableWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E6F0F8',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D9E0',
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  rowEven: {
    backgroundColor: '#FFF',
  },
  rowOdd: {
    backgroundColor: '#F9FAFB',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
  },
  
  // Scrollbar
  customScrollContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  scrollTrack: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  scrollThumb: {
    height: '100%',
    width: 120,
    backgroundColor: '#0B1C36',
    borderRadius: 4,
  },
  
  // Pagination Styles
  paginationWrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    gap: 15,
  },
  entriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  showText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  dropdownWrapperPagination: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
    minWidth: 60,
    backgroundColor: '#FFF',
  },
  dropdownText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  dropdownMenuAbove: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    marginBottom: 5,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    minWidth: 80,
    zIndex: 2000,
  },
  dropdownItemBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#0B1C36',
    borderTopWidth: 1,
    borderTopColor: '#1e3a5f',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#FFF',
    fontWeight: '400',
  },
  pageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navArrow: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  pageNum: {
    minWidth: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  activePage: {
    backgroundColor: '#0B1C36',
  },
  activePageText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  pageText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default ClientsScreen;