import { Ionicons } from '@expo/vector-icons';
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
import { hp, ms, rfs, wp } from "../../utils/responsive";
import DesignMockup from './components/DesignMockup';
import OrderInfo from './components/OrderInfo';
import PaymentSummary from './components/PaymentSummary';
import PrintArea from './components/PrintArea';

export default function AddOrderPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); 

  // Steps Configuration
  const steps = [
    { title: 'Info', id: 0 },
    { title: 'Print', id: 1 },
    { title: 'Design & Mockups', id: 2 },
    { title: 'Payment & Summary', id: 3 },
  ];

  const handleNext = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const handleBack = () => { 
      if (currentStep > 0) setCurrentStep(currentStep - 1);
      else router.back(); 
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0B1C36" />
      <SafeAreaView style={styles.topSafeArea} />
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        
        {/* --- Top Header --- */}
        <View style={styles.headerTop}>
           <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
             <Ionicons name="chevron-back" size={ms(24)} color="#FFF" />
           </TouchableOpacity>
           <Text style={styles.headerTitle}>Add Order</Text>
           <Text style={styles.headerBreadcrumb}>Home / Add New Order</Text>
        </View>

      {/* --- Stepper --- */}
      <View style={styles.stepperContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepperContent}>
           {steps.map((step, index) => (
             <View key={index} style={styles.stepItem}>
               <TouchableOpacity onPress={() => setCurrentStep(index)}>
                 <Text style={[styles.stepText, currentStep === index && styles.stepTextActive]}>{step.title}</Text>
               </TouchableOpacity>
               {index < steps.length - 1 && <Ionicons name="chevron-forward" size={ms(12)} color="#CCC" style={{marginHorizontal: wp(2.1)}} />}
             </View>
           ))}
        </ScrollView>
      </View>

      {/* --- Main Content --- */}
      <View style={styles.mainContent}>
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
                {currentStep === 0 && <OrderInfo />}
                {currentStep === 1 && <PrintArea />}
                {currentStep === 2 && <DesignMockup />}
                {currentStep === 3 && <PaymentSummary />}
                
                <TouchableOpacity style={styles.clearLink}>
                    <Text style={styles.clearText}>Clear all fields</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
      </View>

      {/* --- Bottom Footer --- */}
      <SafeAreaView style={styles.bottomSafeArea}>
        <View style={styles.bottomNav}>
            {/* Logic for buttons changes on last step */}
            {currentStep < 3 ? (
                <>
                  <TouchableOpacity style={styles.navBtnOutline} onPress={handleBack}>
                      <Text style={styles.navBtnTextOutline}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.navBtnFilled} onPress={handleNext}>
                      <Text style={styles.navBtnTextFilled}>Next</Text>
                  </TouchableOpacity>
                </>
            ) : (
                <>
                   <TouchableOpacity style={styles.navBtnOutlineSmall} onPress={handleBack}>
                      <Text style={styles.navBtnTextOutline}>Back</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.navBtnFilledSmall}>
                      <Text style={styles.navBtnTextFilled}>Save</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.navBtnOutlineSmall}>
                      <Text style={styles.navBtnTextOutline}>Save as Draft</Text>
                   </TouchableOpacity>
                </>
            )}
        </View>
      </SafeAreaView>
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
  bottomSafeArea: {
    flex: 0,
    backgroundColor: '#FFF',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4.3),
    paddingBottom: hp(2),
    paddingTop: hp(1.2),
    backgroundColor: '#0B1C36',
  },
  backBtn: {
    padding: ms(4),
    marginRight: wp(2.1),
  },
  headerTitle: {
    fontSize: rfs(20),
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
  },
  headerBreadcrumb: {
    fontSize: rfs(10),
    color: '#AAA',
  },
  stepperContainer: {
    backgroundColor: '#F5F7FA',
    paddingVertical: hp(1.5),
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  stepperContent: {
    paddingHorizontal: wp(4.3),
    alignItems: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    fontSize: rfs(12),
    color: '#999',
    fontWeight: '500',
  },
  stepTextActive: {
    color: '#0B1C36',
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentScroll: {
    flex: 1,
  },
  formContainer: {
    padding: wp(4.3),
    paddingBottom: hp(2.5),
  },
  clearLink: {
    alignSelf: 'flex-end',
    marginTop: hp(1),
  },
  clearText: {
    fontSize: rfs(10),
    textDecorationLine: 'underline',
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: hp(2),
    backgroundColor: '#FFF',
    gap: wp(2.7),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navBtnOutline: {
    borderWidth: 1,
    borderColor: '#D1D9E6',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(8),
    borderRadius: ms(20),
    minWidth: wp(26.7),
    alignItems: 'center',
  },
  navBtnFilled: {
    backgroundColor: '#0B1C36',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(8),
    borderRadius: ms(20),
    minWidth: wp(26.7),
    alignItems: 'center',
  },
  navBtnTextOutline: {
    color: '#333',
    fontSize: rfs(12),
    fontWeight: '600',
  },
  navBtnTextFilled: {
    color: '#FFF',
    fontSize: rfs(12),
    fontWeight: '600',
  },
  navBtnOutlineSmall: {
    borderWidth: 1,
    borderColor: '#D1D9E6',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4.3),
    borderRadius: ms(20),
    alignItems: 'center',
  },
  navBtnFilledSmall: {
    backgroundColor: '#0B1C36',
    paddingVertical: hp(1),
    paddingHorizontal: wp(5.3),
    borderRadius: ms(20),
    alignItems: 'center',
  },
});