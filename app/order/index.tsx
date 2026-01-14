import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated // Import Animated
  ,







































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
import { hp, ms, rfs, wp } from "../../utils/responsive";
import Sidebar from '../sidebar';

// --- Static Mock Data ---
const allOrders = Array.from({ length: 30 }).map((_, i) => {
  const types = ['Repeat', 'New', 'Rush', 'Custom'];
  const priorities = ['High', 'Medium', 'Low'];
  const clothings = ['Adidas', 'Nike', 'Puma', 'Reebok', 'Under Armour'];
  const designs = ['The Reefer', 'Classic Logo', 'Modern Stripe', 'Vintage Style', 'Bold Print'];
  const statuses = ['In Production', 'Pending Approval', 'Confirmed', 'Draft'];
  const colors = ['#F58220', '#000'];
  
  return {
    id: (i + 1).toString(),
    poNumber: `ORD-2025-${825830 + i}`,
    type: types[i % types.length],
    priority: priorities[i % priorities.length],
    clothing: clothings[i % clothings.length],
    designName: designs[i % designs.length],
    status: statuses[i % statuses.length],
    color: colors[i % colors.length]
  };
});

export default function OrderPage() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Dropdown states
  const [showOrdersDropdown, setShowOrdersDropdown] = useState(false);
  const [showTasksDropdown, setShowTasksDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState('All Orders');
  const [selectedTask, setSelectedTask] = useState('All tasks');
  const [selectedPriority, setSelectedPriority] = useState('Priority');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  // Close all dropdowns
  const closeAllDropdowns = () => {
    setShowOrdersDropdown(false);
    setShowTasksDropdown(false);
    setShowPriorityDropdown(false);
    setShowEntriesDropdown(false);
  };
  
  // Toggle dropdown handlers
  const toggleOrdersDropdown = () => {
    setShowOrdersDropdown(!showOrdersDropdown);
    setShowTasksDropdown(false);
    setShowPriorityDropdown(false);
  };
  
  const toggleTasksDropdown = () => {
    setShowTasksDropdown(!showTasksDropdown);
    setShowOrdersDropdown(false);
    setShowPriorityDropdown(false);
  };
  
  const togglePriorityDropdown = () => {
    setShowPriorityDropdown(!showPriorityDropdown);
    setShowOrdersDropdown(false);
    setShowTasksDropdown(false);
  };
  
  const toggleEntriesDropdown = () => {
    setShowEntriesDropdown(!showEntriesDropdown);
  };
  
  // Filter orders based on selections
  const filteredOrders = allOrders.filter(order => {
    // Filter by order type (Sorbetes/Reefer based on color)
    if (selectedOrder !== 'All Orders') {
      const isSorbetes = order.color === '#000';
      const isReefer = order.color === '#F58220';
      if (selectedOrder === 'Sorbetes' && !isSorbetes) return false;
      if (selectedOrder === 'Reefer' && !isReefer) return false;
    }
    
    // Filter by task/status
    if (selectedTask !== 'All tasks') {
      if (order.status !== selectedTask) return false;
    }
    
    // Filter by priority
    if (selectedPriority !== 'Priority' && selectedPriority !== 'All priority') {
      if (order.priority !== selectedPriority) return false;
    }
    
    return true;
  });
  
  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
  
  const handleEntriesChange = (value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1); // Reset to first page
    setShowEntriesDropdown(false);
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleRefresh = () => {
    // Reset all filters to default
    setSelectedOrder('All Orders');
    setSelectedTask('All tasks');
    setSelectedPriority('Priority');
    
    // Reset pagination
    setCurrentPage(1);
    setEntriesPerPage(10);
    
    // Close all dropdowns
    setShowOrdersDropdown(false);
    setShowTasksDropdown(false);
    setShowPriorityDropdown(false);
    setShowEntriesDropdown(false);
  };

  // --- Scrollbar Logic ---
  const scrollX = useRef(new Animated.Value(0)).current; // Track scroll position
  const [contentWidth, setContentWidth] = useState(1);   // Total width of table
  const [visibleWidth, setVisibleWidth] = useState(0);   // Visible screen width

  // Calculate Thumb Position
  // We want the thumb to move from 0 to (trackWidth - thumbWidth)
  // based on how much we've scrolled (scrollX) relative to the total scrollable area.
  
  // Define dimensions for calculation
  const trackWidth = wp(91.4); // Approx width of the track (container padding)
  const thumbWidth = wp(30);   // Fixed width of the blue thumb
  const scrollableWidth = contentWidth - visibleWidth; // How much we can actually scroll
  
  // Interpolate scrollX to translateX
  const thumbTranslateX = scrollX.interpolate({
    inputRange: [0, scrollableWidth > 0 ? scrollableWidth : 1],
    outputRange: [0, trackWidth - thumbWidth],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0B1C36" />

      {/* --- Top Dark Header --- */}
      <SafeAreaView style={styles.topSafeArea}>
        <View style={styles.topHeaderBar}>
           <TouchableOpacity onPress={() => setSidebarVisible(true)}>
             <Ionicons name="menu" size={ms(28)} color="#FFF" />
           </TouchableOpacity>
           <View style={{flex:1}} /> 
           <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.headerIconBtn}>
                 <Ionicons name="list" size={ms(20)} color="#0B1C36" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtnTransparent}>
                 <Ionicons name="notifications" size={ms(24)} color="#FFF" />
              </TouchableOpacity>
           </View>
        </View>
      </SafeAreaView>

      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      {/* --- Main Content --- */}
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          {/* Title Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <View style={styles.leftTitleSection}>
                <View style={styles.iconCircle}>
                    <Ionicons name="people-outline" size={ms(20)} color="#0B1C36" />
                </View>
                <Text style={styles.headerTitle}>Clients</Text>
              </View>
              <Text style={styles.breadcrumb}>Daily Operations / Orders</Text>
            </View>
            {/* Divider Line */}
            <View style={styles.divider} />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/order/add-order')}
            >
              <Ionicons name="add" size={ms(18)} color="#FFF" />
              <Text style={styles.primaryButtonText}>New Order</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleRefresh}
            >
              <Ionicons name="refresh" size={ms(16)} color="#0B1C36" />
              <Text style={styles.secondaryButtonText}>Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <MaterialIcons name="history" size={ms(16)} color="#0B1C36" />
              <Text style={styles.secondaryButtonText}>Order History</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search by client name, brand..." 
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.searchIcon}>
              <Ionicons name="search" size={ms(20)} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Filters & Legends */}
          <View style={styles.filterRow}>
            <View style={styles.legendContainer}>
              <Text style={styles.legendLabel}>Legends:</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Reefer</Text>
                <View style={[styles.dot, { backgroundColor: '#F58220' }]} />
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Sorbetes</Text>
                <View style={[styles.dot, { backgroundColor: '#000' }]} />
              </View>
            </View>
            
            {/* Filter Dropdowns */}
            <View style={styles.filterDropdowns}>
              {/* 1. All Orders */}
              <TouchableOpacity 
                style={styles.filterBtn}
                onPress={toggleOrdersDropdown}
              >
                <Ionicons name="filter" size={ms(12)} color="#333" />
                <Text style={styles.filterBtnText}>{selectedOrder}</Text>
                <Ionicons name="chevron-down" size={ms(12)} color="#333" />
              </TouchableOpacity>
              
              {/* 2. All Tasks */}
              <TouchableOpacity 
                style={styles.filterBtn}
                onPress={toggleTasksDropdown}
              >
                <Text style={styles.filterBtnText}>{selectedTask}</Text>
                <Ionicons name="chevron-down" size={ms(12)} color="#333" />
              </TouchableOpacity>

              {/* 3. Priority */}
              <TouchableOpacity 
                style={styles.filterBtn}
                onPress={togglePriorityDropdown}
              >
                <Text style={styles.filterBtnText}>{selectedPriority}</Text>
                <Ionicons name="chevron-down" size={ms(12)} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Dropdown Menus - Rendered separately below filters */}
          {showOrdersDropdown && (
            <View style={styles.dropdownMenuContainer}>
              <TouchableOpacity 
                style={styles.dropdownHeaderBtn}
                onPress={() => {
                  setSelectedOrder('All Orders');
                  setShowOrdersDropdown(false);
                }}
              >
                <Text style={styles.dropdownHeaderText}>All Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dropdownItemBtn}
                onPress={() => {
                  setSelectedOrder('Sorbetes');
                  setShowOrdersDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Sorbetes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dropdownItemBtn}
                onPress={() => {
                  setSelectedOrder('Reefer');
                  setShowOrdersDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Reefer</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {showTasksDropdown && (
            <View style={styles.dropdownMenuContainer}>
              <TouchableOpacity 
                style={styles.dropdownHeaderBtn}
                onPress={() => {
                  setSelectedTask('All tasks');
                  setShowTasksDropdown(false);
                }}
              >
                <Text style={styles.dropdownHeaderText}>All tasks</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dropdownItemBtn}
                onPress={() => {
                  setSelectedTask('Pending Approval');
                  setShowTasksDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Pending Approval</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dropdownItemBtn}
                onPress={() => {
                  setSelectedTask('In production');
                  setShowTasksDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>In production</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dropdownItemBtn}
                onPress={() => {
                  setSelectedTask('Confirmed');
                  setShowTasksDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Confirmed</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dropdownItemBtn}
                onPress={() => {
                  setSelectedTask('Draft');
                  setShowTasksDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Draft</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {showPriorityDropdown && (
            <View style={styles.dropdownMenuContainer}>
              <TouchableOpacity 
                style={styles.dropdownHeaderBtn}
                onPress={() => {
                  setSelectedPriority('All priority');
                  setShowPriorityDropdown(false);
                }}
              >
                <Text style={styles.dropdownHeaderText}>All priority</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dropdownItemBtn}
                onPress={() => {
                  setSelectedPriority('High');
                  setShowPriorityDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>High</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dropdownItemBtn}
                onPress={() => {
                  setSelectedPriority('Medium');
                  setShowPriorityDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dropdownItemBtn}
                onPress={() => {
                  setSelectedPriority('Low');
                  setShowPriorityDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Low</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Data Table with Animated Scrollbar */}
          <View style={styles.tableContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false } // layout animation needs false usually for scroll sync
              )}
              scrollEventThrottle={16} // smooth updates
              onContentSizeChange={(w, h) => setContentWidth(w)}
              onLayout={(e) => setVisibleWidth(e.nativeEvent.layout.width)}
            >
              <View>
                {/* Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.columnHeader, { width: wp(35) }]}>P.O #</Text>
                  <Text style={[styles.columnHeader, { width: wp(19) }]}>Type</Text>
                  <Text style={[styles.columnHeader, { width: wp(19) }]}>Priority</Text>
                  <Text style={[styles.columnHeader, { width: wp(24) }]}>Clothing</Text>
                  <Text style={[styles.columnHeader, { width: wp(30) }]}>Design Name</Text>
                  <Text style={[styles.columnHeader, { width: wp(27) }]}>Status</Text>
                </View>

                {/* Rows */}
                {currentOrders.map((item, index) => (
                  <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                    <View style={{ width: wp(35), flexDirection: 'row', alignItems: 'center' }}>
                      <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                      <Text style={styles.cellText}>{item.poNumber}</Text>
                    </View>
                    <Text style={[styles.cellText, { width: wp(19) }]}>{item.type}</Text>
                    <Text style={[styles.cellText, { width: wp(19) }]}>{item.priority}</Text>
                    <Text style={[styles.cellText, { width: wp(24) }]}>{item.clothing}</Text>
                    <Text style={[styles.cellText, { width: wp(30) }]}>{item.designName}</Text>
                    <Text style={[styles.cellText, { width: wp(27) }]}>{item.status}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            
            {/* Animated Scrollbar Track */}
            <View style={styles.customScrollContainer}>
                <View style={styles.scrollTrack}>
                    <Animated.View 
                      style={[
                        styles.scrollThumb, 
                        { transform: [{ translateX: thumbTranslateX }] } // Bind animation
                      ]} 
                    />
                </View>
            </View>
          </View>

          {/* Pagination Fixed Alignment */}
          <View style={styles.paginationWrapper}>
            {/* Top: Show all entries */}
            <View style={styles.entriesContainer}>
                <Text style={styles.showText}>Show</Text>
                <View style={styles.dropdownWrapper}>
                  <TouchableOpacity 
                    style={styles.dropdownBox}
                    onPress={toggleEntriesDropdown}
                  >
                      <Text style={styles.dropdownText}>{entriesPerPage === 9999 ? 'All' : entriesPerPage}</Text>
                      <Ionicons name="chevron-down" size={ms(12)} color="#999" />
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
                        onPress={() => handleEntriesChange(30)}
                      >
                        <Text style={styles.dropdownItemText}>30</Text>
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
            
            {/* Bottom: Pagination Controls - Hide when showing all entries */}
            {entriesPerPage !== 9999 && (
              <View style={styles.pageControls}>
                <TouchableOpacity 
                  style={styles.navArrow}
                  onPress={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Ionicons name="chevron-back" size={ms(18)} color={currentPage === 1 ? "#ccc" : "#999"} />
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
                  <Ionicons name="chevron-forward" size={ms(18)} color={currentPage === totalPages ? "#ccc" : "#999"} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={{ height: hp(5) }} /> 
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main Container
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#0B1C36' 
  },
  
  // Top Header
  topSafeArea: { 
    backgroundColor: '#0B1C36', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  topHeaderBar: { 
    height: hp(6.2), 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: wp(4.3), 
    backgroundColor: '#0B1C36' 
  },
  headerIcons: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: wp(3.2) 
  },
  headerIconBtn: { 
    width: ms(32), 
    height: ms(32), 
    backgroundColor: '#FFF', 
    borderRadius: ms(16), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerIconBtnTransparent: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  
  // Content
  contentContainer: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  scrollView: { 
    flex: 1, 
    paddingHorizontal: wp(4.3), 
    paddingTop: hp(2) 
  },
  
  // Header Section
  headerSection: { 
    marginBottom: hp(2.5) 
  },
  titleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: hp(1.5) 
  },
  leftTitleSection: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconCircle: { 
    width: ms(32), 
    height: ms(32), 
    borderRadius: ms(16), 
    borderWidth: 1, 
    borderColor: '#0B1C36', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: wp(2.1) 
  },
  headerTitle: { 
    fontSize: rfs(20), 
    fontWeight: 'bold', 
    color: '#0B1C36' 
  },
  breadcrumb: { 
    fontSize: rfs(12), 
    color: '#666' 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#E0E0E0', 
    marginTop: hp(1.5) 
  },
  
  // Action Buttons
  actionRow: { 
    flexDirection: 'row', 
    marginBottom: hp(2), 
    gap: wp(2.1) 
  },
  primaryButton: { 
    flexDirection: 'row', 
    backgroundColor: '#0B1C36', 
    paddingVertical: hp(1.2), 
    paddingHorizontal: wp(4.3), 
    borderRadius: ms(20), 
    alignItems: 'center' 
  },
  primaryButtonText: { 
    color: '#FFF', 
    fontWeight: '600', 
    fontSize: rfs(12), 
    marginLeft: wp(1.1) 
  },
  secondaryButton: { 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: '#0B1C36', 
    paddingVertical: hp(1.2), 
    paddingHorizontal: wp(3.2), 
    borderRadius: ms(20), 
    alignItems: 'center' 
  },
  secondaryButtonText: { 
    color: '#0B1C36', 
    fontWeight: '600', 
    fontSize: rfs(12), 
    marginLeft: wp(1.1) 
  },
  
  // Search
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: ms(8), 
    paddingHorizontal: wp(3.2), 
    height: hp(5.4), 
    marginBottom: hp(2) 
  },
  searchInput: { 
    flex: 1, 
    fontSize: rfs(14), 
    color: '#333' 
  },
  searchIcon: { 
    marginLeft: wp(2.1) 
  },
  
  // Filters
  filterRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: hp(1.5), 
    flexWrap: 'wrap', 
    gap: wp(2.1),
    zIndex: 100
  },
  legendContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  legendLabel: { 
    fontSize: rfs(12), 
    color: '#666', 
    marginRight: wp(2.1) 
  },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: ms(16), 
    paddingHorizontal: wp(2.1), 
    paddingVertical: hp(0.5), 
    marginRight: wp(1.6) 
  },
  badgeText: { 
    fontSize: rfs(10), 
    color: '#333', 
    marginRight: wp(1.1) 
  },
  dot: { 
    width: ms(8), 
    height: ms(8), 
    borderRadius: ms(4) 
  },
  filterDropdowns: { 
    flexDirection: 'row', 
    gap: wp(2),
    zIndex: 100
  },
  filterBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: ms(6), 
    paddingHorizontal: wp(2.1), 
    paddingVertical: hp(0.6),
    backgroundColor: '#FFF'
  },
  filterBtnText: { 
    fontSize: rfs(10), 
    color: '#333', 
    marginHorizontal: wp(1.1) 
  },

  // Table
  tableContainer: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: ms(8), 
    overflow: 'hidden', 
    paddingBottom: hp(1) 
  },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#E6F0F8', 
    paddingVertical: hp(1.5), 
    paddingHorizontal: wp(2.1), 
    borderBottomWidth: 1, 
    borderBottomColor: '#D1D9E0' 
  },
  columnHeader: { 
    fontSize: rfs(12), 
    fontWeight: 'bold', 
    color: '#4A5568' 
  },
  tableRow: { 
    flexDirection: 'row', 
    paddingVertical: hp(1.5), 
    paddingHorizontal: wp(2.1), 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0', 
    alignItems: 'center' 
  },
  rowEven: { 
    backgroundColor: '#FFF' 
  },
  rowOdd: { 
    backgroundColor: '#F9FAFB' 
  },
  cellText: { 
    fontSize: rfs(12), 
    color: '#333' 
  },
  statusDot: { 
    width: ms(8), 
    height: ms(8), 
    borderRadius: ms(4), 
    marginRight: wp(2.1) 
  },
  
  // Scrollbar
  customScrollContainer: { 
    paddingHorizontal: wp(2.1), 
    paddingTop: hp(1) 
  },
  scrollTrack: { 
    height: hp(0.6), 
    backgroundColor: '#E0E0E0', 
    borderRadius: ms(4), 
    width: '100%', 
    overflow: 'hidden' 
  },
  scrollThumb: { 
    height: '100%', 
    width: wp(30), 
    backgroundColor: '#0B1C36', 
    borderRadius: ms(4) 
  },

  // Pagination
  paginationWrapper: { 
    alignItems: 'center', 
    marginTop: hp(2.5),
    marginBottom: hp(1),
    gap: hp(1.5)
  },
  entriesContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: wp(2)
  },
  showText: { 
    fontSize: rfs(13), 
    color: '#9CA3AF',
    fontWeight: '400'
  },
  dropdownBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    paddingHorizontal: wp(3), 
    paddingVertical: hp(0.6), 
    borderRadius: ms(6),
    gap: wp(1.5),
    minWidth: wp(16)
  },
  dropdownText: { 
    fontSize: rfs(13), 
    color: '#374151',
    fontWeight: '500'
  },
  pageControls: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: wp(2)
  },
  navArrow: { 
    width: ms(32), 
    height: ms(32), 
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: ms(4)
  },
  pageNum: { 
    minWidth: ms(36), 
    height: ms(36), 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: ms(6),
    paddingHorizontal: wp(2)
  },
  activePage: { 
    backgroundColor: '#0B1C36'
  },
  activePageText: { 
    color: '#FFF', 
    fontSize: rfs(13), 
    fontWeight: '600'
  },
  pageText: { 
    fontSize: rfs(13), 
    color: '#6B7280',
    fontWeight: '500'
  },
  
  // Dropdown Menus
  dropdownMenuContainer: {
    backgroundColor: '#FFF',
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: hp(1.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden'
  },
  dropdownHeaderBtn: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    backgroundColor: '#E8F4F8'
  },
  dropdownHeaderText: {
    fontSize: rfs(13),
    color: '#374151',
    fontWeight: '500'
  },
  dropdownItemBtn: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    backgroundColor: '#0B1C36',
    borderTopWidth: 1,
    borderTopColor: '#1e3a5f'
  },
  dropdownItemText: {
    fontSize: rfs(13),
    color: '#FFF',
    fontWeight: '400'
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 1000
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: hp(0.5),
    backgroundColor: '#FFF',
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    minWidth: wp(35),
    zIndex: 2000
  },
  dropdownMenuAbove: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    marginBottom: hp(0.5),
    backgroundColor: '#FFF',
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    minWidth: wp(20),
    zIndex: 2000
  },
  dropdownHeader: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    backgroundColor: '#E8F4F8'
  },
  dropdownItem: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    backgroundColor: '#0B1C36',
    borderTopWidth: 1,
    borderTopColor: '#1e3a5f'
  }
});