import React from 'react';
import Icon2D from '../../../components/common/Icon2D';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { userTokens } from '../../styles/userTokens';
import { formatCurrency } from '../../../utils/calculations';

export default function UserHenCard({ hen, onPress, onDelete, onEdit }) {
  const cost = Math.round((parseFloat(hen.weight) * parseFloat(hen.rateApplied)) * 100) / 100;
  const isMarga = hen.type === 'MARGA';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress && onPress(hen)}
    >
      <View style={styles.leftCol}>
        <View style={styles.badgeRow}>
          {hen.photoUri ? (
            <Image source={{ uri: hen.photoUri }} style={styles.thumbnail} />
          ) : null}
          <View style={[styles.typeBadge, isMarga ? styles.margaBadge : styles.margeeBadge]}>
            <Text style={[styles.typeBadgeText, isMarga ? styles.margaText : styles.margeeText]}>
              {isMarga ? 'Marga' : 'Margee'} {hen.henNumber}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.weightText}>
            {parseFloat(hen.weight).toFixed(2)} kg
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.rateText}>₹{parseFloat(hen.rateApplied).toFixed(0)}/kg</Text>
        </View>

        {hen.notes ? (
          <Text style={styles.notes} numberOfLines={1}>
            "{hen.notes}"
          </Text>
        ) : null}
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.costVal}>{formatCurrency(cost)}</Text>
        <View style={styles.actionsRow}>
          {onEdit && (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => onEdit(hen)}
              activeOpacity={0.7}
            >
              <Icon2D name="edit" size={18} color="#2563EB" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.delBtn}
              onPress={() => onDelete(hen)}
              activeOpacity={0.7}
            >
              <Icon2D name="trash" size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.lg,
    paddingVertical: userTokens.spacing.md,
    paddingHorizontal: userTokens.spacing.base,
    marginBottom: userTokens.spacing.sm,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...userTokens.shadows.card,
  },
  leftCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  thumbnail: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  typeBadge: {
    paddingHorizontal: userTokens.spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: userTokens.radii.pill,
  },
  margaBadge: {
    backgroundColor: userTokens.colors.primaryLight, // #DBEAFE
  },
  margeeBadge: {
    backgroundColor: userTokens.colors.secondaryLight, // #CCFBF1
  },
  typeBadgeText: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.bold,
  },
  margaText: {
    color: userTokens.colors.primary, // #2563EB
  },
  margeeText: {
    color: userTokens.colors.secondary, // #0D9488
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  weightText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  dot: {
    marginHorizontal: 6,
    color: userTokens.colors.textSecondary,
  },
  rateText: {
    fontSize: 12,
    color: userTokens.colors.textSecondary,
  },
  notes: {
    fontSize: 11,
    color: userTokens.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  rightCol: {
    alignItems: 'flex-end',
    marginLeft: userTokens.spacing.sm,
  },
  costVal: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.xs,
  },
  editBtn: {
    padding: 4,
  },
  delBtn: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 14,
  }
});
