import Icon2D from '../../../components/common/Icon2D';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { userTokens } from '../../styles/userTokens';
import { formatCurrency } from '../../../utils/calculations';

export default function UserAddHenModal({
  visible,
  rates,
  onClose,
  onSaveHen
}) {
  const [henNumber, setHenNumber] = useState('');
  const [type, setType] = useState('MARGA');
  const [weightStr, setWeightStr] = useState('');
  const [images, setImages] = useState([]);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeRate = type === 'MARGA' ? rates.MARGA : rates.MARGEE;
  const weight = parseFloat(weightStr) || 0;
  const estimatedCost = Math.round(weight * activeRate * 100) / 100;

  useEffect(() => {
    if (visible) {
      setHenNumber(`H-${Math.floor(Math.random() * 900 + 100)}`);
      setType('MARGA');
      setWeightStr('');
      setImages([]);
      setNotes('');
      setErrorMsg('');
    }
  }, [visible]);

  const handlePickImages = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera roll access is needed to upload hen photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 3,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newUris = result.assets.map(a => a.uri);
        setImages([...images, ...newUris]);
      }
    } catch (err) {
      console.log('Error picking images:', err);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to capture hen photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (err) {
      console.log('Error taking photo:', err);
    }
  };

  const handleSubmit = () => {
    setErrorMsg('');
    if (!weightStr.trim() || weight <= 0) {
      setErrorMsg('Please enter a valid weight in kg greater than 0');
      return;
    }

    onSaveHen({
      henNumber: henNumber.trim() || `H-${Date.now().toString().slice(-3)}`,
      type,
      weight,
      rateApplied: activeRate,
      notes: notes.trim(),
      photoUri: images.length > 0 ? images[0] : null,
      images
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Weigh & Record Hen</Text>
              <Text style={styles.subtitle}>Daily intake batch registration</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon2D name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Hen Tag Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Hen Batch Tag # *</Text>
              <TextInput
                style={styles.input}
                value={henNumber}
                onChangeText={setHenNumber}
                placeholder="e.g. H-105"
                placeholderTextColor={userTokens.colors.textMuted}
              />
            </View>

            {/* Hen Type Selector (Marga vs Margee) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Bird Type / Gender *</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[styles.typeBtn, type === 'MARGA' && styles.typeBtnActiveMarga]}
                  onPress={() => setType('MARGA')}
                  activeOpacity={0.8}
                >
                  <Icon2D name="bird" size={24} color={type === 'MARGA' ? '#2563EB' : '#64748B'} />
                  <Text style={[styles.typeBtnText, type === 'MARGA' && styles.typeBtnTextActive]}>
                    Marga (Male)
                  </Text>
                  <Text style={styles.typeRateHint}>₹{rates.MARGA}/kg</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeBtn, type === 'MARGEE' && styles.typeBtnActiveMargee]}
                  onPress={() => setType('MARGEE')}
                  activeOpacity={0.8}
                >
                  <Icon2D name="bird" size={24} color={type === 'MARGEE' ? '#0D9488' : '#64748B'} />
                  <Text style={[styles.typeBtnText, type === 'MARGEE' && styles.typeBtnTextActive]}>
                    Margee (Female)
                  </Text>
                  <Text style={styles.typeRateHint}>₹{rates.MARGEE}/kg</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Weight Input (kg) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Measured Weight (kg) *</Text>
              <View style={styles.weightInputRow}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="0.000"
                  placeholderTextColor={userTokens.colors.textMuted}
                  keyboardType="decimal-pad"
                  value={weightStr}
                  onChangeText={(val) => {
                    setWeightStr(val);
                    setErrorMsg('');
                  }}
                  autoFocus
                />
                <Text style={styles.weightUnit}>kg</Text>
              </View>
            </View>

            {/* Live Calculation Banner (Spec Section 13) */}
            <View style={styles.calcBanner}>
              <View style={styles.calcLeft}>
                <Text style={styles.calcFormula}>
                  {weight.toFixed(3)} kg × ₹{activeRate}/kg
                </Text>
                <Text style={styles.calcSub}>Standard benchmark calculation</Text>
              </View>
              <Text style={styles.calcTotal}>{formatCurrency(estimatedCost)}</Text>
            </View>

            {/* Error Message */}
            {errorMsg ? (
              <View style={styles.errorBox}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}><Icon2D name="warning" size={15} color="#DC2626" /><Text style={styles.errorText}>{errorMsg}</Text></View>
              </View>
            ) : null}

            {/* Photos & Camera Action */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Hen Photo (Optional)</Text>
              <View style={styles.photoActionsRow}>
                <TouchableOpacity
                  style={styles.photoActionBtn}
                  onPress={handleTakePhoto}
                  activeOpacity={0.8}
                >
                  <Icon2D name="camera" size={20} color="#2563EB" />
                  <Text style={styles.photoActionText}>Take Camera Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.photoActionBtn, styles.photoActionGallery]}
                  onPress={handlePickImages}
                  activeOpacity={0.8}
                >
                  <Icon2D name="gallery" size={20} color="#0D9488" />
                  <Text style={styles.photoActionText}>From Gallery</Text>
                </TouchableOpacity>
              </View>

              {images.length > 0 && (
                <View style={styles.previewThumbsRow}>
                  {images.map((uri, idx) => (
                    <View key={idx} style={styles.thumbWrapper}>
                      <Image source={{ uri }} style={styles.thumbImage} />
                      <TouchableOpacity
                        style={styles.removeThumbBtn}
                        onPress={() => setImages(images.filter((_, i) => i !== idx))}
                      >
                        <Icon2D name="close" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Notes */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Health / Batch Remarks</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="e.g. Cage #3, Prime layer condition"
                placeholderTextColor={userTokens.colors.textMuted}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>Save Hen Entry ({formatCurrency(estimatedCost)})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  sheet: {
    backgroundColor: userTokens.colors.surface,
    borderTopLeftRadius: userTokens.radii.xl,
    borderTopRightRadius: userTokens.radii.xl,
    paddingTop: userTokens.spacing.md,
    maxHeight: '92%',
    ...userTokens.shadows.float,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: userTokens.colors.border,
    borderRadius: userTokens.radii.full,
    alignSelf: 'center',
    marginBottom: userTokens.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: userTokens.spacing.base,
    paddingBottom: userTokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
  },
  title: {
    fontSize: userTokens.typography.md,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: userTokens.colors.textSecondary,
    fontWeight: userTokens.typography.bold,
  },
  body: {
    paddingHorizontal: userTokens.spacing.base,
  },
  bodyContent: {
    paddingVertical: userTokens.spacing.base,
    gap: userTokens.spacing.md,
  },
  fieldGroup: {},
  inputLabel: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: userTokens.colors.surface,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    borderRadius: userTokens.radii.md,
    height: userTokens.touchTarget.minHeight,
    paddingHorizontal: userTokens.spacing.md,
    fontSize: userTokens.typography.sm,
    color: userTokens.colors.textPrimary,
  },
  typeRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.sm,
  },
  typeBtn: {
    flex: 1,
    padding: userTokens.spacing.md,
    borderRadius: userTokens.radii.lg,
    backgroundColor: userTokens.colors.background,
    borderWidth: 1.5,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
  },
  typeBtnActiveMarga: {
    backgroundColor: userTokens.colors.primaryLight,
    borderColor: userTokens.colors.primary,
  },
  typeBtnActiveMargee: {
    backgroundColor: userTokens.colors.secondaryLight,
    borderColor: userTokens.colors.secondary,
  },
  typeBtnEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  typeBtnText: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  typeBtnTextActive: {
    color: userTokens.colors.textPrimary,
  },
  typeRateHint: {
    fontSize: 10,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.surface,
    borderWidth: 2,
    borderColor: userTokens.colors.primary,
    borderRadius: userTokens.radii.lg,
    paddingHorizontal: userTokens.spacing.md,
    height: 54,
  },
  weightInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  weightUnit: {
    fontSize: 18,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textSecondary,
  },
  calcBanner: {
    backgroundColor: userTokens.colors.primaryLight,
    borderRadius: userTokens.radii.lg,
    padding: userTokens.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  calcLeft: {
    flex: 1,
  },
  calcFormula: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  calcSub: {
    fontSize: 10,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  calcTotal: {
    fontSize: 20,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  errorBox: {
    backgroundColor: userTokens.colors.errorLight,
    padding: userTokens.spacing.sm,
    borderRadius: userTokens.radii.sm,
  },
  errorText: {
    color: userTokens.colors.error,
    fontSize: 12,
    fontWeight: userTokens.typography.medium,
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.sm,
  },
  photoActionBtn: {
    flex: 1,
    height: 42,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.background,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoActionGallery: {
    backgroundColor: userTokens.colors.surface,
  },
  photoActionIcon: {
    fontSize: 14,
  },
  photoActionText: {
    fontSize: 11,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
  },
  previewThumbsRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.sm,
    marginTop: userTokens.spacing.sm,
  },
  thumbWrapper: {
    position: 'relative',
  },
  thumbImage: {
    width: 60,
    height: 60,
    borderRadius: userTokens.radii.md,
  },
  removeThumbBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: userTokens.colors.error,
    width: 18,
    height: 18,
    borderRadius: userTokens.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeThumbText: {
    color: userTokens.colors.surface,
    fontSize: 10,
    fontWeight: userTokens.typography.bold,
  },
  notesInput: {
    height: 48,
  },
  footer: {
    flexDirection: 'row',
    padding: userTokens.spacing.base,
    gap: userTokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: userTokens.colors.border,
    backgroundColor: userTokens.colors.surface,
  },
  cancelBtn: {
    flex: 1,
    height: userTokens.touchTarget.minHeight,
    borderRadius: userTokens.radii.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    height: userTokens.touchTarget.minHeight,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.primary, // Blue #2563EB
    alignItems: 'center',
    justifyContent: 'center',
    ...userTokens.shadows.card,
  },
  saveBtnText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.surface,
  }
});
