import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

interface DatePickerFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
}

export default function DatePickerField({
  value,
  onChange,
  placeholder = 'Select Date',
  minimumDate,
  maximumDate,
  disabled = false,
}: DatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // On Android, picker closes automatically
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
      // On iOS, keep picker open until user dismisses
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowPicker(false);
    }
  };

  const openPicker = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return placeholder;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, disabled && styles.disabled]}
        onPress={openPicker}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, !value && styles.placeholder]}>
          {formatDate(value)}
        </Text>
        <Ionicons name="calendar-outline" size={18} color="#6B7280" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 45,
  },
  disabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  text: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#1F2937',
    flex: 1,
  },
  placeholder: {
    color: '#9CA3AF',
  },
});
