import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SIZES, SPACING } from '@styles';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';

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
        <Ionicons name="search" size={iconSize} color="#A2A2A2" />
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
    borderWidth: SIZES.border.thin + 1,
    borderColor: '#808D99',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    fontFamily: "poppins-regular",
    fontSize: FONT_SIZES.sm,
  },
  searchIconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: SIZES.border.thin + 1,
    borderLeftWidth: 0,
    borderColor: '#808D99',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});
