import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { tokens } from '../styles/tokens';

export default function RateSettingModal({ visible, currentRates, rates, onClose, onSaveRates }) {
  const activeRates = currentRates || rates || { MARGA: 260, MARGEE: 240 };
  const [margaRate, setMargaRate] = useState(activeRates.MARGA.toString());
  const [margeeRate, setMargeeRate] = useState(activeRates.MARGEE.toString());
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (activeRates) {
      setMargaRate(activeRates.MARGA.toString());
      setMargeeRate(activeRates.MARGEE.toString());
    }
  }, [activeRates.MARGA, activeRates.MARGEE, visible]);

  const handleSubmit = () => {
    const m = parseFloat(margaRate);
    const f = parseFloat(margeeRate);

    if (isNaN(m) || m <= 0 || isNaN(f) || f <= 0) {
      setErrorMsg('Please enter valid positive rate values for both types.');
      return;
    }

    onSaveRates({
      MARGA: Math.round(m * 100) / 100,
      MARGEE: Math.round(f * 100) / 100
    });
    setErrorMsg('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Configure Standard Rates</Text>
          <Text style={styles.subtitle}>
            Rates applied to new hens added to the system. Existing hen rates will remain locked historically.
          </Text>

          <Text style={styles.label}>Marga (Male) Rate (₹ / kg) *</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={margaRate}
            onChangeText={(t) => { setMargaRate(t); setErrorMsg(''); }}
          />

          <Text style={styles.label}>Margee (Female) Rate (₹ / kg) *</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={margeeRate}
            onChangeText={(t) => { setMargeeRate(t); setErrorMsg(''); }}
          />

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
              <Text style={styles.saveText}>Update Rates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.base,
  },
  dialog: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  subtitle: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    marginTop: 4,
    marginBottom: tokens.spacing.base,
    lineHeight: 18,
  },
  label: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.md,
  },
  errorBox: {
    backgroundColor: tokens.colors.errorLight,
    padding: 8,
    borderRadius: tokens.radii.md,
    marginBottom: tokens.spacing.sm,
  },
  errorText: {
    fontSize: 12,
    color: tokens.colors.error,
  },
  footer: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  cancelText: {
    fontSize: tokens.typography.sm,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.semibold,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.primary,
  },
  saveText: {
    fontSize: tokens.typography.sm,
    color: '#FFFFFF',
    fontWeight: tokens.typography.bold,
  }
});
