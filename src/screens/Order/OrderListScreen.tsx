import { Ionicons } from '@expo/vector-icons'; // Imported for the custom buttons
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const allOrders = Array.from({ length: 30 }).map((_, i) => {
  const types = ['Repeat', 'New', 'Rush', 'Custom'];
  const priorities = ['High', 'Medium', 'Low'];
  const clothings = ['Adidas', 'Nike', 'Puma', 'Reebok', 'Under Armour'];
  const designs = ['The Reefer', 'Classic Logo', 'Modern Stripe', 'Vintage Style', 'Bold Print'];
  const statuses = ['In Production', 'Pending Approval', 'Confirmed', 'Draft'];
  const colors = ['#F58220', '#000'];
  const leadTimes = ['2 days', '5 days', '1 week', '3 days', '10 days'];
  
  return {
    id: (i + 1).toString(),
    poNumber: `ORD-2025-${825830 + i}`,
    type: types[i % types.length],
    priority: priorities[i % priorities.length],
    clothing: clothings[i % clothings.length],
    designName: designs[i % designs.length],
    status: statuses[i % statuses.length],
    leadTimeLeft: leadTimes[i % leadTimes.length],
    color: colors[i % colors.length]
  };
});

export default function OrderListScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();
  
  const [selectedOrder, setSelectedOrder] = useState('all');
  const [selectedTask, setSelectedTask] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  
  const filteredOrders = allOrders.filter(order => {
    if (selectedOrder !== 'all') {
      const isSorbetes = order.color === '#000';
      const isReefer = order.color === '#F58220';
      if (selectedOrder === 'sorbetes' && !isSorbetes) return false;
      if (selectedOrder === 'reefer' && !isReefer) return false;
    }
    
    if (selectedTask !== 'all') {
      if (order.status !== selectedTask) return false;
    }
    
    if (selectedPriority !== 'all') {
      if (order.priority !== selectedPriority) return false;
    }
    
    return true;
  });
  
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
  
  const handleEntriesChange = (value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleRefresh = () => {
    setSelectedOrder('all');
    setSelectedTask('all');
    setSelectedPriority('all');
    setCurrentPage(1);
    setEntriesPerPage(15);
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
    { label: 'Draft', value: 'Draft' },
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
      width: wp(35),
      render: (value: any, item: any) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.statusDot, { backgroundColor: item.color }]} />
          <Text style={styles.cellText}>{value}</Text>
        </View>
      ),
    },
    { key: 'type', header: 'Type', width: wp(19) },
    { key: 'priority', header: 'Priority', width: wp(19) },
    { key: 'clothing', header: 'Clothing', width: wp(24) },
    { key: 'designName', header: 'Design Name', width: wp(30) },
    { key: 'status', header: 'Status', width: wp(27) },
    { key: 'leadTimeLeft', header: 'Lead Time Left', width: wp(25) },
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
      <PageTitle title="Orders" icon="people-outline" breadcrumb="Daily Operations / Orders" />

      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          {/* CUSTOM ACTION BUTTONS */}
          <View style={styles.actionButtonsContainer}>
            
            {/* Left Group: New Order & Refresh */}
            <View style={styles.leftButtonsGroup}>
              <TouchableOpacity 
                style={styles.primaryPillBtn} 
                onPress={() => router.push('/order/add')}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" style={styles.btnIcon} />
                <Text style={styles.primaryPillText}>New Order</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryPillBtn} 
                onPress={handleRefresh}
                activeOpacity={0.6}
              >
                <Ionicons name="refresh-outline" size={16} color="#0D253F" style={styles.btnIcon} />
                <Text style={styles.secondaryPillText}>Refresh</Text>
              </TouchableOpacity>
            </View>

            {/* Right Group: Order History */}
            <TouchableOpacity 
              style={styles.tertiaryPillBtn} 
              onPress={() => console.log('Order history')}
              activeOpacity={0.6}
            >
              <Ionicons name="time-outline" size={16} color="#0D253F" style={styles.btnIcon} />
              <Text style={styles.tertiaryPillText}>Order History</Text>
            </TouchableOpacity>
            
          </View>

          <SearchBar
            value=""
            onChangeText={() => {}}
            placeholder="Search by client name, brand..."
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

          <DataTable
            columns={columns}
            data={currentOrders}
            trackWidth={wp(91.4)}
            thumbWidth={wp(30)}
          />

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

  // --- CUSTOM ACTION BUTTON STYLES (Fixed to match Image 1 exactly) ---
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Pushes left group to the left, history to the right
    alignItems: 'center',
    marginBottom: hp(2),
    width: '100%',
  },
  leftButtonsGroup: {
    
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Gap between New Order and Refresh
  },
  primaryPillBtn: {
    width:110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D253F', // Deep Navy background
    borderRadius: 50, // Pill shape
    height: 42,
    paddingHorizontal: 20, // Defines width dynamically based on text
  },
  secondaryPillBtn: {
    width:100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0D253F', // Deep Navy border
    borderRadius: 50, // Pill shape
    height: 42,
    paddingHorizontal: 20, // Defines width dynamically based on text
  },
   tertiaryPillBtn: {
    width:100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0D253F', // Deep Navy border
    borderRadius: 50, // Pill shape
    height: 35,
    paddingHorizontal: 20, // Defines width dynamically based on text
  },

  primaryPillText: {
    fontFamily: 'Poppins_500Medium', // Matching bold font
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 5,
    marginLeft: -5,
    marginTop: 2,
  },
  secondaryPillText: {
     fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    marginRight: 5,
    marginLeft: -5,
    marginTop: 2,
    color: '#001C34', // Dark Navy text
  },
  tertiaryPillText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8,
    marginRight: 5,
    marginLeft: -5,
    marginTop: 2,
    color: '#001C34', // Dark Navy text
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
});