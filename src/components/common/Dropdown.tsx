import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '../../constants';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  showIcon?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  buttonStyle?: ViewStyle;
  menuStyle?: ViewStyle;
}

export default function Dropdown({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select',
  showIcon = false,
  iconName = 'filter',
  style,
  buttonStyle,
  menuStyle,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.dropdownBtn, buttonStyle]}
        onPress={() => setIsOpen(!isOpen)}
      >
        {showIcon && <Ionicons name={iconName} size={14} color="#666" />}
        <Text style={styles.dropdownText}>{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={14} color="#666" />
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.dropdownMenu, menuStyle]}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                index === 0 ? styles.dropdownHeaderBtn : styles.dropdownItemBtn,
              ]}
              onPress={() => handleSelect(option.value)}
            >
              <Text
                style={
                  index === 0 ? styles.dropdownHeaderText : styles.dropdownItemText
                }
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 100,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius.full,
    paddingVertical: 5,
    paddingHorizontal: 12,
    gap: 6,
    backgroundColor: COLORS.white,
  },
  dropdownText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.medium,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 4,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.base,
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.border,
    overflow: 'hidden',
    minWidth: 150,
    zIndex: 2000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownHeaderBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#E8F4F8',
  },
  dropdownHeaderText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.medium,
  },
  dropdownItemBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#0B1C36',
    borderTopWidth: SIZES.border.thin,
    borderTopColor: '#1e3a5f',
  },
  dropdownItemText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
  },
});
