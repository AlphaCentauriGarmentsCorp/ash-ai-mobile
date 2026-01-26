import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface RoleOption {
  label: string;
  value: string;
  color?: string;
}

interface RoleDropdownProps {
  options: RoleOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function RoleDropdown({
  options,
  selectedValue,
  onSelect,
  disabled = false,
  onOpenChange,
}: RoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
    onOpenChange?.(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      const newState = !isOpen;
      setIsOpen(newState);
      onOpenChange?.(newState);
    }
  };

  // Find the selected option from the provided options
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const selectedLabel = selectedOption?.label || 'Select Role';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.dropdownBtn, disabled && styles.disabled]}
        onPress={handleToggle}
        disabled={disabled}
      >
        <Text style={styles.dropdownText}>{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={14} color="#666" />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownMenu}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownItem,
                index === options.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => handleSelect(option.value)}
            >
              <View style={styles.radioContainer}>
                <View style={styles.radioOuter}>
                  {selectedValue === option.value && (
                    <View style={[styles.radioInner, { backgroundColor: option.color || '#E74C3C' }]} />
                  )}
                </View>
                <Text style={styles.dropdownItemText}>{option.label}</Text>
              </View>
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
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 4,
    minWidth: 100,
  },
  disabled: {
    opacity: 0.5,
  },
  dropdownText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'poppins-regular',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    minWidth: 180,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'poppins-regular',
  },
});
