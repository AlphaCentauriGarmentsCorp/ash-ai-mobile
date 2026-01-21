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

import Button from '../../src/components/common/Button';
import PageHeader from '../../src/components/common/PageHeader';
import type { Step } from '../../src/components/common/Stepper';
import Stepper from '../../src/components/common/Stepper';
import DesignMockup from '../../src/components/specific/Order/DesignMockup';
import OrderInfo from '../../src/components/specific/Order/OrderInfo';
import PaymentSummary from '../../src/components/specific/Order/PaymentSummary';
import PrintArea from '../../src/components/specific/Order/PrintArea';
import { COLORS, FONT_FAMILY } from '../../src/constants';
import { usePoppinsFonts } from '../../src/hooks';
import { hp, ms, rfs, wp } from "../../src/utils/responsive";

export default function AddOrderPage() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    { title: 'Info', id: 0 },
    { title: 'Print', id: 1 },
    { title: 'Design & Mockups', id: 2 },
    { title: 'Payment & Summary', id: 3 },
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else router.back();
  };

  const handleClear = () => {
    console.log('Clear all fields');
  };

  const handleSave = () => {
    console.log('Save');
  };

  const handleSaveAsDraft = () => {
    console.log('Save as draft');
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
          title="Add Order" 
          breadcrumb="Home / Add New Order"
        />

        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepPress={setCurrentStep}
          chevronSize={ms(12)}
        />

        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {currentStep === 0 && <OrderInfo />}
            {currentStep === 1 && <PrintArea />}
            {currentStep === 2 && <DesignMockup />}
            {currentStep === 3 && <PaymentSummary />}
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
                    size="sm"
                    style={StyleSheet.flatten([styles.navBtnSmall, styles.backBtn])}
                    textStyle={styles.backBtnText}
                  />
                  <Button
                    title="Save"
                    onPress={handleSave}
                    variant="primary"
                    size="sm"
                    style={styles.navBtnSmall}
                  />
                  <Button
                    title="Save as Draft"
                    onPress={handleSaveAsDraft}
                    variant="outline"
                    size="sm"
                    style={StyleSheet.flatten([styles.navBtnSmall, styles.backBtn])}
                    textStyle={styles.backBtnText}
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
  navBtnSmall: {
    paddingHorizontal: wp(4.3),
  },
});
