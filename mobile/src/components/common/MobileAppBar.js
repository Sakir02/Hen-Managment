import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { tokens } from '../../styles/tokens';
import Icon2D from './Icon2D';

export default function MobileAppBar({
  title = 'Hen Management',
  subtitle = 'Admin Portal',
  showBack = false,
  onBack,
  rightAction,
  onNotificationPress,
  onProfilePress,
  onChatPress,
  userAvatar = 'SK',
  unreadNotifications = 2
}) {
  return (
    <View style={styles.appBar}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon2D name="back" size={20} color={tokens.colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoBadge}>
            <Text style={styles.logoJvText}>JV</Text>
          </View>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightSection}>
        {onChatPress ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onChatPress}
            activeOpacity={0.7}
          >
            <Icon2D name="chat" size={19} color={tokens.colors.primary} />
          </TouchableOpacity>
        ) : null}

        {rightAction ? (
          rightAction
        ) : (
          <>
            {onNotificationPress ? (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}
              >
                <Icon2D name="bell" size={19} color={tokens.colors.primary} />
                {unreadNotifications > 0 && (
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>{unreadNotifications}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ) : null}

            {onProfilePress ? (
              <TouchableOpacity
                style={styles.avatarButton}
                onPress={onProfilePress}
                activeOpacity={0.8}
              >
                <Text style={styles.avatarText}>{userAvatar}</Text>
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appBar: {
    height: 56,
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.base,
    ...tokens.shadows.card,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.background,
    marginRight: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.sm,
  },
  logoJvText: {
    color: '#FFFFFF',
    fontWeight: tokens.typography.bold,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  subtitle: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: tokens.colors.error,
    minWidth: 14,
    height: 14,
    borderRadius: tokens.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  notifBadgeText: {
    color: tokens.colors.surface,
    fontSize: 8,
    fontWeight: tokens.typography.bold,
  },
  avatarButton: {
    width: 34,
    height: 34,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.primaryLight,
    borderWidth: 1,
    borderColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  avatarText: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  }
});
