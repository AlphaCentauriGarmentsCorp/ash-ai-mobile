import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { equipmentApi, equipmentLocationApi, type Equipment, type EquipmentLocation } from '@api/equipment';
import Button from '@components/common/Button';
import ConfirmModal from '@components/common/ConfirmModal';
import SearchBar from '@components/common/SearchBar';
import { usePoppinsFonts } from '@hooks';
import { Header } from '@layouts';
import { COLORS, FONT_SIZES, SPACING } from '@styles';

interface LocationWithStats extends EquipmentLocation {
  totalItems: number;
  inUse: number;
  available: number;
  missing: number;
}

export default function EquipmentLocationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const [searchText, setSearchText] = useState('');
  const [locations, setLocations] = useState<LocationWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationWithStats | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await equipmentLocationApi.getAll();
      const locationsData = (response as any).data || response;
      const locationsArray = Array.isArray(locationsData) ? locationsData : [];

      // Fetch equipment counts for each location
      const locationsWithStats = await Promise.all(
        locationsArray.map(async (location: EquipmentLocation) => {
          try {
            const equipmentResponse = await equipmentApi.getByLocation(location.id);
            const equipmentData = (equipmentResponse as any).data || equipmentResponse;
            const equipmentArray: Equipment[] = Array.isArray(equipmentData) ? equipmentData : [];
            
            const totalItems = equipmentArray.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const inUse = equipmentArray.reduce((sum, item) => sum + (item.in_use || 0), 0);
            const missing = equipmentArray.reduce((sum, item) => sum + (item.missing || 0), 0);
            const available = totalItems - inUse - missing;

            return {
              ...location,
              totalItems,
              inUse,
              available,
              missing,
            };
          } catch (error) {
            console.error(`Error fetching equipment for location ${location.id}:`, error);
            return {
              ...location,
              totalItems: 0,
              inUse: 0,
              available: 0,
              missing: 0,
            };
          }
        })
      );

      setLocations(locationsWithStats);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLocations();
    setRefreshing(false);
  };

  const filteredLocations = locations.filter(location =>
    location.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDeleteLocation = (location: LocationWithStats) => {
    setSelectedLocation(location);
    setDeleteModalVisible(true);
  };

  const confirmDeleteLocation = async () => {
    if (!selectedLocation) return;
    try {
      await equipmentLocationApi.delete(selectedLocation.id);
      setDeleteModalVisible(false);
      setSelectedLocation(null);
      Alert.alert('Success', 'Location deleted successfully');
      fetchLocations();
    } catch (error: any) {
      console.error('Error deleting location:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete location';
      Alert.alert('Error', errorMessage);
    }
  };

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
            <Ionicons name="construct-outline" size={24} color="#0D253F" />
          </View>
          <Text style={styles.pageTitleText}>Equipment Inventory</Text>
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
            title="Add Location"
            onPress={() => router.push('/inventory/equipment/location/add')}
            variant="primary"
            size="base"
            icon="add-circle-outline"
            iconPosition="left"
          />
        </View>

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search locations..."
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0D253F" />
            <Text style={styles.loadingText}>Loading locations...</Text>
          </View>
        ) : filteredLocations.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {searchText.trim() ? 'No locations found matching your search.' : 'No locations available.'}
            </Text>
          </View>
        ) : (
          <View style={styles.locationsGrid}>
            {filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onPress={() => router.push({ 
                  pathname: "/inventory/equipment/location/view", 
                  params: { id: location.id } 
                })}
                onEdit={() => router.push({ 
                  pathname: "/inventory/equipment/location/edit", 
                  params: { id: location.id } 
                })}
                onDelete={() => handleDeleteLocation(location)}
              />
            ))}
          </View>
        )}

        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>

      <ConfirmModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDeleteLocation}
        title="Delete Location?"
        message={`Are you sure you want to delete ${selectedLocation ? selectedLocation.name : 'this location'}? This action cannot be undone.`}
        confirmText="Delete Location"
        highlightText={selectedLocation ? selectedLocation.name : ''}
      />
    </View>
  );
}

interface LocationCardProps {
  location: LocationWithStats;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const LocationCard = ({ location, onPress, onEdit, onDelete }: LocationCardProps) => {
  return (
    <View style={styles.locationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.locationHeader}>
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={24} color="#0D253F" />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{location.name}</Text>
            <Text style={styles.locationDescription} numberOfLines={1}>
              {location.description || 'This is office area'}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
            <Ionicons name="pencil" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
            <Ionicons name="trash" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="cube" size={14} color="#FFFFFF" />
          <Text style={styles.statLabel}>Total Items:</Text>
          <Text style={styles.statValue}>{location.totalItems}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time" size={14} color="#FFFFFF" />
          <Text style={styles.statLabel}>In use:</Text>
          <Text style={styles.statValue}>{location.inUse}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
          <Text style={styles.statLabel}>Available:</Text>
          <Text style={styles.statValue}>{location.available}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="alert-circle" size={14} color="#FFFFFF" />
          <Text style={styles.statLabel}>Missing:</Text>
          <Text style={styles.statValue}>{location.missing}</Text>
        </View>
      </View>

      <View style={styles.locationFooter}>
        <Button
          title="View contents"
          onPress={onPress}
          variant="secondary"
          size="sm"
        />
      </View>
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
    backgroundColor: COLORS.white,
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
  locationsGrid: {
    gap: SPACING.base,
    paddingBottom: SPACING.xl,
  },
  locationCard: {
    backgroundColor: '#0D253F',
    borderRadius: 12,
    padding: SPACING.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: FONT_SIZES.lg,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Poppins_400Regular',
    color: '#A5B4BF',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.base,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: 'Poppins_400Regular',
    color: '#A5B4BF',
  },
  statValue: {
    fontSize: FONT_SIZES.xs,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
