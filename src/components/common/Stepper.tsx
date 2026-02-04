import { Ionicons } from '@expo/vector-icons';
import { FONT_SIZES } from '@styles';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

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
    backgroundColor: "#EBF6FF",
    paddingVertical: 12,
    borderRadius: 5,
  
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
    color: "#808D99",
    fontFamily: "Poppins_300Light",
  },
  stepTextActive: {
    color: '#001C34',
    fontFamily: "Poppins_600SemiBold",
  },
  chevron: {
    marginHorizontal: 8,
    

  },
});
