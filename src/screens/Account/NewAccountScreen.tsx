import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { employeeService } from '@api';
import Button from '@components/common/Button';
import type { Step } from '@components/common/Stepper';
import Stepper from '@components/common/Stepper';
import { AccountFormProvider, useAccountForm } from '@context/AccountFormContext';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY } from '@styles';
import { hp, ms, rfs, wp } from "@utils/responsive";

import AccountAddress from '../../components/specific/Account/AccountAddress';
import AccountDocument from '../../components/specific/Account/AccountDocument';
import AccountJobPosition from '../../components/specific/Account/AccountJobPosition';
import AccountPersonalData from '../../components/specific/Account/AccountPersonalData';

function NewAccountScreenContent() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { formData, clearFormData } = useAccountForm();

  const steps: Step[] = [
    { title: 'Personal Data', id: 0 },
    { title: 'Address', id: 1 },
    { title: 'Job Position & Roles', id: 2 },
    { title: 'Document', id: 3 },
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else router.back();
  };

  const handleClear = () => {
    clearFormData();
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.username) {
        Alert.alert('Validation Error', 'Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Get selected roles as an array
      const selectedRoles = Object.entries(formData.roleAccess)
        .filter(([_, isSelected]) => isSelected)
        .map(([role, _]) => role);

      // Prepare data for API with all required fields
      const accountData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        username: formData.username,
        contact_number: formData.contactNumber || '',
        birthdate: formData.birthdate || '',
        gender: formData.gender || '',
        civil_status: formData.civilStatus || '',
        position: formData.jobPosition || '',
        department: formData.department || '',
        roles: selectedRoles.length > 0 ? selectedRoles : ['developer'],
        // Optional fields
        middle_name: formData.middleName || '',
        current_street: formData.currentStreet || '',
        current_province: formData.currentProvince || '',
        current_barangay: formData.currentBarangay || '',
        current_city: formData.currentCity || '',
        current_postal_code: formData.currentPostalCode || '',
        permanent_street: formData.permanentStreet || '',
        permanent_province: formData.permanentProvince || '',
        permanent_barangay: formData.permanentBarangay || '',
        permanent_city: formData.permanentCity || '',
        permanent_postal_code: formData.permanentPostalCode || '',
        pag_ibig_no: formData.pagIbigNo || '',
        sss_no: formData.sssNo || '',
        philhealth_no: formData.philhealthNo || '',
      };

      console.log('Creating account with data:', accountData);
      
      await employeeService.createEmployee(accountData);
      
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            clearFormData();
            router.back();
          }
        }
      ]);
    } catch (error: any) {
      console.error('Error creating account:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
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
          title="Add Account" 
          breadcrumb="Home / Add Accounts"
        />

        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepPress={setCurrentStep}
          chevronSize={ms(12)}
        />

        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {currentStep === 0 && <AccountPersonalData />}
            {currentStep === 1 && <AccountAddress />}
            {currentStep === 2 && <AccountJobPosition />}
            {currentStep === 3 && <AccountDocument />}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButtonContainer} onPress={handleClear}>
              <Text style={styles.clearText}>Clear all fields</Text>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              {currentStep < 3 ? (
                <>
                  <Button
                    title="Back"
                    onPress={handleBack}
                    variant="outline"
                    size="base"
                    style={StyleSheet.flatten([styles.navBtn, styles.backBtn])}
                    textStyle={styles.backBtnText}
                  />
                  <Button
                    title="Next"
                    onPress={handleNext}
                    variant="primary"
                    size="base"
                    style={styles.navBtn}
                  />
                </>
              ) : (
                <>
                  <Button
                    title="Back"
                    onPress={handleBack}
                    variant="outline"
                    size="base"
                    style={StyleSheet.flatten([styles.navBtn, styles.backBtn])}
                    textStyle={styles.backBtnText}
                    disabled={loading}
                  />
                  <Button
                    title={loading ? "Saving..." : "Save"}
                    onPress={handleSave}
                    variant="primary"
                    size="base"
                    style={styles.navBtn}
                    disabled={loading}
                  />
                </>
              )}
            </View>
          </View>
        </ScrollView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0D253F" />
            <Text style={styles.loadingText}>Creating account...</Text>
          </View>
        )}
      </View>
    </>
  );
}

export default function NewAccountScreen() {
  return (
    <AccountFormProvider>
      <NewAccountScreenContent />
    </AccountFormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1C36',
  },
  topSafeArea: {
    flex: 0,
    backgroundColor: '#0B1C36',
  },
  mainContent: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  formContainer: {
    padding: wp(4.3),
    paddingBottom: hp(1),
  },
  footer: {
    paddingHorizontal: wp(4.3),
    paddingBottom: hp(2.5),
    backgroundColor: COLORS.white,
  },
  clearButtonContainer: {
    alignSelf: 'flex-end',
    marginBottom: hp(1.5),
  },
  clearText: {
    fontSize: rfs(10),
    textDecorationLine: 'underline',
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.regular,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(2.7),
  },
  navBtn: {
    minWidth: wp(26.7),
  },
  backBtn: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
  backBtnText: {
    color: '#1F2937',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: hp(1),
    fontSize: rfs(14),
    color: COLORS.white,
    fontFamily: FONT_FAMILY.medium,
  },
});
