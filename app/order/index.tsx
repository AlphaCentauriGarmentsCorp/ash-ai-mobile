import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePoppinsFonts } from '../../hooks';
import { hp, ms, rfs, wp } from "../../utils/responsive";
import Button from '../components/Button';
import GlobalHeader from '../components/GlobalHeader';
import PageTitle from '../components/PageTitle';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '../constants';

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
  const fontsLoaded = usePoppinsFonts();
  
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

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      <GlobalHeader />
      <PageTitle title="Orders" icon="people-outline" breadcrumb="Daily Operations / Orders" />

      {/* --- Main Content --- */}
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Button
              title="New Order"
              onPress={() => router.push('/order/add-order')}
              variant="primary"
              size="base"
              icon="add"
              iconPosition="left"
            />

            <Button
              title="Refresh"
              onPress={handleRefresh}
              variant="outline"
              size="base"
              icon="refresh"
              iconPosition="left"
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />

            <Button
              title="Order History"
              onPress={() => console.log('Order history')}
              variant="outline"
              size="base"
              icon="time-outline"
              iconPosition="left"
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: COLORS.surface 
  },
  contentContainer: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },
  scrollView: { 
    flex: 1, 
    paddingHorizontal: wp(4.3), 
    paddingTop: hp(2) 
  },
  
  // Actions
  actionRow: { 
    flexDirection: 'row', 
    marginBottom: hp(2), 
    gap: wp(2.1),
    flexWrap: 'wrap',
  },
  secondaryButton: { 
    borderColor: '#0B1C36',
    backgroundColor: COLORS.white,
  },
  secondaryButtonText: { 
    color: '#0B1C36',
  },
  
  // Search
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    borderRadius: SIZES.radius.base, 
    paddingHorizontal: wp(3.2), 
    height: hp(5.4), 
    marginBottom: hp(2) 
  },
  searchInput: { 
    flex: 1, 
    fontSize: FONT_SIZES.sm, 
    color: COLORS.text,
    fontFamily: FONT_FAMILY.regular,
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
    fontSize: FONT_SIZES.xs, 
    color: COLORS.textSecondary, 
    marginRight: wp(2.1),
    fontFamily: FONT_FAMILY.regular,
  },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    borderRadius: SIZES.radius.lg, 
    paddingHorizontal: wp(2.1), 
    paddingVertical: hp(0.5), 
    marginRight: wp(1.6) 
  },
  badgeText: { 
    fontSize: rfs(10), 
    color: COLORS.text, 
    marginRight: wp(1.1),
    fontFamily: FONT_FAMILY.regular,
  },
  dot: { 
    width: ms(8), 
    height: ms(8), 
    borderRadius: SIZES.radius.xs 
  },
  filterDropdowns: { 
    flexDirection: 'row', 
    gap: wp(2),
    zIndex: 100
  },
  filterBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    borderRadius: SIZES.radius.sm, 
    paddingHorizontal: wp(2.1), 
    paddingVertical: hp(0.6),
    backgroundColor: COLORS.white
  },
  filterBtnText: { 
    fontSize: rfs(10), 
    color: COLORS.text, 
    marginHorizontal: wp(1.1),
    fontFamily: FONT_FAMILY.regular,
  },

  // Table
  tableContainer: { 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    borderRadius: SIZES.radius.base, 
    overflow: 'hidden', 
    paddingBottom: hp(1) 
  },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#E6F0F8', 
    paddingVertical: hp(1.5), 
    paddingHorizontal: wp(2.1), 
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
    paddingVertical: hp(1.5), 
    paddingHorizontal: wp(2.1), 
    borderBottomWidth: SIZES.border.thin, 
    borderBottomColor: COLORS.borderLight, 
    alignItems: 'center' 
  },
  rowEven: { 
    backgroundColor: COLORS.white 
  },
  rowOdd: { 
    backgroundColor: COLORS.surface 
  },
  cellText: { 
    fontSize: FONT_SIZES.xs, 
    color: COLORS.text,
    fontFamily: FONT_FAMILY.regular,
  },
  statusDot: { 
    width: ms(8), 
    height: ms(8), 
    borderRadius: SIZES.radius.xs, 
    marginRight: wp(2.1) 
  },
  
  // Scrollbar
  customScrollContainer: { 
    paddingHorizontal: wp(2.1), 
    paddingTop: hp(1) 
  },
  scrollTrack: { 
    height: hp(0.6), 
    backgroundColor: COLORS.border, 
    borderRadius: SIZES.radius.xs, 
    width: '100%', 
    overflow: 'hidden' 
  },
  scrollThumb: { 
    height: '100%', 
    width: wp(30), 
    backgroundColor: '#0B1C36', 
    borderRadius: SIZES.radius.xs 
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
    fontSize: FONT_SIZES.sm, 
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.regular,
  },
  dropdownBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: SIZES.border.thin, 
    borderColor: COLORS.border, 
    paddingHorizontal: wp(3), 
    paddingVertical: hp(0.6), 
    borderRadius: SIZES.radius.sm,
    gap: wp(1.5),
    minWidth: wp(16)
  },
  dropdownText: { 
    fontSize: FONT_SIZES.sm, 
    color: COLORS.text,
    fontFamily: FONT_FAMILY.medium,
  },
  pageControls: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: wp(2)
  },
  navArrow: { 
    width: SIZES.icon.lg, 
    height: SIZES.icon.lg, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: SIZES.radius.xs
  },
  pageNum: { 
    minWidth: ms(36), 
    height: ms(36), 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: SIZES.radius.sm,
    paddingHorizontal: wp(2)
  },
  activePage: { 
    backgroundColor: '#0B1C36'
  },
  activePageText: { 
    color: COLORS.white, 
    fontSize: FONT_SIZES.sm, 
    fontFamily: FONT_FAMILY.semiBold,
  },
  pageText: { 
    fontSize: FONT_SIZES.sm, 
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.medium,
  },
  
  // Dropdown Menus
  dropdownMenuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.base,
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.border,
    marginBottom: hp(1.5),
    ...SIZES.shadow.base,
    overflow: 'hidden'
  },
  dropdownHeaderBtn: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    backgroundColor: '#E8F4F8'
  },
  dropdownHeaderText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.medium,
  },
  dropdownItemBtn: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    backgroundColor: '#0B1C36',
    borderTopWidth: SIZES.border.thin,
    borderTopColor: '#1e3a5f'
  },
  dropdownItemText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
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
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.base,
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.border,
    ...SIZES.shadow.md,
    overflow: 'hidden',
    minWidth: wp(35),
    zIndex: 2000
  },
  dropdownMenuAbove: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    marginBottom: hp(0.5),
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.base,
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.border,
    ...SIZES.shadow.md,
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
    borderTopWidth: SIZES.border.thin,
    borderTopColor: '#1e3a5f'
  }
});