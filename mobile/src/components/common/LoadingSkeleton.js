import React from 'react';
import { View, StyleSheet } from 'react-native';
import { tokens } from '../../styles/tokens';

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonHeader}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.skeletonTextCol}>
              <View style={[styles.skeletonLine, { width: '60%' }]} />
              <View style={[styles.skeletonLine, { width: '40%', marginTop: 6 }]} />
            </View>
            <View style={styles.skeletonBadge} />
          </View>
          <View style={styles.divider} />
          <View style={styles.skeletonStatsRow}>
            <View style={[styles.skeletonLine, { width: '28%', height: 16 }]} />
            <View style={[styles.skeletonLine, { width: '28%', height: 16 }]} />
            <View style={[styles.skeletonLine, { width: '28%', height: 16 }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.base,
    gap: tokens.spacing.md,
  },
  skeletonCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonAvatar: {
    width: 44,
    height: 44,
    borderRadius: tokens.radii.full,
    backgroundColor: '#E2E8F0',
  },
  skeletonTextCol: {
    flex: 1,
    marginLeft: tokens.spacing.md,
  },
  skeletonLine: {
    height: 12,
    borderRadius: tokens.radii.sm,
    backgroundColor: '#E2E8F0',
  },
  skeletonBadge: {
    width: 60,
    height: 22,
    borderRadius: tokens.radii.pill,
    backgroundColor: '#E2E8F0',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: tokens.spacing.md,
  },
  skeletonStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
