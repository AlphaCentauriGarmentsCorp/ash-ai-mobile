import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import API_CONFIG from '@api/config';
import { equipmentApi, type Equipment } from '@api/equipment';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';

export default function ViewEquipmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  const equipmentId = params.id?.toString();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (equipmentId) {
      fetchEquipmentData();
    } else {
      Alert.alert('Error', 'Equipment ID is missing');
      router.back();
    }
  }, [equipmentId]);

  const fetchEquipmentData = async () => {
    try {
      setIsLoading(true);
      const response = await equipmentApi.show(Number(equipmentId));
      
      const equipmentData = (response as any).data || response;
      setEquipment(equipmentData);
      
    } catch (error: any) {
      console.error('Error fetching equipment:', error);
      Alert.alert('Error', 'Failed to load equipment data');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="View Equipment" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D253F" />
          <Text style={styles.loadingText}>Loading equipment data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!equipment) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="View Equipment" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Equipment not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const available = (equipment.quantity || 0) - (equipment.in_use || 0) - (equipment.missing || 0);
  const locationName = equipment.location?.name || 'N/A';

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader title="View Equipment" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Card with Image/QR */}
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            {equipment.image ? (
              <Image 
                source={{ uri: equipment.image }} 
                style={styles.headerImage}
                resizeMode="cover"
              />
            ) : equipment.qr_code ? (
              <Image 
                source={{ uri: equipment.qr_code }} 
                style={styles.qrCode}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="construct" size={48} color="#A5B4BF" />
              </View>
            )}
            
            <View style={styles.headerInfo}>
              <Text style={styles.equipmentName}>{equipment.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{equipment.status || 'Available'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.totalCard]}>
            <Ionicons name="cube" size={20} color="#3B82F6" />
            <Text style={styles.statValue}>{equipment.quantity || 0}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={[styles.statCard, styles.inUseCard]}>
            <Ionicons name="time" size={20} color="#F59E0B" />
            <Text style={styles.statValue}>{equipment.in_use || 0}</Text>
            <Text style={styles.statLabel}>In Use</Text>
          </View>
          
          <View style={[styles.statCard, styles.availableCard]}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.statValue}>{available}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          
          <View style={[styles.statCard, styles.missingCard]}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={[styles.statValue, (equipment.missing && equipment.missing > 0) ? styles.errorText : null]}>
              {equipment.missing || 0}
            </Text>
            <Text style={styles.statLabel}>Missing</Text>
          </View>
        </View>

        {/* Basic Information Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Item Name</Text>
              <Text style={styles.infoValue}>{equipment.name}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{locationName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Quantity</Text>
              <Text style={styles.infoValue}>{equipment.quantity || 0}</Text>
            </View>

            {equipment.color && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Color</Text>
                <Text style={styles.infoValue}>{equipment.color}</Text>
              </View>
            )}

            {equipment.model && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Model / Type</Text>
                <Text style={styles.infoValue}>{equipment.model}</Text>
              </View>
            )}

            {equipment.material && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Material</Text>
                <Text style={styles.infoValue}>{equipment.material}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Financial Information Section */}
        {(equipment.price || equipment.penalty) && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Financial Information</Text>
            <View style={styles.sectionContent}>
              {equipment.price && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Price</Text>
                  <Text style={styles.infoValue}>{equipment.price}</Text>
                </View>
              )}

              {equipment.penalty && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Penalty</Text>
                  <Text style={styles.infoValue}>{equipment.penalty}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Design Section */}
        {equipment.design && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Design</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.designText}>{equipment.design}</Text>
            </View>
          </View>
        )}

        {/* Description Section */}
        {equipment.description && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.descriptionText}>{equipment.description}</Text>
            </View>
          </View>
        )}

        {/* Media & Documents Section */}
        {(equipment.image || equipment.qr_code || (equipment.receipt && equipment.receipt.length > 0)) && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Media & Documents</Text>
            <View style={styles.mediaContent}>
              {/* Equipment Image */}
              {equipment.image && (
                <View style={styles.mediaItem}>
                  <View style={styles.mediaHeader}>
                    <Ionicons name="image" size={16} color="#6B7280" />
                    <Text style={styles.mediaLabel}>Equipment Image</Text>
                  </View>
                  <Image 
                    source={{ uri: `${API_CONFIG.STORAGE_BASE_URL}${equipment.image}` }} 
                    style={styles.mediaImage}
                    resizeMode="cover"
                  />
                  <View style={styles.mediaActions}>
                    <TouchableOpacity style={styles.mediaActionBtn}>
                      <Ionicons name="eye" size={14} color="#0D253F" />
                      <Text style={styles.mediaActionText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediaActionBtn}>
                      <Ionicons name="download" size={14} color="#0D253F" />
                      <Text style={styles.mediaActionText}>Download</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* QR Code */}
              {equipment.qr_code && (
                <View style={styles.mediaItem}>
                  <View style={styles.mediaHeader}>
                    <Ionicons name="qr-code" size={16} color="#6B7280" />
                    <Text style={styles.mediaLabel}>QR Code</Text>
                  </View>
                  <View style={styles.qrCodeContainer}>
                    <Image 
                      source={{ uri: `${API_CONFIG.STORAGE_BASE_URL}${equipment.qr_code}` }} 
                      style={styles.qrCodeImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.mediaActions}>
                    <TouchableOpacity style={styles.mediaActionBtn}>
                      <Ionicons name="eye" size={14} color="#0D253F" />
                      <Text style={styles.mediaActionText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediaActionBtn}>
                      <Ionicons name="download" size={14} color="#0D253F" />
                      <Text style={styles.mediaActionText}>Download QR Code</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Receipts & Documents */}
              {equipment.receipt && equipment.receipt.length > 0 && (
                <View style={styles.documentsSection}>
                  <View style={styles.mediaHeader}>
                    <Ionicons name="document-text" size={16} color="#6B7280" />
                    <Text style={styles.mediaLabel}>Receipts & Documents</Text>
                  </View>
                  {equipment.receipt.map((receiptUrl, index) => (
                    <View key={index} style={styles.documentItem}>
                      <Ionicons name="document" size={20} color="#EF4444" />
                      <Text style={styles.documentName}>
                        {receiptUrl.split('/').pop() || `Receipt ${index + 1}`}
                      </Text>
                      <TouchableOpacity style={styles.documentActionBtn}>
                        <Ionicons name="download" size={16} color="#0D253F" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push({ pathname: "/inventory/equipment/edit", params: { id: equipmentId } })}
          >
            <Ionicons name="pencil" size={18} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6',
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
    padding: wp(4),
    paddingBottom: hp(4),
  },
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
  headerImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  qrCode: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.bold,
    color: '#0D253F',
    marginBottom: hp(0.5),
  },
  badge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#065F46',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
    marginBottom: hp(2),
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: wp(3),
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: hp(0.5),
  },
  totalCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  inUseCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  availableCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  missingCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  statValue: {
    fontSize: FONT_SIZES['2xl'],
    fontFamily: FONT_FAMILY.bold,
    color: '#0D253F',
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
    color: '#6B7280',
  },
  errorText: {
    color: '#EF4444',
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#0D253F',
    marginBottom: hp(1.5),
  },
  sectionContent: {
    gap: hp(1.2),
  },
  infoRow: {
    backgroundColor: '#F9FAFB',
    padding: wp(3),
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
    color: '#6B7280',
    marginBottom: hp(0.3),
  },
  infoValue: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#0D253F',
  },
  designText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#4B5563',
    lineHeight: 20,
    padding: wp(3),
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#4B5563',
    lineHeight: 20,
    padding: wp(3),
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  mediaContent: {
    gap: hp(2),
  },
  mediaItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: wp(3),
  },
  mediaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1),
  },
  mediaLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: '#6B7280',
  },
  mediaImage: {
    width: '100%',
    height: hp(25),
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    marginBottom: hp(1),
  },
  qrCodeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: wp(3),
    alignItems: 'center',
    marginBottom: hp(1),
  },
  qrCodeImage: {
    width: wp(40),
    height: wp(40),
  },
  mediaActions: {
    flexDirection: 'row',
    gap: wp(2),
    flexWrap: 'wrap',
  },
  mediaActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mediaActionText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
    color: '#0D253F',
  },
  documentsSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: wp(3),
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    backgroundColor: '#FFFFFF',
    padding: wp(2.5),
    borderRadius: 6,
    marginTop: hp(1),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  documentName: {
    flex: 1,
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#4B5563',
  },
  documentActionBtn: {
    padding: wp(1),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: wp(3),
    marginTop: hp(1),
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0D253F',
    paddingVertical: hp(1.5),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(2),
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: hp(1.5),
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
