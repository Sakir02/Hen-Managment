import React from 'react';
import Icon2D from './Icon2D';
import { View, Image, StyleSheet, Text } from 'react-native';

export default function HenAppMascot({ size = 'medium', celebration = false, style }) {
  let dimension = 56;
  if (size === 'small') dimension = 34;
  if (size === 'medium') dimension = 64;
  if (size === 'large') dimension = 96;
  if (size === 'splash') dimension = 120;
  if (size === 'welcome') dimension = 92;

  return (
    <View style={[styles.wrapper, style]}>
      {/* Celebratory sparkle rays if celebration is true (Welcome Back state) */}
      {celebration && (
        <View style={[styles.celebrationRays, { width: dimension * 1.5, height: dimension * 1.5 }]}>
          <View style={[styles.sparkle, styles.sparkleTopLeft]}><Icon2D name="sparkles" size={12} color="#2563EB" /></View>
          <Text style={[styles.sparkle, styles.sparkleTop]}>•</Text>
          <View style={[styles.sparkle, styles.sparkleTopRight]}><Icon2D name="sparkles" size={12} color="#2563EB" /></View>
          <Text style={[styles.sparkle, styles.sparkleRight]}>•</Text>
          <View style={[styles.sparkle, styles.sparkleBottomRight]}><Icon2D name="sparkles" size={12} color="#2563EB" /></View>
          <Text style={[styles.sparkle, styles.sparkleLeft]}>•</Text>
        </View>
      )}

      {/* Mascot Circle */}
      <View
        style={[
          styles.mascotCircle,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
          }
        ]}
      >
        <Image
          source={require('../../../assets/henapp_mascot.jpg')}
          style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  celebrationRays: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 16,
    color: '#16A34A',
  },
  sparkleTopLeft: {
    top: 6,
    left: 8,
    color: '#22C55E',
    transform: [{ rotate: '-15deg' }],
  },
  sparkleTop: {
    top: -2,
    alignSelf: 'center',
    color: '#86EFAC',
    fontSize: 20,
  },
  sparkleTopRight: {
    top: 6,
    right: 8,
    color: '#EAB308',
    transform: [{ rotate: '20deg' }],
  },
  sparkleRight: {
    right: -4,
    color: '#22C55E',
    fontSize: 18,
  },
  sparkleBottomRight: {
    bottom: 8,
    right: 6,
    color: '#16A34A',
  },
  sparkleLeft: {
    left: -4,
    color: '#EAB308',
    fontSize: 18,
  },
  mascotCircle: {
    backgroundColor: '#DCFCE7',
    borderWidth: 2,
    borderColor: '#86EFAC',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#052e16',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  }
});
