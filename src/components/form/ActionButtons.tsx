import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '@components/common/Button';
import { COLORS } from '@styles';
import { hp, wp } from '@utils/responsive';
import { BUTTONS } from '@constants';

interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  cancelTitle?: string;
  submitTitle?: string;
  submitLoadingTitle?: string;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onSubmit,
  isSubmitting = false,
  cancelTitle = BUTTONS.CANCEL,
  submitTitle = BUTTONS.SAVE,
  submitLoadingTitle = BUTTONS.SAVING,
  disabled = false,
}) => {
  return (
    <View style={styles.actionButtons}>
      <Button
        title={cancelTitle}
        onPress={onCancel}
        variant="outline"
        size="base"
        style={styles.cancelBtn}
        textStyle={styles.cancelText}
        disabled={isSubmitting || disabled}
      />
      
      <Button
        title={isSubmitting ? submitLoadingTitle : submitTitle}
        onPress={onSubmit}
        variant="primary"
        size="base"
        style={styles.submitBtn}
        disabled={isSubmitting || disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(4),
  },
  cancelBtn: {
    backgroundColor: COLORS.grayScale[200],
    borderColor: COLORS.grayScale[200],
    minWidth: wp(26.7),
  },
  cancelText: {
    color: COLORS.grayScale[700],
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: COLORS.primaryDark,
    minWidth: wp(26.7),
  },
});