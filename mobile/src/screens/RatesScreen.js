import Icon2D from '../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { tokens } from '../styles/tokens';
import { useAdminData } from '../context/AdminDataContext';
import ConfirmationModal from '../components/common/ConfirmationModal';

export default function RatesScreen({ onBack }) {
  const { rates, updateStandardRates, showToast } = useAdminData();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newMarga, setNewMarga] = useState(rates.MARGA.toString());
  const [newMargee, setNewMargee] = useState(rates.MARGEE.toString());
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleOpenEdit = () => {
    setNewMarga(rates.MARGA.toString());
    setNewMargee(rates.MARGEE.toString());
    setIsEditModalOpen(true);
  };

  const handleValidateAndPrompt = () => {
    const mVal = parseFloat(newMarga);
    const fVal = parseFloat(newMargee);

    if (isNaN(mVal) || mVal <= 0 || isNaN(fVal) || fVal <= 0) {
      showToast('Please enter valid positive pricing for both bird types', 'warning');
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleCommitRates = () => {
    setIsConfirmModalOpen(false);
    setIsEditModalOpen(false);
    updateStandardRates({
      MARGA: parseFloat(newMarga),
      MARGEE: parseFloat(newMargee)
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← More Hub</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Mandi Market Rates</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Standard mandi prices are automatically applied when new bird batches are weighed. Existing ledger entries remain immutable.
          </Text>
        </View>

        {/* Marga (Male) Rate Card (Spec Section 15) */}
        <View style={styles.rateCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.typeBadgeMarga}>
              <Icon2D name="bird" size={26} color="#2563EB" />
              <Text style={styles.typeTitle}>Marga (Male)</Text>
            </View>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>STANDARD BENCHMARK</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.priceNumber}>{rates.MARGA.toFixed(2)}</Text>
            <Text style={styles.priceUnit}>/ kg</Text>
          </View>

          <View style={styles.cardDivider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Last Rate Revision:</Text>
            <Text style={styles.metaVal}>{rates.lastUpdated || 'Today at 06:30 AM'}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Authorized By:</Text>
            <Text style={styles.metaVal}>{rates.updatedBy || 'Sakir Khan (Super Admin)'}</Text>
          </View>
        </View>

        {/* Margee (Female) Rate Card (Spec Section 15) */}
        <View style={styles.rateCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.typeBadgeMargee}>
              <Icon2D name="bird" size={26} color="#0D9488" />
              <Text style={styles.typeTitle}>Margee (Female)</Text>
            </View>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>STANDARD BENCHMARK</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.priceNumber}>{rates.MARGEE.toFixed(2)}</Text>
            <Text style={styles.priceUnit}>/ kg</Text>
          </View>

          <View style={styles.cardDivider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Last Rate Revision:</Text>
            <Text style={styles.metaVal}>{rates.lastUpdated || 'Today at 06:30 AM'}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Authorized By:</Text>
            <Text style={styles.metaVal}>{rates.updatedBy || 'Sakir Khan (Super Admin)'}</Text>
          </View>
        </View>

        {/* Primary Edit Button */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={handleOpenEdit}
          activeOpacity={0.8}
        >
          <Icon2D name="edit" size={18} color="#2563EB" />
          <Text style={styles.editBtnText}>Update Daily Mandi Rates</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Rates Modal */}
      <Modal
        visible={isEditModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>Set Daily Standard Rates</Text>
            <Text style={styles.modalSub}>
              Enter today's wholesale benchmark pricing per kilogram.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Marga (Male) Rate (₹ / kg) *</Text>
              <TextInput
                style={styles.rateInput}
                keyboardType="decimal-pad"
                value={newMarga}
                onChangeText={setNewMarga}
                placeholder="260.00"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Margee (Female) Rate (₹ / kg) *</Text>
              <TextInput
                style={styles.rateInput}
                keyboardType="decimal-pad"
                value={newMargee}
                onChangeText={setNewMargee}
                placeholder="240.00"
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsEditModalOpen(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.commitBtn}
                onPress={handleValidateAndPrompt}
              >
                <Text style={styles.commitBtnText}>Review & Save Rates</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal before saving rate change (Spec Section 15 & 21) */}
      <ConfirmationModal
        visible={isConfirmModalOpen}
        title="Confirm Rate Revision"
        message={`Are you sure you want to update standard rates to Marga: ₹${newMarga}/kg and Margee: ₹${newMargee}/kg? All newly recorded hens will calculate against these rates.`}
        confirmLabel="Yes, Update Rates"
        cancelLabel="Review Again"
        isDestructive={false}
        onConfirm={handleCommitRates}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing.base,
    paddingBottom: 40,
    gap: tokens.spacing.base,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.primaryLight,
    padding: tokens.spacing.md,
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.2)',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: tokens.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: tokens.typography.xs,
    color: tokens.colors.textPrimary,
    lineHeight: 18,
  },
  rateCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.xl,
    padding: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  typeBadgeMarga: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeBadgeMargee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeEmoji: {
    fontSize: 22,
  },
  typeTitle: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  activePill: {
    backgroundColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 3,
    borderRadius: tokens.radii.pill,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: tokens.spacing.base,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
    marginRight: 4,
  },
  priceNumber: {
    fontSize: 38,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  priceUnit: {
    fontSize: tokens.typography.base,
    color: tokens.colors.textSecondary,
    marginLeft: 6,
    fontWeight: tokens.typography.medium,
  },
  cardDivider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginBottom: tokens.spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  metaVal: {
    fontSize: 11,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
  },
  editBtn: {
    height: tokens.touchTarget.minHeight,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.sm,
    ...tokens.shadows.card,
  },
  editBtnIcon: {
    fontSize: 16,
  },
  editBtnText: {
    color: tokens.colors.surface,
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
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
  modalTitle: {
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  modalSub: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.lg,
    marginTop: 2,
  },
  fieldGroup: {
    marginBottom: tokens.spacing.base,
  },
  inputLabel: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: 6,
  },
  rateInput: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.md,
    height: tokens.touchTarget.minHeight,
    paddingHorizontal: tokens.spacing.md,
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
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
  commitBtn: {
    flex: 2,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commitBtnText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.surface,
  }
});
