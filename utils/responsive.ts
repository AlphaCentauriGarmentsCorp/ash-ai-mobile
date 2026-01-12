import { Dimensions } from 'react-native';

// Base design dimensions (iPhone X/11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Get device dimensions with fallback
let deviceWidth = BASE_WIDTH;
let deviceHeight = BASE_HEIGHT;

try {
  const window = Dimensions.get('window');
  if (window.width > 0 && window.height > 0) {
    deviceWidth = window.width;
    deviceHeight = window.height;
  }
} catch (error) {
  console.warn('Failed to get device dimensions, using defaults:', error);
}

// Calculate scale factors with clamping to prevent extreme scaling
const widthScale = Math.max(0.5, Math.min(deviceWidth / BASE_WIDTH, 2.0));
const heightScale = Math.max(0.5, Math.min(deviceHeight / BASE_HEIGHT, 2.0));

/**
 * Width Percentage
 * Converts a percentage of screen width to pixels
 * @param widthPercent - Percentage of screen width (0-100)
 * @returns Scaled width in pixels
 */
export function wp(widthPercent: number): number {
  if (typeof widthPercent !== 'number' || widthPercent < 0) {
    if (__DEV__) {
      console.warn(`Invalid width percentage: ${widthPercent}`);
    }
    return 0;
  }
  return (widthPercent * deviceWidth) / 100;
}

/**
 * Height Percentage
 * Converts a percentage of screen height to pixels
 * @param heightPercent - Percentage of screen height (0-100)
 * @returns Scaled height in pixels
 */
export function hp(heightPercent: number): number {
  if (typeof heightPercent !== 'number') {
    if (__DEV__) {
      console.warn(`Invalid height percentage: ${heightPercent}`);
    }
    return 0;
  }
  return (heightPercent * deviceHeight) / 100;
}

/**
 * Responsive Font Size
 * Scales font size proportionally based on screen dimensions
 * Uses the minimum scale factor to prevent extreme scaling
 * @param fontSize - Base font size in pixels
 * @returns Scaled font size
 */
export function rfs(fontSize: number): number {
  if (typeof fontSize !== 'number' || fontSize < 0) {
    if (__DEV__) {
      console.warn(`Invalid font size: ${fontSize}`);
    }
    return 0;
  }
  return Math.round(fontSize * Math.min(widthScale, heightScale));
}

/**
 * Moderate Scale
 * Provides balanced scaling for elements that shouldn't scale as aggressively
 * Useful for icons, buttons, and other UI elements
 * @param size - Base size in pixels
 * @param factor - Scaling factor (default: 0.5)
 * @returns Moderately scaled size
 */
export function ms(size: number, factor: number = 0.5): number {
  if (typeof size !== 'number' || size < 0) {
    if (__DEV__) {
      console.warn(`Invalid size: ${size}`);
    }
    return 0;
  }
  if (typeof factor !== 'number' || factor < 0) {
    if (__DEV__) {
      console.warn(`Invalid factor: ${factor}, using default 0.5`);
    }
    factor = 0.5;
  }
  return Math.round(size + (widthScale - 1) * factor * size);
}

// Export device dimensions for debugging purposes
export const deviceDimensions = {
  width: deviceWidth,
  height: deviceHeight,
  widthScale,
  heightScale,
};
