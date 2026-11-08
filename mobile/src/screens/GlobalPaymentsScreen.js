import Icon2D from '../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import { tokens } from '../styles/tokens';
import { useAdminData } from '../context/AdminDataContext';
import { formatCurrency } from '../utils/calculations';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';

export default function GlobalPaymentsScreen({ onBack, onSelectCustomer }) {
  const { systemMetrics } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL' | 'TODAY' | 'WEEK'
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = systemMetrics.allPayments.filter((p) => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.method && p.method.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (dateFilter === 'TODAY') {
      const today = new Date().toISOString().split('T')[0];
      return p.date === today;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← More Hub</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Master Payments Ledger</Text>
      </View>

      {/* Aggregate Collection Card */}
      <View style={styles.summaryRibbon}>
        <View>
          <Text style={styles.summaryLabel}>TOTAL SETTLED RECEIPTS</Text>
          <Text style={styles.summaryVal}>{formatCurrency(systemMetrics.totalPaid)}</Text>
        </View>
        <View style={styles.txnBadge}>
          <Text style={styles.txnBadgeText}>{systemMetrics.allPayments.length} Transactions</Text>
        </View>
      </View>

      {/* Search & Filters (Spec Section 14) */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Icon2D name="search" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer name, mode, or notes..."
            placeholderTextColor={tokens.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon2D name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.dateFilterRow}>
          {[
            { key: 'ALL', label: 'All Dates' },
            { key: 'TODAY', label: "Today's Receipts" },
          ].map((df) => {
            const isSelected = dateFilter === df.key;
            return (
              <TouchableOpacity
                key={df.key}
                style={[styles.dateChip, isSelected && styles.dateChipActive]}
                onPress={() => setDateFilter(df.key)}
              >
                <Text style={[styles.dateChipText, isSelected && styles.dateChipTextActive]}>
                  {df.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Payments List */}
      <FlatList
        data={filteredPayments}
        keyExtractor={(item) => `${item.customerId}-${item.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="payments"
            title="No Payment Records Found"
            description="Try clearing your search query or switching date filters."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.paymentCard}
            onPress={() => setSelectedPayment(item)}
            activeOpacity={0.7}
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>₹</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.customerName}>{item.customerName}</Text>
                <Text style={styles.metaText}>
                  {item.date} • {item.method || 'Cash'}
                </Text>
                {item.notes ? (
                  <Text style={styles.notesText} numberOfLines={1}>
                    "{item.notes}"
                  </Text>
                ) : null}
              </View>
            </View>

            <View style={styles.cardRight}>
              <Text style={styles.amountText}>+{formatCurrency(item.amount)}</Text>
              <StatusBadge status="PAID" size="small" />
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Payment Detail Bottom Modal (Spec Section 14) */}
      <Modal
        visible={!!selectedPayment}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPayment(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Receipt Details</Text>
            <Text style={styles.receiptId}>Receipt ID: {selectedPayment?.id?.toUpperCase()}</Text>

            <View style={styles.detailBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer Account:</Text>
                <Text style={styles.detailValBold}>{selectedPayment?.customerName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount Received:</Text>
                <Text style={[styles.detailValBold, { color: tokens.colors.success }]}>
                  {formatCurrency(selectedPayment?.amount)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Method:</Text>
                <Text style={styles.detailVal}>{selectedPayment?.method || 'Cash'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction Date:</Text>
                <Text style={styles.detailVal}>{selectedPayment?.date}</Text>
              </View>
              {selectedPayment?.notes ? (
                <View style={styles.detailRowNotes}>
                  <Text style={styles.detailLabel}>Remarks:</Text>
                  <Text style={styles.detailValNotes}>{selectedPayment?.notes}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.sheetBtnRow}>
              <TouchableOpacity
                style={styles.sheetCloseBtn}
                onPress={() => setSelectedPayment(null)}
              >
                <Text style={styles.sheetCloseText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetLedgerBtn}
                onPress={() => {
                  const custId = selectedPayment.customerId;
                  setSelectedPayment(null);
                  onSelectCustomer(custId);
                }}
              >
                <Text style={styles.sheetLedgerText}>Open Customer Ledger →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  navBar: {
    height: 52,
    backgroundColor: tokens.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: tokens.spacing.md,
  },
  backBtnText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  screenTitle: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  summaryRibbon: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
    letterSpacing: 0.5,
  },
  summaryVal: {
    fontSize: 22,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.success,
    marginTop: 2,
  },
  txnBadge: {
    backgroundColor: tokens.colors.successLight,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 4,
    borderRadius: tokens.radii.pill,
  },
  txnBadgeText: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.success,
  },
  searchHeader: {
    padding: tokens.spacing.base,
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    gap: tokens.spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radii.md,
    paddingHorizontal: tokens.spacing.md,
    height: tokens.touchTarget.minHeight,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: tokens.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: tokens.typography.sm,
    color: tokens.colors.textPrimary,
  },
  clearText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  dateFilterRow: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  dateChip: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 4,
    borderRadius: tokens.radii.pill,
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  dateChipActive: {
    backgroundColor: tokens.colors.primaryLight,
    borderColor: tokens.colors.primary,
  },
  dateChipText: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  dateChipTextActive: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
  },
  listContent: {
    padding: tokens.spacing.base,
    paddingBottom: 40,
    gap: tokens.spacing.sm,
  },
  paymentCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.card,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  iconText: {
    fontSize: 18,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.success,
  },
  cardInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  notesText: {
    fontSize: 10,
    color: tokens.colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    marginLeft: tokens.spacing.sm,
  },
  amountText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.success,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  detailSheet: {
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radii.xl,
    borderTopRightRadius: tokens.radii.xl,
    padding: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xxl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radii.full,
    alignSelf: 'center',
    marginBottom: tokens.spacing.md,
  },
  sheetTitle: {
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  receiptId: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.base,
  },
  detailBox: {
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    gap: tokens.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
  },
  detailValBold: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  detailVal: {
    fontSize: tokens.typography.sm,
    color: tokens.colors.textPrimary,
  },
  detailRowNotes: {
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    paddingTop: tokens.spacing.xs,
  },
  detailValNotes: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textPrimary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  sheetBtnRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.lg,
  },
  sheetCloseBtn: {
    flex: 1,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCloseText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textSecondary,
  },
  sheetLedgerBtn: {
    flex: 2,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetLedgerText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.surface,
  }
});
