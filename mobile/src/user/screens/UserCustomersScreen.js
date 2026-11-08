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
import { calculateCustomerFinancials } from '../../utils/calculations';
import UserCustomerCard from '../components/customer/UserCustomerCard';
import UserEmptyState from '../components/common/UserEmptyState';
import UserCustomerModal from '../components/customer/UserCustomerModal';
import Icon2D from '../../components/common/Icon2D';

export default function UserCustomersScreen({ onSelectCustomer }) {
  const { customers, addCustomer } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [balanceFilter, setBalanceFilter] = useState('ALL'); // 'ALL' | 'DUE' | 'SETTLED'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = [
    { key: 'ALL', label: `All (${customers.length})` },
    {
      key: 'DUE',
      label: `Due (${customers.filter(c => calculateCustomerFinancials(c).payableAmount > 0).length})`
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
      {/* Search Bar & Filter Controls */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputRow}>
          <Icon2D name="search" size={18} color={userTokens.colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers by name or phone..."
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

        {/* Balance Segment Filter */}
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
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Customers List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <UserEmptyState
            icon="customers"
            title="No Customers Found"
            description="No customers match your search criteria. Tap below to create a new profile."
            actionLabel="+ Add New Customer"
            onAction={() => setIsModalOpen(true)}
          />
        }
        renderItem={({ item }) => (
          <UserCustomerCard
            customer={item}
            onPress={() => onSelectCustomer(item.id)}
          />
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fabBtn}
        onPress={() => setIsModalOpen(true)}
        activeOpacity={0.85}
      >
        <Icon2D name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.fabText}>Add Customer</Text>
      </TouchableOpacity>

      {/* Add Customer Modal */}
      <UserCustomerModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewCustomer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: userTokens.colors.background,
  },
  searchHeader: {
    paddingHorizontal: userTokens.spacing.base,
    paddingTop: userTokens.spacing.md,
    paddingBottom: userTokens.spacing.sm,
    backgroundColor: userTokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.background,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    paddingHorizontal: userTokens.spacing.md,
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
  filterRow: {
    flexDirection: 'row',
    marginTop: userTokens.spacing.sm,
    gap: userTokens.spacing.sm,
  },
  filterChip: {
    paddingVertical: userTokens.spacing.xs,
    paddingHorizontal: userTokens.spacing.md,
    borderRadius: userTokens.radii.pill,
    backgroundColor: userTokens.colors.background,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  filterChipActive: {
    backgroundColor: userTokens.colors.primaryLight,
    borderColor: userTokens.colors.primary,
  },
  filterText: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.medium,
    color: userTokens.colors.textSecondary,
  },
  filterTextActive: {
    color: userTokens.colors.primary,
    fontWeight: userTokens.typography.bold,
  },
  listContent: {
    padding: userTokens.spacing.base,
    paddingBottom: 90,
    gap: userTokens.spacing.sm,
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
  fabText: {
    color: userTokens.colors.surface,
    fontWeight: userTokens.typography.bold,
    fontSize: userTokens.typography.sm,
  }
});
