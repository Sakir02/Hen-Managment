import Icon2D from './common/Icon2D';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { tokens } from '../styles/tokens';
import { formatCurrency } from '../utils/calculations';

export default function PaymentModal({
  visible,
  customer,
  financials,
  onClose,
  onSavePayment
}) {
  if (!customer || !financials) return null;

  const [amountStr, setAmountStr] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR'); // 'Cash' | 'UPI / QR' | 'Bank Transfer' | 'Cheque'
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (visible) {
      setAmountStr('');
      setNotes('');
      setErrorMsg('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI / QR');
    }
  }, [visible]);

  const enteredAmount = parseFloat(amountStr) || 0;
  const remainingAfterPayment = Math.max(0, Math.round((financials.payableAmount - enteredAmount) * 100) / 100);

  const handleApplyChip = (extra) => {
    const nextVal = Math.min(financials.payableAmount, enteredAmount + extra);
    setAmountStr(nextVal.toString());
    setErrorMsg('');
  };

  const handleFullSettlement = () => {
    setAmountStr(financials.payableAmount.toString());
    setErrorMsg('');
  };

  const handleSubmit = () => {
    setErrorMsg('');

    if (enteredAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than ₹0');
      return;
    }

    if (enteredAmount > financials.payableAmount) {
      setErrorMsg(`Amount cannot exceed the current payable balance of ${formatCurrency(financials.payableAmount)}`);
      return;
    }

    onSavePayment(customer.id, {
      amount: enteredAmount,
      date: paymentDate || new Date().toISOString().split('T')[0],
      method: paymentMethod,
      notes: notes.trim()
    });

    onClose();
  };

  const methods = ['UPI / QR', 'Cash', 'Bank Transfer', 'Cheque'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header (Spec Section 13) */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Collect & Confirm Payment</Text>
              <Text style={styles.subtitle}>{customer.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon2D name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Financial Ledger Snapshot Card */}
            <View style={styles.ledgerBox}>
              <View style={styles.ledgerCol}>
                <Text style={styles.ledgerLabel}>Total Billed</Text>
                <Text style={styles.ledgerVal}>{formatCurrency(financials.customerTotal)}</Text>
              </View>
              <View style={styles.ledgerDivider} />
              <View style={styles.ledgerCol}>
                <Text style={styles.ledgerLabel}>Already Paid</Text>
                <Text style={[styles.ledgerVal, styles.greenText]}>{formatCurrency(financials.totalPaid)}</Text>
              </View>
              <View style={styles.ledgerDivider} />
              <View style={styles.ledgerCol}>
                <Text style={styles.ledgerLabelBold}>Current Due</Text>
                <Text style={[styles.ledgerValBold, styles.orangeText]}>{formatCurrency(financials.payableAmount)}</Text>
              </View>
            </View>

            {/* Amount Received Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Amount Received (₹) *</Text>
              <View style={styles.amountInputRow}>
                <Text style={styles.rupeePrefix}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={tokens.colors.textMuted}
                  keyboardType="decimal-pad"
                  value={amountStr}
                  onChangeText={(val) => {
                    setAmountStr(val);
                    setErrorMsg('');
                  }}
                  autoFocus
                />
              </View>
            </View>

            {/* Fast Denomination Chips */}
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => handleApplyChip(500)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>+₹500</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => handleApplyChip(1000)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>+₹1,000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => handleApplyChip(2000)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>+₹2,000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, styles.fullChip]}
                onPress={handleFullSettlement}
                activeOpacity={0.7}
              >
                <Text style={styles.fullChipText}>Full Settle</Text>
              </TouchableOpacity>
            </View>

            {/* Real-time Dynamic Calculation Preview */}
            <View style={styles.previewBox}>
              <Text style={styles.previewText}>
                Remaining Balance After Payment:{' '}
                <Text
                  style={[
                    styles.previewVal,
                    remainingAfterPayment === 0 ? styles.greenText : styles.orangeText
                  ]}
                >
                  {formatCurrency(remainingAfterPayment)}
                </Text>
              </Text>
            </View>

            {/* Payment Method Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Payment Mode *</Text>
              <View style={styles.methodRow}>
                {methods.map((m) => {
                  const isSelected = paymentMethod === m;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[styles.methodBtn, isSelected && styles.methodBtnActive]}
                      onPress={() => setPaymentMethod(m)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.methodBtnText, isSelected && styles.methodBtnTextActive]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Payment Date */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Payment Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={paymentDate}
                onChangeText={setPaymentDate}
                placeholder="2026-09-27"
                placeholderTextColor={tokens.colors.textMuted}
              />
            </View>

            {/* Error Message */}
            {errorMsg ? (
              <View style={styles.errorBox}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}><Icon2D name="warning" size={15} color="#DC2626" /><Text style={styles.errorText}>{errorMsg}</Text></View>
              </View>
            ) : null}

            {/* Notes / Reference */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Receipt Note / Transaction Reference</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="e.g. UPI Ref #482910, Cash collected at Mandi gate"
                placeholderTextColor={tokens.colors.textMuted}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </ScrollView>

          {/* Action Footer (Spec Section 13: Warm Orange Confirm Button) */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
              <Text style={styles.submitBtnText}>Confirm Payment ({formatCurrency(enteredAmount)})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  sheet: {
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radii.xl,
    borderTopRightRadius: tokens.radii.xl,
    paddingTop: tokens.spacing.md,
    maxHeight: '92%',
    ...tokens.shadows.float,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radii.full,
    alignSelf: 'center',
    marginBottom: tokens.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: tokens.spacing.base,
    paddingBottom: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  title: {
    fontSize: tokens.typography.md,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: tokens.colors.primary,
    fontWeight: tokens.typography.semibold,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.bold,
  },
  body: {
    paddingHorizontal: tokens.spacing.base,
  },
  bodyContent: {
    paddingVertical: tokens.spacing.base,
    gap: tokens.spacing.md,
  },
  ledgerBox: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    justifyContent: 'space-between',
  },
  ledgerCol: {
    flex: 1,
    alignItems: 'center',
  },
  ledgerDivider: {
    width: 1,
    backgroundColor: tokens.colors.border,
    marginVertical: 4,
  },
  ledgerLabel: {
    fontSize: 10,
    color: tokens.colors.textSecondary,
    marginBottom: 4,
  },
  ledgerLabelBold: {
    fontSize: 10,
    color: tokens.colors.secondary,
    fontWeight: tokens.typography.bold,
    marginBottom: 4,
  },
  ledgerVal: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  ledgerValBold: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
  },
  greenText: {
    color: tokens.colors.success,
  },
  orangeText: {
    color: tokens.colors.secondary,
  },
  fieldGroup: {},
  inputLabel: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: 6,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.secondary,
    borderRadius: tokens.radii.lg,
    paddingHorizontal: tokens.spacing.md,
    height: 54,
  },
  rupeePrefix: {
    fontSize: 22,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.secondary,
    marginRight: tokens.spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  chip: {
    flex: 1,
    height: 38,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  fullChip: {
    backgroundColor: tokens.colors.secondaryLight,
    borderColor: tokens.colors.secondary,
  },
  fullChipText: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.secondary,
  },
  previewBox: {
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  previewVal: {
    fontWeight: tokens.typography.bold,
  },
  methodRow: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  methodBtn: {
    flex: 1,
    height: 38,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodBtnActive: {
    backgroundColor: tokens.colors.primaryLight,
    borderColor: tokens.colors.primary,
  },
  methodBtnText: {
    fontSize: 10,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.medium,
  },
  methodBtnTextActive: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
  },
  input: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.md,
    height: tokens.touchTarget.minHeight,
    paddingHorizontal: tokens.spacing.md,
    fontSize: tokens.typography.sm,
    color: tokens.colors.textPrimary,
  },
  notesInput: {
    height: 48,
  },
  errorBox: {
    backgroundColor: tokens.colors.errorLight,
    padding: tokens.spacing.sm,
    borderRadius: tokens.radii.sm,
  },
  errorText: {
    color: tokens.colors.error,
    fontSize: 12,
    fontWeight: tokens.typography.medium,
  },
  footer: {
    flexDirection: 'row',
    padding: tokens.spacing.base,
    gap: tokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.surface,
  },
  cancelBtn: {
    flex: 1,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textSecondary,
  },
  submitBtn: {
    flex: 2,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.secondary, // Warm Orange as specified in Section 13
    alignItems: 'center',
    justifyContent: 'center',
    ...tokens.shadows.card,
  },
  submitBtnText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.surface,
  }
});
