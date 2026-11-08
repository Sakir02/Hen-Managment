import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { userTokens } from '../styles/userTokens';
import { useAdminData } from '../../context/AdminDataContext';
import { formatCurrency, calculateCustomerFinancials } from '../../utils/calculations';
import UserEmptyState from '../components/common/UserEmptyState';
import UserPaymentSheet from '../components/payment/UserPaymentSheet';
import Icon2D from '../../components/common/Icon2D';

export default function UserPaymentsScreen({ onBack, onSelectCustomer, customerId = null }) {
  const { systemMetrics, customers, addPaymentToCustomer } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  // If customerId is provided or defaulted to the first customer (Rahul Patel)
  const targetCustomer = customerId
    ? customers.find(c => c.id === customerId)
    : customers[0];

  const financials = targetCustomer ? calculateCustomerFinancials(targetCustomer) : null;

  const customerPayments = (targetCustomer?.payments || []).map(p => ({
    ...p,
    customerId: targetCustomer.id,
    customerName: targetCustomer.name,
  }));

  const allPaymentsList = systemMetrics?.allPayments || [];
  const paymentsToDisplay = customerId ? customerPayments : allPaymentsList;

  const filteredPayments = paymentsToDisplay.filter((p) => {
    const matchesSearch =
      p.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.method && p.method.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Top Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon2D name="back" size={18} color={userTokens.colors.primary} />
          <Text style={styles.backBtnText}>Payment History</Text>
        </TouchableOpacity>
      </View>

      {/* Customer Profile Header */}
      {targetCustomer && (
        <View style={styles.customerHeaderCard}>
          <View style={styles.custAvatar}>
            <Text style={styles.custAvatarText}>
              {targetCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.custName}>{targetCustomer.name}</Text>
            <Text style={styles.custPhone}>{targetCustomer.phone}</Text>
          </View>
        </View>
      )}

      {/* 3 Summary Boxes: Total, Paid, Payable */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryBoxLabel}>Total</Text>
          <Text style={styles.summaryBoxVal}>
            {formatCurrency(financials ? financials.customerTotal : (systemMetrics?.grossBill || 0))}
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryBoxLabel}>Paid</Text>
          <Text style={styles.summaryBoxVal}>
            {formatCurrency(financials ? financials.totalPaid : (systemMetrics?.totalPaid || 0))}
          </Text>
        </View>

        <View style={[styles.summaryBox, styles.summaryBoxPayable]}>
          <Text style={styles.summaryBoxLabelPayable}>Payable</Text>
          <Text style={styles.summaryBoxValPayable}>
            {formatCurrency(financials ? financials.payableAmount : (systemMetrics?.totalPayable || 0))}
          </Text>
        </View>
      </View>

      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Icon2D name="search" size={18} color={userTokens.colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search payments..."
            placeholderTextColor={userTokens.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon2D name="close" size={16} color={userTokens.colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Payments List */}
      <FlatList
        data={filteredPayments}
        keyExtractor={(item) => `${item.customerId}-${item.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <UserEmptyState
            icon="payments"
            title="No Payments Recorded"
            description="No receipts found for this ledger account."
          />
        }
        renderItem={({ item }) => (
          <View style={styles.paymentCard}>
            <View style={styles.cardLeft}>
              <Text style={styles.amountText}>
                {formatCurrency(item.amount)}
              </Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaDate}>
                {item.date || '27 Sep 2025'}
              </Text>
            </View>

            <View style={styles.paidBadge}>
              <Icon2D name="check" size={13} color="#16A34A" style={{ marginRight: 4 }} />
              <Text style={styles.paidBadgeText}>Paid</Text>
            </View>
          </View>
        )}
      />

      {/* Floating Action Button (+ Add Payment) */}
      <TouchableOpacity
        style={styles.fabBtn}
        onPress={() => setIsAddPaymentOpen(true)}
        activeOpacity={0.85}
      >
        <Icon2D name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.fabBtnText}>Record Payment</Text>
      </TouchableOpacity>

      {/* Payment Sheet */}
      <UserPaymentSheet
        visible={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        customer={targetCustomer}
        onConfirmPayment={(paymentData) => {
          if (targetCustomer) {
            addPaymentToCustomer(targetCustomer.id, paymentData);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: userTokens.colors.background,
  },
  navBar: {
    paddingHorizontal: userTokens.spacing.base,
    paddingVertical: userTokens.spacing.md,
    backgroundColor: userTokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: userTokens.spacing.xs,
  },
  backBtnText: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  customerHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: userTokens.spacing.base,
    backgroundColor: userTokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
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
    fontSize: userTokens.typography.md,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  custName: {
    fontSize: userTokens.typography.md,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  custPhone: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    padding: userTokens.spacing.base,
    backgroundColor: userTokens.colors.surface,
    gap: userTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: userTokens.colors.background,
    padding: userTokens.spacing.md,
    borderRadius: userTokens.radii.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
  },
  summaryBoxPayable: {
    backgroundColor: userTokens.colors.secondaryLight,
    borderColor: userTokens.colors.secondary,
  },
  summaryBoxLabel: {
    fontSize: 10,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textSecondary,
    textTransform: 'uppercase',
  },
  summaryBoxLabelPayable: {
    fontSize: 10,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.secondary,
    textTransform: 'uppercase',
  },
  summaryBoxVal: {
    fontSize: userTokens.typography.md,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
    marginTop: 4,
  },
  summaryBoxValPayable: {
    fontSize: userTokens.typography.md,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.secondary,
    marginTop: 4,
  },
  searchHeader: {
    paddingHorizontal: userTokens.spacing.base,
    paddingTop: userTokens.spacing.md,
    paddingBottom: userTokens.spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    paddingHorizontal: userTokens.spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: userTokens.typography.sm,
    color: userTokens.colors.textPrimary,
  },
  listContent: {
    padding: userTokens.spacing.base,
    paddingBottom: 90,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: userTokens.colors.surface,
    padding: userTokens.spacing.base,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    marginBottom: userTokens.spacing.sm,
    ...userTokens.shadows.card,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  metaDot: {
    marginHorizontal: userTokens.spacing.sm,
    color: userTokens.colors.textSecondary,
  },
  metaDate: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.successLight,
    paddingVertical: 4,
    paddingHorizontal: userTokens.spacing.sm,
    borderRadius: userTokens.radii.full,
  },
  paidBadgeText: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.success,
  },
  fabBtn: {
    position: 'absolute',
    bottom: userTokens.spacing.xl,
    right: userTokens.spacing.base,
    backgroundColor: userTokens.colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: userTokens.spacing.md,
    paddingHorizontal: userTokens.spacing.lg,
    borderRadius: userTokens.radii.pill,
    ...userTokens.shadows.float,
    gap: userTokens.spacing.xs,
  },
  fabBtnText: {
    color: '#FFFFFF',
    fontWeight: userTokens.typography.bold,
    fontSize: userTokens.typography.sm,
  }
});
