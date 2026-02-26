import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@components/common/Button';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';

export default function EditDropdownScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();
  
  const [name, setName] = useState(params.name as string || '');
  const [description, setDescription] = useState(params.description as string || '');

  const category = params.category as string || '';
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  console.log('EditDropdownScreen params:', params);
  console.log('Category:', category, 'ID:', params.id);

  const handleSave = () => {
    console.log('Update dropdown:', { id: params.id, name, description });
    router.back();
  };

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#0a2540" 
        translucent={false}
      />
      <SafeAreaView style={styles.topSafeArea} />
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <PageHeader 
          title={`Edit ${formattedCategory}`}
          breadcrumbBold={`Home / ${formattedCategory}`}
          breadcrumbNormal=" / Edit"
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{formattedCategory}</Text>
            <View style={styles.divider} />
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Label</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Placeholder"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description here..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.actionButtons}>
              <Button
                title="Cancel"
                onPress={() => router.back()}
                variant="outline"
                size="base"
                style={styles.cancelBtn}
                textStyle={styles.cancelText}
              />
              <Button
                title="Save"
                onPress={handleSave}
                variant="primary"
                size="base"
                style={styles.saveBtn}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topSafeArea: {
    flex: 0,
    backgroundColor: '#0a2540',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: wp(4),
  },
  card: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: wp(5.3),
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.bold,
    color: '#0D253F',
    marginBottom: hp(1.2),
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginBottom: hp(1.9),
  },
  inputContainer: {
    marginBottom: hp(1.9),
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: '#0D253F',
    marginBottom: hp(0.6),
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingHorizontal: wp(2.7),
    paddingVertical: hp(1.2),
    fontSize: FONT_SIZES.sm,
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
    color: '#0D253F',
  },
  textArea: {
    height: hp(20),
    paddingTop: hp(1.2),
  },
  footer: {
    marginTop: hp(3.1),
    marginBottom: hp(2.5),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(4),
  },
  cancelBtn: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
    minWidth: wp(26.7),
  },
  cancelText: {
    color: '#1F2937',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#0D253F',
    minWidth: wp(26.7),
  },
});
