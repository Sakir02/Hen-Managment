import React from 'react';
import Icon2D from './common/Icon2D';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, Dimensions } from 'react-native';
import { tokens } from '../styles/tokens';

const { width, height } = Dimensions.get('window');

export default function ImagePreviewModal({ visible, imageUri, onClose }) {
  if (!imageUri) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Top Close Bar */}
        <View style={styles.topBar}>
          <Text style={styles.headerText}>Hen Photo Preview</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon2D name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Centered Large Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.semibold,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: width * 0.95,
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: tokens.radii.md,
  },
});
