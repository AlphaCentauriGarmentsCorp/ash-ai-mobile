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
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../src/components/common/Button';
import type { Column } from '../../src/components/common/DataTable';
import DataTable from '../../src/components/common/DataTable';
import type { DropdownOption } from '../../src/components/common/Dropdown';
import Dropdown from '../../src/components/common/Dropdown';
import GlobalHeader from '../../src/components/common/GlobalHeader';
import PageTitle from '../../src/components/common/PageTitle';
import Pagination from '../../src/components/common/Pagination';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '../../src/constants';
import { usePoppinsFonts } from '../../src/hooks';
import { hp, ms, rfs, wp } from "../../src/utils/responsive";

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
  
  const [selectedOrder, setSelectedOrder] = useState('all');
  const [selectedTask, setSelectedTask] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
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
    setEntriesPerPage(10);
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
  ];

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      <GlobalHeader />
      <PageTitle title="Orders" icon="people-outline" breadcrumb="Daily Operations / Orders" />

      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          <View style={styles.actionRow}>
            <Button
              title="New Order"
              onPress={() => router.push('/order/add')}
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
            
            <View style={styles.filterDropdowns}>
              <Dropdown
                options={orderOptions}
                selectedValue={selectedOrder}
                onSelect={setSelectedOrder}
                showIcon={true}
                buttonStyle={styles.filterBtn}
              />
              
              <Dropdown
                options={taskOptions}
                selectedValue={selectedTask}
                onSelect={setSelectedTask}
                buttonStyle={styles.filterBtn}
              />

              <Dropdown
                options={priorityOptions}
                selectedValue={selectedPriority}
                onSelect={setSelectedPriority}
                buttonStyle={styles.filterBtn}
              />
            </View>
          </View>

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
