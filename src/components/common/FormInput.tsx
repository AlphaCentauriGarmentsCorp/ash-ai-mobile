import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconSize?: number;
  iconColor?: string;
}

export default function FormInput({
  value,
  onChangeText,
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  containerStyle,
  inputStyle,
  iconSize = 20,
  iconColor = '#999',
  secureTextEntry,
  ...textInputProps
}: FormInputProps) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleRightIconPress = () => {
    if (isPassword) {
      setPasswordVisible(!isPasswordVisible);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIconName = (): keyof typeof Ionicons.glyphMap => {
    if (isPassword) {
      return isPasswordVisible ? 'eye-off-outline' : 'eye-outline';
    }
    return rightIcon || 'close-circle';
  };

  const shouldShowRightIcon = isPassword || rightIcon;

  return (
    <View style={[styles.inputRow, containerStyle]}>
      {leftIcon && (
        <Ionicons
          name={leftIcon}
          size={iconSize}
          color={iconColor}
          style={styles.inputIcon}
        />
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
        {...textInputProps}
      />
      {shouldShowRightIcon && (
        <Pressable onPress={handleRightIconPress}>
          <Ionicons name={getRightIconName()} size={iconSize} color={iconColor} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 34,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#8E909B',
  },
  inputIcon: {
    marginRight: 10,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    fontFamily: 'Poppins_400Regular',
  },
});
