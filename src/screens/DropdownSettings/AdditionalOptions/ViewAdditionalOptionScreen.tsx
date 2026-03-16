import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { additionalOptionsApi, type AdditionalOption } from '@api';
import Button from '@components/common/Button';
import { usePoppinsFonts } from '@hooks';
import { Header } from '@layouts';
import { COLORS, SPACING } from '@styles';

export default function ViewAdditionalOptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const fontsLoaded = usePoppinsFonts();

  const optionId = parseInt(params.id as string);

  const [additionalOption, setAdditionalOption] = useState<AdditionalOption | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdditionalOption = async () => {
    try {
      setLoading(true);
      const response = await additionalOptionsApi.show(optionId);
      
      console.log('API Response:', response);
      
      // Handle different response structures
      // If response has success field, use it; otherwise check if we have data
      const isSuccess = response.success !== undefined ? response.success : !!(response.data || (response as any).id);
      
      if (isSuccess) {
        // If response has data field, use it; otherwise use response directly
        const optionData = response.data || response;
        setAdditionalOption(optionData);
      } else {
        Alert.alert('Error', response.message || 'Failed to load additional option');
        router.back();
      }
    } catch (error: any) {
      console.error('Error fetching additional option:', error);
      Alert.alert('Error', 'Failed to load additional option');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (optionId) {
      fetchAdditionalOption();
    }
  }, [optionId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    if (!additionalOption) return;

    Alert.alert(
      'Delete Additional Option',
      `Are you sure you want to delete "${additionalOption.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await additionalOptionsApi.delete(additionalOption.id);
              Alert.alert('Success', 'Additional option deleted successfully', [
                { text: 'OK', onPress: () => router.replace('/dropdown-settings/additional-options' as any) }
              ]);
            } catch (error: any) {
              console.error('Failed to delete additional option:', error);
              Alert.alert('Error', 'Failed to delete additional option. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!additionalOption) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Additional option not found</Text>
      </View>
    );
  }

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
            <Ionicons name="eye-outline" size={24} color="#0D253F" />
          </View>
          <Text style={styles.pageTitleText}>View Additional Option</Text>
        </View>

        <View style={styles.breadcrumbGroup}>
          <Text style={styles.breadcrumbBold}>Home</Text>
          <Text style={styles.breadcrumbNormal}> / Dropdown Settings / Additional Options / View</Text>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.detailsContainer}>
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID:</Text>
              <Text style={styles.detailValue}>{additionalOption.id}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailValue}>{additionalOption.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.detailValue}>
                {additionalOption.description || 'No description provided'}
              </Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Timestamps</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Created At:</Text>
              <Text style={styles.detailValue}>{formatDate(additionalOption.created_at)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Updated At:</Text>
              <Text style={styles.detailValue}>{formatDate(additionalOption.updated_at)}</Text>
            </View>
          </View>

          <View style={styles.actionButtonsContainer}>
            <Button
              title="Back to List"
              onPress={() => router.back()}
              variant="outline"
              size="base"
              style={styles.backButton}
            />

            <Button
              title="Edit"
              onPress={() => router.push(`/dropdown-settings/additional-options/edit/${additionalOption.id}` as any)}
              variant="primary"
              size="base"
              style={styles.editButton}
            />

            <Button
              title="Delete"
              onPress={handleDelete}
              variant="outline"
              size="base"
              style={styles.deleteButton}
            />
          </View>
        </View>

        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
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
  breadcrumbGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbBold: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#001C34',
  },
  breadcrumbNormal: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#001C34',
  },
  detailsContainer: {
    padding: SPACING.base,
  },
  detailsSection: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.base,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0D253F',
    marginBottom: SPACING.base,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#6B7280',
    width: 120,
    flexShrink: 0,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#1F2937',
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  backButton: {
    flex: 1,
    minWidth: 100,
  },
  editButton: {
    flex: 1,
    minWidth: 100,
  },
  deleteButton: {
    flex: 1,
    minWidth: 100,
    borderColor: '#F44336',
  },
});