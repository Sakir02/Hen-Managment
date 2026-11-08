import Icon2D from '../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { tokens } from '../styles/tokens';
import { useAdminData } from '../context/AdminDataContext';

export default function RolesPermissionsScreen({ onBack }) {
  const { roles, updateRolePermissions, showToast } = useAdminData();

  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || 'role-super-admin');
  const [expandedGroups, setExpandedGroups] = useState({
    'Customer Management': true,
    'Hen Operations': true,
    'Payments & Billing': true,
  });

  const activeRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleTogglePermission = (groupName, permId, currentVal) => {
    if (activeRole.name === 'Super Admin') {
      showToast('Super Admin permissions are fixed and immutable for safety.', 'warning');
      return;
    }
    updateRolePermissions(activeRole.id, groupName, permId, !currentVal);
  };

  return (
    <View style={styles.container}>
      {/* Top Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← More Hub</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Roles & Permissions Matrix</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Role Selection Horizontal Cards (Spec Section 16) */}
        <Text style={styles.sectionHeader}>SELECT SYSTEM ROLE</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.roleCardRow}
        >
          {roles.map((role) => {
            const isSelected = selectedRoleId === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                style={[styles.roleCard, isSelected && styles.roleCardActive]}
                onPress={() => setSelectedRoleId(role.id)}
                activeOpacity={0.8}
              >
                <View style={styles.roleHeaderRow}>
                  <Text style={[styles.roleName, isSelected && styles.roleNameActive]}>
                    {role.name}
                  </Text>
                  {isSelected && <Icon2D name="check-simple" size={15} color="#2563EB" />}
                </View>
                <Text style={styles.roleDesc} numberOfLines={2}>
                  {role.description}
                </Text>
                <View style={styles.roleFooter}>
                  <Text style={styles.userCountBadge}>
                    {role.userCount} Assigned Staff
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Role Active Banner */}
        <View style={styles.activeRoleBanner}>
          <View>
            <Text style={styles.activeBannerTitle}>
              Configuring: <Text style={styles.greenText}>{activeRole.name}</Text>
            </Text>
            <Text style={styles.activeBannerSub}>{activeRole.description}</Text>
          </View>
        </View>

        {/* Expandable Permission Groups (Spec Section 16) */}
        <Text style={styles.sectionHeader}>GRANULAR PERMISSION POLICIES</Text>
        <View style={styles.groupsContainer}>
          {Object.entries(activeRole.permissions || {}).map(([groupName, permList]) => {
            const isExpanded = !!expandedGroups[groupName];
            const enabledCount = permList.filter((p) => p.enabled).length;

            return (
              <View key={groupName} style={styles.groupCard}>
                <TouchableOpacity
                  style={styles.groupHeader}
                  onPress={() => toggleGroup(groupName)}
                  activeOpacity={0.7}
                >
                  <View style={styles.groupTitleCol}>
                    <Text style={styles.groupTitle}>{groupName}</Text>
                    <Text style={styles.groupCount}>
                      {enabledCount} of {permList.length} enabled
                    </Text>
                  </View>
                  <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.permList}>
                    {permList.map((perm) => (
                      <View key={perm.id} style={styles.permRow}>
                        <View style={styles.permTextCol}>
                          <Text style={styles.permLabel}>{perm.label}</Text>
                          <Text style={styles.permKey}>{perm.id}</Text>
                        </View>
                        <Switch
                          value={perm.enabled}
                          onValueChange={() =>
                            handleTogglePermission(groupName, perm.id, perm.enabled)
                          }
                          trackColor={{
                            false: tokens.colors.border,
                            true: tokens.colors.primaryLight
                          }}
                          thumbColor={perm.enabled ? tokens.colors.primary : '#9CA3AF'}
                          disabled={activeRole.name === 'Super Admin'}
                        />
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Save Action Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => showToast(`Permissions for ${activeRole.name} committed!`, 'success')}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>Save Role Configuration</Text>
        </TouchableOpacity>
      </ScrollView>
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
    gap: tokens.spacing.md,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
    letterSpacing: 0.5,
  },
  roleCardRow: {
    gap: tokens.spacing.sm,
    paddingRight: tokens.spacing.base,
  },
  roleCard: {
    width: 220,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.md,
    borderWidth: 1.5,
    borderColor: tokens.colors.border,
    justifyContent: 'space-between',
    ...tokens.shadows.card,
  },
  roleCardActive: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.primaryLight,
  },
  roleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleName: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  roleNameActive: {
    color: tokens.colors.primary,
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  roleDesc: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    lineHeight: 16,
    marginBottom: tokens.spacing.sm,
  },
  roleFooter: {
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    paddingTop: 6,
  },
  userCountBadge: {
    fontSize: 10,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textSecondary,
  },
  activeRoleBanner: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  activeBannerTitle: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  greenText: {
    color: tokens.colors.primary,
  },
  activeBannerSub: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  groupsContainer: {
    gap: tokens.spacing.sm,
  },
  groupCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    overflow: 'hidden',
    ...tokens.shadows.card,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacing.base,
    backgroundColor: tokens.colors.surface,
  },
  groupTitleCol: {
    flex: 1,
  },
  groupTitle: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  groupCount: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 12,
    color: tokens.colors.textMuted,
    marginLeft: tokens.spacing.sm,
  },
  permList: {
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    paddingHorizontal: tokens.spacing.base,
  },
  permRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAF8',
  },
  permTextCol: {
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  permLabel: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
  },
  permKey: {
    fontSize: 10,
    color: tokens.colors.textMuted,
    marginTop: 1,
  },
  saveBtn: {
    height: tokens.touchTarget.minHeight,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.sm,
    ...tokens.shadows.card,
  },
  saveBtnText: {
    color: tokens.colors.surface,
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
  }
});
