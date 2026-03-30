import { Ionicons } from '@expo/vector-icons';
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

import { screenApi, type Screen } from '@api/screens';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from '@styles';
import { hp, wp } from '@utils/responsive';

export default function ViewScreenScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();

  const screenId = params.id?.toString();

  const [screen, setScreen] = useState<Screen | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (screenId) {
      fetchScreenData();
    } else {
      Alert.alert('Error', 'Screen ID is missing');
      router.back();
    }
  }, [screenId]);

  const fetchScreenData = async () => {
    try {
      setIsLoading(true);
      const response = await screenApi.show(Number(screenId));
      
      const screenData = (response as any).data || response;
      setScreen(screenData);
      
    } catch (error: any) {
      console.error('Error fetching screen:', error);
      Alert.alert('Error', 'Failed to load screen data');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="View Screen" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D253F" />
          <Text style={styles.loadingText}>Loading screen data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!screen) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageHeader title="View Screen" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Screen not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status?: string) => {
    const statusLower = status?.toLowerCase() || 'active';
    if (statusLower === 'active') return { bg: '#D1FAE5', text: '#065F46' };
    if (statusLower === 'inactive') return { bg: '#FEE2E2', text: '#991B1B' };
    return { bg: '#E5E7EB', text: '#6B7280' };
  };

  const statusColors = getStatusColor(screen.status);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <PageHeader title="View Screen" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="grid" size={40} color="#0D253F" />
            </View>
            
            <View style={styles.headerInfo}>
              <Text style={styles.screenName}>{screen.name || 'Unnamed Screen'}</Text>
              <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
                <Text style={[styles.badgeText, { color: statusColors.text }]}>
                  {screen.status || 'Active'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.totalUseCard]}>
            <Ionicons name="repeat" size={20} color="#3B82F6" />
            <Text style={styles.statValue}>{screen.total_use || 0}</Text>
            <Text style={styles.statLabel}>Total Uses</Text>
          </View>
          
          <View style={[styles.statCard, styles.meshCard]}>
            <Ionicons name="grid" size={20} color="#8B5CF6" />
            <Text style={styles.statValue}>{screen.mesh_count || 0}</Text>
            <Text style={styles.statLabel}>Mesh Count</Text>
          </View>
        </View>

        {/* Basic Information Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Design Name</Text>
              <Text style={styles.infoValue}>{screen.name || 'N/A'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{screen.address || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Size</Text>
              <Text style={styles.infoValue}>{screen.size || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mesh Count</Text>
              <Text style={styles.infoValue}>{screen.mesh_count || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Usage History Section */}
        {(screen.last_maintenance || screen.last_used) && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Usage History</Text>
            <View style={styles.sectionContent}>
              {screen.last_maintenance && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Last Maintenance</Text>
                  <Text style={styles.infoValue}>
                    {new Date(screen.last_maintenance).toLocaleDateString()}
                  </Text>
                </View>
              )}

              {screen.last_used && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Last Used</Text>
                  <Text style={styles.infoValue}>
                    {new Date(screen.last_used).toLocaleDateString()}
                  </Text>
                </View>
              )}

              {screen.created_at && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Created Date</Text>
                  <Text style={styles.infoValue}>
                    {new Date(screen.created_at).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push({ pathname: "/inventory/screen/edit", params: { id: screenId } })}
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#EBF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A5B4BF',
  },
  headerInfo: {
    flex: 1,
  },
  screenName: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.bold,
    color: '#0D253F',
    marginBottom: hp(0.5),
  },
  badge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: wp(2),
    marginBottom: hp(2),
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: wp(3),
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: hp(0.5),
  },
  totalUseCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  meshCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
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
