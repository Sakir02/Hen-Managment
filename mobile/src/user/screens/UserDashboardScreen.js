import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { userTokens } from '../styles/userTokens';
import { useAdminData } from '../../context/AdminDataContext';
import { formatCurrency, calculateCustomerFinancials } from '../../utils/calculations';
import UserStatusBadge from '../components/common/UserStatusBadge';
import Icon2D from '../../components/common/Icon2D';

export default function UserDashboardScreen({
  onSelectCustomer,
  onNavigateTab,
  onOpenAddCustomer,
  onOpenAddHen,
  onOpenAddPayment,
}) {
  const { currentUser, customers, systemMetrics, rates } = useAdminData();

  const displayCustomersCount = systemMetrics?.totalCustomers || customers.length || 0;
  const displayTotalHens = systemMetrics?.totalHens ? systemMetrics.totalHens.toLocaleString() : '0';
  const displayOutstanding = formatCurrency(systemMetrics?.totalPayable || 0);

  // Top 5 customers for the list
  const recentCustomers = customers.slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Greeting (Spec Section 3 & Prototype Screen 5) */}
      <View style={styles.headerRow}>
        <View style={styles.greetingCol}>
          <Text style={styles.greetingSub}>Good Morning,</Text>
          <Text style={styles.greetingName}>
            {currentUser?.name || 'Rahul Kumar'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => onNavigateTab('customers')}
            activeOpacity={0.7}
          >
            <Icon2D name="bell" size={20} color={userTokens.colors.primary} />
            {(systemMetrics?.dueCustomersCount || 0) > 0 ? <View style={styles.bellDot} /> : null}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => onNavigateTab('more', 'profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>
              {currentUser?.avatar || 'RK'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. 2-Column Summary Cards: Customers & Total Hens (Prototype Screen 5) */}
      <View style={styles.statsGrid}>
        {/* Customers Card */}
        <TouchableOpacity
          style={styles.statBox}
          activeOpacity={0.8}
          onPress={() => onNavigateTab('customers')}
        >
          <View style={styles.statIconCircleTeal}>
            <Icon2D name="customers" size={22} color={userTokens.colors.secondary} />
          </View>
          <Text style={styles.statLabel}>Customers</Text>
          <Text style={styles.statNumber}>{displayCustomersCount}</Text>
        </TouchableOpacity>

        {/* Total Hens Card */}
        <TouchableOpacity
          style={styles.statBox}
          activeOpacity={0.8}
          onPress={() => onNavigateTab('hens')}
        >
          <View style={styles.statIconCircleBlue}>
            <Icon2D name="hens" size={22} color={userTokens.colors.primary} />
          </View>
          <Text style={styles.statLabel}>Total Hens</Text>
          <Text style={styles.statNumber}>{displayTotalHens}</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Solid Teal Card: Outstanding Amount (Prototype Screen 5) */}
      <TouchableOpacity
        style={styles.outstandingCard}
        activeOpacity={0.9}
        onPress={() => onNavigateTab('customers')}
      >
        <View style={styles.outstandingLeft}>
          <Text style={styles.outstandingLabel}>Outstanding Amount</Text>
          <Text style={styles.outstandingValue}>{displayOutstanding}</Text>
        </View>

        <View style={styles.outstandingArrowBtn}>
          <Icon2D name="more" size={18} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* 3.1 Quick Actions Bar */}
      <View style={styles.quickActionsRow}>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={onOpenAddCustomer}
          activeOpacity={0.8}
        >
          <Icon2D name="plus" size={16} color={userTokens.colors.textPrimary} />
          <Text style={styles.quickActionText}>Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionBtnPrimary}
          onPress={onOpenAddHen}
          activeOpacity={0.8}
        >
          <Icon2D name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.quickActionTextPrimary}>+ Add Hen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => onNavigateTab('more', 'payments')}
          activeOpacity={0.8}
        >
          <Icon2D name="payments" size={16} color={userTokens.colors.secondary} />
          <Text style={styles.quickActionText}>Payments</Text>
        </TouchableOpacity>
      </View>

      {/* 4. Recent Customers Header (Prototype Screen 5) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Recent Customers</Text>
        <TouchableOpacity onPress={() => onNavigateTab('customers')} activeOpacity={0.7}>
          <Text style={styles.viewAllLink}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* 5. Recent Customers List (Prototype Screen 5) */}
      <View style={styles.customerList}>
        {recentCustomers.map((cust) => {
          const fin = calculateCustomerFinancials(cust);
          const initials = cust.name
            ? cust.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            : 'RP';

          return (
            <TouchableOpacity
              key={cust.id}
              style={styles.customerCard}
              onPress={() => onSelectCustomer(cust.id)}
              activeOpacity={0.7}
            >
              <View style={styles.customerLeft}>
                <View style={styles.custAvatar}>
                  <Text style={styles.custAvatarText}>{initials}</Text>
                </View>

                <View style={styles.custInfoCol}>
                  <Text style={styles.custName} numberOfLines={1}>
                    {cust.name}
                  </Text>
                  <Text style={styles.custMeta}>
                    {fin.totalHens} Hens • {formatCurrency(fin.customerTotal)}
                  </Text>
                </View>
              </View>

              <View style={styles.customerRight}>
                {fin.payableAmount > 0 ? (
                  <View style={styles.duePill}>
                    <Text style={styles.duePillText}>Due {formatCurrency(fin.payableAmount)}</Text>
                  </View>
                ) : (
                  <View style={styles.settledPill}>
                    <Icon2D name="check" size={12} color="#16A34A" style={{ marginRight: 3 }} />
                    <Text style={styles.settledPillText}>Settled</Text>
                  </View>
                )}
                <Icon2D name="more" size={14} color={userTokens.colors.textSecondary} style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: userTokens.colors.background,
  },
  scrollContent: {
    padding: userTokens.spacing.base,
    paddingBottom: userTokens.spacing.xxl * 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: userTokens.spacing.base,
  },
  greetingCol: {
    flex: 1,
  },
  greetingSub: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    fontWeight: userTokens.typography.medium,
  },
  greetingName: {
    fontSize: userTokens.typography.xl,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: userTokens.spacing.sm,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.card,
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: userTokens.colors.error,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.primaryLight,
    borderWidth: 1,
    borderColor: userTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: userTokens.spacing.md,
    marginBottom: userTokens.spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: userTokens.colors.surface,
    padding: userTokens.spacing.base,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.card,
  },
  statIconCircleTeal: {
    width: 44,
    height: 44,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: userTokens.spacing.sm,
  },
  statIconCircleBlue: {
    width: 44,
    height: 44,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: userTokens.spacing.sm,
  },
  statLabel: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    fontWeight: userTokens.typography.medium,
  },
  statNumber: {
    fontSize: userTokens.typography.xl,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
    marginTop: 2,
  },
  outstandingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: userTokens.colors.secondary,
    padding: userTokens.spacing.lg,
    borderRadius: userTokens.radii.lg,
    marginBottom: userTokens.spacing.base,
    ...userTokens.shadows.card,
  },
  outstandingLeft: {
    flex: 1,
  },
  outstandingLabel: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.surface,
    fontWeight: userTokens.typography.medium,
    opacity: 0.9,
  },
  outstandingValue: {
    fontSize: userTokens.typography.xxl,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.surface,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  outstandingArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: userTokens.radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.sm,
    marginBottom: userTokens.spacing.lg,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: userTokens.colors.surface,
    paddingVertical: userTokens.spacing.sm + 2,
    borderRadius: userTokens.radii.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    gap: userTokens.spacing.xs,
    ...userTokens.shadows.card,
  },
  quickActionBtnPrimary: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: userTokens.colors.primary,
    paddingVertical: userTokens.spacing.sm + 2,
    borderRadius: userTokens.radii.md,
    gap: userTokens.spacing.xs,
    ...userTokens.shadows.card,
  },
  quickActionText: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
  },
  quickActionTextPrimary: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.surface,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: userTokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  viewAllLink: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.primary,
  },
  customerList: {
    gap: userTokens.spacing.sm,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: userTokens.colors.surface,
    padding: userTokens.spacing.base,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.card,
  },
  customerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  custAvatar: {
    width: 44,
    height: 44,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.md,
  },
  custAvatarText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  custInfoCol: {
    flex: 1,
  },
  custName: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  custMeta: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  customerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duePill: {
    backgroundColor: userTokens.colors.secondaryLight,
    paddingHorizontal: userTokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: userTokens.radii.full,
  },
  duePillText: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.secondary,
  },
  settledPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.successLight,
    paddingHorizontal: userTokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: userTokens.radii.full,
  },
  settledPillText: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.success,
  }
});
