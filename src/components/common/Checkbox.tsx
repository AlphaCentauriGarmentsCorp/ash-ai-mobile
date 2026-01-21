import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  size?: number;
  checkedColor?: string;
  uncheckedColor?: string;
  borderColor?: string;
  checkmarkColor?: string;
  checkmarkSize?: number;
  containerStyle?: ViewStyle;
  checkboxStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export default function Checkbox({
  checked,
  onPress,
  label,
  size = 18,
  checkedColor = '#084C7F',
  uncheckedColor = '#fff',
  borderColor = '#889',
  checkmarkColor = '#fff',
  checkmarkSize = 12,
  containerStyle,
  checkboxStyle,
  labelStyle,
}: CheckboxProps) {
  return (
    <Pressable style={[styles.container, containerStyle]} onPress={onPress}>
      <View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            borderColor: checked ? checkedColor : borderColor,
            backgroundColor: checked ? checkedColor : uncheckedColor,
          },
          checkboxStyle,
        ]}
      >
        {checked && (
          <Ionicons name="checkmark" size={checkmarkSize} color={checkmarkColor} />
        )}
      </View>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    color: '#334',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
});
