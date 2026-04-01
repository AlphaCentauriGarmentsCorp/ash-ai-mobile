import React from 'react';
import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp } from '@utils/responsive';

interface FormLabelProps {
  children: string;
  required?: boolean;
  style?: TextStyle;
}

/**
 * FormLabel Component
 * 
 * A reusable label component for form fields with optional required indicator.
 * 
 * @param children - The label text to display
 * @param required - Whether to show the red asterisk (*)
 * @param style - Optional custom styles to override defaults
 * 
 * @example
 * <FormLabel required>Item Name</FormLabel>
 * <FormLabel>Description</FormLabel>
 */
export const FormLabel: React.FC<FormLabelProps> = ({ 
  children, 
  required = false,
  style 
}) => {
  return (
    <Text style={[styles.label, style]}>
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: hp(0.6),
  },
  required: {
    color: COLORS.errorRed,
  },
});

export default FormLabel;
