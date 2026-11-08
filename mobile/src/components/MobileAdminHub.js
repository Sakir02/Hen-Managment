import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { tokens } from '../styles/tokens';

export default function MobileAdminHub({
  rates,
  staffUsers,
  auditLogs,
  onOpenRateModal,
  onToggleUserStatus
}) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Title */}
      <View style={styles.headerBox}>
        <Text style={styles.heading}>Admin Command Hub</Text>
        <Text style={styles.subheading}>
          Mobile staff supervision, rate triggers, and live activity feed.
        </Text>
      </View>

      {/* Live Mandi Rates Quick Card */}
      <View style={styles.rateCard}>
        <View style={styles.rateCardHeader}>
          <Text style={styles.sectionTitle}>Live Mandi Rates</Text>
          <TouchableOpacity style={styles.editRateBtn} onPress={onOpenRateModal}>
            <Text style={styles.editRateBtnText}>Adjust Rates</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ratesRow}>
          <View style={styles.rateBox}>
            <Text style={styles.rateLabel}>Marga (Male)</Text>
            <Text style={styles.rateValue}>₹{rates.MARGA.toFixed(2)}</Text>
            <Text style={styles.rateUnit}>per kg live</Text>
          </View>

          <View style={[styles.rateBox, { borderLeftWidth: 1, borderLeftColor: tokens.colors.border }]}>
            <Text style={styles.rateLabel}>Margee (Female)</Text>
            <Text style={styles.rateValue}>₹{rates.MARGEE.toFixed(2)}</Text>
            <Text style={styles.rateUnit}>per kg live</Text>
          </View>
        </View>
      </View>

      {/* Staff Accounts Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Staff Accounts ({staffUsers.length})</Text>
      </View>

      {staffUsers.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <View style={styles.userInfoRow}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.userName}>{user.name}</Text>
                <TouchableOpacity
                  style={[
                    styles.statusPill,
                    user.status === 'ACTIVE' ? styles.statusActive : styles.statusInactive
                  ]}
                  onPress={() => onToggleUserStatus(user.id)}
                >
                  <Text style={[
                    styles.statusText,
                    user.status === 'ACTIVE' ? styles.statusTextActive : styles.statusTextInactive
                  ]}>
                    {user.status}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.userRole}>{user.role}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
            </View>
          </View>
        </View>
      ))}

      {/* Recent Security Audits */}
      <View style={[styles.sectionHeaderRow, { marginTop: tokens.spacing.lg }]}>
        <Text style={styles.sectionTitle}>Recent Audit Trail</Text>
      </View>

      {auditLogs.map((log) => (
        <View key={log.id} style={styles.auditCard}>
          <View style={styles.auditHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={[
                styles.actionBadge,
                log.action === 'UPDATE' ? styles.badgeUpdate : styles.badgeCreate
              ]}>
                <Text style={styles.actionBadgeText}>{log.action}</Text>
              </View>
              <Text style={styles.auditTarget}>{log.target}</Text>
            </View>
            <Text style={styles.auditTime}>{log.time}</Text>
          </View>
          <Text style={styles.auditDetail}>{log.detail}</Text>
          <Text style={styles.auditActor}>By: {log.actor}</Text>
        </View>
      ))}

      {/* Web Portal Banner */}
      <View style={styles.webBanner}>
        <Text style={styles.webBannerTitle}>Need Granular RBAC or Forensic Diffs?</Text>
        <Text style={styles.webBannerDesc}>
          Access the full Hen Management Web Admin Portal on desktop for 2D permission matrices, field privacy rules, and visual old-vs-new JSON comparisons.
        </Text>
      </View>
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
    paddingBottom: 40,
  },
  headerBox: {
    marginBottom: tokens.spacing.base,
  },
  heading: {
    fontSize: tokens.typography.xxl,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  subheading: {
    fontSize: tokens.typography.sm,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  rateCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    marginBottom: tokens.spacing.base,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  rateCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  editRateBtn: {
    backgroundColor: tokens.colors.primaryLight,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 6,
    borderRadius: tokens.radii.md,
  },
  editRateBtnText: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
    fontSize: tokens.typography.xs,
  },
  ratesRow: {
    flexDirection: 'row',
  },
  rateBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: tokens.spacing.xs,
  },
  rateLabel: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.medium,
  },
  rateValue: {
    fontSize: 24,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
    marginVertical: 2,
  },
  rateUnit: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textMuted,
  },
  sectionHeaderRow: {
    marginBottom: tokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  userCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
    fontSize: tokens.typography.base,
  },
  userName: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  userRole: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    marginTop: 1,
  },
  userPhone: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textMuted,
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: tokens.radii.full,
  },
  statusActive: {
    backgroundColor: tokens.colors.successLight,
  },
  statusInactive: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 10,
    fontWeight: tokens.typography.bold,
  },
  statusTextActive: {
    color: tokens.colors.success,
  },
  statusTextInactive: {
    color: '#6B7280',
  },
  auditCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  auditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  actionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeCreate: {
    backgroundColor: tokens.colors.successLight,
  },
  badgeUpdate: {
    backgroundColor: '#DBEAFE',
  },
  actionBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: tokens.colors.textPrimary,
  },
  auditTarget: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  auditTime: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textMuted,
  },
  auditDetail: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    lineHeight: 16,
  },
  auditActor: {
    fontSize: 10,
    color: tokens.colors.textMuted,
    marginTop: 4,
  },
  webBanner: {
    marginTop: tokens.spacing.lg,
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
  },
  webBannerTitle: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: '#1E40AF',
    marginBottom: 4,
  },
  webBannerDesc: {
    fontSize: tokens.typography.xs,
    color: '#3B82F6',
    lineHeight: 18,
  }
});
