import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import FormDropdown, { FormDropdownOption } from '../../../components/common/FormDropdown';
import { useAccountForm } from '../../../context/AccountFormContext';

interface AccountPersonalDataProps {
  readOnly?: boolean;
  onEdit?: () => void;
}

export default function AccountPersonalData({ readOnly = false, onEdit }: AccountPersonalDataProps) {
  const { formData, updateFormData } = useAccountForm();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genderOptions: FormDropdownOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const civilStatusOptions: FormDropdownOption[] = [
    { label: 'Single', value: 'single' },
    { label: 'Married', value: 'married' },
    { label: 'Divorced', value: 'divorced' },
    { label: 'Widowed', value: 'widowed' },
  ];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      updateFormData({ birthdate: formattedDate });
    }
  };

  const openDatePicker = () => {
    if (!readOnly) {
      setShowDatePicker(true);
    }
  };

  return (
    <View style={styles.card}>
      {/* Section Header with Edit Button */}
      {readOnly && onEdit && (
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Personal Data</Text>
          <TouchableOpacity style={styles.innerEditBtn} onPress={onEdit}>
            <Ionicons name="pencil" size={12} color="#333" style={{marginRight:5}}/>
            <Text style={styles.innerEditText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Profile Picture Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#999" />
          </View>
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.editProfileText}>Edit Personal Data</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter first name"
            value={formData.firstName}
            onChangeText={(text) => updateFormData({ firstName: text })}
            editable={!readOnly}
          />
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter email"
            value={formData.email}
            onChangeText={(text) => updateFormData({ email: text })}
            editable={!readOnly}
            keyboardType="email-address"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Middle Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter middle name"
            value={formData.middleName}
            onChangeText={(text) => updateFormData({ middleName: text })}
            editable={!readOnly}
          />
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter contact number"
            value={formData.contactNumber}
            onChangeText={(text) => updateFormData({ contactNumber: text })}
            editable={!readOnly}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter last name"
            value={formData.lastName}
            onChangeText={(text) => updateFormData({ lastName: text })}
            editable={!readOnly}
          />
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Gender</Text>
          <FormDropdown
            options={genderOptions}
            selectedValue={formData.gender}
            onSelect={(value) => updateFormData({ gender: value })}
            placeholder="Select gender"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Birthdate</Text>
          <TouchableOpacity 
            style={styles.dropdownContainer} 
            onPress={openDatePicker}
            disabled={readOnly}
          >
            <TextInput 
              style={styles.input} 
              placeholder="Select birthdate"
              value={formData.birthdate}
              editable={false}
              pointerEvents="none"
            />
            <Ionicons name="calendar-outline" size={16} color="#666" style={styles.calendarIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Civil Status</Text>
          <FormDropdown
            options={civilStatusOptions}
            selectedValue={formData.civilStatus}
            onSelect={(value) => updateFormData({ civilStatus: value })}
            placeholder="Select civil status"
          />
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={formData.birthdate ? new Date(formData.birthdate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter username"
          value={formData.username}
          onChangeText={(text) => updateFormData({ username: text })}
          editable={!readOnly}
        />
      </View>

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter password"
          value={formData.password}
          onChangeText={(text) => updateFormData({ password: text })}
          editable={!readOnly}
          secureTextEntry
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EBF6FF',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.text,
  },
  innerEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  innerEditText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.semiBold,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0D253F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editProfileText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  halfInputContainer: {
    flex: 1,
  },
  fullInputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#0D253F',
    marginBottom: 5,
  },
  dropdownContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    backgroundColor: COLORS.white,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  calendarIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
});
