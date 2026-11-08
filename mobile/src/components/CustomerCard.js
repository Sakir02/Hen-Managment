import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { tokens } from '../styles/tokens';
import { calculateCustomerFinancials, formatCurrency } from '../utils/calculations';

export default function CustomerCard({ customer, onPress }) {
  const fin = calculateCustomerFinancials(customer);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress(customer)}
    >
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{customer.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.name} numberOfLines={1}>{customer.name}</Text>
          <Text style={styles.phone}>{customer.phone}</Text>
        </View>
        <View style={[styles.badge, fin.payableAmount > 0 ? styles.pendingBadge : styles.settledBadge]}>
          <Text style={[styles.badgeText, fin.payableAmount > 0 ? styles.pendingBadgeText : styles.settledBadgeText]}>
            {fin.payableAmount > 0 ? 'Due' : 'Settled'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Hens Stock</Text>
          <Text style={styles.statVal}>{fin.totalHens} ({fin.totalWeight} kg)</Text>
        </View>

        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Total Bill</Text>
          <Text style={styles.statVal}>{formatCurrency(fin.customerTotal)}</Text>
        </View>

        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={[styles.statVal, fin.payableAmount > 0 ? styles.dueText : styles.settledText]}>
            {formatCurrency(fin.payableAmount)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginBottom: tokens.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  avatarText: {
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  infoCol: {
    flex: 1,
  },
  name: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  phone: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: tokens.radii.sm,
  },
  pendingBadge: {
    backgroundColor: tokens.colors.warningLight,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.warning,
  },
  settledBadge: {
    backgroundColor: tokens.colors.successLight,
  },
  settledBadgeText: {
    fontSize: 11,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginVertical: tokens.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginBottom: 2,
  },
  statVal: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  dueText: {
    color: tokens.colors.secondary,
  },
  settledText: {
    color: tokens.colors.success,
  }
});
