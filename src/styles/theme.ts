// Import all style constants
import { COLORS } from './colors';
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS } from './fonts';
import { SIZES } from './sizes';
import { MARGIN, PADDING, SPACING } from './spacing';

// Export individual constants
export { COLORS } from './colors';
export { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS } from './fonts';
export { SIZES } from './sizes';
export { MARGIN, PADDING, SPACING } from './spacing';

// Export everything as a single theme object
export const theme = {
  colors: COLORS,
  fonts: {
    family: FONT_FAMILY,
    sizes: FONT_SIZES,
    weights: FONT_WEIGHTS,
    lineHeights: LINE_HEIGHTS,
  },
  sizes: SIZES,
  spacing: {
    spacing: SPACING,
    padding: PADDING,
    margin: MARGIN,
  },
};

export default theme;

