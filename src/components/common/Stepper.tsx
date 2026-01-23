import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../constants';

export interface Step {
  title: string;
  id: number;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepPress: (stepId: number) => void;
  style?: ViewStyle;
  chevronSize?: number;
  chevronColor?: string;
}

export default function Stepper({
  steps,
  currentStep,
  onStepPress,
  style,
  chevronSize = 12,
  chevronColor = '#CCC',
}: StepperProps) {
  return (
    <View style={[styles.stepperContainer, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepperContent}
      >
        {steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <TouchableOpacity onPress={() => onStepPress(step.id)}>
              <Text
                style={[
                  styles.stepText,
                  currentStep === step.id && styles.stepTextActive,
                ]}
              >
                {step.title}
              </Text>
            </TouchableOpacity>
            {index < steps.length - 1 && (
              <Ionicons
                name="chevron-forward"
                size={chevronSize}
                color={chevronColor}
                style={styles.chevron}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  stepperContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  stepperContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.medium,
  },
  stepTextActive: {
    color: '#0B1C36',
    fontFamily: FONT_FAMILY.bold,
  },
  chevron: {
    marginHorizontal: 8,
  },
});
