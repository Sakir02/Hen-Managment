import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '../../styles/tokens';

export default function StatusBadge({ status, type, size = 'medium' }) {
  // Normalize string
  const text = (status || type || '').toUpperCase();

  let bg = tokens.colors.primaryLight;
  let fg = tokens.colors.primary;
  let label = text;

  switch (text) {
    case 'ACTIVE':
      bg = tokens.colors.primaryLight;
      fg = tokens.colors.primary;
      label = 'Active';
      break;
    case 'INACTIVE':
      bg = '#F3F4F6';
      fg = tokens.colors.textSecondary;
      label = 'Inactive';
      break;
    case 'PAID':
    case 'SETTLED':
      bg = tokens.colors.successLight;
      fg = tokens.colors.success;
      label = text === 'SETTLED' ? 'Settled' : 'Paid';
      break;
    case 'DUE':
    case 'PENDING':
      bg = tokens.colors.secondaryLight;
      fg = tokens.colors.secondary;
      label = text === 'DUE' ? 'Balance Due' : 'Pending';
      break;
    case 'MARGA':
      bg = tokens.colors.primaryLight;
      fg = tokens.colors.primary;
      label = 'Marga (Male)';
      break;
    case 'MARGEE':
      bg = '#FDF2F8';
      fg = '#BE185D';
      label = 'Margee (Female)';
      break;
    case 'SUPER ADMIN':
      bg = tokens.colors.primaryLight;
      fg = tokens.colors.primary;
      label = 'Super Admin';
      break;
    case 'FARM MANAGER':
      bg = '#ECFDF5';
      fg = '#059669';
      label = 'Farm Manager';
      break;
    case 'FIELD OPERATOR':
      bg = tokens.colors.secondaryLight;
      fg = tokens.colors.secondary;
      label = 'Field Operator';
      break;
    case 'BILLING AUDITOR':
      bg = '#EEF2FF';
      fg = '#4F46E5';
      label = 'Billing Auditor';
      break;
    case 'CREATE':
      bg = tokens.colors.primaryLight;
      fg = tokens.colors.primary;
      label = 'Created';
      break;
    case 'UPDATE':
      bg = '#EFF6FF';
      fg = '#2563EB';
      label = 'Updated';
      break;
    case 'DELETE':
      bg = tokens.colors.errorLight;
      fg = tokens.colors.error;
      label = 'Deleted';
      break;
    default:
      bg = tokens.colors.background;
      fg = tokens.colors.textSecondary;
      label = text;
  }

  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, { backgroundColor: bg }, isSmall && styles.badgeSmall]}>
      <Text style={[styles.badgeText, { color: fg }, isSmall && styles.badgeTextSmall]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: tokens.spacing.sm + 2,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radii.pill,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSmall: {
    paddingHorizontal: tokens.spacing.xs + 2,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.semibold,
    letterSpacing: 0.2,
  },
  badgeTextSmall: {
    fontSize: 10,
  }
});
