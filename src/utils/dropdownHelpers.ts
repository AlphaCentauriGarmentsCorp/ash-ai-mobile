/**
 * Utility functions for dropdown options
 */

import { FormDropdownOption } from '@components/common/FormDropdown';

// Enhanced option interface
export interface EnhancedOption {
  value: string;
  label: string;
  description?: string;
  color?: string;
  iconFamily?: string;
  iconName?: string;
  badge?: string;
  estimatedDays?: string;
  priceRange?: string;
  processingTime?: string;
  fees?: string;
  popular?: boolean;
  recommended?: boolean;
  [key: string]: any; // Allow additional properties
}

/**
 * Convert enhanced dropdown options to simple FormDropdown format
 * @param enhancedOptions - Array of enhanced option objects
 * @returns Array of {label, value} objects for FormDropdown
 */
export const convertToFormOptions = (enhancedOptions: EnhancedOption[]): FormDropdownOption[] => {
  return enhancedOptions.map(option => ({
    label: option.label,
    value: option.value
  }));
};

/**
 * Get enhanced option details by value
 * @param enhancedOptions - Array of enhanced option objects
 * @param value - The value to search for
 * @returns The enhanced option object or null if not found
 */
export const getOptionDetails = (enhancedOptions: EnhancedOption[], value: string): EnhancedOption | null => {
  return enhancedOptions.find(option => option.value === value) || null;
};

/**
 * Get label from value using enhanced options
 * @param enhancedOptions - Array of enhanced option objects
 * @param value - The value to get label for
 * @returns The label or the original value if not found
 */
export const getLabelFromValue = (enhancedOptions: EnhancedOption[], value: string): string => {
  const option = enhancedOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

/**
 * Filter options by property
 * @param enhancedOptions - Array of enhanced option objects
 * @param property - Property to filter by (e.g., 'popular', 'recommended')
 * @param value - Value to match (e.g., true, false, specific string)
 * @returns Filtered array of options
 */
export const filterOptionsByProperty = (enhancedOptions: EnhancedOption[], property: string, value: any): EnhancedOption[] => {
  return enhancedOptions.filter(option => option[property] === value);
};

/**
 * Get popular/recommended options
 * @param enhancedOptions - Array of enhanced option objects
 * @returns Array of popular or recommended options
 */
export const getPopularOptions = (enhancedOptions: EnhancedOption[]): EnhancedOption[] => {
  return enhancedOptions.filter(option => option.popular || option.recommended);
};