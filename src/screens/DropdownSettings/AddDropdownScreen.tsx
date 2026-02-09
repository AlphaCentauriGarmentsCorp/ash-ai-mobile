import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@components/common/Button';
import FormInput from '@components/common/FormInput';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, SPACING } from '@styles';

export default function AddDropdownScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleClear = () => {
    setName('');
    setDescription('');
  };

  const handleSave = () => {
    console.log('Save dropdown:', { name, description });
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
          title="Add Dropdown" 
          breadcrumbBold="Home / Dropdown Settings"
          breadcrumbNormal=" / Add"
        />

        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <FormInput
              value={name}
              onChangeText={setName}
              placeholder="Enter dropdown name"
            />

            <FormInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButtonContainer} onPress={handleClear}>
              <Text style={styles.clearText}>Clear all fields</Text>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <Button
                title="Back"
                onPress={() => router.back()}
                variant="outline"
                size="base"
              />
              <Button
                title="Save"
                onPress={handleSave}
                variant="primary"
                size="base"
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
  mainContent: {
    flex: 1,
    paddingHorizontal: SPACING.base,
  },
  formContainer: {
    paddingTop: SPACING.lg,
    gap: SPACING.base,
  },
  footer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  clearButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.base,
  },
  clearText: {
    color: '#0D253F',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    textDecorationLine: 'underline',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.base,
  },
});
