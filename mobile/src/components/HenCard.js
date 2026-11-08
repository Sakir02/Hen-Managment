import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { tokens } from '../styles/tokens';
import { formatCurrency } from '../utils/calculations';

export default function HenCard({ hen, onDelete, onImagePress }) {
  const cost = Math.round((hen.weight * hen.rateApplied) * 100) / 100;
  const isMarga = hen.type === 'MARGA';
  const photos = hen.images || (hen.image ? [hen.image] : []);

  return (
    <View style={styles.card}>
      <View style={styles.leftCol}>
        <View style={styles.badgeRow}>
          <Text style={styles.henNumber}>{hen.henNumber}</Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{isMarga ? 'Marga (Male)' : 'Margee (Female)'}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.weightText}>
            {parseFloat(hen.weight).toFixed(3)} <Text style={styles.unitText}>kg</Text>
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.rateText}>@ {formatCurrency(hen.rateApplied)}/kg</Text>
        </View>

        {/* Thumbnail Preview Row for Multiple Images */}
        {photos.length > 0 && (
          <View style={styles.photoRow}>
            {photos.slice(0, 3).map((uri, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={() => onImagePress && onImagePress(uri)}
              >
                <Image source={{ uri }} style={styles.photoThumb} />
              </TouchableOpacity>
            ))}
            {photos.length > 3 && (
              <TouchableOpacity
                style={styles.morePhotoBadge}
                activeOpacity={0.8}
                onPress={() => onImagePress && onImagePress(photos[3])}
              >
                <Text style={styles.morePhotoText}>+{photos.length - 3}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {hen.notes ? <Text style={styles.notes}>{hen.notes}</Text> : null}
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.costVal}>{formatCurrency(cost)}</Text>
        {onDelete && (
          <TouchableOpacity
            style={styles.delBtn}
            onPress={() => onDelete(hen.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.delBtnText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginBottom: tokens.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: 4,
  },
  henNumber: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  pill: {
    backgroundColor: tokens.colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: tokens.radii.sm,
  },
  pillText: {
    fontSize: 10,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.primary,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weightText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  unitText: {
    fontWeight: tokens.typography.regular,
    color: tokens.colors.textSecondary,
  },
  dot: {
    color: tokens.colors.textSecondary,
  },
  rateText: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  photoThumb: {
    width: 40,
    height: 40,
    borderRadius: tokens.radii.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.background,
  },
  morePhotoBadge: {
    width: 40,
    height: 40,
    borderRadius: tokens.radii.sm,
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  morePhotoText: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
  },
  notes: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  costVal: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
    marginBottom: 4,
  },
  delBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  delBtnText: {
    fontSize: 11,
    color: tokens.colors.error,
    fontWeight: tokens.typography.semibold,
  }
});
