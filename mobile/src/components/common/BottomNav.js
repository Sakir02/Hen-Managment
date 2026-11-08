import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { tokens } from '../../styles/tokens';
import Icon2D from './Icon2D';

export default function BottomNav({ activeTab, onTabSelect, dueCount = 0, tabsConfig }) {
  const defaultTabs = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'customers', label: 'Customers', icon: 'customers', badge: dueCount > 0 ? dueCount : null },
    { key: 'hens', label: 'Hens', icon: 'hens' },
    { key: 'more', label: 'More', icon: 'more' },
  ];

  const tabs = tabsConfig || defaultTabs;

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
                color={isActive ? tokens.colors.primary : tokens.colors.textSecondary}
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
    backgroundColor: tokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 12 : 4,
    paddingTop: 4,
    ...tokens.shadows.nav,
  },
  navItem: {
    flex: 1,
    height: tokens.touchTarget.minHeight,
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
    backgroundColor: tokens.colors.secondary,
    minWidth: 16,
    height: 16,
    borderRadius: tokens.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: tokens.colors.surface,
    fontSize: 9,
    fontWeight: tokens.typography.bold,
  },
  navLabel: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.medium,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  navLabelActive: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 20,
    height: 3,
    borderRadius: tokens.radii.pill,
    backgroundColor: tokens.colors.primary,
  }
});
