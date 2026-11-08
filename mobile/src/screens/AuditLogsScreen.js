import Icon2D from '../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { tokens } from '../styles/tokens';
import { useAdminData } from '../context/AdminDataContext';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';

export default function AuditLogsScreen({ onBack }) {
  const { auditLogs } = useAdminData();
  const [selectedLog, setSelectedLog] = useState(null);
  const [actionFilter, setActionFilter] = useState('ALL'); // 'ALL' | 'CREATE' | 'UPDATE' | 'DELETE'

  const filteredLogs = auditLogs.filter((log) => {
    if (actionFilter === 'ALL') return true;
    return log.action === actionFilter;
  });

  return (
    <View style={styles.container}>
      {/* Top Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← More Hub</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Audit Trail Timeline</Text>
      </View>

      {/* Info Banner */}
      <View style={styles.readOnlyBanner}>
        <Icon2D name="lock" size={22} color="#2563EB" />
        <Text style={styles.bannerText}>
          Audit logs are tamper-proof and cryptographically logged. Records are immutable and strictly read-only.
        </Text>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {['ALL', 'CREATE', 'UPDATE', 'DELETE'].map((f) => {
          const isSelected = actionFilter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => setActionFilter(f)}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                {f === 'ALL' ? 'All Activities' : f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Vertical Timeline Card Feed (Spec Section 17) */}
      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="audit"
            title="No Activity Logs"
            description="No system transactions match the selected filter."
          />
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.logCard}
            onPress={() => setSelectedLog(item)}
            activeOpacity={0.7}
          >
            {/* Timeline indicator connector */}
            <View style={styles.timelineCol}>
              <View style={styles.timelineDot}>
                <Text style={styles.timelineDotIcon}>
                  <Icon2D name={item.action === 'CREATE' ? 'plus' : item.action === 'DELETE' ? 'close' : 'edit'} size={15} color={item.action === 'DELETE' ? '#EF4444' : '#2563EB'} />
                </Text>
              </View>
              {index < filteredLogs.length - 1 && <View style={styles.timelineLine} />}
            </View>

            {/* Log Card Body */}
            <View style={styles.logBody}>
              <View style={styles.logHeader}>
                <Text style={styles.actorName}>{item.actor}</Text>
                <StatusBadge status={item.action} size="small" />
              </View>

              <Text style={styles.logSummary}>{item.summary || item.detail}</Text>

              <View style={styles.logMetaRow}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="document" size={12} color="#64748B" /><Text style={styles.entityTag}>{item.entity || item.target}</Text></View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="history" size={12} color="#64748B" /><Text style={styles.timestampText}>{item.timestamp || item.time}</Text></View>
              </View>

              {item.diff ? (
                <View style={styles.diffHintBox}>
                  <Text style={styles.diffHintText}>Tap to inspect before/after diffs →</Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Stacked Before/After Diff Viewer Modal (Spec Section 17) */}
      <Modal
        visible={!!selectedLog}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedLog(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.diffSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.diffTitle}>Audit Record Inspection</Text>
            <Text style={styles.diffId}>Audit ID: {selectedLog?.id}</Text>

            <ScrollView style={styles.diffScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>Operator Information</Text>
                <Text style={styles.actorMeta}>
                  Actor: <Text style={styles.bold}>{selectedLog?.actor}</Text> ({selectedLog?.actorRole || 'Staff'})
                </Text>
                <Text style={styles.actorMeta}>
                  Timestamp: <Text style={styles.bold}>{selectedLog?.timestamp || selectedLog?.time}</Text>
                </Text>
                <Text style={styles.actorMeta}>
                  Action: <Text style={styles.bold}>{selectedLog?.action}</Text> on {selectedLog?.entity || selectedLog?.target}
                </Text>
                <Text style={styles.actorMeta}>
                  Summary: {selectedLog?.summary || selectedLog?.detail}
                </Text>
              </View>

              {/* Stacked Before / After Values (Spec Section 17) */}
              <Text style={styles.diffSectionHeader}>STATE TRANSITION (BEFORE vs AFTER)</Text>

              <View style={styles.stackedDiffContainer}>
                {/* BEFORE STATE */}
                <View style={styles.diffBoxBefore}>
                  <View style={styles.diffBoxHeader}>
                    <Text style={styles.beforeBadge}>BEFORE (PREVIOUS STATE)</Text>
                  </View>
                  <View style={styles.diffBoxContent}>
                    {selectedLog?.diff?.before ? (
                      typeof selectedLog.diff.before === 'object' ? (
                        Object.entries(selectedLog.diff.before).map(([k, v]) => (
                          <View key={k} style={styles.diffRow}>
                            <Text style={styles.diffKey}>{k}:</Text>
                            <Text style={styles.diffVal}>{String(v)}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.diffVal}>{String(selectedLog.diff.before)}</Text>
                      )
                    ) : (
                      <Text style={styles.diffNullText}>None (Record was newly created)</Text>
                    )}
                  </View>
                </View>

                {/* AFTER STATE */}
                <View style={styles.diffBoxAfter}>
                  <View style={styles.diffBoxHeader}>
                    <Text style={styles.afterBadge}>AFTER (COMMITTED STATE)</Text>
                  </View>
                  <View style={styles.diffBoxContent}>
                    {selectedLog?.diff?.after ? (
                      typeof selectedLog.diff.after === 'object' ? (
                        Object.entries(selectedLog.diff.after).map(([k, v]) => (
                          <View key={k} style={styles.diffRow}>
                            <Text style={styles.diffKey}>{k}:</Text>
                            <Text style={[styles.diffVal, styles.greenText]}>{String(v)}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={[styles.diffVal, styles.greenText]}>
                          {String(selectedLog.diff.after)}
                        </Text>
                      )
                    ) : (
                      <Text style={styles.diffNullText}>None (Record was removed)</Text>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeDiffBtn}
              onPress={() => setSelectedLog(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeDiffText}>Close Inspection</Text>
            </TouchableOpacity>
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
  readOnlyBanner: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    padding: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79, 70, 229, 0.2)',
  },
  bannerIcon: {
    fontSize: 16,
    marginRight: tokens.spacing.sm,
  },
  bannerText: {
    flex: 1,
    fontSize: 11,
    color: '#3730A3',
    lineHeight: 16,
  },
  filterRow: {
    flexDirection: 'row',
    padding: tokens.spacing.base,
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    gap: tokens.spacing.xs,
  },
  filterChip: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 4,
    borderRadius: tokens.radii.pill,
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  filterChipActive: {
    backgroundColor: tokens.colors.primaryLight,
    borderColor: tokens.colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  filterChipTextActive: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
  },
  listContent: {
    padding: tokens.spacing.base,
    paddingBottom: 40,
  },
  logCard: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.base,
  },
  timelineCol: {
    width: 32,
    alignItems: 'center',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.primaryLight,
    borderWidth: 1.5,
    borderColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotIcon: {
    fontSize: 10,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: tokens.colors.border,
    marginTop: 4,
  },
  logBody: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.md,
    marginLeft: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.card,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  actorName: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  logSummary: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 6,
  },
  logMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entityTag: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.medium,
  },
  timestampText: {
    fontSize: 10,
    color: tokens.colors.textMuted,
  },
  diffHintBox: {
    marginTop: tokens.spacing.sm,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  diffHintText: {
    fontSize: 10,
    color: tokens.colors.secondary,
    fontWeight: tokens.typography.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  diffSheet: {
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radii.xl,
    borderTopRightRadius: tokens.radii.xl,
    padding: tokens.spacing.xl,
    maxHeight: '85%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radii.full,
    alignSelf: 'center',
    marginBottom: tokens.spacing.md,
  },
  diffTitle: {
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  diffId: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.md,
  },
  diffScroll: {
    marginBottom: tokens.spacing.md,
  },
  actorCard: {
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginBottom: tokens.spacing.md,
    gap: 4,
  },
  actorTitle: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  actorMeta: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textPrimary,
  },
  bold: {
    fontWeight: tokens.typography.bold,
  },
  diffSectionHeader: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.sm,
  },
  stackedDiffContainer: {
    gap: tokens.spacing.sm,
  },
  diffBoxBefore: {
    backgroundColor: '#FEF2F2',
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    overflow: 'hidden',
  },
  diffBoxAfter: {
    backgroundColor: tokens.colors.primaryLight,
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    overflow: 'hidden',
  },
  diffBoxHeader: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  beforeBadge: {
    fontSize: 10,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.error,
  },
  afterBadge: {
    fontSize: 10,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  diffBoxContent: {
    padding: tokens.spacing.md,
    gap: 4,
  },
  diffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  diffKey: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.medium,
  },
  diffVal: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  greenText: {
    color: tokens.colors.primary,
  },
  diffNullText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: tokens.colors.textMuted,
  },
  closeDiffBtn: {
    height: tokens.touchTarget.minHeight,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeDiffText: {
    color: tokens.colors.surface,
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
  }
});
