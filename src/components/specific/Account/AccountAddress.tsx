import Checkbox from '@components/common/Checkbox';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useAccountForm } from '../../../context/AccountFormContext';

interface AccountAddressProps {
  readOnly?: boolean;
  onEdit?: () => void;
}

export default function AccountAddress({ readOnly = false, onEdit }: AccountAddressProps) {
  const { formData, updateFormData } = useAccountForm();

  return (
    <View style={styles.card}>
      {/* Current Address */}
      <View style={styles.addressSection}>
        <View style={styles.addressHeader}>
          <Text style={styles.sectionTitle}>Current Address</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox
              checked={formData.sameAddress}
              onPress={() => updateFormData({ sameAddress: !formData.sameAddress })}
              size={16}
              checkedColor="#0D253F"
              borderColor="#ccc"
            />
            <Text style={styles.checkboxLabel}>I live On-Site</Text>
          </View>
        </View>

        <View style={styles.fullInputContainer}>
          <Text style={styles.label}>Street</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter street"
            value={formData.currentStreet}
            onChangeText={(text) => updateFormData({ currentStreet: text })}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Province</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter Province"
              value={formData.currentProvince}
              onChangeText={(text) => updateFormData({ currentProvince: text })}
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Barangay</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter barangay"
              value={formData.currentBarangay}
              onChangeText={(text) => updateFormData({ currentBarangay: text })}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput 
              style={styles.input} 
              placeholder="City"
              value={formData.currentCity}
              onChangeText={(text) => updateFormData({ currentCity: text })}
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter postal code"
              value={formData.currentPostalCode}
              onChangeText={(text) => updateFormData({ currentPostalCode: text })}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Permanent Address */}
      <View style={styles.addressSection}>
        <Text style={styles.sectionTitle}>Permanent Address</Text>

        <View style={styles.fullInputContainer}>
          <Text style={styles.label}>Street</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter street"
            value={formData.permanentStreet}
            onChangeText={(text) => updateFormData({ permanentStreet: text })}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Province</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter Province"
              value={formData.permanentProvince}
              onChangeText={(text) => updateFormData({ permanentProvince: text })}
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Barangay</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter barangay"
              value={formData.permanentBarangay}
              onChangeText={(text) => updateFormData({ permanentBarangay: text })}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput 
              style={styles.input} 
              placeholder="City"
              value={formData.permanentCity}
              onChangeText={(text) => updateFormData({ permanentCity: text })}
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter postal code"
              value={formData.permanentPostalCode}
              onChangeText={(text) => updateFormData({ permanentPostalCode: text })}
              keyboardType="numeric"
            />
          </View>
        </View>
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
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONT_FAMILY.bold,
    color: '#0D253F',
    marginBottom: 10,
  },
  addressSection: {
    marginBottom: 20,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkboxLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#0D253F',
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    backgroundColor: COLORS.white,
  },
});
