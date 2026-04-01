import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp } from '@utils/responsive';

interface SectionHeaderProps {
  title: string;
  titleStyle?: TextStyle;
  dividerStyle?: ViewStyle;
}

/**
 * SectionHeader Component
 * 
 * A reusable section header with title and divider line.
 * Used to separate different sections within forms.
 * 
 * @param title - The section title text to display
 * @param titleStyle - Optional custom styles for the title
 * @param dividerStyle - Optional custom styles for the divider
 * 
 * @example
 * <SectionHeader title="Equipment Details" />
 * <SectionHeader title="Documents" />
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  titleStyle,
  dividerStyle 
}) => {
  return (
    <>
      <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
      <View style={[styles.divider, dividerStyle]} />
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: hp(1.2),
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.dividerLight,
    marginBottom: hp(1.9),
  },
});

export default SectionHeader;
