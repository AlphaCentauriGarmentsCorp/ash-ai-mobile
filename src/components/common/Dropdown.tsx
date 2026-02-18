import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '@styles';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

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
  textStyle?: ViewStyle;
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
  textStyle,
}: DropdownProps) {
  const [visible, setVisible] = useState(false);
  // Store the calculated position for the menu
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0, width: 0 });
  const buttonRef = useRef<TouchableOpacity>(null);

  const toggleDropdown = () => {
    if (visible) {
      setVisible(false);
    } else {
      // Measure the button's position on screen to place the modal correctly
      buttonRef.current?.measure((_fx, _fy, _w, h, px, py) => {
        const windowWidth = Dimensions.get('window').width;
        setDropdownPosition({
          top: py + h + 4, // Button Y pos + Button Height + small margin
          right: windowWidth - (px + _w), // Calculate distance from right edge
          width: _w,
        });
        setVisible(true);
      });
    }
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setVisible(false);
  };

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  return (
    <View style={[styles.container, style]}>
      {/* The Button */}
      <TouchableOpacity
        ref={buttonRef}
        style={[styles.dropdownBtn, buttonStyle]}
        onPress={toggleDropdown}
      >
        {showIcon && <Ionicons name={iconName} size={14} color="#666" />}
        <Text style={[styles.dropdownText, textStyle]}>{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={14} color="#666" />
      </TouchableOpacity>

      {/* The Menu (Rendered in a Modal to overlay everything) */}
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.dropdownMenu,
                menuStyle,
                {
                  top: dropdownPosition.top,
                  right: dropdownPosition.right,
                  // Ensure a minimum width so it doesn't look squashed
                  minWidth: Math.max(150, dropdownPosition.width),
                },
              ]}
            >
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
                      index === 0
                        ? styles.dropdownHeaderText
                        : styles.dropdownItemText
                    }
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Relative position is no longer strictly needed for the menu, 
    // but good for the button layout.
    zIndex: 100, 
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: SIZES.border.thin + 1,
    borderColor: '#808D99',
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
  // Full screen transparent overlay to detect clicks outside the menu
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownMenu: {
    position: 'absolute',
    // Top and Right are set dynamically in the component
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.base,
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.border,
    overflow: 'hidden',
    // Shadow for elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
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