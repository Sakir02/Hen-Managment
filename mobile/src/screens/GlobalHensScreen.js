import Icon2D from '../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { tokens } from '../styles/tokens';
import { useAdminData } from '../context/AdminDataContext';
import { formatCurrency } from '../utils/calculations';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';

export default function GlobalHensScreen({ onBack, onSelectCustomer }) {
  const { systemMetrics } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'MARGA' | 'MARGEE'

  const filteredHens = systemMetrics.allHens.filter((hen) => {
    const matchesSearch =
      hen.henNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hen.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hen.notes && hen.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (typeFilter === 'ALL') return true;
    return hen.type === typeFilter;
  });

  return (
    <View style={styles.container}>
      {/* Top Bar Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← More Hub</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>All Hens Stock Inventory</Text>
      </View>

      {/* Aggregate Stats Banner (Spec Section 12 & 18) */}
      <View style={styles.statsBanner}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Total Hens</Text>
          <Text style={styles.statVal}>{systemMetrics.totalHens} Birds</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Aggregate Weight</Text>
          <Text style={styles.statVal}>{systemMetrics.totalWeight} kg</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Gross Value</Text>
          <Text style={[styles.statVal, { color: tokens.colors.primary }]}>
            {formatCurrency(systemMetrics.grossBill)}
          </Text>
        </View>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchBarRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by tag # (e.g. H-01) or customer..."
          placeholderTextColor={tokens.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Icon2D name="close" size={18} color="#64748B" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.typeFilterRow}>
        {['ALL', 'MARGA', 'MARGEE'].map((t) => {
          const isSelected = typeFilter === t;
          return (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, isSelected && styles.typeChipActive]}
              onPress={() => setTypeFilter(t)}
            >
              <Text style={[styles.typeChipText, isSelected && styles.typeChipTextActive]}>
                {t === 'ALL' ? 'All Types' : t === 'MARGA' ? 'Marga (Male)' : 'Margee (Female)'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Hens Feed */}
      <FlatList
        data={filteredHens}
        keyExtractor={(item) => `${item.customerId}-${item.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="hens"
            title="No Hens Found"
            description="No hens match the selected search tag or gender filter."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.henCard}
            onPress={() => onSelectCustomer(item.customerId)}
            activeOpacity={0.7}
          >
            <View style={styles.henLeft}>
              <View style={styles.henAvatar}>
                <Icon2D name="bird" size={24} color={item.type === 'MARGA' ? '#2563EB' : '#0D9488'} />
              </View>
              <View style={styles.henInfo}>
                <View style={styles.tagRow}>
                  <Text style={styles.henTag}>{item.henNumber}</Text>
                  <StatusBadge status={item.type} size="small" />
                </View>
                <Text style={styles.customerLink}>Customer: {item.customerName}</Text>
                <Text style={styles.henWeight}>
                  {item.weight.toFixed(3)} kg @ {formatCurrency(item.rateApplied)}/kg
                </Text>
                {item.notes ? <Text style={styles.henNotes}>"{item.notes}"</Text> : null}
              </View>
            </View>

            <View style={styles.henRight}>
              <Text style={styles.priceVal}>{formatCurrency(item.totalPrice)}</Text>
              <Text style={styles.viewLedgerHint}>View Ledger →</Text>
            </View>
          </TouchableOpacity>
        )}
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
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: tokens.colors.border,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 10,
    color: tokens.colors.textSecondary,
    marginBottom: 2,
  },
  statVal: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    marginHorizontal: tokens.spacing.base,
    marginTop: tokens.spacing.sm,
    borderRadius: tokens.radii.md,
    paddingHorizontal: tokens.spacing.md,
    height: tokens.touchTarget.minHeight,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: tokens.typography.sm,
    color: tokens.colors.textPrimary,
  },
  clearBtn: {
    padding: tokens.spacing.xs,
  },
  clearBtnText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  typeFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: tokens.spacing.base,
    paddingVertical: tokens.spacing.sm,
    gap: tokens.spacing.xs,
  },
  typeChip: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 6,
    borderRadius: tokens.radii.pill,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  typeChipActive: {
    backgroundColor: tokens.colors.primaryLight,
    borderColor: tokens.colors.primary,
  },
  typeChipText: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  typeChipTextActive: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
  },
  listContent: {
    padding: tokens.spacing.base,
    paddingBottom: 40,
    gap: tokens.spacing.sm,
  },
  henCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.card,
  },
  henLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  henAvatar: {
    width: 44,
    height: 44,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  henEmoji: {
    fontSize: 22,
  },
  henInfo: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    marginBottom: 2,
  },
  henTag: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  customerLink: {
    fontSize: 11,
    color: tokens.colors.primary,
    fontWeight: tokens.typography.semibold,
  },
  henWeight: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  henNotes: {
    fontSize: 10,
    color: tokens.colors.textMuted,
    fontStyle: 'italic',
    marginTop: 1,
  },
  henRight: {
    alignItems: 'flex-end',
    marginLeft: tokens.spacing.sm,
  },
  priceVal: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  viewLedgerHint: {
    fontSize: 10,
    color: tokens.colors.secondary,
    fontWeight: tokens.typography.semibold,
    marginTop: 4,
  }
});
