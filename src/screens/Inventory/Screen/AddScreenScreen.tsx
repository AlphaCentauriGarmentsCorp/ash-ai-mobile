import Button from '@components/common/Button';
import { PageHeader } from '@layouts';
import { COLORS } from '@styles';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddScreenScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    Alert.alert('Info', 'Screen creation not yet implemented');
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Add Screen" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Screen Details</Text>
          <Text style={styles.infoText}>Screen form will be implemented here</Text>
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="secondary"
              size="base"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title={isSubmitting ? "Saving..." : "Save Screen"}
              onPress={handleSubmit}
              variant="primary"
              size="base"
              disabled={isSubmitting}
            />
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
  scrollContent: { 
    padding: 16,
    paddingBottom: 32,
  },
  formCard: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D253F',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  buttonWrapper: {
    flex: 1,
  },
});
