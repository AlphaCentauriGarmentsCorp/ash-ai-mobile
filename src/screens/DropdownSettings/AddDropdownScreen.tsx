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

export default function AddDropdownScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();
  
  const [dropdownTitle, setDropdownTitle] = useState('');
  const [description, setDescription] = useState('');

  const category = params.category as string || '';
  const page = params.page as string || '';

  const handleClear = () => {
    setDropdownTitle('');
    setDescription('');
  };

  const handleSave = () => {
    console.log('Save dropdown:', { category, page, dropdownTitle, description });
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
          title="Add Option"
          breadcrumbBold={`Home / ${category}`}
          breadcrumbNormal={` / ${page} / Add`}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            
            {/* Section: Dropdown Details */}
            <Text style={styles.sectionTitle}>Dropdown Details</Text>
            <View style={styles.divider} />
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Option Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder={`Enter ${category.toLowerCase()} option name`}
                value={dropdownTitle}
                onChangeText={setDropdownTitle}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Enter description here..."
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

          </View>

          {/* Footer */}
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
    color: COLORS.text,
    marginBottom: hp(1.2),
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: hp(1.9),
  },
  inputContainer: {
    marginBottom: hp(1.9),
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
    marginBottom: hp(0.6),
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingHorizontal: wp(2.7),
    paddingVertical: hp(1),
    fontSize: FONT_SIZES.sm,
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },
  textArea: {
    height: hp(15),
    paddingTop: hp(1),
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
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
