import Button from '@components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from '@styles';
import { hp, wp } from '@utils/responsive';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { materialApi, supplierApi, type Material } from '@api/materialSuppliers';
import type { Column } from '@components/common/DataTable';
import DataTable from '@components/common/DataTable';
import Pagination from '@components/common/Pagination';
import SearchBar from '@components/common/SearchBar';

export default function ViewSupplierScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  const supplierId = params.id?.toString();

  // Supplier state
  const [codeName, setCodeName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [province, setProvince] = useState('');
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  
  // Materials state
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(4);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (supplierId) {
      fetchSupplierData();
    } else {
      Alert.alert('Error', 'Supplier ID is missing');
      router.back();
    }
  }, [supplierId]);

  useEffect(() => {
    if (supplierId && codeName) {
      fetchMaterials();
    }
  }, [supplierId, codeName]);

  const fetchSupplierData = async () => {
    try {
      setIsLoading(true);
      const response = await supplierApi.show(Number(supplierId));
      
      const supplier = (response as any).data || response;
      
      setCodeName(supplier.code_name || '');
      setContactPerson(supplier.contact_person || '');
      setContactNumber(supplier.contact_information || '');
      setEmail(supplier.email || '');
      setStreet(supplier.street || '');
      setProvince(supplier.province || '');
      setBarangay(supplier.barangay || '');
      setCity(supplier.city || '');
      setPostalCode(supplier.postal_code || '');
      setNotes(supplier.notes || '');
      setCreatedAt(supplier.created_at || '');
      
    } catch (error: any) {
      console.error('Error fetching supplier:', error);
      Alert.alert('Error', 'Failed to load supplier data');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaterials = async () => {
    if (!supplierId) return;
    
    try {
      const response = await materialApi.getBySupplier(Number(supplierId));
      const materialsArray = Array.isArray((response as any).data) 
        ? (response as any).data 
        : Array.isArray(response) 
        ? response 
        : [];
      
      setMaterials(materialsArray);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials([]);
    }
  };

  // Filter materials by search
  const filteredMaterials = useMemo(() => {
    if (!searchText.trim()) return materials;
    
    const searchLower = searchText.toLowerCase();
    return materials.filter(material => 
      material.material_type?.toLowerCase().includes(searchLower) ||
      material.name?.toLowerCase().includes(searchLower)
    );
  }, [materials, searchText]);

  // Pagination
  const totalMaterials = filteredMaterials.length;
  const totalPages = Math.ceil(totalMaterials / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentMaterials = filteredMaterials.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEntriesChange = (value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };

  const columns: Column[] = useMemo(() => [
    { 
      key: 'material_type', 
      header: 'Material Type', 
      width: 130, 
      sortable: false,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={2}>
          {value || 'N/A'}
        </Text>
      )
    },
    { 
      key: 'name', 
      header: 'Name', 
      width: 200, 
      sortable: false,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={2}>
          {value || 'N/A'}
        </Text>
      )
    },
    { 
      key: 'price', 
      header: 'Price/Unit', 
      width: 130, 
      sortable: false,
      render: (value: any, item: Material) => {
        const price = item.price || '-';
        const unit = item.unit || '-';
        const minimum = item.minimum || 'N/A';
        return (
          <View>
            <Text style={styles.cellText} numberOfLines={1}>
              {price} / {unit}
            </Text>
            <Text style={[styles.cellText, { fontSize: 10, color: '#6B7280' }]} numberOfLines={1}>
              Min: {minimum}
            </Text>
          </View>
        );
      }
    },
    { 
      key: 'lead', 
      header: 'Lead Time', 
      width: 100, 
      sortable: false,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={1}>
          {value || 'N/A'}
        </Text>
      )
    },
    { 
      key: 'notes', 
      header: 'Notes', 
      width: 150, 
      sortable: false,
      render: (value: any) => (
        <Text style={styles.cellText} numberOfLines={2}>
          {value || 'None'}
        </Text>
      )
    },
  ], []);

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="View Supplier" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D253F" />
          <Text style={styles.loadingText}>Loading supplier data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const fullAddress = [street, barangay, city, province, postalCode]
    .filter(Boolean)
    .join(', ');

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader title="View Supplier" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Supplier Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="business" size={32} color="#0D253F" />
          </View>
          
          <Text style={styles.supplierName}>{codeName}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{contactPerson}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color="#6B7280" />
            <Text style={styles.infoText}>
              {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{email}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{contactNumber}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{fullAddress || 'N/A'}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push({ pathname: "/material-suppliers/edit", params: { id: supplierId } })}
            >
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Materials Button */}
        <View style={styles.actionButtonsRow}>
          <Button
            title="Add Materials"
            onPress={() => router.push('/material-suppliers/materials/add')}
            variant="primary"
            size="base"
            icon="add-circle-outline"
            iconPosition="left"
          />
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by client name, brand..."
        />

        {/* Materials Section */}
        <Text style={styles.materialsTitle}>Materials</Text>

        {materials.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No materials available for this supplier</Text>
          </View>
        ) : (
          <View style={{ paddingBottom: 20, zIndex: 1 }}>
            <DataTable 
              columns={columns} 
              data={currentMaterials} 
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              entriesPerPage={entriesPerPage}
              totalEntries={totalMaterials}
              onPageChange={handlePageChange}
              onEntriesChange={handleEntriesChange}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(4),
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },
  scrollContent: { 
    padding: wp(4) 
  },
  infoCard: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: wp(5),
    marginBottom: hp(2),
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  supplierName: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONT_FAMILY.bold,
    color: '#0D253F',
    marginBottom: hp(2),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
    width: '100%',
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
    marginLeft: wp(2),
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: hp(2),
    gap: wp(3),
    width: '100%',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0D253F',
    paddingVertical: hp(1.2),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(1),
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: hp(1.2),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#1F2937',
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.base,
  },
  materialsTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#0D253F',
    marginBottom: hp(1.5),
  },
  cellText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontFamily: 'poppins-regular',
  },
  emptyContainer: {
    padding: wp(4),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#9CA3AF',
  },
});
