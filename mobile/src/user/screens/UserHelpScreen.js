import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { userTokens } from '../styles/userTokens';
import Icon2D from '../../components/common/Icon2D';

export default function UserHelpScreen({ onBack }) {
  const guideSections = [
    {
      title: '1. Live Bird Weighing Standard',
      icon: 'scale',
      steps: [
        'Always tare (zero) the electronic digital scale with the empty weighing cage before inserting live birds.',
        'Enter exact weight up to 3 decimal places (e.g. 2.850 kg).',
        'Check bird tag numbers carefully to prevent duplicate entry.'
      ]
    },
    {
      title: '2. Marga vs Margee Classification',
      icon: 'hens',
      steps: [
        'Marga (Male): Distinct large comb, higher weight ratio, standard benchmark pricing.',
        'Margee (Female): Standard layer body, lighter weight, prime culinary grade.',
        'Ensure correct gender selection so the appropriate Mandi daily rate is applied automatically.'
      ]
    },
    {
      title: '3. Payment Collection & Digital Slips',
      icon: 'payments',
      steps: [
        'Collect partial or full cash settlements and select the corresponding payment mode.',
        'When collecting via UPI, verify transaction success on your Mandi QR stand before pressing Confirm.',
        'Customer balances and receipts update immediately on the ledger.'
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Top Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon2D name="back" size={18} color={userTokens.colors.primary} />
          <Text style={styles.backBtnText}>More Hub</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Operational Guide & Help</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Card */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIconBox}>
            <Icon2D name="help" size={24} color={userTokens.colors.primary} />
          </View>
          <View style={styles.bannerTextBox}>
            <Text style={styles.bannerTitle}>Field Operator Protocol</Text>
            <Text style={styles.bannerSub}>
              Standard operating procedures for weigh-ins, mandi benchmarks, and receipts.
            </Text>
          </View>
        </View>

        {/* Guides */}
        {guideSections.map((sec, idx) => (
          <View key={idx} style={styles.guideCard}>
            <View style={styles.guideHeader}>
              <View style={styles.guideIconBox}>
                <Icon2D name={sec.icon} size={18} color={userTokens.colors.primary} />
              </View>
              <Text style={styles.guideTitle}>{sec.title}</Text>
            </View>

            <View style={styles.stepsContainer}>
              {sec.steps.map((step, sIdx) => (
                <View key={sIdx} style={styles.stepRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Hotline Contact Button */}
        <TouchableOpacity
          style={styles.callSupportBtn}
          onPress={() => Linking.openURL('tel:+919876543210')}
          activeOpacity={0.8}
        >
          <Icon2D name="phone" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.callSupportText}>Call Farm Supervisor (+91 98765 43210)</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: userTokens.colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: userTokens.spacing.base,
    paddingVertical: userTokens.spacing.md,
    backgroundColor: userTokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
    gap: userTokens.spacing.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: userTokens.spacing.xs,
  },
  backBtnText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  screenTitle: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  scrollContent: {
    padding: userTokens.spacing.base,
    paddingBottom: userTokens.spacing.xxl,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.primaryLight,
    padding: userTokens.spacing.base,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.primary,
    marginBottom: userTokens.spacing.base,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.md,
  },
  bannerTextBox: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  bannerSub: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textPrimary,
    marginTop: 2,
    lineHeight: 18,
  },
  guideCard: {
    backgroundColor: userTokens.colors.surface,
    padding: userTokens.spacing.base,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    marginBottom: userTokens.spacing.base,
    ...userTokens.shadows.card,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: userTokens.spacing.md,
  },
  guideIconBox: {
    width: 32,
    height: 32,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.background,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.sm,
  },
  guideTitle: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  stepsContainer: {
    gap: userTokens.spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: userTokens.colors.primary,
    marginTop: 7,
    marginRight: userTokens.spacing.sm,
  },
  stepText: {
    flex: 1,
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    lineHeight: 20,
  },
  callSupportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: userTokens.colors.secondary,
    padding: userTokens.spacing.md,
    borderRadius: userTokens.radii.lg,
    marginTop: userTokens.spacing.sm,
    ...userTokens.shadows.card,
  },
  callSupportText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.surface,
  }
});
