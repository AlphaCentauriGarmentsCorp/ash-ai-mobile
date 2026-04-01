import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp } from '@utils/responsive';

interface ErrorTextProps {
  children?: string;
  style?: TextStyle;
}

/**
 * ErrorText Component
 * 
 * A reusable error message component that only renders when an error exists.
 * Handles conditional rendering internally so you don't need to check for errors.
 * 
 * @param children - The error message to display (optional)
 * @param style - Optional custom styles to override defaults
 * 
 * @example
 * <ErrorText>{errors.name}</ErrorText>
 * // Only renders if errors.name exists
 */
export const ErrorText: React.FC<ErrorTextProps> = ({ children, style }) => {
  // Don't render anything if there's no error message
  if (!children) {
    return null;
  }

  return <Text style={[styles.errorText, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.errorLight,
    marginTop: hp(0.3),
    fontFamily: FONT_FAMILY.regular,
  },
});

export default ErrorText;
