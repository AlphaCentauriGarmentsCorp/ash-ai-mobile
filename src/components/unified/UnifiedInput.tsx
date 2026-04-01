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
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';

type InputVariant = 'simple' | 'styled';

interface UnifiedInputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  variant?: InputVariant;
  
  // Form integration props
  label?: string;
  required?: boolean;
  error?: string;
  isTextArea?: boolean;
  containerStyle?: ViewStyle;
  
  // Styled variant props
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  inputStyle?: TextStyle;
  iconSize?: number;
  iconColor?: string;
}

export const UnifiedInput: React.FC<UnifiedInputProps> = ({
  value,
  onChangeText,
  placeholder,
  variant = 'simple',
  label,
  required = false,
  error,
  isTextArea = false,
  containerStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  inputStyle,
  iconSize = 20,
  iconColor = '#999',
  secureTextEntry,
  ...textInputProps
}) => {
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

  // Render form label if provided
  const renderLabel = () => {
    if (!label) return null;
    
    return (
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
        {required && <Text style={styles.requiredText}> *</Text>}
      </View>
    );
  };

  // Render error text if provided
  const renderError = () => {
    if (!error) return null;
    
    return (
      <Text style={styles.errorText}>{error}</Text>
    );
  };

  // Simple variant input (matches form/FormField)
  const renderSimpleInput = () => {
    const inputStyles = [
      styles.simpleInput,
      error && styles.simpleInputError,
      isTextArea && styles.simpleTextArea,
      inputStyle,
    ];

    const textAreaProps = isTextArea ? {
      multiline: true,
      numberOfLines: textInputProps.numberOfLines || 3,
      textAlignVertical: 'top' as const,
    } : {};

    return (
      <TextInput
        style={inputStyles}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
        {...textAreaProps}
        {...textInputProps}
      />
    );
  };

  // Styled variant input (matches common/FormInput)
  const renderStyledInput = () => {
    return (
      <View style={[styles.styledInputRow, containerStyle]}>
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
          style={[styles.styledInput, inputStyle]}
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
  };

  return (
    <View style={[styles.container, variant === 'simple' && containerStyle]}>
      {renderLabel()}
      
      {variant === 'simple' ? renderSimpleInput() : renderStyledInput()}
      
      {renderError()}
    </View>
  );
};

// Import Text component for label rendering
import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(1.9),
  },
  
  // Label styles (from form/FormLabel)
  labelContainer: {
    flexDirection: 'row',
    marginBottom: hp(0.6),
  },
  labelText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
  },
  requiredText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.errorLight,
  },
  
  // Error styles (from form/ErrorText)
  errorText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.errorLight,
    marginTop: hp(0.3),
    minHeight: hp(1.5),
  },

  // Simple variant styles (matches form/FormField)
  simpleInput: {
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.borderGray,
    borderRadius: SIZES.radius.sm,
    paddingHorizontal: wp(2.7),
    paddingVertical: hp(1),
    fontSize: FONT_SIZES.sm,
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },
  simpleInputError: {
    borderColor: COLORS.errorLight,
  },
  simpleTextArea: {
    height: hp(10),
  },

  // Styled variant styles (matches common/FormInput exactly)
  styledInputRow: {
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
  styledInput: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    fontFamily: 'Poppins_400Regular',
  },
});