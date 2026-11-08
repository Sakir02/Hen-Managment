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
import { calculateCustomerFinancials } from '../utils/calculations';
import CustomerCard from '../components/CustomerCard';
import EmptyState from '../components/common/EmptyState';
import AddCustomerModal from '../components/AddCustomerModal';

export default function CustomersScreen({ onSelectCustomer }) {
  const { customers, addCustomer } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [balanceFilter, setBalanceFilter] = useState('ALL'); // 'ALL' | 'DUE' | 'SETTLED'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = [
    { key: 'ALL', label: `All (${customers.length})` },
    {
      key: 'DUE',
      label: `Balance Due (${customers.filter(c => calculateCustomerFinancials(c).payableAmount > 0).length})`
    },
    {
      key: 'SETTLED',
      label: `Settled (${customers.filter(c => calculateCustomerFinancials(c).payableAmount === 0).length})`
    }
  ];

  const filteredCustomers = customers.filter((cust) => {
    const fin = calculateCustomerFinancials(cust);
    const matchesSearch =
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.includes(searchQuery) ||
      (cust.address && cust.address.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (balanceFilter === 'DUE') return fin.payableAmount > 0;
    if (balanceFilter === 'SETTLED') return fin.payableAmount === 0;
    return true;
  });

  const handleSaveNewCustomer = (customerData) => {
    const created = addCustomer(customerData);
    if (created && created.id) {
      onSelectCustomer(created.id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar & Filter Controls (Spec Section 10) */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputRow}>
          <Icon2D name="search" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer name, phone, or mandi..."
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

        {/* Balance Filter Chips */}
        <View style={styles.filterRow}>
          {filters.map((f) => {
            const isSelected = balanceFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setBalanceFilter(f.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Customer List as Stacked Cards */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="customers"
            title="No Customers Match Query"
            description={
              searchQuery
                ? `No customers match "${searchQuery}". Please check your search spelling or filters.`
                : 'No customers found under the selected balance status.'
            }
            actionLabel="+ Add New Customer"
            onAction={() => setIsModalOpen(true)}
          />
        }
        renderItem={({ item }) => (
          <CustomerCard
            customer={item}
            onPress={(cust) => onSelectCustomer(cust.id)}
          />
        )}
      />

      {/* Primary Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setIsModalOpen(true)}
      >
        <Text style={styles.fabIcon}>＋</Text>
        <Text style={styles.fabLabel}>New Customer</Text>
      </TouchableOpacity>

      {/* Add Customer Modal */}
      <AddCustomerModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveCustomer={handleSaveNewCustomer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  searchHeader: {
    backgroundColor: tokens.colors.surface,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    ...tokens.shadows.card,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
    marginHorizontal: tokens.spacing.base,
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
  clearBtn: {
    padding: tokens.spacing.xs,
  },
  clearBtnText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.bold,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: tokens.spacing.base,
    paddingTop: tokens.spacing.sm,
    gap: tokens.spacing.xs,
  },
  filterChip: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 6,
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
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.medium,
  },
  filterChipTextActive: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
  },
  listContent: {
    padding: tokens.spacing.base,
    paddingBottom: 100,
    gap: tokens.spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: tokens.spacing.lg,
    right: tokens.spacing.base,
    backgroundColor: tokens.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radii.pill,
    ...tokens.shadows.float,
  },
  fabIcon: {
    color: tokens.colors.surface,
    fontSize: 18,
    fontWeight: tokens.typography.bold,
    marginRight: 6,
  },
  fabLabel: {
    color: tokens.colors.surface,
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
  }
});
