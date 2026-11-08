import Icon2D from '../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { tokens } from '../styles/tokens';
import { useAdminData } from '../context/AdminDataContext';
import { calculateCustomerFinancials, formatCurrency } from '../utils/calculations';
import FinancialSummaryCard from '../components/FinancialSummaryCard';
import HenCard from '../components/HenCard';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import UserBatchAddHenModal from '../user/components/hen/UserBatchAddHenModal';
import PaymentModal from '../components/PaymentModal';
import AddCustomerModal from '../components/AddCustomerModal';

export default function CustomerDetailsScreen({ customerId, onBack }) {
  const {
    customers,
    updateCustomer,
    deleteCustomer,
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
  const [isDeleteCustomerModalOpen, setIsDeleteCustomerModalOpen] = useState(false);

  if (!customer) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="alert"
          title="Customer Not Found"
          description="The selected customer profile does not exist or has been removed."
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

  const handleConfirmDeleteCustomer = () => {
    setIsDeleteCustomerModalOpen(false);
    deleteCustomer(customer.id);
    onBack();
  };

  return (
    <View style={styles.container}>
      {/* Sub-Header Navigation Bar */}
      <View style={styles.topNavBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>← All Customers</Text>
        </TouchableOpacity>

        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.topActionBtn}
            onPress={() => setIsEditCustomerOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="edit" size={14} color="#2563EB" /><Text style={styles.topActionText}>Edit Profile</Text></View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.topActionBtn, styles.deleteCustBtn]}
            onPress={() => setIsDeleteCustomerModalOpen(true)}
            activeOpacity={0.7}
          >
            <Icon2D name="trash" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Profile Banner (Spec Section 11) */}
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

            <StatusBadge
              status={financials.payableAmount > 0 ? 'DUE' : 'SETTLED'}
              size="small"
            />
          </View>

          {customer.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesContent}>{customer.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* Financial Summary Card (Spec Section 11) */}
        <FinancialSummaryCard
          financials={financials}
          onPayPress={() => setIsPaymentSheetOpen(true)}
          canPay={true}
        />

        {/* Hens Operations Section (Spec Section 11 & 12) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>
                Hens Batch Inventory ({customer.hens?.length || 0})
              </Text>
              <Text style={styles.sectionSub}>
                {financials.totalWeight} kg gross recorded stock
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addHenBtn}
              onPress={() => setIsAddHenOpen(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.addHenBtnText}>＋ Add Hens (Batch)</Text>
            </TouchableOpacity>
          </View>

          {/* Hen Type Filter Switch */}
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
                No {activeHenFilter === 'ALL' ? '' : activeHenFilter.toLowerCase()} hens recorded in this batch.
              </Text>
              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={() => setIsAddHenOpen(true)}
              >
                <Text style={styles.emptyAddBtnText}>+ Weigh & Add Hen</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.henCardsStack}>
              {filteredHens.map((hen) => (
                <HenCard
                  key={hen.id}
                  hen={hen}
                  onDelete={() => setHenToDelete(hen)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Payment History Section (Spec Section 11 & 13) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>
                Payment History ({customer.payments?.length || 0})
              </Text>
              <Text style={styles.sectionSub}>
                Total received: {formatCurrency(financials.totalPaid)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.recordPayBtn}
              onPress={() => setIsPaymentSheetOpen(true)}
              activeOpacity={0.8}
            >
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="card" size={14} color="#FFFFFF" /><Text style={styles.recordPayBtnText}>Record Payment</Text></View>
            </TouchableOpacity>
          </View>

          {(!customer.payments || customer.payments.length === 0) ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyBoxText}>No payments received yet.</Text>
              <TouchableOpacity
                style={[styles.emptyAddBtn, { backgroundColor: tokens.colors.secondaryLight }]}
                onPress={() => setIsPaymentSheetOpen(true)}
              >
                <Text style={[styles.emptyAddBtnText, { color: tokens.colors.secondary }]}>
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
                    <StatusBadge status="PAID" size="small" />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Payment Bar if Due */}
      {financials.payableAmount > 0 && (
        <View style={styles.stickyPayBar}>
          <View>
            <Text style={styles.stickyPayLabel}>Current Payable</Text>
            <Text style={styles.stickyPayValue}>
              {formatCurrency(financials.payableAmount)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.stickyPayBtn}
            onPress={() => setIsPaymentSheetOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.stickyPayBtnText}>Confirm Payment Now →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Batch Add Hens Modal */}
      <UserBatchAddHenModal
        visible={isAddHenOpen}
        customerName={customer.name}
        rates={rates}
        onClose={() => setIsAddHenOpen(false)}
        onSaveBatch={(batchHens) => addHensBatchToCustomer(customer.id, batchHens)}
      />

      {/* Payment Entry Bottom Sheet (Spec Section 13) */}
      <PaymentModal
        visible={isPaymentSheetOpen}
        customer={customer}
        financials={financials}
        onClose={() => setIsPaymentSheetOpen(false)}
        onSavePayment={(customerId, paymentRecord) => addPaymentToCustomer(customerId, paymentRecord)}
      />

      {/* Edit Customer Profile Modal */}
      <AddCustomerModal
        visible={isEditCustomerOpen}
        initialCustomer={customer}
        onClose={() => setIsEditCustomerOpen(false)}
        onSaveCustomer={(updated) => updateCustomer(customer.id, updated)}
      />

      {/* Confirm Delete Hen Modal */}
      <ConfirmationModal
        visible={!!henToDelete}
        title="Remove Hen Entry"
        message={`Are you sure you want to delete Hen #${henToDelete?.henNumber} (${henToDelete?.weight} kg)? This will recalculate the customer's total balance.`}
        confirmLabel="Yes, Delete Hen"
        isDestructive={true}
        onConfirm={handleConfirmDeleteHen}
        onCancel={() => setHenToDelete(null)}
      />

      {/* Confirm Delete Customer Modal */}
      <ConfirmationModal
        visible={isDeleteCustomerModalOpen}
        title="Delete Customer Account"
        message={`Are you sure you want to delete "${customer.name}" and all associated hen records and payments? This action cannot be undone.`}
        confirmLabel="Yes, Delete Customer"
        isDestructive={true}
        onConfirm={handleConfirmDeleteCustomer}
        onCancel={() => setIsDeleteCustomerModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  topNavBar: {
    height: 52,
    backgroundColor: tokens.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  backBtn: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backBtnText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  topActionBtn: {
    paddingVertical: 6,
    paddingHorizontal: tokens.spacing.sm,
    borderRadius: tokens.radii.sm,
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  topActionText: {
    fontSize: 11,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
  },
  deleteCustBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: tokens.colors.errorLight,
  },
  deleteCustText: {
    fontSize: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing.base,
    paddingBottom: 120,
    gap: tokens.spacing.md,
  },
  profileCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.xl,
    padding: tokens.spacing.base,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.card,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: tokens.colors.primary,
  },
  avatarText: {
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: tokens.spacing.md,
    marginRight: tokens.spacing.xs,
  },
  customerName: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
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
    fontSize: tokens.typography.xs,
    color: tokens.colors.primary,
    fontWeight: tokens.typography.semibold,
  },
  customerAddress: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 3,
  },
  notesBox: {
    marginTop: tokens.spacing.md,
    padding: tokens.spacing.sm,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radii.sm,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
    textTransform: 'uppercase',
  },
  notesContent: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textPrimary,
    marginTop: 2,
  },
  sectionContainer: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.xl,
    padding: tokens.spacing.base,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.card,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.md,
  },
  sectionTitle: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  addHenBtn: {
    backgroundColor: tokens.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radii.md,
  },
  addHenBtnText: {
    color: tokens.colors.surface,
    fontSize: 11,
    fontWeight: tokens.typography.bold,
  },
  recordPayBtn: {
    backgroundColor: tokens.colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radii.md,
  },
  recordPayBtnText: {
    color: tokens.colors.surface,
    fontSize: 11,
    fontWeight: tokens.typography.bold,
  },
  henFilterRow: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.md,
  },
  henFilterChip: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 4,
    borderRadius: tokens.radii.pill,
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  henFilterChipActive: {
    backgroundColor: tokens.colors.primaryLight,
    borderColor: tokens.colors.primary,
  },
  henFilterText: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  henFilterTextActive: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
  },
  henCardsStack: {
    gap: tokens.spacing.sm,
  },
  emptyBox: {
    paddingVertical: tokens.spacing.lg,
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radii.md,
  },
  emptyBoxText: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.sm,
  },
  emptyAddBtn: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 6,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.primaryLight,
  },
  emptyAddBtnText: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  paymentStack: {
    gap: tokens.spacing.sm,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconCircle: {
    width: 28,
    height: 28,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.sm,
  },
  paymentIconText: {
    fontSize: 14,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.success,
  },
  paymentMethod: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  paymentDate: {
    fontSize: 10,
    color: tokens.colors.textSecondary,
  },
  paymentNotes: {
    fontSize: 10,
    fontStyle: 'italic',
    color: tokens.colors.textMuted,
  },
  paymentRight: {
    alignItems: 'flex-end',
    marginLeft: tokens.spacing.sm,
  },
  paymentAmount: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.success,
    marginBottom: 2,
  },
  stickyPayBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    paddingHorizontal: tokens.spacing.base,
    paddingVertical: tokens.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...tokens.shadows.float,
  },
  stickyPayLabel: {
    fontSize: 10,
    color: tokens.colors.secondary,
    fontWeight: tokens.typography.bold,
    textTransform: 'uppercase',
  },
  stickyPayValue: {
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  stickyPayBtn: {
    backgroundColor: tokens.colors.secondary,
    paddingHorizontal: tokens.spacing.lg,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyPayBtnText: {
    color: tokens.colors.surface,
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
  }
});
