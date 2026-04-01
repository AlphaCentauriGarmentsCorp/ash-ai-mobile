import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';
import { UI_TEXT } from '@constants';

interface ClearFieldsButtonProps {
  onPress: () => void;
}

export const ClearFieldsButton: React.FC<ClearFieldsButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.clearButtonContainer} onPress={onPress}>
      <Text style={styles.clearText}>{UI_TEXT.CLEAR_ALL_FIELDS}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clearButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: hp(2.5),
  },
  clearText: {
    color: COLORS.grayScale[600],
    textDecorationLine: 'underline',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
  },
});