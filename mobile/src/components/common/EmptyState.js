import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { tokens } from '../../styles/tokens';
import Icon2D from './Icon2D';

export default function EmptyState({
  icon = 'search',
  title = 'No Records Found',
  description = 'Try adjusting your search query or filters to find what you are looking for.',
  actionLabel,
  onAction
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon2D name={icon} size={30} color={tokens.colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: tokens.spacing.xxl,
    paddingHorizontal: tokens.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.base,
  },
  title: {
    fontSize: tokens.typography.md,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
  },
  description: {
    fontSize: tokens.typography.sm,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: tokens.spacing.base,
  },
  actionBtn: {
    height: tokens.touchTarget.minHeight,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.surface,
  }
});
