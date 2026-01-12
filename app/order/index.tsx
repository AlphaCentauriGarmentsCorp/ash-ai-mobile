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

// --- Static Mock Data ---
const orders = Array.from({ length: 12 }).map((_, i) => ({
  id: i.toString(),
  poNumber: 'ORD-2025-825830',
  type: 'Repeat',
  priority: 'Medium',
  clothing: 'Adidas',
  designName: 'The Reefer',
  status: 'In Production',
  color: '#F58220'
}));

export default function OrderPage() {
  const router = useRouter();

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
           <TouchableOpacity>
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

      {/* --- Main Content --- */}
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          {/* Title Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                  <Ionicons name="people-outline" size={ms(20)} color="#0B1C36" />
              </View>
              <Text style={styles.headerTitle}>Clients</Text>
              <Text style={styles.breadcrumb}>Daily Operations / Orders</Text>
            </View>
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

            <TouchableOpacity style={styles.secondaryButton}>
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
            
            {/* Added Missing Dropdowns here */}
            <View style={styles.filterDropdowns}>
              {/* 1. Filter: All Orders */}
              <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="filter" size={ms(12)} color="#333" />
                <Text style={styles.filterBtnText}>All Orders</Text>
                <Ionicons name="chevron-down" size={ms(12)} color="#333" />
              </TouchableOpacity>
              
              {/* 2. All Tasks */}
              <TouchableOpacity style={styles.filterBtn}>
                <Text style={styles.filterBtnText}>All Tasks</Text>
                <Ionicons name="chevron-down" size={ms(12)} color="#333" />
              </TouchableOpacity>

              {/* 3. Priority */}
              <TouchableOpacity style={styles.filterBtn}>
                <Text style={styles.filterBtnText}>Priority</Text>
                <Ionicons name="chevron-down" size={ms(12)} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

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
                {orders.map((item, index) => (
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
          <View style={styles.paginationContainer}>
             {/* Left Side: Text strictly aligned */}
             <View style={styles.entriesContainer}>
                 <Text style={styles.showText}>Show all</Text>
                 <View style={styles.pageBox}>
                     <Text style={styles.pageBoxText}>10</Text>
                 </View>
                 <Text style={styles.showText}>entries</Text>
             </View>
             
             {/* Right Side: Pagination Controls */}
             <View style={styles.pageControls}>
               <TouchableOpacity><Ionicons name="chevron-back" size={ms(18)} color="#333" /></TouchableOpacity>
               <TouchableOpacity style={[styles.pageNum, styles.activePage]}><Text style={styles.activePageText}>1</Text></TouchableOpacity>
               <TouchableOpacity style={styles.pageNum}><Text style={styles.pageText}>2</Text></TouchableOpacity>
               <TouchableOpacity style={styles.pageNum}><Text style={styles.pageText}>3</Text></TouchableOpacity>
               <TouchableOpacity><Ionicons name="chevron-forward" size={ms(18)} color="#333" /></TouchableOpacity>
             </View>
          </View>

          <View style={{ height: hp(5) }} /> 
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0B1C36' },
  topSafeArea: { backgroundColor: '#0B1C36', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  topHeaderBar: { height: hp(6.2), flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(4.3), backgroundColor: '#0B1C36' },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: wp(3.2) },
  headerIconBtn: { width: ms(32), height: ms(32), backgroundColor: '#FFF', borderRadius: ms(16), justifyContent: 'center', alignItems: 'center' },
  headerIconBtnTransparent: { justifyContent: 'center', alignItems: 'center' },
  contentContainer: { flex: 1, backgroundColor: '#FFF' },
  scrollView: { flex: 1, paddingHorizontal: wp(4.3), paddingTop: hp(2) },
  
  // Header
  headerSection: { marginBottom: hp(2.5) },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap' },
  iconCircle: { width: ms(32), height: ms(32), borderRadius: ms(16), borderWidth: 1, borderColor: '#0B1C36', justifyContent: 'center', alignItems: 'center', marginRight: wp(2.1) },
  headerTitle: { fontSize: rfs(20), fontWeight: 'bold', color: '#0B1C36', marginRight: 'auto' },
  breadcrumb: { fontSize: rfs(12), color: '#666', marginTop: hp(0.5), width: '100%', textAlign: 'right' },
  
  // Actions
  actionRow: { flexDirection: 'row', marginBottom: hp(2), gap: wp(2.1) },
  primaryButton: { flexDirection: 'row', backgroundColor: '#0B1C36', paddingVertical: hp(1.2), paddingHorizontal: wp(4.3), borderRadius: ms(20), alignItems: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: '600', fontSize: rfs(12), marginLeft: wp(1.1) },
  secondaryButton: { flexDirection: 'row', borderWidth: 1, borderColor: '#0B1C36', paddingVertical: hp(1.2), paddingHorizontal: wp(3.2), borderRadius: ms(20), alignItems: 'center' },
  secondaryButtonText: { color: '#0B1C36', fontWeight: '600', fontSize: rfs(12), marginLeft: wp(1.1) },
  
  // Search
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: ms(8), paddingHorizontal: wp(3.2), height: hp(5.4), marginBottom: hp(2) },
  searchInput: { flex: 1, fontSize: rfs(14), color: '#333' },
  searchIcon: { marginLeft: wp(2.1) },
  
  // Filters
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: hp(1.5), flexWrap: 'wrap', gap: wp(2.1) },
  legendContainer: { flexDirection: 'row', alignItems: 'center' },
  legendLabel: { fontSize: rfs(12), color: '#666', marginRight: wp(2.1) },
  badge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: ms(16), paddingHorizontal: wp(2.1), paddingVertical: hp(0.5), marginRight: wp(1.6) },
  badgeText: { fontSize: rfs(10), color: '#333', marginRight: wp(1.1) },
  dot: { width: ms(8), height: ms(8), borderRadius: ms(4) },
  
  filterDropdowns: { flexDirection: 'row', gap: wp(2) }, // Added gap for spacing between dropdowns
  filterBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: ms(6), paddingHorizontal: wp(2.1), paddingVertical: hp(0.6) },
  filterBtnText: { fontSize: rfs(10), color: '#333', marginHorizontal: wp(1.1) },

  // Table
  tableContainer: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: ms(8), overflow: 'hidden', paddingBottom: hp(1) },
  tableHeader: { flexDirection: 'row', backgroundColor: '#E6F0F8', paddingVertical: hp(1.5), paddingHorizontal: wp(2.1), borderBottomWidth: 1, borderBottomColor: '#D1D9E0' },
  columnHeader: { fontSize: rfs(12), fontWeight: 'bold', color: '#4A5568' },
  tableRow: { flexDirection: 'row', paddingVertical: hp(1.5), paddingHorizontal: wp(2.1), borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  rowEven: { backgroundColor: '#FFF' },
  rowOdd: { backgroundColor: '#F9FAFB' },
  cellText: { fontSize: rfs(12), color: '#333' },
  statusDot: { width: ms(8), height: ms(8), borderRadius: ms(4), marginRight: wp(2.1) },
  
  // Scrollbar
  customScrollContainer: { paddingHorizontal: wp(2.1), paddingTop: hp(1) },
  scrollTrack: { height: hp(0.6), backgroundColor: '#E0E0E0', borderRadius: ms(4), width: '100%', overflow: 'hidden' },
  scrollThumb: { height: '100%', width: wp(30), backgroundColor: '#0B1C36', borderRadius: ms(4) }, // Fixed width thumb

  // Pagination
  paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: hp(2) },
  entriesContainer: { flexDirection: 'row', alignItems: 'center' }, // Ensures Show all | 10 | entries are in one line
  showText: { fontSize: rfs(12), color: '#666' },
  pageBox: { borderWidth: 1, borderColor: '#ccc', paddingHorizontal: wp(1.5), paddingVertical: hp(0.1), borderRadius: ms(4), marginHorizontal: wp(1.5) },
  pageBoxText: { fontSize: rfs(10), color: '#333' },
  pageControls: { flexDirection: 'row', alignItems: 'center', gap: wp(1.6) },
  pageNum: { width: ms(24), height: ms(24), justifyContent: 'center', alignItems: 'center', borderRadius: ms(4) },
  activePage: { backgroundColor: '#0B1C36' },
  activePageText: { color: '#FFF', fontSize: rfs(12) },
  pageText: { fontSize: rfs(12), color: '#333' }
});