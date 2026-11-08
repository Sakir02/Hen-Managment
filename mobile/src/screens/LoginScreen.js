import Icon2D from '../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { tokens } from '../styles/tokens';
import { useAdminData } from '../context/AdminDataContext';

export default function LoginScreen({ onSwitchToUser }) {
  const { login, staffUsers, showToast } = useAdminData();

  const [authMode, setAuthMode] = useState('password'); // 'password' | 'otp'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetContact, setResetContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!identifier.trim()) {
      showToast('Please enter your email or phone number', 'warning');
      return;
    }

    if (authMode === 'password' && !password.trim()) {
      showToast('Please enter your password', 'warning');
      return;
    }

    if (authMode === 'otp' && otpCode.length < 4) {
      showToast('Please enter a valid OTP code', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(identifier, password);
    }, 400);
  };

  const handleQuickFill = (user) => {
    setIdentifier(user.email);
    setPassword('admin1234');
    showToast(`Loaded credentials for ${user.name} (${user.role})`, 'info');
  };

  const handleSendResetLink = () => {
    if (!resetContact.trim()) {
      showToast('Enter your registered email or phone', 'warning');
      return;
    }
    setIsForgotModalOpen(false);
    showToast(`Password reset instructions sent to ${resetContact}`, 'success');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.primary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header Banner */}
          <View style={styles.brandSection}>
            <View style={styles.logoCircle}>
              <Icon2D name="bird" size={48} color="#2563EB" />
            </View>
            <Text style={styles.appName}>Hen Management</Text>
            <View style={styles.badgeRow}>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN PORTAL</Text>
              </View>
            </View>
            <Text style={styles.appTagline}>Poultry Operations, Mandi Rates & Financial Billing</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {authMode === 'password' ? 'Admin Sign In' : 'One-Time Passcode (OTP)'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {authMode === 'password'
                ? 'Enter your operational credentials to access farm ledgers.'
                : 'Enter your phone number to receive a secure login code.'}
            </Text>

            {/* Identifier input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email or Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. sakir.khan@henoperations.com"
                placeholderTextColor={tokens.colors.textMuted}
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password / OTP input */}
            {authMode === 'password' ? (
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <TouchableOpacity
                    onPress={() => setIsForgotModalOpen(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.forgotLink}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter account password"
                    placeholderTextColor={tokens.colors.textMuted}
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    activeOpacity={0.7}
                  >
                    <Icon2D name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>6-Digit OTP Code</Text>
                  <TouchableOpacity
                    onPress={() => showToast('New code sent: 482910', 'info')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.forgotLink}>Resend OTP</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  placeholder="• • • • • •"
                  placeholderTextColor={tokens.colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otpCode}
                  onChangeText={setOtpCode}
                />
              </View>
            )}

            {/* Sign In Primary Button */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.loginBtnText}>
                {isLoading ? 'Authenticating...' : authMode === 'password' ? 'Sign In to Admin Panel' : 'Verify & Enter'}
              </Text>
            </TouchableOpacity>

            {/* Mode Toggle (Password <-> OTP) */}
            <TouchableOpacity
              style={styles.switchModeBtn}
              onPress={() => {
                setAuthMode(authMode === 'password' ? 'otp' : 'password');
                setOtpCode('');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.switchModeText}>
                {authMode === 'password' ? 'Sign In with One-Time Password (OTP)' : 'Sign In with Standard Password'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Switch to User Portal Link */}
          {onSwitchToUser ? (
            <TouchableOpacity
              style={styles.userSwitchRow}
              onPress={onSwitchToUser}
              activeOpacity={0.7}
            >
              <Text style={styles.userSwitchText}>
                Field Staff? <Text style={styles.userSwitchBold}>Open User Operations Portal (v2.0 Blue & Teal)</Text>
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Bottom Modal */}
      <Modal
        visible={isForgotModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsForgotModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.forgotSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Reset Admin Password</Text>
            <Text style={styles.sheetSubtitle}>
              Enter your registered phone number or email to receive password reset instructions.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Registered email or phone"
              placeholderTextColor={tokens.colors.textMuted}
              value={resetContact}
              onChangeText={setResetContact}
            />

            <View style={styles.sheetActions}>
              <TouchableOpacity
                style={[styles.sheetBtn, styles.sheetCancelBtn]}
                onPress={() => setIsForgotModalOpen(false)}
              >
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sheetBtn, styles.sheetConfirmBtn]}
                onPress={handleSendResetLink}
              >
                <Text style={styles.sheetConfirmText}>Send Instructions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.primary,
  },
  keyboardView: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: tokens.spacing.xxl,
  },
  brandSection: {
    backgroundColor: tokens.colors.primary,
    paddingTop: tokens.spacing.xxl,
    paddingBottom: tokens.spacing.xxl + 10,
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.base,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: tokens.radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: tokens.typography.xxl,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.surface,
    letterSpacing: 0.5,
  },
  badgeRow: {
    marginTop: tokens.spacing.xs,
    marginBottom: tokens.spacing.sm,
  },
  adminBadge: {
    backgroundColor: tokens.colors.secondary,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 3,
    borderRadius: tokens.radii.pill,
  },
  adminBadgeText: {
    color: tokens.colors.surface,
    fontSize: 10,
    fontWeight: tokens.typography.bold,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: tokens.typography.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    maxWidth: 260,
  },
  card: {
    backgroundColor: tokens.colors.surface,
    marginHorizontal: tokens.spacing.base,
    marginTop: -20,
    borderRadius: tokens.radii.xl,
    padding: tokens.spacing.xl,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.float,
  },
  cardTitle: {
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.lg,
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: tokens.spacing.base,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: 6,
  },
  forgotLink: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.primary,
    fontWeight: tokens.typography.semibold,
  },
  input: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.md,
    paddingHorizontal: tokens.spacing.md,
    height: tokens.touchTarget.minHeight,
    fontSize: tokens.typography.base,
    color: tokens.colors.textPrimary,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: 0,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 18,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: 8,
    fontWeight: tokens.typography.bold,
  },
  loginBtn: {
    backgroundColor: tokens.colors.primary,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.sm,
    ...tokens.shadows.card,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: tokens.colors.surface,
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
  },
  switchModeBtn: {
    marginTop: tokens.spacing.base,
    alignItems: 'center',
    paddingVertical: tokens.spacing.xs,
  },
  switchModeText: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.medium,
  },
  demoSection: {
    marginHorizontal: tokens.spacing.base,
    marginTop: tokens.spacing.lg,
    padding: tokens.spacing.base,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  demoHeader: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.sm,
  },
  demoRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  demoChip: {
    flex: 1,
    backgroundColor: tokens.colors.primaryLight,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.xs,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
  },
  demoChipName: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  demoChipRole: {
    fontSize: 9,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  forgotSheet: {
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radii.xl,
    borderTopRightRadius: tokens.radii.xl,
    padding: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xxl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radii.full,
    alignSelf: 'center',
    marginBottom: tokens.spacing.md,
  },
  sheetTitle: {
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    lineHeight: 18,
    marginBottom: tokens.spacing.lg,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.base,
  },
  sheetBtn: {
    flex: 1,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCancelBtn: {
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  sheetCancelText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textSecondary,
  },
  sheetConfirmBtn: {
    backgroundColor: tokens.colors.primary,
  },
  sheetConfirmText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.surface,
  },
  userSwitchRow: {
    marginTop: tokens.spacing.base,
    paddingVertical: tokens.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userSwitchText: {
    fontSize: tokens.typography.xs,
    color: '#2563EB',
    textAlign: 'center',
  },
  userSwitchBold: {
    fontWeight: tokens.typography.bold,
    textDecorationLine: 'underline',
  },
});
