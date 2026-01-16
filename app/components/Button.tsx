import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES, SPACING } from '../constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'base' | 'lg';

interface ButtonProps {
  // Content
  title: string;
  onPress: () => void;
  
  // Styling
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  
  // Icon
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  
  // Custom styles
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'base',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  iconSize,
  style,
  textStyle,
}: ButtonProps) {
  
  // Size configurations
  const sizeConfig = {
    sm: {
      paddingVertical: SPACING.xs + 2,
      paddingHorizontal: SPACING.base,
      fontSize: FONT_SIZES.sm,
      iconSize: SIZES.icon.sm,
      borderRadius: SIZES.radius.full,
      height: SIZES.button.sm,
    },
    base: {
      paddingVertical: SPACING.sm + 2,
      paddingHorizontal: SPACING.lg,
      fontSize: FONT_SIZES.sm,
      iconSize: 18,
      borderRadius: SIZES.radius.full,
      height: SIZES.button.base,
    },
    lg: {
      paddingVertical: SPACING.base,
      paddingHorizontal: SPACING.xl,
      fontSize: FONT_SIZES.base,
      iconSize: SIZES.icon.base,
      borderRadius: SIZES.radius.full,
      height: SIZES.button.lg,
    },
  };

  // Variant configurations
  const variantConfig = {
    primary: {
      backgroundColor: '#1E3A5F',
      textColor: COLORS.white,
      borderColor: '#1E3A5F',
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: COLORS.secondary,
      textColor: COLORS.white,
      borderColor: COLORS.secondary,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: COLORS.white,
      textColor: '#E05D5D',
      borderColor: '#FFC0CB',
      borderWidth: SIZES.border.thin,
    },
    danger: {
      backgroundColor: COLORS.error,
      textColor: COLORS.white,
      borderColor: COLORS.error,
      borderWidth: 0,
    },
    ghost: {
      backgroundColor: COLORS.transparent,
      textColor: COLORS.primary,
      borderColor: COLORS.transparent,
      borderWidth: 0,
    },
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];
  const finalIconSize = iconSize || currentSize.iconSize;

  const buttonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: currentSize.paddingVertical,
    paddingHorizontal: currentSize.paddingHorizontal,
    backgroundColor: currentVariant.backgroundColor,
    borderRadius: currentSize.borderRadius,
    borderWidth: currentVariant.borderWidth,
    borderColor: currentVariant.borderColor,
    minHeight: currentSize.height,
    opacity: disabled || loading ? 0.5 : 1,
    ...(fullWidth && { width: '100%' }),
  };

  const textStyleConfig: TextStyle = {
    color: currentVariant.textColor,
    fontSize: currentSize.fontSize,
    fontFamily: FONT_FAMILY.semiBold,
    fontWeight: '600',
  };

  const iconColor = currentVariant.textColor;
  const iconMargin = icon ? (iconPosition === 'left' ? { marginRight: SPACING.xs + 1 } : { marginLeft: SPACING.xs + 1 }) : {};

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={finalIconSize} color={iconColor} style={iconMargin} />
          )}
          <Text style={[textStyleConfig, textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={finalIconSize} color={iconColor} style={iconMargin} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
