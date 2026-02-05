import { useState } from 'react';

type ValidationRule<T> = {
  [K in keyof T]?: Array<{
    validate: (value: T[K], formValues: T) => boolean;
    message: string;
  }>;
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

interface UseFormValidationProps<T> {
  initialValues: T;
  validationRules?: ValidationRule<T>;
}

interface UseFormValidationReturn<T> {
  values: T;
  errors: ValidationErrors<T>;
  touched: { [K in keyof T]?: boolean };
  setValue: (name: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (name: keyof T, error: string) => void;
  setErrors: (errors: ValidationErrors<T>) => void;
  clearError: (name: keyof T) => void;
  clearErrors: () => void;
  setTouched: (name: keyof T, isTouched?: boolean) => void;
  handleChange: (name: keyof T) => (value: any) => void;
  handleBlur: (name: keyof T) => () => void;
  validate: (fieldName?: keyof T) => boolean;
  resetForm: () => void;
  isValid: boolean;
}

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
}: UseFormValidationProps<T>): UseFormValidationReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<ValidationErrors<T>>({});
  const [touched, setTouchedState] = useState<{ [K in keyof T]?: boolean }>({});

  const setValue = (name: keyof T, value: any) => {
    setValuesState((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when value changes
    if (errors[name]) {
      clearError(name);
    }
  };

  const setValues = (newValues: Partial<T>) => {
    setValuesState((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  const setError = (name: keyof T, error: string) => {
    setErrorsState((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const setErrors = (newErrors: ValidationErrors<T>) => {
    setErrorsState(newErrors);
  };

  const clearError = (name: keyof T) => {
    setErrorsState((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const clearErrors = () => {
    setErrorsState({});
  };

  const setTouched = (name: keyof T, isTouched = true) => {
    setTouchedState((prev) => ({
      ...prev,
      [name]: isTouched,
    }));
  };

  const handleChange = (name: keyof T) => (value: any) => {
    setValue(name, value);
  };

  const handleBlur = (name: keyof T) => () => {
    setTouched(name, true);
    validate(name);
  };

  const validate = (fieldName?: keyof T): boolean => {
    const fieldsToValidate = fieldName ? [fieldName] : Object.keys(validationRules);
    const newErrors: ValidationErrors<T> = {};
    let isFormValid = true;

    fieldsToValidate.forEach((field) => {
      const rules = validationRules[field as keyof T];
      if (!rules) return;

      const value = values[field as keyof T];
      
      for (const rule of rules) {
        if (!rule.validate(value, values)) {
          newErrors[field as keyof T] = rule.message;
          isFormValid = false;
          break;
        }
      }
    });

    if (fieldName) {
      if (newErrors[fieldName]) {
        setError(fieldName, newErrors[fieldName]!);
      } else {
        clearError(fieldName);
      }
    } else {
      setErrorsState(newErrors);
    }

    return isFormValid;
  };

  const resetForm = () => {
    setValuesState(initialValues);
    setErrorsState({});
    setTouchedState({});
  };

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    setValue,
    setValues,
    setError,
    setErrors,
    clearError,
    clearErrors,
    setTouched,
    handleChange,
    handleBlur,
    validate,
    resetForm,
    isValid,
  };
}

// Common validation rules
export const ValidationRules = {
  required: (message = 'This field is required') => ({
    validate: (value: any) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value !== null && value !== undefined && value !== '';
    },
    message,
  }),

  email: (message = 'Invalid email address') => ({
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !value || emailRegex.test(value);
    },
    message,
  }),

  minLength: (min: number, message?: string) => ({
    validate: (value: string) => !value || value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string) => ({
    validate: (value: string) => !value || value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),

  phone: (message = 'Invalid phone number') => ({
    validate: (value: string) => {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      return !value || phoneRegex.test(value);
    },
    message,
  }),

  postalCode: (message = 'Invalid postal code') => ({
    validate: (value: string) => {
      // Canadian postal code format
      const postalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
      return !value || postalRegex.test(value);
    },
    message,
  }),

  match: (fieldName: string, message?: string) => ({
    validate: (value: any, formValues: any) => {
      return value === formValues[fieldName];
    },
    message: message || `Must match ${fieldName}`,
  }),
};

export default useFormValidation;
