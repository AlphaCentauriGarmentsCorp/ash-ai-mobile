import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES, SPACING } from '../../constants';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  iconSize?: number;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  style,
  iconSize = 20,
  ...textInputProps
}: SearchBarProps) {
  return (
    <View style={[styles.searchContainer, style]}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
        {...textInputProps}
      />
      <View style={styles.searchIconContainer}>
        <Ionicons name="search" size={iconSize} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.border,
    borderTopLeftRadius: SIZES.radius.sm,
    borderBottomLeftRadius: SIZES.radius.sm,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZES.sm,
  },
  searchIconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: SIZES.border.thin,
    borderLeftWidth: 0,
    borderColor: COLORS.border,
    borderTopRightRadius: SIZES.radius.sm,
    borderBottomRightRadius: SIZES.radius.sm,
  },
});
