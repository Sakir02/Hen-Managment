import Icon2D from './common/Icon2D';
import React, { useState } from 'react';
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
  Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { tokens } from '../styles/tokens';
import { formatCurrency } from '../utils/calculations';

export default function AddHenModal({ visible, rates, onClose, onSaveHen }) {
  const [henNumber, setHenNumber] = useState('');
  const [type, setType] = useState('MARGA');
  const [weightStr, setWeightStr] = useState('');
  const [images, setImages] = useState([]);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeRate = type === 'MARGA' ? rates.MARGA : rates.MARGEE;
  const weight = parseFloat(weightStr) || 0;
  const estimatedCost = Math.round(weight * activeRate * 100) / 100;

  // Pick multiple images from library
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
        selectionLimit: 5,
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

  // Take photo with camera
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

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!henNumber.trim()) {
      setErrorMsg('Please enter a Hen ID/Number (e.g. H-05)');
      return;
    }
    if (weight <= 0) {
      setErrorMsg('Please enter a valid weight in kg (e.g. 2.650)');
      return;
    }

    onSaveHen({
      id: `h-${Date.now()}`,
      henNumber: henNumber.trim().toUpperCase(),
      type,
      weight: parseFloat(weight.toFixed(3)),
      rateApplied: activeRate,
      images: images,
      image: images.length > 0 ? images[0] : null,
      notes: notes.trim()
    });

    setHenNumber('');
    setWeightStr('');
    setImages([]);
    setNotes('');
    setErrorMsg('');
    onClose();
  };

  const handleClose = () => {
    setErrorMsg('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardContainer}
          >
            <View style={styles.popupCard}>
              {/* Header */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>Add New Hen</Text>
                  <Text style={styles.subtitle}>Log weight, gender & attach photos</Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                  <Icon2D name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollBody}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Hen Type Selector */}
                <Text style={styles.inputLabel}>Gender / Category *</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[styles.typeBtn, type === 'MARGA' && styles.typeBtnActive]}
                    onPress={() => setType('MARGA')}
                  >
                    <Text style={[styles.typeBtnText, type === 'MARGA' && styles.typeBtnTextActive]}>
                      Marga (Male)
                    </Text>
                    <Text style={[styles.typeSub, type === 'MARGA' && styles.typeSubActive]}>
                      ₹{rates.MARGA}/kg
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.typeBtn, type === 'MARGEE' && styles.typeBtnActive]}
                    onPress={() => setType('MARGEE')}
                  >
                    <Text style={[styles.typeBtnText, type === 'MARGEE' && styles.typeBtnTextActive]}>
                      Margee (Female)
                    </Text>
                    <Text style={[styles.typeSub, type === 'MARGEE' && styles.typeSubActive]}>
                      ₹{rates.MARGEE}/kg
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Hen ID */}
                <Text style={styles.inputLabel}>Hen ID / Tag Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. H-12, M-04..."
                  placeholderTextColor={tokens.colors.textMuted}
                  value={henNumber}
                  onChangeText={(t) => { setHenNumber(t); setErrorMsg(''); }}
                />

                {/* Weight */}
                <Text style={styles.inputLabel}>Weight (in kg) *</Text>
                <TextInput
                  style={[styles.input, styles.weightInput]}
                  placeholder="e.g. 2.750"
                  placeholderTextColor={tokens.colors.textMuted}
                  keyboardType="decimal-pad"
                  value={weightStr}
                  onChangeText={(t) => { setWeightStr(t); setErrorMsg(''); }}
                />

                {/* Live Calculation Ribbon */}
                {weight > 0 && (
                  <View style={styles.calcRibbon}>
                    <Text style={styles.calcText}>
                      Live Calculation: {weight.toFixed(3)} kg × ₹{activeRate} ={' '}
                      <Text style={styles.calcBold}>{formatCurrency(estimatedCost)}</Text>
                    </Text>
                  </View>
                )}

                {/* MULTIPLE HEN IMAGES SECTION */}
                <Text style={styles.inputLabel}>
                  Hen Images ({images.length} added)
                </Text>
                <View style={styles.imageActionRow}>
                  <TouchableOpacity
                    style={styles.photoPickerBtn}
                    onPress={handlePickImages}
                    activeOpacity={0.7}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="gallery" size={15} color="#2563EB" /><Text style={styles.photoPickerText}>Select Photos</Text></View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.photoPickerBtn, styles.cameraBtn]}
                    onPress={handleTakePhoto}
                    activeOpacity={0.7}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="camera" size={15} color="#2563EB" /><Text style={styles.cameraBtnText}>Camera</Text></View>
                  </TouchableOpacity>
                </View>

                {/* Selected Images Horizontal Thumbnail Strip */}
                {images.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.thumbStrip}
                  >
                    {images.map((uri, index) => (
                      <View key={index} style={styles.thumbContainer}>
                        <Image source={{ uri }} style={styles.thumbImage} />
                        <TouchableOpacity
                          style={styles.thumbDeleteBtn}
                          onPress={() => handleRemoveImage(index)}
                        >
                          <Icon2D name="close" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}

                {errorMsg ? (
                  <View style={styles.errorBox}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}><Icon2D name="warning" size={15} color="#DC2626" /><Text style={styles.errorText}>{errorMsg}</Text></View>
                  </View>
                ) : null}

                {/* Notes */}
                <Text style={styles.inputLabel}>Notes / Batch Info (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Optional notes..."
                  placeholderTextColor={tokens.colors.textMuted}
                  value={notes}
                  onChangeText={setNotes}
                />
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                  <Text style={styles.submitBtnText}>Add Hen Entry</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.base,
  },
  keyboardContainer: {
    width: '100%',
    maxWidth: 440,
  },
  popupCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    paddingBottom: tokens.spacing.sm,
  },
  title: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
  },
  scrollBody: {
    maxHeight: 380,
    marginBottom: tokens.spacing.sm,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: 5,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: tokens.radii.md,
    borderWidth: 1.5,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
  },
  typeBtnActive: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.primaryLight,
  },
  typeBtnText: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textSecondary,
  },
  typeBtnTextActive: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
  },
  typeSub: {
    fontSize: 10,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  typeSubActive: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.semibold,
  },
  input: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1.5,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: tokens.typography.sm,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.md,
  },
  weightInput: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
  },
  calcRibbon: {
    backgroundColor: tokens.colors.primaryLight,
    padding: 9,
    borderRadius: tokens.radii.md,
    marginBottom: tokens.spacing.md,
  },
  calcText: {
    fontSize: 11,
    color: tokens.colors.primary,
  },
  calcBold: {
    fontWeight: tokens.typography.bold,
  },
  imageActionRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  photoPickerBtn: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    paddingVertical: 9,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
  },
  photoPickerText: {
    fontSize: 12,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
  },
  cameraBtn: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.primaryLight,
  },
  cameraBtnText: {
    fontSize: 12,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.primary,
  },
  thumbStrip: {
    marginBottom: tokens.spacing.md,
  },
  thumbContainer: {
    position: 'relative',
    marginRight: 10,
  },
  thumbImage: {
    width: 64,
    height: 64,
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  thumbDeleteBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: tokens.colors.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbDeleteText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  errorBox: {
    backgroundColor: tokens.colors.errorLight,
    padding: 8,
    borderRadius: tokens.radii.md,
    marginBottom: tokens.spacing.md,
  },
  errorText: {
    fontSize: 11,
    color: tokens.colors.error,
    fontWeight: tokens.typography.semibold,
  },
  notesInput: {
    height: 50,
  },
  footer: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    paddingTop: tokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.background,
  },
  cancelBtnText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textSecondary,
  },
  submitBtn: {
    flex: 1.6,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.primary,
  },
  submitBtnText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: '#FFFFFF',
  }
});
