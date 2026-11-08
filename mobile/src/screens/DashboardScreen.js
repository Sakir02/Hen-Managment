import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { tokens } from '../styles/tokens';
import { useAdminData } from '../context/AdminDataContext';
import { formatCurrency } from '../utils/calculations';
import StatusBadge from '../components/common/StatusBadge';
import Icon2D from '../components/common/Icon2D';

export default function DashboardScreen({
  onNavigateTab,
  onOpenRateModal,
  onOpenAddCustomer,
  onSelectCustomer
}) {
  const { currentUser, rates, systemMetrics } = useAdminData();

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Banner */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeTextGroup}>
          <Text style={styles.greetingText}>
            Welcome back, {currentUser?.name?.split(' ')[0] || 'Admin'}
          </Text>
          <Text style={styles.roleSubtext}>
            {currentUser?.role || 'Super Admin'} • {formattedDate}
          </Text>
        </View>
        <View style={styles.shiftBadge}>
          <Text style={styles.shiftBadgeText}>LIVE MANDI</Text>
        </View>
      </View>

      {/* Live Mandi Rates Quick Ribbon */}
      <TouchableOpacity
        style={styles.rateRibbon}
        onPress={onOpenRateModal}
        activeOpacity={0.8}
      >
        <View style={styles.rateRibbonLeft}>
          <View style={styles.rateIconWrap}>
            <Icon2D name="rates" size={18} color={tokens.colors.primary} />
          </View>
          <View>
            <Text style={styles.rateRibbonTitle}>Today's Standard Mandi Rates</Text>
            <Text style={styles.rateRibbonSub}>Tap to update wholesale prices</Text>
          </View>
        </View>
        <View style={styles.rateValues}>
          <View style={styles.ratePillMarga}>
            <Text style={styles.ratePillLabel}>Marga:</Text>
            <Text style={styles.ratePillVal}>₹{rates.MARGA}</Text>
          </View>
          <View style={styles.ratePillMargee}>
            <Text style={styles.ratePillLabel}>Margee:</Text>
            <Text style={styles.ratePillVal}>₹{rates.MARGEE}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Full-Width Outstanding Amount Card */}
      <View style={styles.outstandingCard}>
        <View style={styles.outstandingHeader}>
          <View>
            <Text style={styles.outstandingLabel}>TOTAL OUTSTANDING RECEIVABLES</Text>
            <Text style={styles.outstandingValue}>
              {formatCurrency(systemMetrics?.totalPayable || 0)}
            </Text>
          </View>
          <View style={styles.alertCircle}>
            <Icon2D name="payments" size={20} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.outstandingFooter}>
          <Text style={styles.outstandingSub}>
            Across <Text style={styles.boldText}>{systemMetrics?.dueCustomersCount || 0}</Text> customers with pending balance
          </Text>
          <TouchableOpacity
            style={styles.viewDueBtn}
            onPress={() => onNavigateTab('customers')}
            activeOpacity={0.7}
          >
            <Text style={styles.viewDueBtnText}>Review Due ›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2-Column Summary Cards Grid */}
      <View style={styles.statsGrid}>
        {/* Total Users */}
        <TouchableOpacity
          style={styles.statBox}
          activeOpacity={0.8}
          onPress={() => onNavigateTab('users')}
        >
          <View style={styles.statIconBadge}>
            <Icon2D name="users" size={20} color={tokens.colors.primary} />
          </View>
          <Text style={styles.statNumber}>{systemMetrics?.totalStaff || 0}</Text>
          <Text style={styles.statTitle}>Staff Users</Text>
          <Text style={styles.statMeta}>{systemMetrics?.activeStaff || 0} Active</Text>
        </TouchableOpacity>

        {/* Active Customers */}
        <TouchableOpacity
          style={styles.statBox}
          activeOpacity={0.8}
          onPress={() => onNavigateTab('customers')}
        >
          <View style={[styles.statIconBadge, { backgroundColor: tokens.colors.primaryLight }]}>
            <Icon2D name="customers" size={20} color={tokens.colors.primary} />
          </View>
          <Text style={styles.statNumber}>{systemMetrics?.totalCustomers || 0}</Text>
          <Text style={styles.statTitle}>Customers</Text>
          <Text style={styles.statMeta}>{systemMetrics?.dueCustomersCount || 0} with dues</Text>
        </TouchableOpacity>

        {/* Total Hens */}
        <TouchableOpacity
          style={styles.statBox}
          activeOpacity={0.8}
          onPress={() => onNavigateTab('more', 'hens')}
        >
          <View style={[styles.statIconBadge, { backgroundColor: '#ECFDF5' }]}>
            <Icon2D name="hens" size={20} color={tokens.colors.secondary} />
          </View>
          <Text style={styles.statNumber}>{systemMetrics?.totalHens || 0}</Text>
          <Text style={styles.statTitle}>Total Hens</Text>
          <Text style={styles.statMeta}>{systemMetrics?.totalWeight || '0.00'} kg</Text>
        </TouchableOpacity>

        {/* Total Payments */}
        <TouchableOpacity
          style={styles.statBox}
          activeOpacity={0.8}
          onPress={() => onNavigateTab('more', 'payments')}
        >
          <View style={[styles.statIconBadge, { backgroundColor: tokens.colors.successLight }]}>
            <Icon2D name="payments" size={20} color={tokens.colors.success} />
          </View>
          <Text style={[styles.statNumber, { fontSize: 16 }]}>
            {formatCurrency(systemMetrics?.totalPaid || 0)}
          </Text>
          <Text style={styles.statTitle}>Collected</Text>
          <Text style={styles.statMeta}>{(systemMetrics?.allPayments?.length || 0)} txns</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Operations Bar */}
      <View style={styles.quickBar}>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={onOpenAddCustomer}
          activeOpacity={0.8}
        >
          <Icon2D name="plus" size={16} color={tokens.colors.primary} />
          <Text style={styles.quickActionText}>Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={onOpenRateModal}
          activeOpacity={0.8}
        >
          <Icon2D name="rates" size={16} color={tokens.colors.primary} />
          <Text style={styles.quickActionText}>Mandi Rates</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => onNavigateTab('more', 'audit')}
          activeOpacity={0.8}
        >
          <Icon2D name="history" size={16} color={tokens.colors.textSecondary} />
          <Text style={styles.quickActionText}>Audit Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickActionBtn, { borderColor: tokens.colors.secondary }]}
          onPress={() => onNavigateTab('more', 'payments')}
          activeOpacity={0.8}
        >
          <Icon2D name="payments" size={16} color={tokens.colors.secondary} />
          <Text style={[styles.quickActionText, { color: tokens.colors.secondary }]}>Payments</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Payments Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Payments</Text>
        <TouchableOpacity
          onPress={() => onNavigateTab('more', 'payments')}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllLink}>View All ({(systemMetrics?.allPayments?.length || 0)}) ›</Text>
        </TouchableOpacity>
      </View>

      {(!systemMetrics?.recentPayments || systemMetrics.recentPayments.length === 0) ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No recent payments recorded.</Text>
        </View>
      ) : (
        <View style={styles.paymentStack}>
          {systemMetrics.recentPayments.map((payment) => (
            <TouchableOpacity
              key={payment.id}
              style={styles.paymentItem}
              activeOpacity={0.7}
              onPress={() => onSelectCustomer(payment.customerId)}
            >
              <View style={styles.paymentLeft}>
                <View style={styles.payIconCircle}>
                  <Icon2D name="payments" size={16} color={tokens.colors.primary} />
                </View>
                <View style={styles.payInfoCol}>
                  <Text style={styles.payCustomerName} numberOfLines={1}>
                    {payment.customerName}
                  </Text>
                  <Text style={styles.payMeta}>
                    {payment.date} • {payment.method || 'Cash'}
                  </Text>
                </View>
              </View>

              <View style={styles.paymentRight}>
                <Text style={styles.payAmountText}>
                  +{formatCurrency(payment.amount)}
                </Text>
                <StatusBadge status="PAID" size="small" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  scrollContent: {
    padding: tokens.spacing.base,
    paddingBottom: tokens.spacing.xxl + 20,
  },
  welcomeCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginBottom: tokens.spacing.md,
    ...tokens.shadows.card,
  },
  welcomeTextGroup: {
    flex: 1,
  },
  greetingText: {
    fontSize: tokens.typography.md,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  roleSubtext: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  shiftBadge: {
    backgroundColor: tokens.colors.primaryLight,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.radii.full,
    borderWidth: 1,
    borderColor: tokens.colors.primary,
  },
  shiftBadgeText: {
    fontSize: 10,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  rateRibbon: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginBottom: tokens.spacing.md,
    ...tokens.shadows.card,
  },
  rateRibbonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rateIconWrap: {
    width: 32,
    height: 32,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.sm,
  },
  rateRibbonTitle: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  rateRibbonSub: {
    fontSize: 10,
    color: tokens.colors.textSecondary,
    marginTop: 1,
  },
  rateValues: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  ratePillMarga: {
    backgroundColor: tokens.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: tokens.radii.md,
    flexDirection: 'row',
    gap: 2,
  },
  ratePillMargee: {
    backgroundColor: tokens.colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: tokens.radii.md,
    flexDirection: 'row',
    gap: 2,
  },
  ratePillLabel: {
    fontSize: 10,
    color: tokens.colors.textSecondary,
  },
  ratePillVal: {
    fontSize: 10,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  outstandingCard: {
    backgroundColor: tokens.colors.secondary,
    borderRadius: tokens.radii.xl,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
    ...tokens.shadows.float,
  },
  outstandingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  outstandingLabel: {
    fontSize: 10,
    fontWeight: tokens.typography.bold,
    color: '#E0F2FE',
    letterSpacing: 0.5,
  },
  outstandingValue: {
    fontSize: tokens.typography.display,
    fontWeight: tokens.typography.bold,
    color: '#FFFFFF',
    marginTop: 4,
  },
  alertCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outstandingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: tokens.spacing.md,
    paddingTop: tokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  outstandingSub: {
    fontSize: tokens.typography.xs,
    color: '#E0F2FE',
    flex: 1,
  },
  boldText: {
    fontWeight: tokens.typography.bold,
    color: '#FFFFFF',
  },
  viewDueBtn: {
    paddingVertical: 4,
    paddingHorizontal: tokens.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: tokens.radii.sm,
  },
  viewDueBtnText: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  statBox: {
    width: '48.5%',
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.md,
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.card,
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
  },
  statNumber: {
    fontSize: tokens.typography.xl,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  statTitle: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.medium,
    marginTop: 2,
  },
  statMeta: {
    fontSize: 10,
    color: tokens.colors.textMuted,
    marginTop: 2,
  },
  quickBar: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.lg,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    paddingVertical: tokens.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    gap: 4,
  },
  quickActionText: {
    fontSize: 10,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: tokens.typography.md,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  seeAllLink: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.primary,
  },
  emptyCard: {
    padding: tokens.spacing.xl,
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  emptyText: {
    color: tokens.colors.textSecondary,
    fontSize: tokens.typography.xs,
  },
  paymentStack: {
    gap: tokens.spacing.xs,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.md,
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.card,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  payIconCircle: {
    width: 36,
    height: 36,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  payInfoCol: {
    flex: 1,
  },
  payCustomerName: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  payMeta: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  paymentRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  payAmountText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.success,
  }
});
