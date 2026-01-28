import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '@styles';
import React from 'react';
import {
    Modal as RNModal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  highlightText?: string;
}

export default function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  highlightText,
}: ConfirmModalProps) {
  const renderMessage = () => {
    if (!highlightText) {
      return <Text style={styles.removeModalText}>{message}</Text>;
    }

    const parts = message.split(highlightText);
    return (
      <Text style={styles.removeModalText}>
        {parts[0]}
        <Text style={{ fontWeight: 'bold', color: '#000' }}>{highlightText}</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.removeModalContent}>
          <View style={styles.removeModalHeader}>
            <Text style={styles.removeModalTitle}>{title}</Text>
          </View>
          <View style={styles.removeModalBody}>
            {renderMessage()}
            <View style={styles.removeModalButtons}>
              <TouchableOpacity style={styles.btnCancelRemove} onPress={onClose}>
                <Text style={styles.btnCancelRemoveText}>{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirmRemove} onPress={onConfirm}>
                <Text style={styles.btnConfirmRemoveText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeModalContent: {
    width: 320,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  removeModalHeader: {
    backgroundColor: '#0D253F',
    paddingVertical: 16,
    alignItems: 'center',
  },
  removeModalTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xl,
    fontFamily: FONT_FAMILY.bold,
  },
  removeModalBody: {
    padding: 17,
    alignItems: 'center',
  },
  removeModalText: {
    textAlign: 'center',
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    marginBottom: 17,
    lineHeight: 22,
    fontFamily: FONT_FAMILY.regular,
  },
  removeModalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  btnCancelRemove: {
    backgroundColor: COLORS.gray[400],
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: SIZES.radius.base,
  },
  btnCancelRemoveText: {
    color: COLORS.black,
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZES.sm,
  },
  btnConfirmRemove: {
    backgroundColor: COLORS.error,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: SIZES.radius.base,
  },
  btnConfirmRemoveText: {
    color: COLORS.white,
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZES.sm,
  },
});
