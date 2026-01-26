import { useState } from 'react';

type FormValues = Record<string, any>;

interface UseFormStateProps<T extends FormValues> {
  initialValues: T;
}

interface UseFormStateReturn<T extends FormValues> {
  values: T;
  setValue: (name: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  resetForm: () => void;
  clearForm: () => void;
  handleChange: (name: keyof T) => (value: any) => void;
}

export function useFormState<T extends FormValues>({
  initialValues,
}: UseFormStateProps<T>): UseFormStateReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);

  const setValue = (name: keyof T, value: any) => {
    setValuesState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setValues = (newValues: Partial<T>) => {
    setValuesState((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  const resetForm = () => {
    setValuesState(initialValues);
  };

  const clearForm = () => {
    const clearedValues = Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = '' as any;
      return acc;
    }, {} as T);
    setValuesState(clearedValues);
  };

  // Helper function for easier integration with TextInput onChangeText
  const handleChange = (name: keyof T) => (value: any) => {
    setValue(name, value);
  };

  return {
    values,
    setValue,
    setValues,
    resetForm,
    clearForm,
    handleChange,
  };
}

export default useFormState;
