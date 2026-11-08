import React from 'react';
import Icon2D from '../../../components/common/Icon2D';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { userTokens } from '../../styles/userTokens';

export default function UserConfirmationModal({
  visible,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel
}) {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <View style={[styles.iconBox, isDestructive ? styles.iconDestructive : styles.iconNormal]}>
                <Icon2D name={isDestructive ? 'warning' : 'info'} size={32} color={isDestructive ? '#EF4444' : '#2563EB'} />
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    isDestructive ? styles.destructiveButton : styles.confirmButton
                  ]}
                  onPress={onConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: userTokens.spacing.base,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.xl,
    padding: userTokens.spacing.xl,
    alignItems: 'center',
    ...userTokens.shadows.float,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: userTokens.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: userTokens.spacing.md,
  },
  iconDestructive: {
    backgroundColor: userTokens.colors.errorLight,
  },
  iconNormal: {
    backgroundColor: userTokens.colors.primaryLight,
  },
  iconText: {
    fontSize: 22,
  },
  title: {
    fontSize: userTokens.typography.lg,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
    textAlign: 'center',
    marginBottom: userTokens.spacing.xs,
  },
  message: {
    fontSize: userTokens.typography.sm,
    color: userTokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: userTokens.spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: userTokens.spacing.sm,
  },
  button: {
    flex: 1,
    height: userTokens.touchTarget.minHeight,
    borderRadius: userTokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: userTokens.colors.background,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  cancelButtonText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textSecondary,
  },
  destructiveButton: {
    backgroundColor: userTokens.colors.error,
  },
  confirmButton: {
    backgroundColor: userTokens.colors.primary,
  },
  confirmButtonText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.surface,
  }
});
