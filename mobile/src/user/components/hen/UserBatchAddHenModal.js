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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { userTokens } from '../../styles/userTokens';
import { formatCurrency } from '../../../utils/calculations';

export default function UserBatchAddHenModal({
  visible,
  customerName = 'Customer',
  rates,
  onClose,
  onSaveBatch
}) {
  const margaRateDefault = rates?.MARGA ? parseFloat(rates.MARGA) : 260.00;
  const margeeRateDefault = rates?.MARGEE ? parseFloat(rates.MARGEE) : 240.00;

  // List of hen cards: { id, type, weight, rateApplied, photoUri, notes }
  const [henCards, setHenCards] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedBatchResult, setSavedBatchResult] = useState(null);

  // Initialize with 1 empty card whenever opened
  useEffect(() => {
    if (visible) {
      setHenCards([
        {
          id: `card-${Date.now()}-1`,
          type: 'MARGA',
          weight: '',
          rateApplied: margaRateDefault,
          photoUri: null,
          notes: ''
        }
      ]);
      setErrorMsg('');
      setIsSubmitting(false);
      setSavedBatchResult(null);
    }
  }, [visible, margaRateDefault, margeeRateDefault]);

  const handleCompleteClose = () => {
    setSavedBatchResult(null);
    setIsSubmitting(false);
    setErrorMsg('');
    onClose();
  };

  // Add another hen card (Section 2.1 & 2.2)
  const handleAddAnotherHen = () => {
    const nextIdx = henCards.length + 1;
    setHenCards(prev => [
      ...prev,
      {
        id: `card-${Date.now()}-${nextIdx}`,
        type: 'MARGA',
        weight: '',
        rateApplied: margaRateDefault,
        photoUri: null,
        notes: ''
      }
    ]);
    setErrorMsg('');
  };

  // Remove a hen card
  const handleRemoveCard = (cardId) => {
    if (henCards.length <= 1) {
      Alert.alert('Cannot Remove', 'You must have at least one hen card in the batch.');
      return;
    }
    setHenCards(prev => prev.filter(c => c.id !== cardId));
  };

  // Update a card property
  const handleUpdateCard = (cardId, field, value) => {
    setHenCards(prev =>
      prev.map(c => {
        if (c.id !== cardId) return c;
        if (field === 'type') {
          const newRate = value === 'MARGA' ? margaRateDefault : margeeRateDefault;
          return { ...c, type: value, rateApplied: newRate };
        }
        return { ...c, [field]: value };
      })
    );
  };

  // Camera action (Section 2.1 & 2.2)
  const handleTakePhoto = async (cardId) => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access in your device settings to take live hen photos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleUpdateCard(cardId, 'photoUri', result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Camera Error', 'Could not open camera. Please try again.');
    }
  };

  // Gallery action (Section 2.1 & 2.2)
  const handlePickFromGallery = async (cardId) => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Gallery Permission Required',
          'Please allow photo gallery access in your device settings to select hen photos.'
        );
        return;
      }

      const mediaTypeOption = ImagePicker.MediaTypeOptions?.Images || ['images'];
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypeOption,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleUpdateCard(cardId, 'photoUri', result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Gallery Error', 'Could not select photo. Please try again.');
    }
  };

  // Remove photo from card
  const handleRemovePhoto = (cardId) => {
    handleUpdateCard(cardId, 'photoUri', null);
  };

  // Live aggregates
  const validCards = henCards.filter(c => (parseFloat(c.weight) || 0) > 0);
  const totalBatchWeight = henCards.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);
  const totalBatchAmount = henCards.reduce((sum, c) => {
    const w = parseFloat(c.weight) || 0;
    const r = parseFloat(c.rateApplied) || 0;
    return sum + (w * r);
  }, 0);
  const margaCount = henCards.filter(c => c.type === 'MARGA').length;
  const margeeCount = henCards.filter(c => c.type === 'MARGEE').length;

  // Submit Batch (Section 2.2 Save All Hens)
  const handleSubmitAllHens = async () => {
    if (isSubmitting) return;
    setErrorMsg('');

    if (henCards.length === 0) {
      setErrorMsg('Please add at least one hen card.');
      return;
    }

    // Strict validation identifying the exact card (Section 2.3)
    const batchPayload = [];
    for (let i = 0; i < henCards.length; i++) {
      const card = henCards[i];
      const w = parseFloat(card.weight);

      if (!card.weight || card.weight.trim() === '' || isNaN(w) || w <= 0) {
        setErrorMsg(`Card #${i + 1} (${card.type === 'MARGA' ? 'Marga' : 'Margee'}) has an invalid weight. Please enter a weight greater than 0 kg.`);
        return;
      }

      batchPayload.push({
        type: card.type,
        weight: w,
        rateApplied: parseFloat(card.rateApplied) || (card.type === 'MARGA' ? margaRateDefault : margeeRateDefault),
        photoUri: card.photoUri || null,
        notes: card.notes?.trim() || ''
      });
    }

    setIsSubmitting(true);
    try {
      const result = await Promise.resolve(onSaveBatch(batchPayload));
      if (result && Array.isArray(result) && result.length > 0) {
        setSavedBatchResult(result);
      } else {
        handleCompleteClose();
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to save batch intake. Your entered data has been preserved, please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
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

          {/* Success Screen: Generated IDs & Count Confirmation (Section 2.1 & 2.2) */}
          {savedBatchResult ? (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <View style={styles.resultIconCircle}>
                  <Icon2D name="check" size={32} color="#16A34A" />
                </View>
                <Text style={styles.resultTitle}>Batch Intake Saved!</Text>
                <Text style={styles.resultSubtitle}>
                  Recorded <Text style={styles.highlightBold}>{savedBatchResult.length} hens</Text> for <Text style={styles.customerHighlight}>{customerName}</Text>
                </Text>
              </View>

              {/* Summary Stats */}
              <View style={styles.resultSummaryBar}>
                <View style={styles.resultCol}>
                  <Text style={styles.resultLabel}>Total Birds</Text>
                  <Text style={styles.resultVal}>{savedBatchResult.length} Hens</Text>
                </View>
                <View style={styles.resultDivider} />
                <View style={styles.resultCol}>
                  <Text style={styles.resultLabel}>Total Weight</Text>
                  <Text style={styles.resultVal}>
                    {savedBatchResult.reduce((s, h) => s + (parseFloat(h.weight) || 0), 0).toFixed(3)} kg
                  </Text>
                </View>
                <View style={styles.resultDivider} />
                <View style={styles.resultCol}>
                  <Text style={styles.resultLabel}>Batch Total</Text>
                  <Text style={[styles.resultVal, styles.amountHighlight]}>
                    {formatCurrency(
                      savedBatchResult.reduce((s, h) => s + ((parseFloat(h.weight) || 0) * (parseFloat(h.rateApplied) || 0)), 0)
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.idListHeader}>
                <Text style={styles.idListTitle}>Generated Hen IDs</Text>
                <View style={styles.autoBadge}>
                  <Text style={styles.autoBadgeText}>System Generated</Text>
                </View>
              </View>

              {/* Scrollable list of generated Hen IDs with photos */}
              <ScrollView
                style={styles.resultScroll}
                contentContainerStyle={styles.resultScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {savedBatchResult.map((hen, idx) => {
                  const amt = (parseFloat(hen.weight) || 0) * (parseFloat(hen.rateApplied) || 0);
                  const isMarga = hen.type === 'MARGA';

                  return (
                    <View key={hen.id || idx} style={styles.generatedIdCard}>
                      <View style={styles.generatedLeft}>
                        {hen.photoUri ? (
                          <Image source={{ uri: hen.photoUri }} style={styles.generatedThumbnail} />
                        ) : (
                          <View style={[styles.avatarCircle, isMarga ? styles.margaBg : styles.margeeBg]}>
                            <Icon2D name="bird" size={24} color={isMarga ? '#2563EB' : '#0D9488'} />
                          </View>
                        )}
                        <View style={styles.idDetailsCol}>
                          <View style={styles.idTagRow}>
                            <Text style={styles.generatedIdText}>{hen.henNumber}</Text>
                            <View style={[styles.typeBadgeMini, isMarga ? styles.margaBadgeMini : styles.margeeBadgeMini]}>
                              <Text style={[styles.typeTextMini, isMarga ? styles.margaTextMini : styles.margeeTextMini]}>
                                {isMarga ? 'Marga' : 'Margee'}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.generatedMetaText}>
                            {parseFloat(hen.weight).toFixed(2)} kg @ ₹{parseFloat(hen.rateApplied).toFixed(0)}/kg
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.generatedAmountText}>
                        {formatCurrency(amt)}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>

              <TouchableOpacity
                style={styles.finishBtn}
                onPress={handleCompleteClose}
                activeOpacity={0.85}
              >
                <Text style={styles.finishBtnText}>Done & View Customer Ledger</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Input Form: Multiple Hen Cards (Section 2.1 & 2.2) */
            <>
              {/* Header */}
              <View style={styles.sheetHeader}>
                <View style={styles.titleGroup}>
                  <Text style={styles.sheetTitle}>Batch Hen Intake</Text>
                  <Text style={styles.sheetSubtitle}>
                    Adding hens for <Text style={styles.customerHighlight}>{customerName}</Text>
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon2D name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Mandi Standard Rate Banner */}
              <View style={styles.mandiRatesBar}>
                <Text style={styles.mandiLabel}>MANDI BENCHMARK RATES:</Text>
                <View style={styles.rateChipRow}>
                  <Text style={styles.mandiRateChip}>Marga: ₹{margaRateDefault.toFixed(0)}/kg</Text>
                  <Text style={styles.mandiRateChip}>Margee: ₹{margeeRateDefault.toFixed(0)}/kg</Text>
                </View>
              </View>

              {/* Error Alert Banner */}
              {errorMsg ? (
                <View style={styles.errorBanner}>
                  <Icon2D name="warning" size={16} color="#DC2626" />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              ) : null}

              {/* Hen Cards Scroll Area */}
              <ScrollView
                style={styles.formScroll}
                contentContainerStyle={styles.formScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {henCards.map((card, idx) => {
                  const cardWeight = parseFloat(card.weight) || 0;
                  const cardRate = parseFloat(card.rateApplied) || 0;
                  const cardAmount = cardWeight * cardRate;
                  const isMarga = card.type === 'MARGA';

                  return (
                    <View key={card.id} style={styles.henCard}>
                      {/* Card Header: #Index & Remove */}
                      <View style={styles.cardHeaderRow}>
                        <View style={styles.cardIndexBadge}>
                          <Text style={styles.cardIndexText}>HEN #{idx + 1}</Text>
                        </View>

                        {henCards.length > 1 && (
                          <TouchableOpacity
                            style={styles.removeCardBtn}
                            onPress={() => handleRemoveCard(card.id)}
                            activeOpacity={0.7}
                          >
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="trash" size={14} color="#EF4444" /><Text style={styles.removeCardText}>Remove</Text></View>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* 1. Type Selector: Two Large Options (Section 2.1 & 2.2) */}
                      <Text style={styles.inputLabel}>SELECT BIRD TYPE</Text>
                      <View style={styles.typeSelectorRow}>
                        <TouchableOpacity
                          style={[
                            styles.typeChoiceBtn,
                            isMarga && styles.typeChoiceBtnActiveMarga
                          ]}
                          onPress={() => handleUpdateCard(card.id, 'type', 'MARGA')}
                          activeOpacity={0.8}
                        >
                          <Icon2D name="bird" size={22} color={card.type === 'MARGA' ? '#2563EB' : '#64748B'} />
                          <View>
                            <Text style={[styles.typeChoiceTitle, isMarga && styles.typeChoiceTitleActive]}>
                              Marga
                            </Text>
                            <Text style={[styles.typeChoiceSubtitle, isMarga && styles.typeChoiceSubtitleActive]}>
                              Male • ₹{margaRateDefault.toFixed(0)}/kg
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.typeChoiceBtn,
                            !isMarga && styles.typeChoiceBtnActiveMargee
                          ]}
                          onPress={() => handleUpdateCard(card.id, 'type', 'MARGEE')}
                          activeOpacity={0.8}
                        >
                          <Icon2D name="bird" size={22} color={card.type === 'MARGEE' ? '#0D9488' : '#64748B'} />
                          <View>
                            <Text style={[styles.typeChoiceTitle, !isMarga && styles.typeChoiceTitleActive]}>
                              Margee
                            </Text>
                            <Text style={[styles.typeChoiceSubtitle, !isMarga && styles.typeChoiceSubtitleActive]}>
                              Female • ₹{margeeRateDefault.toFixed(0)}/kg
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      {/* 2. Weight Input & Amount Display (Section 2.1 & 2.2) */}
                      <View style={styles.weightRow}>
                        <View style={styles.weightInputCol}>
                          <Text style={styles.inputLabel}>
                            WEIGHT (KG) <Text style={styles.requiredStar}>*</Text>
                          </Text>
                          <View style={styles.weightInputWrapper}>
                            <TextInput
                              style={styles.weightInput}
                              placeholder="0.000"
                              placeholderTextColor={userTokens.colors.textMuted}
                              keyboardType="decimal-pad"
                              value={card.weight}
                              onChangeText={(val) => handleUpdateCard(card.id, 'weight', val)}
                            />
                            <Text style={styles.weightUnitBadge}>kg</Text>
                          </View>
                        </View>

                        <View style={styles.cardAmountCol}>
                          <Text style={styles.inputLabel}>CALCULATED AMOUNT</Text>
                          <View style={styles.cardAmountBox}>
                            <Text style={styles.cardAmountValue}>
                              {formatCurrency(cardAmount)}
                            </Text>
                            <Text style={styles.cardAmountSub}>
                              @ ₹{cardRate.toFixed(0)}/kg
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* 3. Hen Photo: Camera/Gallery & Preview (Section 2.1 & 2.2) */}
                      <View style={styles.photoSection}>
                        <Text style={styles.inputLabel}>HEN PHOTO</Text>

                        {card.photoUri ? (
                          <View style={styles.photoPreviewCard}>
                            <Image source={{ uri: card.photoUri }} style={styles.photoPreviewImage} />
                            <View style={styles.photoMetaCol}>
                              <View style={styles.photoAttachedBadge}>
                                <Text style={styles.photoAttachedText}>Photo Attached</Text>
                              </View>
                              <View style={styles.photoActionRow}>
                                <TouchableOpacity
                                  style={styles.replacePhotoBtn}
                                  onPress={() => handleTakePhoto(card.id)}
                                  activeOpacity={0.7}
                                >
                                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="camera" size={14} color="#2563EB" /><Text style={styles.replacePhotoText}>Camera</Text></View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.replacePhotoBtn}
                                  onPress={() => handlePickFromGallery(card.id)}
                                  activeOpacity={0.7}
                                >
                                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="gallery" size={14} color="#0D9488" /><Text style={styles.replacePhotoText}>Gallery</Text></View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.removePhotoBtn}
                                  onPress={() => handleRemovePhoto(card.id)}
                                  activeOpacity={0.7}
                                >
                                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}><Icon2D name="close" size={14} color="#EF4444" /><Text style={styles.removePhotoText}>Remove</Text></View>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.photoPickerRow}>
                            <TouchableOpacity
                              style={styles.photoChoiceBtn}
                              onPress={() => handleTakePhoto(card.id)}
                              activeOpacity={0.7}
                            >
                              <Icon2D name="camera" size={24} color="#2563EB" />
                              <Text style={styles.photoChoiceText}>Take Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.photoChoiceBtn}
                              onPress={() => handlePickFromGallery(card.id)}
                              activeOpacity={0.7}
                            >
                              <Icon2D name="gallery" size={24} color="#0D9488" />
                              <Text style={styles.photoChoiceText}>Choose Gallery</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>

                      {/* 4. Optional Note */}
                      <View style={styles.notesSection}>
                        <Text style={styles.inputLabel}>NOTE (OPTIONAL)</Text>
                        <TextInput
                          style={styles.notesInput}
                          placeholder="e.g. Crate tag #4, premium batch"
                          placeholderTextColor={userTokens.colors.textMuted}
                          value={card.notes}
                          onChangeText={(val) => handleUpdateCard(card.id, 'notes', val)}
                        />
                      </View>
                    </View>
                  );
                })}

                {/* Prominent "+ Add Another Hen" button (Section 2.1 & 2.2) */}
                <TouchableOpacity
                  style={styles.addAnotherBtn}
                  onPress={handleAddAnotherHen}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addAnotherIcon}>＋</Text>
                  <Text style={styles.addAnotherText}>Add Another Hen</Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Bottom Summary Bar & Save All Hens Button */}
              <View style={styles.bottomBar}>
                <View style={styles.batchTotalsRow}>
                  <View>
                    <Text style={styles.batchSummaryLabel}>BATCH SUMMARY ({henCards.length} Cards)</Text>
                    <Text style={styles.batchSummaryCount}>
                      {margaCount} Marga • {margeeCount} Margee ({totalBatchWeight.toFixed(2)} kg)
                    </Text>
                  </View>
                  <View style={styles.batchTotalRight}>
                    <Text style={styles.batchSummaryLabel}>TOTAL AMOUNT</Text>
                    <Text style={styles.batchTotalVal}>{formatCurrency(totalBatchAmount)}</Text>
                  </View>
                </View>

                {/* Save All Hens (Prevent duplicate taps - Section 2.2) */}
                <TouchableOpacity
                  style={[
                    styles.saveAllBtn,
                    isSubmitting && styles.saveAllBtnDisabled
                  ]}
                  onPress={handleSubmitAllHens}
                  disabled={isSubmitting}
                  activeOpacity={0.85}
                >
                  {isSubmitting ? (
                    <View style={styles.savingRow}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.saveAllBtnText}>Saving Batch Hens...</Text>
                    </View>
                  ) : (
                    <Text style={styles.saveAllBtnText}>
                      Save All Hens ({henCards.length})
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    ...userTokens.shadows.float,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  titleGroup: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  customerHighlight: {
    color: userTokens.colors.primary,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  mandiRatesBar: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  mandiLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  rateChipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  mandiRateChip: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 10,
    gap: 8,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  henCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIndexBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardIndexText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  removeCardBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
  },
  removeCardText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  requiredStar: {
    color: '#DC2626',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  typeChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    gap: 8,
  },
  typeChoiceBtnActiveMarga: {
    borderColor: userTokens.colors.primary,
    backgroundColor: userTokens.colors.primary,
  },
  typeChoiceBtnActiveMargee: {
    borderColor: userTokens.colors.secondary,
    backgroundColor: userTokens.colors.secondary,
  },
  typeChoiceEmoji: {
    fontSize: 22,
  },
  typeChoiceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  typeChoiceTitleActive: {
    color: '#FFFFFF',
  },
  typeChoiceSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  typeChoiceSubtitleActive: {
    color: '#E2E8F0',
  },
  weightRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  weightInputCol: {
    flex: 1.2,
  },
  weightInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    height: 48,
  },
  weightInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  weightUnitBadge: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  cardAmountCol: {
    flex: 1,
  },
  cardAmountBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  cardAmountValue: {
    fontSize: 15,
    fontWeight: '800',
    color: userTokens.colors.primary,
  },
  cardAmountSub: {
    fontSize: 10,
    color: '#64748B',
  },
  photoSection: {
    marginBottom: 12,
  },
  photoPickerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  photoChoiceIcon: {
    fontSize: 16,
  },
  photoChoiceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  photoPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 10,
  },
  photoPreviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  photoMetaCol: {
    flex: 1,
    gap: 6,
  },
  photoAttachedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  photoAttachedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  photoActionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  replacePhotoBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  replacePhotoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  removePhotoBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  removePhotoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  notesSection: {
    marginTop: 2,
  },
  notesInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  addAnotherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: userTokens.colors.primary,
    borderStyle: 'dashed',
    backgroundColor: '#EFF6FF',
    gap: 8,
    marginBottom: 8,
  },
  addAnotherIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: userTokens.colors.primary,
  },
  addAnotherText: {
    fontSize: 14,
    fontWeight: '700',
    color: userTokens.colors.primary,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 16 : 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  batchTotalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchSummaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  batchSummaryCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 1,
  },
  batchTotalRight: {
    alignItems: 'flex-end',
  },
  batchTotalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: userTokens.colors.primary,
    marginTop: 1,
  },
  saveAllBtn: {
    backgroundColor: userTokens.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: userTokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveAllBtnDisabled: {
    opacity: 0.65,
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveAllBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  // Result screen styles
  resultContainer: {
    flex: 1,
    padding: 16,
  },
  resultHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resultIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  resultIconText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#16A34A',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  resultSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  highlightBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  resultSummaryBar: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  resultCol: {
    alignItems: 'center',
  },
  resultDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#CBD5E1',
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  resultVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  amountHighlight: {
    color: userTokens.colors.primary,
  },
  idListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  idListTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  autoBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  autoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  resultScroll: {
    flex: 1,
  },
  resultScrollContent: {
    paddingBottom: 10,
  },
  generatedIdCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  generatedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  generatedThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  margaBg: {
    backgroundColor: '#EFF6FF',
  },
  margeeBg: {
    backgroundColor: '#F0FDFA',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  idDetailsCol: {
    gap: 2,
  },
  idTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  generatedIdText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  typeBadgeMini: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  margaBadgeMini: {
    backgroundColor: '#DBEAFE',
  },
  margeeBadgeMini: {
    backgroundColor: '#CCFBF1',
  },
  typeTextMini: {
    fontSize: 10,
    fontWeight: '700',
  },
  margaTextMini: {
    color: '#1D4ED8',
  },
  margeeTextMini: {
    color: '#0F766E',
  },
  generatedMetaText: {
    fontSize: 11,
    color: '#64748B',
  },
  generatedAmountText: {
    fontSize: 14,
    fontWeight: '800',
    color: userTokens.colors.primary,
  },
  finishBtn: {
    backgroundColor: userTokens.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  finishBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
