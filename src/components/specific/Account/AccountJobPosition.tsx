import Checkbox from '@components/common/Checkbox';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useAccountForm } from '../../../context/AccountFormContext';

interface AccountJobPositionProps {
  readOnly?: boolean;
  onEdit?: () => void;
}

export default function AccountJobPosition({ readOnly = false, onEdit }: AccountJobPositionProps) {
  const { formData, updateFormData } = useAccountForm();

  const toggleRole = (role: keyof typeof formData.roleAccess) => {
    updateFormData({
      roleAccess: {
        ...formData.roleAccess,
        [role]: !formData.roleAccess[role]
      }
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Job Position and Roles</Text>
      <View style={styles.divider} />

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Job Position</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter job position"
          value={formData.jobPosition}
          onChangeText={(text) => updateFormData({ jobPosition: text })}
        />
      </View>

      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Department</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter department"
          value={formData.department}
          onChangeText={(text) => updateFormData({ department: text })}
        />
      </View>

      <View style={styles.roleAccessSection}>
        <Text style={styles.label}>Role Access</Text>
        <View style={styles.rolesGrid}>
          <View style={styles.roleColumn}>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.admin} onPress={() => toggleRole('admin')} />
              <Text style={styles.roleLabel}>Admin</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.generalManager} onPress={() => toggleRole('generalManager')} />
              <Text style={styles.roleLabel}>General Manager</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.csr} onPress={() => toggleRole('csr')} />
              <Text style={styles.roleLabel}>CSR</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.graphicArtist} onPress={() => toggleRole('graphicArtist')} />
              <Text style={styles.roleLabel}>Graphic Artist</Text>
            </View>
          </View>

          <View style={styles.roleColumn}>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.finance} onPress={() => toggleRole('finance')} />
              <Text style={styles.roleLabel}>Finance</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.purchasing} onPress={() => toggleRole('purchasing')} />
              <Text style={styles.roleLabel}>Purchasing</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.sewer} onPress={() => toggleRole('sewer')} />
              <Text style={styles.roleLabel}>Sewer</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.driver} onPress={() => toggleRole('driver')} />
              <Text style={styles.roleLabel}>Driver</Text>
            </View>
          </View>

          <View style={styles.roleColumn}>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.printer} onPress={() => toggleRole('printer')} />
              <Text style={styles.roleLabel}>Printer</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.warehouseManager} onPress={() => toggleRole('warehouseManager')} />
              <Text style={styles.roleLabel}>Warehouse Manager</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.screenMaker} onPress={() => toggleRole('screenMaker')} />
              <Text style={styles.roleLabel}>Screen Maker</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.packer} onPress={() => toggleRole('packer')} />
              <Text style={styles.roleLabel}>Packer</Text>
            </View>
          </View>

          <View style={styles.roleColumn}>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.cutter} onPress={() => toggleRole('cutter')} />
              <Text style={styles.roleLabel}>Cutter</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.qa} onPress={() => toggleRole('qa')} />
              <Text style={styles.roleLabel}>QA</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.sampleMaker} onPress={() => toggleRole('sampleMaker')} />
              <Text style={styles.roleLabel}>Sample Maker</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={formData.roleAccess.subordinate} onPress={() => toggleRole('subordinate')} />
              <Text style={styles.roleLabel}>Subordinate</Text>
            </View>
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
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
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
  roleAccessSection: {
    marginTop: 10,
  },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  roleColumn: {
    width: '48%',
    gap: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#333',
  },
});
