import React from 'react';
import Icon2D from './Icon2D';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { tokens } from '../../styles/tokens';

export default function ConfirmationModal({
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
    padding: tokens.spacing.base,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.xl,
    padding: tokens.spacing.xl,
    alignItems: 'center',
    ...tokens.shadows.float,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: tokens.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.md,
  },
  iconDestructive: {
    backgroundColor: tokens.colors.errorLight,
  },
  iconNormal: {
    backgroundColor: tokens.colors.primaryLight,
  },
  iconText: {
    fontSize: 22,
  },
  title: {
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
  },
  message: {
    fontSize: tokens.typography.sm,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: tokens.spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: tokens.spacing.sm,
  },
  button: {
    flex: 1,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  cancelButtonText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textSecondary,
  },
  destructiveButton: {
    backgroundColor: tokens.colors.error,
  },
  confirmButton: {
    backgroundColor: tokens.colors.primary,
  },
  confirmButtonText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.surface,
  }
});
