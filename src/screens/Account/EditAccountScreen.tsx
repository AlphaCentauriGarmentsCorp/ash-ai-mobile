import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS, FONT_FAMILY } from '@styles';
import { hp, ms, rfs, wp } from "@utils/responsive";
import { AccountFormProvider, useAccountForm } from '../../context/AccountFormContext';

import AccountAddress from '../../components/specific/Account/AccountAddress';
import AccountDocument from '../../components/specific/Account/AccountDocument';
import AccountJobPosition from '../../components/specific/Account/AccountJobPosition';
import AccountPersonalData from '../../components/specific/Account/AccountPersonalData';

function EditAccountScreenContent() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { formData, updateFormData, clearFormData } = useAccountForm();

  const accountId = params.id as string;

  useEffect(() => {
    if (accountId) {
      fetchAccountData();
    }
  }, [accountId]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      console.log('Fetching account with ID:', accountId);
      console.log('Endpoint:', `/employee/${accountId}`);
      const account = await employeeService.getEmployeeById(accountId);
      console.log('Account data received:', account);
      
      // Parse the name into first, middle, last
      const nameParts = account.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
      const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

      // Populate form with account data
      updateFormData({
        firstName,
        middleName,
        lastName,
        email: account.email || '',
        // Add other fields as they come from the API
        // Note: You may need to adjust based on what fields the API returns
      });
    } catch (error: any) {
      console.error('Error fetching account:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Full URL attempted:', error.config?.url);
      
      let errorMessage = 'Failed to load account data. ';
      
      if (error.response?.status === 404) {
        errorMessage += 'The account does not exist.';
      } else if (error.response?.status === 401) {
        errorMessage += 'You are not authorized. Please log in again.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. Check your Laravel backend logs.';
      } else if (error.message === 'Network Error') {
        errorMessage += 'Cannot connect to server. Check if backend is running.';
      } else {
        errorMessage += error.response?.data?.message || 'The endpoint may not be available.';
      }
      
      Alert.alert('Error', errorMessage);
      router.back();
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        Alert.alert('Validation Error', 'Please fill in all required fields');
        setSaving(false);
        return;
      }

      // Get selected roles as an array
      const selectedRoles = Object.entries(formData.roleAccess)
        .filter(([_, isSelected]) => isSelected)
        .map(([role, _]) => role);

      // Prepare data for API
      const accountData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        username: formData.username,
        contact_number: formData.contactNumber || '',
        birthdate: formData.birthdate || '',
        gender: formData.gender || '',
        civil_status: formData.civilStatus || '',
        position: formData.jobPosition || '',
        department: formData.department || '',
        roles: selectedRoles.length > 0 ? selectedRoles : ['developer'],
        middle_name: formData.middleName || '',
      };

      console.log('Updating account with data:', accountData);
      
      await employeeService.updateEmployee(accountId, accountData);
      
      Alert.alert('Success', 'Account updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (error: any) {
      console.error('Error updating account:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update account. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0D253F" />
        <Text style={{ marginTop: 10, color: COLORS.white }}>Loading account...</Text>
      </View>
    );
  }

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
          title="Edit Account" 
          breadcrumb="Home / Edit Account"
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
                    disabled={saving}
                  />
                  <Button
                    title={saving ? "Saving..." : "Save"}
                    onPress={handleSave}
                    variant="primary"
                    size="base"
                    style={styles.navBtn}
                    disabled={saving}
                  />
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

export default function EditAccountScreen() {
  return (
    <AccountFormProvider>
      <EditAccountScreenContent />
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
});
