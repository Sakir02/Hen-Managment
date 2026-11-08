import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { userTokens } from '../../styles/userTokens';
import Icon2D from '../../../components/common/Icon2D';

export default function UserBottomNav({ activeTab, onTabSelect, dueCount = 0 }) {
  const tabs = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'customers', label: 'Customers', icon: 'customers', badge: dueCount > 0 ? dueCount : null },
    { key: 'hens', label: 'Hens', icon: 'hens' },
    { key: 'more', label: 'More', icon: 'more' },
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => onTabSelect(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View style={styles.iconWrapper}>
              <Icon2D
                name={tab.icon}
                size={22}
                color={isActive ? userTokens.colors.primary : userTokens.colors.textSecondary}
              />
              {tab.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: userTokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: userTokens.colors.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 12 : 4,
    paddingTop: 4,
    ...userTokens.shadows.nav,
  },
  navItem: {
    flex: 1,
    height: userTokens.touchTarget.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapper: {
    position: 'relative',
    height: 24,
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: userTokens.colors.secondary,
    minWidth: 16,
    height: 16,
    borderRadius: userTokens.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: userTokens.colors.surface,
    fontSize: 9,
    fontWeight: userTokens.typography.bold,
  },
  navLabel: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.medium,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  navLabelActive: {
    color: userTokens.colors.primary,
    fontWeight: userTokens.typography.bold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 20,
    height: 3,
    borderRadius: userTokens.radii.pill,
    backgroundColor: userTokens.colors.primary,
  }
});
