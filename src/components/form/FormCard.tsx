import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';

interface FormCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const FormCard: React.FC<FormCardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBlue,
    borderRadius: SIZES.radius.md,
    padding: wp(5.3),
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.borderGray,
    marginBottom: hp(2),
  },
});