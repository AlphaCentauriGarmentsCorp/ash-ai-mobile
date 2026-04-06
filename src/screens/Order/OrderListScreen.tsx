import { Ionicons } from '@expo/vector-icons'; // Imported for the custom buttons
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { orderApi } from '@api/order';
import type { Order } from '@api/types';
import type { Column } from '@components/common/DataTable';
import DataTable from '@components/common/DataTable';
import type { DropdownOption } from '@components/common/Dropdown';
import Dropdown from '@components/common/Dropdown';
import type { Legend } from '@components/common/FilterBar';
import FilterBar from '@components/common/FilterBar';
import Pagination from '@components/common/Pagination';
import SearchBar from '@components/common/SearchBar';
import { usePoppinsFonts } from '@hooks';
import { Header, PageTitle } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '@styles';
import { hp, ms, wp } from "@utils/responsive";

interface OrderDisplay {
  id: string;
  poNumber: string;
  type: string;
  priority: string;
  clothing: string;
  designName: string;
  status: string;
  leadTimeLeft: string;
  color: string;
}

export default function OrderListScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();
  
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState('all');
  const [selectedTask, setSelectedTask] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Helper function to calculate lead time
  const calculateLeadTime = (deadline: string): string => {
    try {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diffTime = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'Overdue';
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day';
      if (diffDays < 7) return `${diffDays} days`;
      
      const weeks = Math.floor(diffDays / 7);
      const remainingDays = diffDays % 7;
      if (remainingDays === 0) return `${weeks} week${weeks > 1 ? 's' : ''}`;
      return `${weeks}w ${remainingDays}d`;
    } catch {
      return 'N/A';
    }
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderApi.index({
        page: currentPage,
        per_page: entriesPerPage,
        // Remove search from API call since we're doing client-side search
        status: selectedTask !== 'all' ? selectedTask : undefined,
      });

      // Transform API data to display format
      const transformedOrders: OrderDisplay[] = response.data.map((order: Order) => ({
        id: order.id,
        poNumber: order.po_code,
        type: order.service_type || 'N/A',
        priority: order.priority || 'normal',
        clothing: order.apparel_type || 'N/A',
        designName: order.design_name || 'N/A',
        status: order.status,
        leadTimeLeft: order.deadline ? calculateLeadTime(order.deadline) : 'N/A',
        color: order.brand === 'sorbetes' ? '#000' : '#F58220',
      }));

      setOrders(transformedOrders);
      setTotalRecords(response.total);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, entriesPerPage, selectedTask]);
  
  // Create searchable text for each order (optimized with useMemo)
  const searchableOrders = useMemo(() => {
    return orders.map(order => ({
      ...order,
      searchableText: [
        order.poNumber,
        order.type,
        order.priority,
        order.clothing,
        order.designName,
        order.status,
        order.leadTimeLeft,
        // Add any nested properties if they exist
        order.color === '#000' ? 'sorbetes' : 'reefer', // Brand search
      ].filter(Boolean).join(' ').toLowerCase()
    }));
  }, [orders]);

  // Enhanced filtering with multi-field search
  const filteredOrders = useMemo(() => {
    let filtered = searchableOrders;

    // Apply search filter (multi-field, case-insensitive, partial matching)
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(order => 
        order.searchableText.includes(searchTerm)
      );
    }

    // Apply brand filter
    if (selectedOrder !== 'all') {
      const isSorbetes = (order: any) => order.color === '#000';
      const isReefer = (order: any) => order.color === '#F58220';
      
      filtered = filtered.filter(order => {
        if (selectedOrder === 'sorbetes' && !isSorbetes(order)) return false;
        if (selectedOrder === 'reefer' && !isReefer(order)) return false;
        return true;
      });
    }
    
    // Apply priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(order => order.priority === selectedPriority);
    }
    
    return filtered;
  }, [searchableOrders, searchQuery, selectedOrder, selectedPriority]);
  
  const totalPages = Math.ceil(totalRecords / entriesPerPage);
  
  const handleEntriesChange = (value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    setSelectedOrder('all');
    setSelectedTask('all');
    setSelectedPriority('all');
    setSearchQuery('');
    setCurrentPage(1);
    setEntriesPerPage(15);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleView = (orderId: string) => {
    setDropdownVisible(null);
    // Find the order to get its PO code
    const order = filteredOrders.find(o => o.id === orderId);
    if (order) {
      router.push(`/order/view?po_code=${encodeURIComponent(order.poNumber)}`);
    }
  };

  const handleEdit = (orderId: string) => {
    setDropdownVisible(null);
    const order = filteredOrders.find(o => o.id === orderId);
    if (order) {
      router.push(`/order/edit?po_code=${encodeURIComponent(order.poNumber)}`);
    }
  };

  const handleDeleteClick = (orderId: string) => {
    setDropdownVisible(null);
    setSelectedOrderId(orderId);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrderId) return;
    
    try {
      await orderApi.delete(Number(selectedOrderId));
      setDeleteModalVisible(false);
      setSelectedOrderId(null);
      fetchOrders(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setSelectedOrderId(null);
  };

  const orderOptions: DropdownOption[] = [
    { label: 'All Orders', value: 'all' },
    { label: 'Sorbetes', value: 'sorbetes' },
    { label: 'Reefer', value: 'reefer' },
  ];

  const taskOptions: DropdownOption[] = [
    { label: 'All tasks', value: 'all' },
    { label: 'Pending Approval', value: 'Pending Approval' },
    { label: 'In Production', value: 'In Production' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  const priorityOptions: DropdownOption[] = [
    { label: 'Priority', value: 'all' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  const columns: Column[] = [
    {
      key: 'poNumber',
      header: 'P.O #',
      width: wp(25),
      render: (value: any, item: any) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.statusDot, { backgroundColor: item.color }]} />
          <Text style={styles.cellText}>{value}</Text>
        </View>
      ),
    },
    { key: 'type', header: 'Type', width: wp(15) },
    { key: 'priority', header: 'Priority', width: wp(15) },
    { key: 'clothing', header: 'Clothing', width: wp(18) },
    { key: 'designName', header: 'Design Name', width: wp(20) },
    { key: 'status', header: 'Status', width: wp(22) },
    { key: 'leadTimeLeft', header: 'Lead Time Left', width: wp(20) },
    {
      key: 'actions',
      header: '',
      width: wp(10),
      render: (value: any, item: any) => (
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(dropdownVisible === item.id ? null : item.id)}
        >
          <Ionicons 
            name="chevron-down" 
            size={20} 
            color="#6B7280" 
          />
        </TouchableOpacity>
      ),
    },
  ];

  const legends: Legend[] = [
    { label: 'Reefer', color: '#F58220' },
    { label: 'Sorbetes', color: '#000' },
  ];

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      <Header />
      <PageTitle title="Orders" icon="people-outline" />

      <View style={styles.contentContainer}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#0D253F']}
              tintColor="#0D253F"
            />
          }
        >
          
          {/* NEW ORDER BUTTON */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.primaryPillBtn} 
              onPress={() => router.push('/order/add')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" style={styles.btnIcon} />
              <Text style={styles.primaryPillText}>New Order</Text>
            </TouchableOpacity>
          </View>

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by PO#, type, priority, clothing, design, status..."
            style={styles.searchContainer}
          />

          <FilterBar legends={legends}>
            <Dropdown
              options={orderOptions}
              selectedValue={selectedOrder}
              onSelect={setSelectedOrder}
              showIcon={true}
            />
            
            <Dropdown
              options={taskOptions}
              selectedValue={selectedTask}
              onSelect={setSelectedTask}
            />

            <Dropdown
              options={priorityOptions}
              selectedValue={selectedPriority}
              onSelect={setSelectedPriority}
            />
          </FilterBar>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          ) : (
            <DataTable
              columns={columns}
              data={filteredOrders}
              trackWidth={wp(91.4)}
              thumbWidth={wp(30)}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            entriesPerPage={entriesPerPage}
            onPageChange={handlePageChange}
            onEntriesChange={handleEntriesChange}
            entriesOptions={[5, 10, 15, 20, 30]}
          />

          <View style={{ height: hp(5) }} /> 
        </ScrollView>
      </View>

      {/* Dropdown Menu Modal */}
      {dropdownVisible && (
        <Modal
          visible={true}
          transparent={true}
          animationType="none"
          onRequestClose={() => setDropdownVisible(null)}
        >
          <Pressable 
            style={styles.dropdownOverlay} 
            onPress={() => setDropdownVisible(null)}
          >
            <View style={styles.dropdownMenuModal}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleView(dropdownVisible)}
              >
                <Ionicons name="eye-outline" size={20} color={COLORS.text} />
                <Text style={styles.dropdownText}>View</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleEdit(dropdownVisible)}
              >
                <Ionicons name="pencil-outline" size={20} color={COLORS.text} />
                <Text style={styles.dropdownText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.dropdownItem, styles.dropdownItemDanger]}
                onPress={() => handleDeleteClick(dropdownVisible)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text style={[styles.dropdownText, styles.dropdownTextDanger]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDeleteCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning-outline" size={48} color="#EF4444" />
              <Text style={styles.modalTitle}>Delete Order</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this order? This action cannot be undone.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleDeleteCancel}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={handleDeleteConfirm}
              >
                <Text style={styles.modalButtonTextDelete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // --- NEW ORDER BUTTON STYLES ---
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  primaryPillBtn: {
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D253F', // Deep Navy background
    borderRadius: 50, // Pill shape
    height: 42,
    paddingHorizontal: 20,
  },
  primaryPillText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 5,
    marginLeft: -5,
    marginTop: 2,
  },
  btnIcon: {
    marginRight: 8,
  },
  // ------------------------------------------------------------------

  searchContainer: { 
    marginBottom: hp(2) 
  },

  statusDot: { 
    width: ms(8), 
    height: ms(8),  
    borderRadius: SIZES.radius.xs, 
    marginRight: wp(2.1) 
  },
  cellText: { 
    fontSize: FONT_SIZES.xs, 
    color: COLORS.text,
    fontFamily: FONT_FAMILY.regular,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.regular,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    fontFamily: FONT_FAMILY.regular,
    textAlign: 'center',
    marginBottom: hp(2),
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: SIZES.radius.md,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.regular,
  },
  dropdownButton: {
    width: ms(32),
    height: ms(32),
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: SIZES.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenuModal: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: wp(40),
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemDanger: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    marginLeft: wp(3),
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.regular,
  },
  dropdownTextDanger: {
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.lg,
    padding: wp(6),
    width: wp(85),
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text,
    marginTop: hp(1),
  },
  modalMessage: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: hp(3),
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
  },
  modalButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  modalButtonDelete: {
    backgroundColor: '#EF4444',
  },
  modalButtonTextCancel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
  },
  modalButtonTextDelete: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.white,
  },
});