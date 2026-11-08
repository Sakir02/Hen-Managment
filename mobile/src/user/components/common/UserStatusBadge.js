import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { userTokens } from '../../styles/userTokens';

export default function UserStatusBadge({ status, type, size = 'medium' }) {
  const text = (status || type || '').toUpperCase();

  let bg = userTokens.colors.primaryLight;
  let fg = userTokens.colors.primary;
  let label = text;

  switch (text) {
    case 'ACTIVE':
      bg = userTokens.colors.primaryLight;
      fg = userTokens.colors.primary;
      label = 'Active';
      break;
    case 'INACTIVE':
      bg = '#F1F5F9';
      fg = userTokens.colors.textSecondary;
      label = 'Inactive';
      break;
    case 'PAID':
    case 'SETTLED':
      bg = userTokens.colors.successLight;
      fg = userTokens.colors.success;
      label = text === 'SETTLED' ? 'Settled' : 'Paid';
      break;
    case 'DUE':
    case 'PENDING':
      bg = userTokens.colors.warningLight;
      fg = userTokens.colors.warning;
      label = text === 'DUE' ? 'Balance Due' : 'Pending';
      break;
    // Spec Section 12: Unified common palette for Marga & Margee
    case 'MARGA':
      bg = userTokens.colors.primaryLight;
      fg = userTokens.colors.primary;
      label = 'Marga (Male)';
      break;
    case 'MARGEE':
      bg = userTokens.colors.secondaryLight;
      fg = userTokens.colors.secondary;
      label = 'Margee (Female)';
      break;
    default:
      bg = userTokens.colors.background;
      fg = userTokens.colors.textSecondary;
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
    paddingHorizontal: userTokens.spacing.sm + 2,
    paddingVertical: userTokens.spacing.xs,
    borderRadius: userTokens.radii.pill,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSmall: {
    paddingHorizontal: userTokens.spacing.xs + 2,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.semibold,
    letterSpacing: 0.2,
  },
  badgeTextSmall: {
    fontSize: 10,
  }
});
