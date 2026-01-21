export const FONT_FAMILY = {
  thin: 'Poppins_100Thin',
  extraLight: 'Poppins_200ExtraLight',
  light: 'Poppins_300Light',
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extraBold: 'Poppins_800ExtraBold',
  black: 'Poppins_900Black',
};

export const FONT_SIZES = {
  // Small sizes
  xs: 12,
  sm: 14,
  
  // Base sizes
  base: 16,
  lg: 18,
  xl: 20,
  
  // Heading sizes
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
};

export const FONT_WEIGHTS = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

export const LINE_HEIGHTS = {
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

export default {
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
};
