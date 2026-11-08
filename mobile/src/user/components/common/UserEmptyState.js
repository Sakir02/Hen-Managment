import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { userTokens } from '../../styles/userTokens';
import Icon2D from '../../../components/common/Icon2D';

export default function UserEmptyState({
  icon = 'search',
  title = 'No Records Found',
  description = 'Try adjusting your search query or filters to find what you are looking for.',
  actionLabel,
  onAction
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon2D name={icon} size={30} color={userTokens.colors.primary} />
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
    paddingVertical: userTokens.spacing.xxl,
    paddingHorizontal: userTokens.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: userTokens.spacing.base,
  },
  title: {
    fontSize: userTokens.typography.md,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
    textAlign: 'center',
    marginBottom: userTokens.spacing.xs,
  },
  description: {
    fontSize: userTokens.typography.sm,
    color: userTokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: userTokens.spacing.base,
  },
  actionBtn: {
    height: userTokens.touchTarget.minHeight,
    paddingHorizontal: userTokens.spacing.lg,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.surface,
  }
});
