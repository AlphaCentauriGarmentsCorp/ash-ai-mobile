import { Entypo, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { screenApi, type Screen } from '@api/screens';
import Button from '@components/common/Button';
import ConfirmModal from '@components/common/ConfirmModal';
import type { Column } from '@components/common/DataTable';
import DataTable from '@components/common/DataTable';
import Pagination from '@components/common/Pagination';
import SearchBar from '@components/common/SearchBar';
import { usePoppinsFonts } from '@hooks';
import { Header } from '@layouts';
import { COLORS, FONT_SIZES, SIZES, SPACING } from '@styles';

interface RowActionMenuProps {
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

const RowActionMenu = ({ onEdit, onView, onDelete }: RowActionMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

  const toggleDropdown = () => {
    if (visible) {
      setVisible(false);
    } else {
      buttonRef.current?.measure((_fx: number, _fy: number, _w: number, h: number, px: number, py: number) => {
        const windowWidth = Dimensions.get('window').width;
        setDropdownPosition({
          top: py + h, 
          right: windowWidth - (px + _w), 
        });
        setVisible(true);
      });
    }
  };

  return (
    <View>
      <TouchableOpacity 
        ref={buttonRef}
        style={styles.actionBtn} 
        onPress={toggleDropdown}
      >
        <Entypo name="chevron-down" size={20} color="#1E3A5F" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.floatingMenu,
                {
                  top: dropdownPosition.top,
                  right: dropdownPosition.right,
                },
              ]}
            >
              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => { setVisible(false); onEdit(); }}
              >
                <Ionicons name="pencil" size={16} color="#0D253F" style={styles.dropdownIcon} />
                <Text style={styles.dropdownItemText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => { setVisible(false); onView(); }}
              >
                <Ionicons name="eye" size={16} color="#0D253F" style={styles.dropdownIcon} />
                <Text style={styles.dropdownItemText}>View</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.dropdownItem, { borderBottomWidth: 0 }]} 
                onPress={() => { setVisible(false); onDelete(); }}
              >
                <Ionicons name="trash" size={16} color="#0D253F" style={styles.dropdownIcon} />
                <Text style={styles.dropdownItemText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default function AllScreensScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);

  const [allScreensFromAPI, setAllScreensFromAPI] = useState<Screen[]>([]); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);

  const filteredScreens = useMemo(() => {
    if (!Array.isArray(allScreensFromAPI)) {
      return [];
    }
    
    if (!searchText.trim()) {
      return allScreensFromAPI;
    }

    const searchLower = searchText.toLowerCase().trim();
    return allScreensFromAPI.filter(screen => {
      if (screen.name?.toLowerCase().includes(searchLower)) return true;
      if (screen.address?.toLowerCase().includes(searchLower)) return true;
      if (screen.size?.toLowerCase().includes(searchLower)) return true;
      return false;
    });
  }, [allScreensFromAPI, searchText]);

  const totalScreens = filteredScreens.length;
  const totalPages = Math.ceil(totalScreens / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentScreens = filteredScreens.slice(startIndex, endIndex);

  useEffect(() => {
    fetchScreens();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage, searchText]);

  const fetchScreens = async () => {
    try {
      setLoading(true);
      const response = await screenApi.getAll({ page: 1, per_page: 9999 });
      
      let screensArray: Screen[] = [];
      
      if (Array.isArray(response.data)) {
        screensArray = response.data;
      } else if (Array.isArray(response)) {
        screensArray = response;
      }
      
      setAllScreensFromAPI(screensArray);
    } catch (error) {
      console.error('Error fetching screens:', error);
      setAllScreensFromAPI([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchScreens();
    setRefreshing(false);
  };

  const handleDeleteScreen = (screen: Screen) => {
    setSelectedScreen(screen);
    setRemoveModalVisible(true);
  };

  const confirmDeleteScreen = async () => {
    if (!selectedScreen) return;
    try {
      await screenApi.delete(selectedScreen.id);
      setRemoveModalVisible(false);
      setSelectedScreen(null);
      Alert.alert('Success', 'Screen deleted successfully');
      fetchScreens(); 
    } catch (error: any) {
      console.error('Error deleting screen:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete screen';
      Alert.alert('Error', errorMessage);
    }
  };

  const columns: Column[] = useMemo(() => [
    { 
      key: 'name', 
      header: 'Design Name', 
      width: 180, 
      sortable: true,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={2}>
          {value || 'N/A'}
        </Text>
      )
    },
    { 
      key: 'address', 
      header: 'Address', 
      width: 150, 
      sortable: true,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={2}>
          {value || 'N/A'}
        </Text>
      )
    },
    { 
      key: 'size', 
      header: 'Size', 
      width: 100, 
      sortable: true,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={1}>
          {value || 'N/A'}
        </Text>
      )
    },
    { 
      key: 'mesh_count', 
      header: 'Mesh Count', 
      width: 100, 
      sortable: true,
      render: (value: any) => (
        <Text style={[styles.cellText, styles.centerText]}>
          {value || 'N/A'}
        </Text>
      )
    },
    { 
      key: 'total_use', 
      header: 'Total Use', 
      width: 90, 
      sortable: true,
      render: (value: any) => (
        <Text style={[styles.cellText, styles.centerText]}>
          {value || '0'}
        </Text>
      )
    },
    { 
      key: 'status', 
      header: 'Status', 
      width: 100, 
      sortable: true,
      render: (value: any) => {
        const status = value || 'Active';
        const bgColor = status.toLowerCase() === 'active' ? '#D1FAE5' : '#FEE2E2';
        const textColor = status.toLowerCase() === 'active' ? '#065F46' : '#991B1B';
        
        return (
          <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
            <Text style={[styles.statusText, { color: textColor }]} numberOfLines={1}>
              {status}
            </Text>
          </View>
        );
      }
    },
    {
      key: 'action',
      header: '',
      width: 60,
      sortable: false,
      render: (_value: any, item: Screen) => {
        return (
          <RowActionMenu 
            onEdit={() => router.push({ pathname: "/inventory/screen/edit", params: { id: item.id } })}
            onView={() => router.push({ pathname: "/inventory/screen/view", params: { id: item.id } })}
            onDelete={() => handleDeleteScreen(item)}
          />
        );
      },
    },
  ], [currentScreens.length]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0D253F" />

      <View style={{ paddingTop: insets.top }}>
        <Header />
      </View>

      <View style={styles.pageTitleContainer}>
        <View style={styles.titleLeftGroup}>
          <View style={styles.iconCircleWrapper}>
            <Ionicons name="grid-outline" size={24} color="#0D253F" />
          </View>
          <Text style={styles.pageTitleText}>Screen Inventory</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0D253F']}
            tintColor="#0D253F"
          />
        }
      >
        <View style={styles.actionButtonsRow}>
          <Button
            title="Add Screen"
            onPress={() => router.push('/inventory/screen/add')}
            variant="primary"
            size="base"
            icon="add-circle-outline"
            iconPosition="left"
          />
        </View>

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search screens..."
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0D253F" />
            <Text style={styles.loadingText}>Loading screens...</Text>
          </View>
        ) : filteredScreens.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {searchText.trim() ? 'No screens found matching your search.' : 'No screens available.'}
            </Text>
          </View>
        ) : (
          <View style={{ paddingBottom: 150, zIndex: 1 }}> 
            <DataTable 
              columns={columns} 
              data={currentScreens} 
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              entriesPerPage={entriesPerPage}
              totalEntries={totalScreens}
              onPageChange={setCurrentPage}
              onEntriesChange={setEntriesPerPage}
            />
          </View>
        )}

        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>

      <ConfirmModal
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        onConfirm={confirmDeleteScreen}
        title="Remove Screen?"
        message={`Are you sure you want to remove ${selectedScreen ? selectedScreen.name || 'this screen' : 'this screen'}? This action cannot be undone.`}
        confirmText="Remove Screen"
        highlightText={selectedScreen ? selectedScreen.name || '' : ''}
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
  pageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: SPACING.base, 
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.white, 
  },
  titleLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#0D253F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  pageTitleText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0D253F',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.base,
  },
  actionBtn: {
    borderWidth: SIZES.border.thin + 1,
    borderColor: '#A5B4BF',
    backgroundColor: '#EBF6FF',
    borderRadius: SIZES.radius.xs,
    paddingVertical: SPACING.xs - 2,
    paddingHorizontal: SPACING.xs + 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  floatingMenu: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 150,
    borderWidth: 2,
    borderColor: '#A5B4BF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8, 
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#A5B4BF',
  },
  dropdownIcon: {
    marginRight: 8,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#0D253F',
    fontFamily: 'poppins-regular', 
  },
  cellText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontFamily: 'poppins-regular',
  },
  centerText: {
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  loadingText: {
    marginTop: SPACING.base,
    fontSize: FONT_SIZES.base,
    fontFamily: 'Poppins_400Regular',
    color: '#0D253F',
  },
});
