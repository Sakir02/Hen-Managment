import React from 'react';
import Icon2D from '../../../components/common/Icon2D';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { userTokens } from '../../styles/userTokens';
import { formatCurrency } from '../../../utils/calculations';

export default function UserHenDetailsModal({
  visible,
  hen,
  customerName = 'Rahul Patel',
  onClose,
  onEdit,
  onDelete
}) {
  if (!hen) return null;

  const cost = Math.round((parseFloat(hen.weight) * parseFloat(hen.rateApplied)) * 100) / 100;
  const isMarga = hen.type === 'MARGA';
  const createdDate = hen.createdAt || '27 Sep 2025';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Top Bar: ← Hen Details */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Hen Details</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Main Hen Identification Card */}
          <View style={styles.mainCard}>
            <View style={styles.idRow}>
              <Text style={styles.henIdText}>{hen.henNumber}</Text>
              <View style={[styles.typeBadge, isMarga ? styles.margaBadge : styles.margeeBadge]}>
                <Text style={[styles.typeText, isMarga ? styles.margaText : styles.margeeText]}>
                  {isMarga ? 'Marga' : 'Margee'}
                </Text>
              </View>
            </View>

            {hen.photoUri ? (
              <Image source={{ uri: hen.photoUri }} style={styles.detailHenPhoto} />
            ) : null}

            {/* 3-Column Metrics: Weight, Rate, Amount */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricLabel}>Weight</Text>
                <Text style={styles.metricVal}>{parseFloat(hen.weight).toFixed(2)} kg</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricCol}>
                <Text style={styles.metricLabel}>Rate</Text>
                <Text style={styles.metricVal}>₹{parseFloat(hen.rateApplied).toFixed(0)}/kg</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricCol}>
                <Text style={styles.metricLabel}>Amount</Text>
                <Text style={[styles.metricVal, styles.amountHighlight]}>
                  {formatCurrency(cost)}
                </Text>
              </View>
            </View>
          </View>

          {/* Customer Association */}
          <View style={styles.infoCard}>
            <View style={styles.infoLeft}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarMiniText}>
                  {customerName ? customerName.charAt(0).toUpperCase() : 'C'}
                </Text>
              </View>
              <View>
                <Text style={styles.infoLabel}>Customer</Text>
                <Text style={styles.infoValue}>{customerName}</Text>
              </View>
            </View>
          </View>

          {/* Created Date */}
          <View style={styles.infoCard}>
            <View style={styles.infoLeft}>
              <View style={styles.dateIconCircle}>
                <Icon2D name="calendar" size={16} color="#64748B" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Created</Text>
                <Text style={styles.infoValue}>{createdDate}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons: Edit (Teal) | Delete (Red) */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                onClose();
                if (onEdit) onEdit(hen);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                onClose();
                if (onDelete) onDelete(hen);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    backgroundColor: userTokens.colors.surface,
    borderTopLeftRadius: userTokens.radii.xl,
    borderTopRightRadius: userTokens.radii.xl,
    paddingTop: userTokens.spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 40 : userTokens.spacing.xl,
    paddingHorizontal: userTokens.spacing.base,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.float,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.border,
    alignSelf: 'center',
    marginBottom: userTokens.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: userTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
  },
  backBtn: {
    padding: userTokens.spacing.xs,
  },
  backArrow: {
    fontSize: 22,
    color: userTokens.colors.textPrimary,
    fontWeight: userTokens.typography.bold,
  },
  title: {
    fontSize: userTokens.typography.lg,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  headerSpacer: {
    width: 24,
  },
  mainCard: {
    backgroundColor: userTokens.colors.background,
    borderRadius: userTokens.radii.lg,
    padding: userTokens.spacing.base,
    marginTop: userTokens.spacing.base,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: userTokens.spacing.base,
  },
  detailHenPhoto: {
    width: '100%',
    height: 180,
    borderRadius: userTokens.radii.md,
    backgroundColor: '#E2E8F0',
    marginBottom: userTokens.spacing.base,
  },
  henIdText: {
    fontSize: 24,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  typeBadge: {
    paddingHorizontal: userTokens.spacing.md,
    paddingVertical: 4,
    borderRadius: userTokens.radii.pill,
  },
  margaBadge: {
    backgroundColor: userTokens.colors.primaryLight,
  },
  margeeBadge: {
    backgroundColor: userTokens.colors.secondaryLight,
  },
  typeText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
  },
  margaText: {
    color: userTokens.colors.primary,
  },
  margeeText: {
    color: userTokens.colors.secondary,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.md,
    padding: userTokens.spacing.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: userTokens.colors.border,
  },
  metricLabel: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginBottom: 4,
  },
  metricVal: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  amountHighlight: {
    color: userTokens.colors.primary,
  },
  infoCard: {
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.md,
    padding: userTokens.spacing.md,
    marginTop: userTokens.spacing.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.md,
  },
  avatarMiniText: {
    fontSize: 14,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  dateIconCircle: {
    width: 38,
    height: 38,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.md,
  },
  dateIconText: {
    fontSize: 16,
  },
  infoLabel: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
  },
  infoValue: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.md,
    marginTop: userTokens.spacing.xl,
  },
  editBtn: {
    flex: 1,
    height: 48,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.secondary, // Teal #0D9488
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    color: userTokens.colors.surface,
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
  },
  deleteBtn: {
    flex: 1,
    height: 48,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.error, // Red #DC2626
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: userTokens.colors.surface,
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
  }
});
