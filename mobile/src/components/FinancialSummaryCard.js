import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { tokens } from '../styles/tokens';
import { formatCurrency } from '../utils/calculations';

export default function FinancialSummaryCard({ financials, onPayPress, canPay = true }) {
  if (!financials) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>FINANCIAL SUMMARY</Text>

      {/* Breakdown Row */}
      <View style={styles.row}>
        {/* Marga Box */}
        <View style={[styles.subBox, styles.margaBox]}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>Marga (Male)</Text>
          </View>
          <Text style={styles.subBoxMeta}>{financials.margaCount} hens • {financials.margaWeight} kg</Text>
          <Text style={styles.subBoxAmount}>{formatCurrency(financials.margaAmount)}</Text>
        </View>

        {/* Margee Box */}
        <View style={[styles.subBox, styles.margeeBox]}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>Margee (Female)</Text>
          </View>
          <Text style={styles.subBoxMeta}>{financials.margeeCount} hens • {financials.margeeWeight} kg</Text>
          <Text style={styles.subBoxAmount}>{formatCurrency(financials.margeeAmount)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Main Totals Strip */}
      <View style={styles.totalsRow}>
        <View style={styles.totalCol}>
          <Text style={styles.totalLabel}>Gross Bill</Text>
          <Text style={styles.totalValue}>{formatCurrency(financials.customerTotal)}</Text>
        </View>

        <View style={styles.totalCol}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={[styles.totalValue, styles.paidValue]}>{formatCurrency(financials.totalPaid)}</Text>
        </View>

        <View style={styles.totalCol}>
          <Text style={styles.totalLabel}>Remaining</Text>
          <Text style={[styles.totalValue, financials.payableAmount > 0 ? styles.payableValue : styles.paidValue]}>
            {formatCurrency(financials.payableAmount)}
          </Text>
        </View>
      </View>

      {/* Pay Action Button */}
      {canPay && financials.payableAmount > 0 && (
        <TouchableOpacity
          style={styles.payButton}
          activeOpacity={0.8}
          onPress={onPayPress}
        >
          <Text style={styles.payButtonText}>Record Payment</Text>
          <Text style={styles.payButtonSub}>Due: {formatCurrency(financials.payableAmount)}</Text>
        </TouchableOpacity>
      )}

      {financials.isSettled && (
        <View style={styles.settledBanner}>
          <Text style={styles.settledText}>Account Fully Settled</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: tokens.spacing.base,
  },
  cardHeader: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: tokens.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  subBox: {
    flex: 1,
    padding: tokens.spacing.sm,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  margaBox: {
    borderLeftWidth: 3,
    borderLeftColor: tokens.colors.primary,
  },
  margeeBox: {
    borderLeftWidth: 3,
    borderLeftColor: tokens.colors.primary,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: tokens.colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: tokens.radii.sm,
    marginBottom: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.primary,
  },
  subBoxMeta: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    marginBottom: 2,
  },
  subBoxAmount: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginVertical: tokens.spacing.md,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.base,
  },
  totalCol: {
    flex: 1,
  },
  totalLabel: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  paidValue: {
    color: tokens.colors.success,
  },
  payableValue: {
    color: tokens.colors.secondary,
  },
  payButton: {
    backgroundColor: tokens.colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
    shadowColor: tokens.colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
  },
  payButtonSub: {
    color: '#FFE0B2',
    fontSize: tokens.typography.xs,
    marginTop: 2,
  },
  settledBanner: {
    backgroundColor: tokens.colors.successLight,
    paddingVertical: 8,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
  },
  settledText: {
    color: tokens.colors.success,
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.semibold,
  }
});
