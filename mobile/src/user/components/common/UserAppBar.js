import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { userTokens } from '../../styles/userTokens';
import Icon2D from '../../../components/common/Icon2D';

export default function UserAppBar({
  title = 'Hen Management',
  subtitle = 'Staff Operations',
  showBack = false,
  onBack,
  rightAction,
  onNotificationPress,
  onProfilePress,
  onChatPress,
  userAvatar = 'VS',
  unreadNotifications = 0,
  onTogglePortal
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
            <Icon2D name="back" size={20} color={userTokens.colors.primary} />
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
        {rightAction ? (
          rightAction
        ) : (
          <>
            {onTogglePortal ? (
              <TouchableOpacity
                style={styles.portalSwitchBtn}
                onPress={onTogglePortal}
                activeOpacity={0.8}
              >
                <Icon2D name="shield" size={14} color={userTokens.colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.portalSwitchText}>Admin</Text>
              </TouchableOpacity>
            ) : null}

            {onChatPress ? (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onChatPress}
                activeOpacity={0.7}
              >
                <Icon2D name="chat" size={19} color={userTokens.colors.primary} />
              </TouchableOpacity>
            ) : null}

            {onNotificationPress ? (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}
              >
                <Icon2D name="bell" size={19} color={userTokens.colors.primary} />
                {unreadNotifications > 0 ? <View style={styles.badgeDot} /> : null}
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
    backgroundColor: userTokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: userTokens.spacing.base,
    ...userTokens.shadows.card,
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
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.background,
    marginRight: userTokens.spacing.sm,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.sm,
  },
  logoJvText: {
    color: '#FFFFFF',
    fontWeight: userTokens.typography.bold,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  subtitle: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: userTokens.spacing.xs,
  },
  portalSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: userTokens.spacing.sm,
    paddingVertical: 5,
    borderRadius: userTokens.radii.pill,
    backgroundColor: userTokens.colors.primaryLight,
    borderWidth: 1,
    borderColor: userTokens.colors.primary,
    marginRight: 4,
  },
  portalSwitchText: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  badgeDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: userTokens.colors.error,
  },
  avatarButton: {
    width: 34,
    height: 34,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.primaryLight,
    borderWidth: 1,
    borderColor: userTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  avatarText: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  }
});
