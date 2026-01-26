import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import FormDropdown, { FormDropdownOption } from '../../../components/common/FormDropdown';

export default function AccountPersonalData() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [gender, setGender] = useState('');
  const [civilStatus, setCivilStatus] = useState('');

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

  return (
    <View style={styles.card}>
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
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
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
            value={middleName}
            onChangeText={setMiddleName}
          />
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter contact number"
            value={contactNumber}
            onChangeText={setContactNumber}
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
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Gender</Text>
          <FormDropdown
            options={genderOptions}
            selectedValue={gender}
            onSelect={setGender}
            placeholder="Select gender"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Birthdate</Text>
          <View style={styles.dropdownContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="Select birthdate"
              value={birthdate}
              onChangeText={setBirthdate}
              editable={false}
            />
            <Ionicons name="calendar-outline" size={16} color="#666" style={styles.calendarIcon} />
          </View>
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Civil Status</Text>
          <FormDropdown
            options={civilStatusOptions}
            selectedValue={civilStatus}
            onSelect={setCivilStatus}
            placeholder="Select civil status"
          />
        </View>
      </View>

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
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
