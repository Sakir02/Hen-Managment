import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { userTokens } from '../../styles/userTokens';
import { calculateCustomerFinancials, formatCurrency } from '../../../utils/calculations';

export default function UserCustomerCard({ customer, onPress }) {
  const fin = calculateCustomerFinancials(customer);
  const initials = customer.name
    ? customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CP';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress(customer)}
    >
      <View style={styles.cardContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.name} numberOfLines={1}>
            {customer.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {fin.totalHens} Hens • {formatCurrency(fin.customerTotal)}
          </Text>
        </View>

        {fin.payableAmount > 0 ? (
          <View style={styles.dueBadge}>
            <Text style={styles.dueBadgeText}>{formatCurrency(fin.payableAmount)}</Text>
          </View>
        ) : (
          <View style={styles.settledBadge}>
            <Text style={styles.settledBadgeText}>Settled</Text>
          </View>
        )}

        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.lg,
    paddingVertical: userTokens.spacing.md,
    paddingHorizontal: userTokens.spacing.base,
    marginBottom: userTokens.spacing.sm + 2,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.card,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.md,
    borderWidth: 1.5,
    borderColor: userTokens.colors.primary,
  },
  avatarText: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  infoCol: {
    flex: 1,
    marginRight: userTokens.spacing.sm,
  },
  name: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  subtitle: {
    fontSize: userTokens.typography.sm,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  dueBadge: {
    backgroundColor: userTokens.colors.secondaryLight,
    paddingHorizontal: userTokens.spacing.sm,
    paddingVertical: 3,
    borderRadius: userTokens.radii.pill,
    marginRight: userTokens.spacing.xs,
  },
  dueBadgeText: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.secondary,
  },
  settledBadge: {
    backgroundColor: userTokens.colors.secondaryLight,
    paddingHorizontal: userTokens.spacing.sm,
    paddingVertical: 3,
    borderRadius: userTokens.radii.pill,
    marginRight: userTokens.spacing.xs,
  },
  settledBadgeText: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.success,
  },
  chevron: {
    fontSize: 22,
    color: userTokens.colors.textSecondary,
    marginLeft: userTokens.spacing.xs,
  }
});
