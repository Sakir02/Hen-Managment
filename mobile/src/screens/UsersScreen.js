import Icon2D from '../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { tokens } from '../styles/tokens';
import { useAdminData } from '../context/AdminDataContext';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import UserFormModal from '../components/user/UserFormModal';

export default function UsersScreen() {
  const { staffUsers, addStaffUser, updateStaffUser, toggleStaffStatus, deleteStaffUser } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'Super Admin' | 'Farm Manager' | 'Field Operator' | 'ACTIVE' | 'INACTIVE'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const filters = [
    { key: 'ALL', label: 'All Users' },
    { key: 'ACTIVE', label: 'Active Only' },
    { key: 'Super Admin', label: 'Super Admins' },
    { key: 'Farm Manager', label: 'Farm Managers' },
    { key: 'Field Operator', label: 'Operators' },
    { key: 'INACTIVE', label: 'Inactive' },
  ];

  const filteredUsers = staffUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (roleFilter === 'ALL') return true;
    if (roleFilter === 'ACTIVE') return user.status === 'ACTIVE';
    if (roleFilter === 'INACTIVE') return user.status === 'INACTIVE';
    return user.role === roleFilter;
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (userData) => {
    if (userData.id) {
      updateStaffUser(userData.id, userData);
    } else {
      addStaffUser(userData);
    }
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteStaffUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar & Header Controls (Spec Section 8) */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputRow}>
          <Icon2D name="search" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, phone, or email..."
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

        {/* Filter Chips Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {filters.map((f) => {
            const isSelected = roleFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setRoleFilter(f.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Users Stacked List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="users"
            title="No Staff Accounts Found"
            description={
              searchQuery
                ? `No users match "${searchQuery}". Try a different search.`
                : 'No staff users match the selected role filter.'
            }
            actionLabel="+ Register Staff Member"
            onAction={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.avatar || item.name.slice(0, 2).toUpperCase()}</Text>
              </View>

              <View style={styles.userInfoCol}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userPhone}>{item.phone}</Text>
                {item.email ? <Text style={styles.userEmail}>{item.email}</Text> : null}
              </View>

              <View style={styles.badgesCol}>
                <StatusBadge status={item.status} size="small" />
                <View style={{ height: 4 }} />
                <StatusBadge status={item.role} size="small" />
              </View>
            </View>

            <View style={styles.cardDivider} />

            {/* Quick Actions Row */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => toggleStaffStatus(item.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionBtnText, item.status === 'ACTIVE' ? styles.deactivateText : styles.activateText]}>
                  {item.status === 'ACTIVE' ? '⏸ Deactivate' : '▶ Activate'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleEdit(item)}
                activeOpacity={0.7}
              >
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="edit" size={14} color="#2563EB" /><Text style={styles.actionBtnText}>Edit Profile</Text></View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => setUserToDelete(item)}
                activeOpacity={0.7}
              >
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="trash" size={14} color="#EF4444" /><Text style={styles.deleteBtnText}>Delete</Text></View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Floating Action Button (FAB) for Add User */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => {
          setSelectedUser(null);
          setIsModalOpen(true);
        }}
      >
        <Text style={styles.fabIcon}>＋</Text>
        <Text style={styles.fabLabel}>Add Staff</Text>
      </TouchableOpacity>

      {/* User Form Modal */}
      <UserFormModal
        visible={isModalOpen}
        initialUser={selectedUser}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        visible={!!userToDelete}
        title="Delete Staff Account"
        message={`Are you sure you want to permanently remove "${userToDelete?.name}"? This action will be logged in the audit trail.`}
        confirmLabel="Yes, Delete"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  searchContainer: {
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
  filterBar: {
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
  userCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.card,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: tokens.colors.primary,
  },
  avatarText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  userInfoCol: {
    flex: 1,
    marginLeft: tokens.spacing.md,
  },
  userName: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  userPhone: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 11,
    color: tokens.colors.textMuted,
    marginTop: 1,
  },
  badgesCol: {
    alignItems: 'flex-end',
  },
  cardDivider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginVertical: tokens.spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tokens.spacing.xs,
  },
  actionBtn: {
    flex: 1,
    height: 38,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
  },
  activateText: {
    color: tokens.colors.primary,
  },
  deactivateText: {
    color: tokens.colors.warning,
  },
  deleteBtn: {
    borderColor: tokens.colors.errorLight,
    backgroundColor: '#FEF2F2',
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.error,
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
