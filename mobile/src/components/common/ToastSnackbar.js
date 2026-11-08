import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { tokens } from '../../styles/tokens';
import Icon2D from './Icon2D';

export default function ToastSnackbar({ visible, message, type = 'success', onDismiss }) {
  if (!visible) return null;

  let bg = tokens.colors.primary;
  let iconName = 'check';

  if (type === 'warning') {
    bg = tokens.colors.warning;
    iconName = 'warning';
  } else if (type === 'error') {
    bg = tokens.colors.error;
    iconName = 'close';
  } else if (type === 'info') {
    bg = tokens.colors.textPrimary;
    iconName = 'info';
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Icon2D name={iconName} size={18} color="#FFFFFF" style={{ marginRight: tokens.spacing.sm }} />
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      {onDismiss ? (
        <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
          <Icon2D name="close" size={16} color="rgba(255, 255, 255, 0.8)" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: tokens.spacing.base,
    right: tokens.spacing.base,
    borderRadius: tokens.radii.lg,
    paddingHorizontal: tokens.spacing.base,
    paddingVertical: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
    ...tokens.shadows.float,
  },
  message: {
    flex: 1,
    color: tokens.colors.surface,
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.medium,
  },
  dismissBtn: {
    padding: tokens.spacing.xs,
    marginLeft: tokens.spacing.xs,
  }
});
