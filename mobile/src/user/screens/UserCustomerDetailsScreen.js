import Icon2D from '../../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { userTokens } from '../styles/userTokens';
import { useAdminData } from '../../context/AdminDataContext';
import { calculateCustomerFinancials, formatCurrency } from '../../utils/calculations';
import UserHenCard from '../components/hen/UserHenCard';
import UserStatusBadge from '../components/common/UserStatusBadge';
import UserEmptyState from '../components/common/UserEmptyState';
import UserConfirmationModal from '../components/common/UserConfirmationModal';
import UserCustomerModal from '../components/customer/UserCustomerModal';
import UserBatchAddHenModal from '../components/hen/UserBatchAddHenModal';
import UserPaymentSheet from '../components/payment/UserPaymentSheet';

export default function UserCustomerDetailsScreen({ customerId, onBack }) {
  const {
    customers,
    updateCustomer,
    addHenToCustomer,
    addHensBatchToCustomer,
    deleteHenFromCustomer,
    addPaymentToCustomer,
    rates,
    showToast
  } = useAdminData();

  const customer = customers.find((c) => c.id === customerId);

  const [activeHenFilter, setActiveHenFilter] = useState('ALL'); // 'ALL' | 'MARGA' | 'MARGEE'
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [isAddHenOpen, setIsAddHenOpen] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [henToDelete, setHenToDelete] = useState(null);

  if (!customer) {
    return (
      <View style={styles.container}>
        <UserEmptyState
          icon="alert"
          title="Customer Not Found"
          description="The selected customer profile was not found."
          actionLabel="← Back to Customer List"
          onAction={onBack}
        />
      </View>
    );
  }

  const financials = calculateCustomerFinancials(customer);

  const filteredHens = (customer.hens || []).filter((hen) => {
    if (activeHenFilter === 'ALL') return true;
    return hen.type === activeHenFilter;
  });

  const handleCallCustomer = () => {
    if (customer.phone) {
      Linking.openURL(`tel:${customer.phone}`).catch(() => {
        showToast(`Cannot dial ${customer.phone} on this device.`, 'warning');
      });
    }
  };

  const handleConfirmDeleteHen = () => {
    if (henToDelete) {
      deleteHenFromCustomer(customer.id, henToDelete.id);
      setHenToDelete(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen 8 Top Bar: ← Customer Details */}
      <View style={styles.topNavBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>← Customer Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.topActionBtn}
          onPress={() => setIsEditCustomerOpen(true)}
          activeOpacity={0.7}
        >
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="edit" size={14} color="#2563EB" /><Text style={styles.topActionText}>Edit</Text></View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Profile Banner (Prototype Screen 8) */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{customer.name.charAt(0).toUpperCase()}</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <TouchableOpacity
                onPress={handleCallCustomer}
                activeOpacity={0.7}
                style={styles.phoneRow}
              >
                <Icon2D name="phone" size={18} color="#64748B" />
                <Text style={styles.customerPhone}>{customer.phone}</Text>
              </TouchableOpacity>
            </View>

            <UserStatusBadge
              status={financials.payableAmount > 0 ? 'DUE' : 'SETTLED'}
              size="small"
            />
          </View>
        </View>

        {/* 3 Summary Boxes: Total, Paid, Payable (Prototype Screen 8) */}
        <View style={styles.financialRow}>
          {/* Total */}
          <View style={styles.financialCard}>
            <Text style={styles.financialLabel}>Total</Text>
            <Text style={styles.financialValPrimary}>{formatCurrency(financials.customerTotal)}</Text>
          </View>

          {/* Paid */}
          <View style={styles.financialCard}>
            <Text style={styles.financialLabel}>Paid</Text>
            <Text style={styles.financialValPrimary}>{formatCurrency(financials.totalPaid)}</Text>
          </View>

          {/* Payable in Soft Teal #CCFBF1 */}
          <View style={[styles.financialCard, styles.payableCardTeal]}>
            <Text style={styles.payableLabelTeal}>Payable</Text>
            <Text style={styles.payableValTeal}>
              {formatCurrency(financials.payableAmount)}
            </Text>
          </View>
        </View>

        {/* Marga + Margee Subtotal Breakdown Card (Roadmap Section 1 & 8) */}
        <View style={styles.margaMargeeBreakdownCard}>
          <View style={styles.breakdownCol}>
            <View style={styles.breakdownHeader}>
              <View style={[styles.miniDot, { backgroundColor: userTokens.colors.primary }]} />
              <Text style={styles.breakdownTitle}>Marga Subtotal</Text>
            </View>
            <Text style={styles.breakdownAmount}>{formatCurrency(financials.margaAmount)}</Text>
            <Text style={styles.breakdownDetail}>
              {financials.margaCount} birds • {financials.margaWeight} kg
            </Text>
          </View>

          <View style={styles.breakdownDivider} />

          <View style={styles.breakdownCol}>
            <View style={styles.breakdownHeader}>
              <View style={[styles.miniDot, { backgroundColor: userTokens.colors.secondary }]} />
              <Text style={styles.breakdownTitle}>Margee Subtotal</Text>
            </View>
            <Text style={styles.breakdownAmount}>{formatCurrency(financials.margeeAmount)}</Text>
            <Text style={styles.breakdownDetail}>
              {financials.margeeCount} birds • {financials.margeeWeight} kg
            </Text>
          </View>
        </View>

        {/* Hens Section (Prototype Screen 8) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Hens</Text>

            <TouchableOpacity
              style={styles.addHenBtn}
              onPress={() => setIsAddHenOpen(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.addHenBtnText}>+ Add Hen</Text>
            </TouchableOpacity>
          </View>

          {/* Hen Type Filter */}
          <View style={styles.henFilterRow}>
            <TouchableOpacity
              style={[styles.henFilterChip, activeHenFilter === 'ALL' && styles.henFilterChipActive]}
              onPress={() => setActiveHenFilter('ALL')}
            >
              <Text style={[styles.henFilterText, activeHenFilter === 'ALL' && styles.henFilterTextActive]}>
                All ({customer.hens?.length || 0})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.henFilterChip, activeHenFilter === 'MARGA' && styles.henFilterChipActive]}
              onPress={() => setActiveHenFilter('MARGA')}
            >
              <Text style={[styles.henFilterText, activeHenFilter === 'MARGA' && styles.henFilterTextActive]}>
                Marga ({financials.margaCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.henFilterChip, activeHenFilter === 'MARGEE' && styles.henFilterChipActive]}
              onPress={() => setActiveHenFilter('MARGEE')}
            >
              <Text style={[styles.henFilterText, activeHenFilter === 'MARGEE' && styles.henFilterTextActive]}>
                Margee ({financials.margeeCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Hens List */}
          {filteredHens.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyBoxText}>
                No {activeHenFilter === 'ALL' ? '' : activeHenFilter.toLowerCase()} birds recorded for this customer.
              </Text>
              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={() => setIsAddHenOpen(true)}
              >
                <Text style={styles.emptyAddBtnText}>＋ Batch Add Hens (Marga + Margee)</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.henCardsStack}>
              {filteredHens.map((hen) => (
                <UserHenCard
                  key={hen.id}
                  hen={hen}
                  onDelete={() => setHenToDelete(hen)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Payment History Section with Secondary Teal #0D9488 Button (Spec Section 11) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>
                Payment History ({customer.payments?.length || 0})
              </Text>
              <Text style={styles.sectionSub}>
                Received: {formatCurrency(financials.totalPaid)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.recordPayBtnTeal}
              onPress={() => setIsPaymentSheetOpen(true)}
              activeOpacity={0.8}
            >
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="card" size={14} color="#FFFFFF" /><Text style={styles.recordPayBtnText}>Pay / Collect</Text></View>
            </TouchableOpacity>
          </View>

          {(!customer.payments || customer.payments.length === 0) ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyBoxText}>No payments recorded yet.</Text>
              <TouchableOpacity
                style={[styles.emptyAddBtn, { backgroundColor: userTokens.colors.secondaryLight }]}
                onPress={() => setIsPaymentSheetOpen(true)}
              >
                <Text style={[styles.emptyAddBtnText, { color: userTokens.colors.secondary }]}>
                  Collect First Payment
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.paymentStack}>
              {customer.payments.map((payment) => (
                <View key={payment.id} style={styles.paymentCard}>
                  <View style={styles.paymentLeft}>
                    <View style={styles.paymentIconCircle}>
                      <Icon2D name="check" size={18} color="#16A34A" />
                    </View>
                    <View>
                      <Text style={styles.paymentMethod}>
                        {payment.method || 'Cash Payment'}
                      </Text>
                      <Text style={styles.paymentDate}>{payment.date}</Text>
                      {payment.notes ? (
                        <Text style={styles.paymentNotes}>"{payment.notes}"</Text>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.paymentRight}>
                    <Text style={styles.paymentAmount}>
                      +{formatCurrency(payment.amount)}
                    </Text>
                    <UserStatusBadge status="PAID" size="small" />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action: Full-Width Blue Pay Button (Prototype Screen 8) */}
      <View style={styles.stickyPayBar}>
        <TouchableOpacity
          style={styles.payBtnFull}
          onPress={() => setIsPaymentSheetOpen(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.payBtnFullText}>Pay</Text>
        </TouchableOpacity>
      </View>

      {/* Batch Add Hens Modal (Roadmap Section 2: Combined Marga + Margee Batch Flow) */}
      <UserBatchAddHenModal
        visible={isAddHenOpen}
        customerName={customer.name}
        rates={rates}
        onClose={() => setIsAddHenOpen(false)}
        onSaveBatch={(batchHens) => addHensBatchToCustomer(customer.id, batchHens)}
      />

      {/* Payment Bottom Sheet */}
      <UserPaymentSheet
        visible={isPaymentSheetOpen}
        customer={customer}
        financials={financials}
        onClose={() => setIsPaymentSheetOpen(false)}
        onSavePayment={(customerId, paymentRecord) => addPaymentToCustomer(customerId, paymentRecord)}
      />

      {/* Edit Customer Profile Modal */}
      <UserCustomerModal
        visible={isEditCustomerOpen}
        initialCustomer={customer}
        onClose={() => setIsEditCustomerOpen(false)}
        onSaveCustomer={(updated) => updateCustomer(customer.id, updated)}
      />

      {/* Delete Hen Confirmation Modal */}
      <UserConfirmationModal
        visible={!!henToDelete}
        title="Remove Hen Entry"
        message={`Delete Hen #${henToDelete?.henNumber} (${henToDelete?.weight} kg)? Customer ledger totals will be recalculated.`}
        confirmLabel="Yes, Delete"
        isDestructive={true}
        onConfirm={handleConfirmDeleteHen}
        onCancel={() => setHenToDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: userTokens.colors.background,
  },
  topNavBar: {
    height: 52,
    backgroundColor: userTokens.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: userTokens.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
  },
  backBtn: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backBtnText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  topActionBtn: {
    paddingVertical: 6,
    paddingHorizontal: userTokens.spacing.sm,
    borderRadius: userTokens.radii.sm,
    backgroundColor: userTokens.colors.background,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  topActionText: {
    fontSize: 11,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: userTokens.spacing.base,
    paddingBottom: 120,
    gap: userTokens.spacing.md,
  },
  profileCard: {
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.xl,
    padding: userTokens.spacing.base,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.card,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: userTokens.colors.primary,
  },
  avatarText: {
    fontSize: userTokens.typography.lg,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: userTokens.spacing.md,
    marginRight: userTokens.spacing.xs,
  },
  customerName: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  phoneIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  customerPhone: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.primary,
    fontWeight: userTokens.typography.semibold,
  },
  customerAddress: {
    fontSize: 11,
    color: userTokens.colors.textSecondary,
    marginTop: 3,
  },
  notesBox: {
    marginTop: userTokens.spacing.md,
    padding: userTokens.spacing.sm,
    backgroundColor: userTokens.colors.background,
    borderRadius: userTokens.radii.sm,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textSecondary,
    textTransform: 'uppercase',
  },
  notesContent: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textPrimary,
    marginTop: 2,
  },
  financialRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.xs,
  },
  financialCard: {
    flex: 1,
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.lg,
    padding: userTokens.spacing.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.card,
  },
  payableHighlight: {
    borderLeftWidth: 3,
    borderLeftColor: userTokens.colors.secondary,
  },
  financialLabel: {
    fontSize: 10,
    color: userTokens.colors.textSecondary,
    marginBottom: 4,
  },
  payableCardTeal: {
    backgroundColor: userTokens.colors.secondaryLight, // #CCFBF1
    borderColor: userTokens.colors.secondary,
  },
  payableLabelTeal: {
    fontSize: 10,
    color: userTokens.colors.secondary,
    fontWeight: userTokens.typography.bold,
    marginBottom: 4,
  },
  payableValTeal: {
    fontSize: 13,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.secondary,
  },
  payableLabel: {
    color: userTokens.colors.secondary,
    fontWeight: userTokens.typography.bold,
  },
  financialValPrimary: {
    fontSize: 13,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  financialValPaid: {
    fontSize: 13,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.success,
  },
  financialValDue: {
    fontSize: 13,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.secondary,
  },
  financialMeta: {
    fontSize: 9,
    color: userTokens.colors.textMuted,
    marginTop: 4,
  },
  margaMargeeBreakdownCard: {
    backgroundColor: userTokens.colors.background,
    borderRadius: userTokens.radii.lg,
    padding: userTokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  breakdownCol: {
    flex: 1,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  breakdownTitle: {
    fontSize: 10,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textSecondary,
    textTransform: 'uppercase',
  },
  breakdownAmount: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  breakdownDetail: {
    fontSize: 10,
    color: userTokens.colors.textSecondary,
    marginTop: 1,
  },
  breakdownDivider: {
    width: 1,
    height: 36,
    backgroundColor: userTokens.colors.border,
    marginHorizontal: userTokens.spacing.sm,
  },
  sectionContainer: {
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.xl,
    padding: userTokens.spacing.base,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.card,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: userTokens.spacing.md,
  },
  sectionTitle: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  addHenBtn: {
    backgroundColor: userTokens.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: userTokens.spacing.md,
    borderRadius: userTokens.radii.md,
  },
  addHenBtnText: {
    color: userTokens.colors.surface,
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
  },
  recordPayBtnTeal: {
    backgroundColor: userTokens.colors.secondary, // Secondary Teal #0D9488
    paddingVertical: 8,
    paddingHorizontal: userTokens.spacing.md,
    borderRadius: userTokens.radii.md,
  },
  recordPayBtnText: {
    color: userTokens.colors.surface,
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
  },
  henFilterRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.xs,
    marginBottom: userTokens.spacing.md,
  },
  henFilterChip: {
    paddingHorizontal: userTokens.spacing.md,
    paddingVertical: 4,
    borderRadius: userTokens.radii.pill,
    backgroundColor: userTokens.colors.background,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  henFilterChipActive: {
    backgroundColor: userTokens.colors.primaryLight,
    borderColor: userTokens.colors.primary,
  },
  henFilterText: {
    fontSize: 11,
    color: userTokens.colors.textSecondary,
  },
  henFilterTextActive: {
    color: userTokens.colors.primary,
    fontWeight: userTokens.typography.bold,
  },
  henCardsStack: {
    gap: userTokens.spacing.sm,
  },
  emptyBox: {
    paddingVertical: userTokens.spacing.lg,
    alignItems: 'center',
    backgroundColor: userTokens.colors.background,
    borderRadius: userTokens.radii.md,
  },
  emptyBoxText: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginBottom: userTokens.spacing.sm,
  },
  emptyAddBtn: {
    paddingHorizontal: userTokens.spacing.md,
    paddingVertical: 6,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.primaryLight,
  },
  emptyAddBtnText: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  paymentStack: {
    gap: userTokens.spacing.sm,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: userTokens.spacing.md,
    backgroundColor: userTokens.colors.background,
    borderRadius: userTokens.radii.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconCircle: {
    width: 28,
    height: 28,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.sm,
  },
  paymentIconText: {
    fontSize: 14,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.success,
  },
  paymentMethod: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  paymentDate: {
    fontSize: 10,
    color: userTokens.colors.textSecondary,
  },
  paymentNotes: {
    fontSize: 10,
    fontStyle: 'italic',
    color: userTokens.colors.textMuted,
  },
  paymentRight: {
    alignItems: 'flex-end',
    marginLeft: userTokens.spacing.sm,
  },
  paymentAmount: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.success,
    marginBottom: 2,
  },
  stickyPayBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: userTokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: userTokens.colors.border,
    paddingHorizontal: userTokens.spacing.base,
    paddingVertical: userTokens.spacing.md,
    ...userTokens.shadows.float,
  },
  payBtnFull: {
    backgroundColor: userTokens.colors.primary, // Solid Blue #2563EB
    height: 52,
    borderRadius: userTokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    ...userTokens.shadows.card,
  },
  payBtnFullText: {
    color: userTokens.colors.surface,
    fontSize: userTokens.typography.md,
    fontWeight: userTokens.typography.bold,
    letterSpacing: 0.3,
  }
});
