import Button from '@components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from '@styles';
import { hp, wp } from '@utils/responsive';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

import { materialApi, type Material } from '@api/materialSuppliers';

export default function ViewMaterialScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  const materialId = params.id?.toString();

  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (materialId) {
      fetchMaterialData();
    } else {
      Alert.alert('Error', 'Material ID is missing');
      router.back();
    }
  }, [materialId]);

  const fetchMaterialData = async () => {
    try {
      setIsLoading(true);
      const response = await materialApi.show(Number(materialId));
      
      const materialData = (response as any).data || response;
      setMaterial(materialData);
      
    } catch (error: any) {
      console.error('Error fetching material:', error);
      Alert.alert('Error', 'Failed to load material data');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="View Material" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D253F" />
          <Text style={styles.loadingText}>Loading material data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!material) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="View Material" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Material not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const supplierName = material.supplier?.code_name || material.supplier_name || 'N/A';

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader title="View Material" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Material Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="cube" size={32} color="#0D253F" />
          </View>
          
          <Text style={styles.materialName}>{material.name}</Text>
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{material.material_type}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Ionicons name="pricetag" size={16} color="#6B7280" />
                <Text style={styles.labelText}>Price</Text>
              </View>
              <Text style={styles.valueText}>{material.price || 'N/A'}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Ionicons name="cube-outline" size={16} color="#6B7280" />
                <Text style={styles.labelText}>Unit</Text>
              </View>
              <Text style={styles.valueText}>{material.unit || 'N/A'}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Ionicons name="business" size={16} color="#6B7280" />
                <Text style={styles.labelText}>Supplier</Text>
              </View>
              <Text style={styles.valueText}>{supplierName}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Ionicons name="layers" size={16} color="#6B7280" />
                <Text style={styles.labelText}>Minimum</Text>
              </View>
              <Text style={styles.valueText}>{material.minimum || 'N/A'}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Ionicons name="time" size={16} color="#6B7280" />
                <Text style={styles.labelText}>Lead Time</Text>
              </View>
              <Text style={styles.valueText}>{material.lead || 'N/A'}</Text>
            </View>

            {material.created_at && (
              <View style={styles.detailRow}>
                <View style={styles.detailLabel}>
                  <Ionicons name="calendar" size={16} color="#6B7280" />
                  <Text style={styles.labelText}>Created</Text>
                </View>
                <Text style={styles.valueText}>
                  {new Date(material.created_at).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

          {material.notes && (
            <>
              <View style={styles.divider} />
              <View style={styles.notesSection}>
                <View style={styles.detailLabel}>
                  <Ionicons name="document-text" size={16} color="#6B7280" />
                  <Text style={styles.labelText}>Notes</Text>
                </View>
                <Text style={styles.notesText}>{material.notes}</Text>
              </View>
            </>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push({ pathname: "/material-suppliers/materials/edit", params: { id: materialId } })}
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
  materialName: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONT_FAMILY.bold,
    color: '#0D253F',
    marginBottom: hp(1),
    textAlign: 'center',
  },
  badge: {
    backgroundColor: '#0D253F',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 20,
    marginBottom: hp(2),
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#A5B4BF',
    marginVertical: hp(2),
  },
  detailsGrid: {
    width: '100%',
    gap: hp(1.5),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  labelText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: '#6B7280',
  },
  valueText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#0D253F',
    textAlign: 'right',
    flex: 1,
    marginLeft: wp(2),
  },
  notesSection: {
    width: '100%',
  },
  notesText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#4B5563',
    marginTop: hp(1),
    lineHeight: 20,
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
});
