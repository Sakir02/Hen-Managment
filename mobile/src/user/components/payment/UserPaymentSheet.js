import Icon2D from '../../../components/common/Icon2D';
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
import { userTokens } from '../../styles/userTokens';
import { formatCurrency } from '../../../utils/calculations';

export default function UserPaymentSheet({
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setAmountStr('');
      setNotes('');
      setErrorMsg('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI / QR');
      setIsSubmitting(false);
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

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setErrorMsg('');

    if (enteredAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than ₹0');
      return;
    }

    if (enteredAmount > financials.payableAmount) {
      setErrorMsg(`Amount cannot exceed current balance of ${formatCurrency(financials.payableAmount)}`);
      return;
    }

    if (!paymentDate.trim()) {
      setErrorMsg('Please enter a valid payment date');
      return;
    }

    setIsSubmitting(true);
    try {
      await Promise.resolve(
        onSavePayment(customer.id, {
          amount: enteredAmount,
          date: paymentDate.trim(),
          method: paymentMethod,
          notes: notes.trim()
        })
      );
      onClose();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to record payment. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Header (Prototype Screen 10) */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Add Payment</Text>
              <Text style={styles.subtitle}>Customer: {customer.name}</Text>
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
            {/* 3 Mini Boxes: Total, Paid, Payable (Prototype Screen 10) */}
            <View style={styles.ledgerBox}>
              <View style={styles.ledgerCol}>
                <Text style={styles.ledgerLabel}>Total</Text>
                <Text style={styles.ledgerVal}>{formatCurrency(financials.customerTotal)}</Text>
              </View>
              <View style={styles.ledgerDivider} />
              <View style={styles.ledgerCol}>
                <Text style={styles.ledgerLabel}>Paid</Text>
                <Text style={[styles.ledgerVal, styles.greenText]}>{formatCurrency(financials.totalPaid)}</Text>
              </View>
              <View style={styles.ledgerDivider} />
              <View style={styles.ledgerCol}>
                <Text style={styles.ledgerLabelBold}>Payable</Text>
                <Text style={[styles.ledgerValBold, styles.tealText]}>{formatCurrency(financials.payableAmount)}</Text>
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
                  placeholderTextColor={userTokens.colors.textMuted}
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
                    remainingAfterPayment === 0 ? styles.greenText : styles.tealText
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
              <Text style={styles.inputLabel}>Payment Date *</Text>
              <View style={styles.dateInputRow}>
                <Icon2D name="calendar" size={18} color="#64748B" />
                <TextInput
                  style={styles.dateInput}
                  value={paymentDate}
                  onChangeText={setPaymentDate}
                  placeholder="27 Sep 2025"
                  placeholderTextColor={userTokens.colors.textMuted}
                />
              </View>
            </View>

            {/* Error Message */}
            {errorMsg ? (
              <View style={styles.errorBox}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}><Icon2D name="warning" size={15} color="#DC2626" /><Text style={styles.errorText}>{errorMsg}</Text></View>
              </View>
            ) : null}

            {/* Note (Optional) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Note (Optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Enter note..."
                placeholderTextColor={userTokens.colors.textMuted}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </ScrollView>

          {/* Action Footer (Prototype Screen 10: Cancel & Confirm Pay) */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Processing...' : 'Confirm Pay'}
              </Text>
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
    backgroundColor: userTokens.colors.surface,
    borderTopLeftRadius: userTokens.radii.xl,
    borderTopRightRadius: userTokens.radii.xl,
    paddingTop: userTokens.spacing.md,
    maxHeight: '92%',
    ...userTokens.shadows.float,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: userTokens.colors.border,
    borderRadius: userTokens.radii.full,
    alignSelf: 'center',
    marginBottom: userTokens.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: userTokens.spacing.base,
    paddingBottom: userTokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
  },
  title: {
    fontSize: userTokens.typography.md,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: userTokens.colors.primary,
    fontWeight: userTokens.typography.semibold,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: userTokens.colors.textSecondary,
    fontWeight: userTokens.typography.bold,
  },
  body: {
    paddingHorizontal: userTokens.spacing.base,
  },
  bodyContent: {
    paddingVertical: userTokens.spacing.base,
    gap: userTokens.spacing.md,
  },
  ledgerBox: {
    flexDirection: 'row',
    backgroundColor: userTokens.colors.background,
    borderRadius: userTokens.radii.lg,
    padding: userTokens.spacing.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    justifyContent: 'space-between',
  },
  ledgerCol: {
    flex: 1,
    alignItems: 'center',
  },
  ledgerDivider: {
    width: 1,
    backgroundColor: userTokens.colors.border,
    marginVertical: 4,
  },
  ledgerLabel: {
    fontSize: 10,
    color: userTokens.colors.textSecondary,
    marginBottom: 4,
  },
  ledgerLabelBold: {
    fontSize: 10,
    color: userTokens.colors.secondary,
    fontWeight: userTokens.typography.bold,
    marginBottom: 4,
  },
  ledgerVal: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  ledgerValBold: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
  },
  greenText: {
    color: userTokens.colors.success,
  },
  tealText: {
    color: userTokens.colors.secondary,
  },
  fieldGroup: {},
  inputLabel: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
    marginBottom: 6,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.surface,
    borderWidth: 2,
    borderColor: userTokens.colors.secondary, // Teal #0D9488
    borderRadius: userTokens.radii.lg,
    paddingHorizontal: userTokens.spacing.md,
    height: 54,
  },
  rupeePrefix: {
    fontSize: 22,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.secondary,
    marginRight: userTokens.spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.xs,
  },
  chip: {
    flex: 1,
    height: 38,
    backgroundColor: userTokens.colors.background,
    borderRadius: userTokens.radii.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  fullChip: {
    backgroundColor: userTokens.colors.secondaryLight,
    borderColor: userTokens.colors.secondary,
  },
  fullChipText: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.secondary,
  },
  previewBox: {
    backgroundColor: userTokens.colors.background,
    borderRadius: userTokens.radii.md,
    padding: userTokens.spacing.sm,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 12,
    color: userTokens.colors.textSecondary,
  },
  previewVal: {
    fontWeight: userTokens.typography.bold,
  },
  methodRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.xs,
  },
  methodBtn: {
    flex: 1,
    height: 38,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.background,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodBtnActive: {
    backgroundColor: userTokens.colors.primaryLight,
    borderColor: userTokens.colors.primary,
  },
  methodBtnText: {
    fontSize: 10,
    color: userTokens.colors.textSecondary,
    fontWeight: userTokens.typography.medium,
  },
  methodBtnTextActive: {
    color: userTokens.colors.primary,
    fontWeight: userTokens.typography.bold,
  },
  input: {
    backgroundColor: userTokens.colors.surface,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    borderRadius: userTokens.radii.md,
    height: userTokens.touchTarget.minHeight,
    paddingHorizontal: userTokens.spacing.md,
    fontSize: userTokens.typography.sm,
    color: userTokens.colors.textPrimary,
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.surface,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    borderRadius: userTokens.radii.md,
    paddingHorizontal: userTokens.spacing.md,
    height: userTokens.touchTarget.minHeight,
  },
  calendarIcon: {
    fontSize: 16,
    marginRight: userTokens.spacing.sm,
  },
  dateInput: {
    flex: 1,
    fontSize: userTokens.typography.sm,
    color: userTokens.colors.textPrimary,
  },
  notesInput: {
    height: 48,
  },
  errorBox: {
    backgroundColor: userTokens.colors.errorLight,
    padding: userTokens.spacing.sm,
    borderRadius: userTokens.radii.sm,
  },
  errorText: {
    color: userTokens.colors.error,
    fontSize: 12,
    fontWeight: userTokens.typography.medium,
  },
  footer: {
    flexDirection: 'row',
    padding: userTokens.spacing.base,
    gap: userTokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: userTokens.colors.border,
    backgroundColor: userTokens.colors.surface,
  },
  cancelBtn: {
    flex: 1,
    height: userTokens.touchTarget.minHeight,
    borderRadius: userTokens.radii.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textSecondary,
  },
  submitBtn: {
    flex: 2,
    height: userTokens.touchTarget.minHeight,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.secondary, // Secondary Teal #0D9488 (Spec Section 14)
    alignItems: 'center',
    justifyContent: 'center',
    ...userTokens.shadows.card,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.surface,
  }
});
