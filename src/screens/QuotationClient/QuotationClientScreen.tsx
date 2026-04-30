import Header from '@/layouts/Header';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type StepProps = {
  form: QuotationClientForm;
  setForm: React.Dispatch<React.SetStateAction<QuotationClientForm>>;
  onNext?: () => void;
  onPrev?: () => void;
  onSubmit?: () => void;
};

type QuotationClientForm = {
  frontDesign: boolean;
  backDesign: boolean;

  designMethod: string;
  designNotes: string;

  tshirtColor: string;
  printColorCount: string;
  printColors: string[];
  colorNotes: string;

  fullName: string;
  email: string;
  phone: string;
  company: string;
  urgencyLevel: string;
  preferredDeliveryDate: string;
  additionalNotes: string;
};

const initialForm: QuotationClientForm = {
  frontDesign: false,
  backDesign: false,

  designMethod: '',
  designNotes: '',

  tshirtColor: '',
  printColorCount: '',
  printColors: [],
  colorNotes: '',

  fullName: '',
  email: '',
  phone: '',
  company: '',
  urgencyLevel: '',
  preferredDeliveryDate: '',
  additionalNotes: '',
};

export default function QuotationClientScreen() {
const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<QuotationClientForm>(initialForm);
  const insets = useSafeAreaInsets();

  const canGoNextStep1 = form.frontDesign || form.backDesign;
  const canGoNextStep2 = !!form.designMethod;
  const canGoNextStep3 = !!form.tshirtColor && !!form.printColorCount;

  const summary = useMemo(() => {
    const locations = [
      form.frontDesign ? 'Front' : null,
      form.backDesign ? 'Back' : null,
    ].filter(Boolean).join(', ');

    return {
      locations: locations || '-',
      method: form.designMethod || '-',
      tshirtColor: form.tshirtColor || '-',
      printColorCount: form.printColorCount || '-',
      printColors: form.printColors.length ? form.printColors.join(', ') : '-',
    };
  }, [form]);

  const handleSubmit = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      Alert.alert('Validation Error', 'Please fill in Full Name, Email, and Phone Number.');
      return;
    }

    Alert.alert('Submitted', 'Quotation request submitted successfully.');
    console.log('Quotation Client Form:', form);
  };

  return (
    <SafeAreaView style={styles.container}>
    <Header />

    <View style={styles.pageTitleBar}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.pageTitleText}>Request a Quotation</Text>
    </View>

    <Stepper currentStep={step} />

      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && (
          <StepFrontBack
            form={form}
            setForm={setForm}
            onNext={() => {
              if (!canGoNextStep1) {
                Alert.alert('Required', 'Please select at least one design option.');
                return;
              }
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <StepDesigns
            form={form}
            setForm={setForm}
            onPrev={() => setStep(1)}
            onNext={() => {
              if (!canGoNextStep2) {
                Alert.alert('Required', 'Please select a design method.');
                return;
              }
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <StepColors
            form={form}
            setForm={setForm}
            onPrev={() => setStep(2)}
            onNext={() => {
              if (!canGoNextStep3) {
                Alert.alert('Required', 'Please complete the color selection.');
                return;
              }
              setStep(4);
            }}
          />
        )}

        {step === 4 && (
          <StepOverview
            form={form}
            setForm={setForm}
            onPrev={() => setStep(3)}
            onSubmit={handleSubmit}
            summary={summary}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stepper({ currentStep }: { currentStep: number }) {
  const items = [
    { step: 1, title: 'Front & Back', subtitle: 'Choose design locations' },
    { step: 2, title: 'Designs', subtitle: 'Upload or select designs' },
    { step: 3, title: 'Colors', subtitle: 'Select colors' },
    { step: 4, title: 'Overview', subtitle: 'Review and submit' },
  ];

  return (
    <View style={styles.stepperWrap}>
      {items.map((item, index) => {
        const done = currentStep > item.step;
        const active = currentStep === item.step;

        return (
          <React.Fragment key={item.step}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  done && styles.stepCircleDone,
                  active && styles.stepCircleActive,
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                ) : (
                  <Text style={[styles.stepCircleText, active && { color: '#fff' }]}>
                    {item.step}
                  </Text>
                )}
              </View>
              <Text style={[styles.stepTitle, (done || active) && styles.stepTitleActive]}>
                {item.title}
              </Text>
              <Text style={styles.stepSub}>{item.subtitle}</Text>
            </View>

            {index < items.length - 1 && <View style={styles.stepLine} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

function StepFrontBack({ form, setForm, onNext }: StepProps) {
  return (
    <Card title="Front & Back Design" subtitle="Select which sides of the t-shirt you want to customize">
      <TouchableOpacity
        style={[styles.optionBox, form.frontDesign && styles.optionBoxSelected]}
        onPress={() => setForm(prev => ({ ...prev, frontDesign: !prev.frontDesign }))}
      >
        <Ionicons name="shirt-outline" size={20} color="#0D253F" />
        <View style={styles.optionTextWrap}>
          <Text style={styles.optionTitle}>Front Design</Text>
          <Text style={styles.optionDesc}>Add a design to the front of the t-shirt</Text>
        </View>
        <View style={[styles.checkbox, form.frontDesign && styles.checkboxChecked]}>
          {form.frontDesign && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionBox, form.backDesign && styles.optionBoxSelected]}
        onPress={() => setForm(prev => ({ ...prev, backDesign: !prev.backDesign }))}
      >
        <Ionicons name="shirt-outline" size={20} color="#0D253F" />
        <View style={styles.optionTextWrap}>
          <Text style={styles.optionTitle}>Back Design</Text>
          <Text style={styles.optionDesc}>Add a design to the back of the t-shirt</Text>
        </View>
        <View style={[styles.checkbox, form.backDesign && styles.checkboxChecked]}>
          {form.backDesign && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
      </TouchableOpacity>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>Please select at least one design option</Text>
      </View>

      <FooterNav onNext={onNext} stepText="Step 1 of 4" />
    </Card>
  );
}

function StepDesigns({ form, setForm, onPrev, onNext }: StepProps) {
  const methods = ['Upload Own Design', 'Choose Existing Design', 'Need Design Assistance'];

  return (
    <Card title="Design Details" subtitle="Tell us more about your design preferences">
      <Text style={styles.label}>How would you like to provide your design?</Text>
      <View style={styles.selectWrap}>
        {methods.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.selectOption, form.designMethod === m && styles.selectOptionActive]}
            onPress={() => setForm(prev => ({ ...prev, designMethod: m }))}
          >
            <Text style={[styles.selectOptionText, form.designMethod === m && styles.selectOptionTextActive]}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Design Notes & Specifications</Text>
      <InputBox
        placeholder="Provide any additional details about your design"
        value={form.designNotes}
        onChangeText={(text) => setForm(prev => ({ ...prev, designNotes: text }))}
      />

      <FooterNav onPrev={onPrev} onNext={onNext} stepText="Step 2 of 4" />
    </Card>
  );
}

function StepColors({ form, setForm, onPrev, onNext }: StepProps) {
  const tshirtColors = ['White', 'Black', 'Navy', 'Red', 'Gray', 'Green', 'Yellow'];
  const printCountOptions = ['1 Color', '2 Colors', '3 Colors', '4 Colors'];
  const printColorOptions = ['White', 'Black', 'Blue', 'Red', 'Gray', 'Green', 'Yellow'];

  const togglePrintColor = (color: string) => {
    setForm(prev => ({
      ...prev,
      printColors: prev.printColors.includes(color)
        ? prev.printColors.filter(c => c !== color)
        : [...prev.printColors, color],
    }));
  };

  return (
    <Card title="Color Selection" subtitle="Choose your t-shirt and print colors">
      <Text style={styles.label}>T-Shirt Base Color</Text>
      <View style={styles.selectWrap}>
        {tshirtColors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.selectOption, form.tshirtColor === color && styles.selectOptionActive]}
            onPress={() => setForm(prev => ({ ...prev, tshirtColor: color }))}
          >
            <Text style={[styles.selectOptionText, form.tshirtColor === color && styles.selectOptionTextActive]}>
              {color}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Number of Print Colors</Text>
      <View style={styles.selectWrap}>
        {printCountOptions.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.selectOption, form.printColorCount === item && styles.selectOptionActive]}
            onPress={() => setForm(prev => ({ ...prev, printColorCount: item }))}
          >
            <Text style={[styles.selectOptionText, form.printColorCount === item && styles.selectOptionTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Select Print Colors</Text>
      <View style={styles.colorChipWrap}>
        {printColorOptions.map((color) => {
          const active = form.printColors.includes(color);
          return (
            <TouchableOpacity
              key={color}
              style={[styles.colorChip, active && styles.colorChipActive]}
              onPress={() => togglePrintColor(color)}
            >
              <Text style={[styles.colorChipText, active && styles.colorChipTextActive]}>{color}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Color Notes</Text>
      <InputBox
        placeholder="Any specific color requirements?"
        value={form.colorNotes}
        onChangeText={(text) => setForm(prev => ({ ...prev, colorNotes: text }))}
      />

      <FooterNav onPrev={onPrev} onNext={onNext} stepText="Step 3 of 4" />
    </Card>
  );
}

function StepOverview({
  form,
  setForm,
  onPrev,
  onSubmit,
  summary,
}: StepProps & { summary: any }) {
  const urgencyOptions = ['Rush', 'Normal (2-3 weeks)', 'Flexible'];

  return (
    <Card title="Review & Submit" subtitle="Review your quotation details and provide contact information">
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Quotation Summary</Text>
        <Text style={styles.summaryItem}>Design Locations: {summary.locations}</Text>
        <Text style={styles.summaryItem}>Design Method: {summary.method}</Text>
        <Text style={styles.summaryItem}>T-Shirt Color: {summary.tshirtColor}</Text>
        <Text style={styles.summaryItem}>Print Color Count: {summary.printColorCount}</Text>
        <Text style={styles.summaryItem}>Print Colors: {summary.printColors}</Text>
      </View>

      <Text style={styles.sectionHeader}>Your Information</Text>
      <InputBox
        placeholder="Full Name"
        value={form.fullName}
        onChangeText={(text) => setForm(prev => ({ ...prev, fullName: text }))}
      />
      <InputBox
        placeholder="Email Address"
        value={form.email}
        onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
      />
      <InputBox
        placeholder="Phone Number"
        value={form.phone}
        onChangeText={(text) => setForm(prev => ({ ...prev, phone: text }))}
      />
      <InputBox
        placeholder="Company Name (optional)"
        value={form.company}
        onChangeText={(text) => setForm(prev => ({ ...prev, company: text }))}
      />

      <Text style={styles.sectionHeader}>Additional Details</Text>
      <View style={styles.selectWrap}>
        {urgencyOptions.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.selectOption, form.urgencyLevel === item && styles.selectOptionActive]}
            onPress={() => setForm(prev => ({ ...prev, urgencyLevel: item }))}
          >
            <Text style={[styles.selectOptionText, form.urgencyLevel === item && styles.selectOptionTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <InputBox
        placeholder="Preferred Delivery Date"
        value={form.preferredDeliveryDate}
        onChangeText={(text) => setForm(prev => ({ ...prev, preferredDeliveryDate: text }))}
      />
      <InputBox
        placeholder="Additional Notes"
        value={form.additionalNotes}
        onChangeText={(text) => setForm(prev => ({ ...prev, additionalNotes: text }))}
        multiline
      />

      <View style={styles.readyBox}>
        <Text style={styles.readyText}>Ready to Submit</Text>
      </View>

      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.prevBtn} onPress={onPrev}>
          <Text style={styles.prevBtnText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.stepFooterText}>Step 4 of 4</Text>

        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
          <Text style={styles.submitBtnText}>Submit Quotation</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      {children}
    </View>
  );
}

function InputBox({
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  const { TextInput } = require('react-native');
  return (
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
    />
  );
}

function FooterNav({
  onPrev,
  onNext,
  stepText,
}: {
  onPrev?: () => void;
  onNext?: () => void;
  stepText: string;
}) {
  return (
    <View style={styles.footerRow}>
      <TouchableOpacity
        style={[styles.prevBtn, !onPrev && styles.prevBtnDisabled]}
        onPress={onPrev}
        disabled={!onPrev}
      >
        <Text style={styles.prevBtnText}>Previous</Text>
      </TouchableOpacity>

      <Text style={styles.stepFooterText}>{stepText}</Text>

      <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
        <Text style={styles.nextBtnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  topBar: {
  paddingHorizontal: 20,
  paddingBottom: 14,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#E2E8F0',
},

topTitle: {
  fontSize: 22,
  fontWeight: '800',
  color: '#0F172A',
},

topSubtitle: {
  marginTop: 4,
  fontSize: 13,
  color: '#64748B',
},
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 18,
    backgroundColor: '#fff',
  },
  stepItem: {
    width: 78,
    alignItems: 'center',
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: '#0D253F',
  },
  stepCircleDone: {
    backgroundColor: '#22C55E',
  },
  stepCircleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'center',
  },
  stepTitleActive: {
    color: '#0F172A',
  },
  stepSub: {
    fontSize: 9,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
  },
  stepLine: {
    width: 26,
    height: 2,
    backgroundColor: '#D1D5DB',
    marginTop: 16,
    marginHorizontal: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  optionBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionBoxSelected: {
    borderColor: '#0D253F',
    backgroundColor: '#EFF6FF',
  },
  optionTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  checkboxChecked: {
    backgroundColor: '#0D253F',
    borderColor: '#0D253F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 8,
  },
  selectWrap: {
    marginBottom: 8,
  },
  selectOption: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectOptionActive: {
    backgroundColor: '#0D253F',
    borderColor: '#0D253F',
  },
  selectOptionText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
  selectOptionTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  colorChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  colorChip: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  colorChipActive: {
    backgroundColor: '#0D253F',
    borderColor: '#0D253F',
  },
  colorChipText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 13,
  },
  colorChipTextActive: {
    color: '#fff',
  },
  summaryBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  summaryItem: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 6,
  },
  readyBox: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    marginBottom: 16,
  },
  readyText: {
    color: '#166534',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  prevBtn: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  prevBtnDisabled: {
    opacity: 0.5,
  },
  prevBtnText: {
    color: '#334155',
    fontWeight: '700',
  },
  nextBtn: {
    backgroundColor: '#0D253F',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  stepFooterText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  pageTitleBar: {
  backgroundColor: '#0D253F',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 14,
},

backButton: {
  marginRight: 8,
},

pageTitleText: {
  fontSize: 20,
  fontWeight: '800',
  color: '#fff',
},
});