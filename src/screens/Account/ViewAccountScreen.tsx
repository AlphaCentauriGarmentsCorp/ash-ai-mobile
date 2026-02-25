import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@components/common/Button';
import type { Step } from '@components/common/Stepper';
import Stepper from '@components/common/Stepper';
import { usePoppinsFonts } from '@hooks';
import { PageHeader } from '@layouts';
import { COLORS } from '@styles';
import { hp, ms, wp } from "@utils/responsive";
import { AccountFormProvider } from '../../context/AccountFormContext';

import AccountAddress from '../../components/specific/Account/AccountAddress';
import AccountDocument from '../../components/specific/Account/AccountDocument';
import AccountJobPosition from '../../components/specific/Account/AccountJobPosition';
import AccountPersonalData from '../../components/specific/Account/AccountPersonalData';

function ViewAccountScreenContent() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fontsLoaded = usePoppinsFonts();
  const [currentStep, setCurrentStep] = useState(0);

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
          title="View Account" 
          breadcrumb="Home / View Account"
        />

        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepPress={setCurrentStep}
          chevronSize={ms(12)}
        />

        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {currentStep === 0 && <AccountPersonalData readOnly onEdit={() => router.push({ pathname: "/Account/edit", params: params })} />}
            {currentStep === 1 && <AccountAddress readOnly onEdit={() => router.push({ pathname: "/Account/edit", params: params })} />}
            {currentStep === 2 && <AccountJobPosition readOnly onEdit={() => router.push({ pathname: "/Account/edit", params: params })} />}
            {currentStep === 3 && <AccountDocument readOnly onEdit={() => router.push({ pathname: "/Account/edit", params: params })} />}
          </View>

          <View style={styles.footer}>
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
                  />
                  <Button
                    title="Done"
                    onPress={() => router.push('/Account')}
                    variant="primary"
                    size="base"
                    style={styles.navBtn}
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

export default function ViewAccountScreen() {
  return (
    <AccountFormProvider>
      <ViewAccountScreenContent />
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
