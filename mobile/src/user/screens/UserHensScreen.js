import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { userTokens } from '../styles/userTokens';
import { useAdminData } from '../../context/AdminDataContext';
import { formatCurrency } from '../../utils/calculations';
import UserStatusBadge from '../components/common/UserStatusBadge';
import UserEmptyState from '../components/common/UserEmptyState';
import UserBatchAddHenModal from '../components/hen/UserBatchAddHenModal';
import UserHenDetailsModal from '../components/hen/UserHenDetailsModal';
import Icon2D from '../../components/common/Icon2D';

export default function UserHensScreen({ onSelectCustomer }) {
  const { systemMetrics, customers, addHensBatchToCustomer, deleteHenFromCustomer, rates } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'MARGA' | 'MARGEE'
  const [isAddHenModalOpen, setIsAddHenModalOpen] = useState(false);
  const [selectedHenForDetails, setSelectedHenForDetails] = useState(null);
  const [targetCustomerId, setTargetCustomerId] = useState(customers[0]?.id || null);

  const allHensList = systemMetrics?.allHens || [];

  const filteredHens = allHensList.filter((hen) => {
    const matchesSearch =
      hen.henNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hen.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hen.notes && hen.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (typeFilter === 'ALL') return true;
    return hen.type === typeFilter;
  });

  const handleSaveBatch = (batchHens) => {
    if (targetCustomerId) {
      addHensBatchToCustomer(targetCustomerId, batchHens);
    }
  };

  return (
    <View style={styles.container}>
      {/* Aggregate Header Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Total Birds</Text>
          <Text style={styles.statVal}>{systemMetrics?.totalHens || 0} Hens</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Aggregate Weight</Text>
          <Text style={styles.statVal}>{systemMetrics?.totalWeight || '0.00'} kg</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Total Valuation</Text>
          <Text style={[styles.statVal, { color: userTokens.colors.primary }]}>
            {formatCurrency(systemMetrics?.grossBill || 0)}
          </Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBarRow}>
        <Icon2D name="search" size={18} color={userTokens.colors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by tag # (e.g. H-01) or customer..."
          placeholderTextColor={userTokens.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Icon2D name="close" size={16} color={userTokens.colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Type Filter Chips */}
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
                {t === 'ALL' ? 'All Birds' : t === 'MARGA' ? 'Marga (Male)' : 'Margee (Female)'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Hens List as Stacked Cards */}
      <FlatList
        data={filteredHens}
        keyExtractor={(item) => `${item.customerId}-${item.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <UserEmptyState
            icon="hens"
            title="No Hens Recorded"
            description="No bird inventory matches your search filter."
            actionLabel="+ Weigh New Hen"
            onAction={() => setIsAddHenModalOpen(true)}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.henCard}
            onPress={() => setSelectedHenForDetails(item)}
            activeOpacity={0.7}
          >
            <View style={styles.henLeft}>
              <View style={styles.henAvatar}>
                <Icon2D
                  name="hens"
                  size={20}
                  color={item.type === 'MARGA' ? userTokens.colors.primary : userTokens.colors.secondary}
                />
              </View>
              <View style={styles.henInfo}>
                <View style={styles.tagRow}>
                  <Text style={styles.henTag}>{item.henNumber}</Text>
                  <UserStatusBadge type={item.type} size="small" />
                </View>
                <Text style={styles.customerLink}>Customer: {item.customerName}</Text>
                <Text style={styles.henWeight}>
                  {(item.weight || 0).toFixed(2)} kg @ {formatCurrency(item.rateApplied || 0)}/kg
                </Text>
                {item.notes ? <Text style={styles.henNotes}>"{item.notes}"</Text> : null}
              </View>
            </View>

            <View style={styles.henRight}>
              <Text style={styles.priceVal}>{formatCurrency(item.amount || (item.weight * item.rateApplied))}</Text>
              <Text style={styles.viewLedgerHint}>Details ›</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Action Button (+ Batch Weigh-in) */}
      <TouchableOpacity
        style={styles.fabBtn}
        onPress={() => setIsAddHenModalOpen(true)}
        activeOpacity={0.85}
      >
        <Icon2D name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.fabBtnText}>Weigh Hens Batch</Text>
      </TouchableOpacity>

      {/* Batch Add Modal */}
      <UserBatchAddHenModal
        visible={isAddHenModalOpen}
        onClose={() => setIsAddHenModalOpen(false)}
        customers={customers}
        selectedCustomerId={targetCustomerId}
        onSelectCustomer={setTargetCustomerId}
        onSaveBatch={handleSaveBatch}
      />

      {/* Hen Details Modal */}
      <UserHenDetailsModal
        visible={!!selectedHenForDetails}
        hen={selectedHenForDetails}
        onClose={() => setSelectedHenForDetails(null)}
        onDelete={(henId) => {
          if (selectedHenForDetails) {
            deleteHenFromCustomer(selectedHenForDetails.customerId, henId);
            setSelectedHenForDetails(null);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: userTokens.colors.background,
  },
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.surface,
    paddingVertical: userTokens.spacing.md,
    paddingHorizontal: userTokens.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: userTokens.colors.border,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textSecondary,
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
    marginTop: 2,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.surface,
    marginHorizontal: userTokens.spacing.base,
    marginTop: userTokens.spacing.md,
    paddingHorizontal: userTokens.spacing.md,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: userTokens.typography.sm,
    color: userTokens.colors.textPrimary,
  },
  clearBtn: {
    padding: userTokens.spacing.xs,
  },
  typeFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: userTokens.spacing.base,
    marginTop: userTokens.spacing.sm,
    marginBottom: userTokens.spacing.xs,
    gap: userTokens.spacing.sm,
  },
  typeChip: {
    paddingVertical: userTokens.spacing.xs,
    paddingHorizontal: userTokens.spacing.md,
    borderRadius: userTokens.radii.pill,
    backgroundColor: userTokens.colors.surface,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  typeChipActive: {
    backgroundColor: userTokens.colors.primaryLight,
    borderColor: userTokens.colors.primary,
  },
  typeChipText: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textSecondary,
  },
  typeChipTextActive: {
    color: userTokens.colors.primary,
    fontWeight: userTokens.typography.bold,
  },
  listContent: {
    padding: userTokens.spacing.base,
    paddingBottom: 90,
  },
  henCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: userTokens.colors.surface,
    padding: userTokens.spacing.base,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    marginBottom: userTokens.spacing.sm,
    ...userTokens.shadows.card,
  },
  henLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  henAvatar: {
    width: 44,
    height: 44,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.background,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.md,
  },
  henInfo: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: userTokens.spacing.xs,
  },
  henTag: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  customerLink: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.medium,
    color: userTokens.colors.primary,
    marginTop: 2,
  },
  henWeight: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  henNotes: {
    fontSize: userTokens.typography.xs,
    fontStyle: 'italic',
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  henRight: {
    alignItems: 'flex-end',
    marginLeft: userTokens.spacing.md,
  },
  priceVal: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  viewLedgerHint: {
    fontSize: 10,
    color: userTokens.colors.textSecondary,
    marginTop: 4,
  },
  fabBtn: {
    position: 'absolute',
    bottom: userTokens.spacing.xl,
    right: userTokens.spacing.base,
    backgroundColor: userTokens.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: userTokens.spacing.md,
    paddingHorizontal: userTokens.spacing.lg,
    borderRadius: userTokens.radii.pill,
    ...userTokens.shadows.float,
    gap: userTokens.spacing.xs,
  },
  fabBtnText: {
    color: '#FFFFFF',
    fontWeight: userTokens.typography.bold,
    fontSize: userTokens.typography.sm,
  }
});
