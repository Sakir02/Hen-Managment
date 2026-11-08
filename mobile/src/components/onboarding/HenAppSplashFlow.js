import Icon2D from '../common/Icon2D';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Easing,
} from 'react-native';
import { userTokens } from '../../user/styles/userTokens';

const { height, width } = Dimensions.get('window');

/**
 * JVSplashFlow
 * Implements the JV - Hen Management brand splash & quick welcome flow:
 * - Brand: JV (visual brand) & Hen Management (product name)
 * - Color tokens: Primary Blue #2563EB, Secondary Teal #0D9488, Slate #F8FAFC
 * - Animation duration: 800-1200 ms (configured at 1000 ms)
 */
export default function HenAppSplashFlow({ onFinish }) {
  const [step, setStep] = useState(1); // 1: Splash (1000ms) -> 2: Welcome Ready

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const sheetTranslateY = useRef(new Animated.Value(height * 0.5)).current;

  useEffect(() => {
    // 1. Fade & spring in JV emblem and Hen Management title
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 45,
        useNativeDriver: true,
      })
    ]).start();

    // 2. Transition from Splash to Welcome Sheet after 1000 ms (Agreed 800-1200ms)
    const timer = setTimeout(() => {
      setStep(2);
      Animated.spring(sheetTranslateY, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={userTokens.colors.primary} />

      {/* Screen 1: Splash Canvas */}
      <View style={styles.splashBackground}>
        {/* Soft radial cloud accents */}
        <View style={styles.softCircleTopRight} />
        <View style={styles.softCircleLeft} />

        {/* Center JV Brand Content */}
        <Animated.View
          style={[
            styles.centerContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: logoScale }],
            }
          ]}
        >
          {/* JV Monogram Emblem Badge */}
          <View style={styles.jvEmblemBadge}>
            <View style={styles.jvInnerCircle}>
              <Text style={styles.jvBrandText}>JV</Text>
              <Icon2D name="bird" size={48} color="#2563EB" />
            </View>
          </View>

          {/* Product Name */}
          <Text style={styles.brandTitle}>Hen Management</Text>

          {/* Subtitle / Product Badge */}
          <View style={styles.brandPill}>
            <Text style={styles.brandPillText}>POULTRY ENTERPRISE LEDGER</Text>
          </View>

          {/* Tagline */}
          <Text style={styles.brandTagline}>
            Track Customers • Combined Batch Intake • Daily Settlement
          </Text>
        </Animated.View>

        {/* Decorative Modern Wave Base */}
        <View style={styles.footerDecorative}>
          <View style={styles.decorativeStripeTeal} />
          <Text style={styles.versionText}>v2.0 • Android Edition</Text>
        </View>
      </View>

      {/* Screen 2: Slide-up Welcome Sheet */}
      {step === 2 && (
        <View style={styles.darkOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onFinish}
          />

          <Animated.View
            style={[
              styles.welcomeSheet,
              { transform: [{ translateY: sheetTranslateY }] }
            ]}
          >
            {/* Top Drag Handle */}
            <View style={styles.sheetHandle} />

            {/* Emblem in Circle */}
            <View style={styles.welcomeEmblemWrap}>
              <View style={styles.welcomeJvBadge}>
                <Text style={styles.welcomeJvText}>JV</Text>
              </View>
              <View style={styles.welcomeTealDot} />
            </View>

            {/* Title */}
            <Text style={styles.welcomeTitle}>Welcome to JV Hen Management</Text>

            {/* Subtitle */}
            <Text style={styles.welcomeSubtitle}>
              Fast customer ledger management, combined Marga & Margee batch weighing, and live payment receipts.
            </Text>

            {/* Get Started Button (Primary Blue #2563EB) */}
            <TouchableOpacity
              style={styles.getStartedBtn}
              onPress={onFinish}
              activeOpacity={0.85}
            >
              <Text style={styles.getStartedText}>Open Operations Portal →</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* Skip Button */}
      <SafeAreaView style={styles.skipContainer}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={onFinish}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip ›</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF6EE',
  },
  splashBackground: {
    flex: 1,
    backgroundColor: '#EDF7EE',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  softCircleTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#DCF3E2',
    opacity: 0.6,
  },
  softCircleLeft: {
    position: 'absolute',
    top: height * 0.28,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#DBEAFE',
    opacity: 0.6,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.20,
    zIndex: 2,
    paddingHorizontal: 24,
  },
  jvEmblemBadge: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: userTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: userTokens.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#93C5FD',
  },
  jvInnerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  jvBrandText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  roosterIcon: {
    fontSize: 16,
    marginTop: -4,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginTop: 20,
    marginBottom: 6,
  },
  brandPill: {
    backgroundColor: userTokens.colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  brandPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: userTokens.colors.secondary,
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: 0.2,
    maxWidth: 290,
    lineHeight: 20,
  },
  footerDecorative: {
    width: '100%',
    paddingBottom: 32,
    alignItems: 'center',
    zIndex: 1,
  },
  decorativeStripeTeal: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: userTokens.colors.secondary,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // Step 2: Dark Overlay
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.70)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 10,
  },

  // Slide-up Welcome Sheet
  welcomeSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
    zIndex: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  welcomeEmblemWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  welcomeJvBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: userTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  welcomeJvText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  welcomeTealDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: userTokens.colors.secondary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    maxWidth: 300,
  },
  getStartedBtn: {
    width: '100%',
    height: 52,
    backgroundColor: userTokens.colors.primary,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: userTokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Skip Control
  skipContainer: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 30,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skipText: {
    fontSize: 12,
    fontWeight: '600',
    color: userTokens.colors.primary,
  },
});
