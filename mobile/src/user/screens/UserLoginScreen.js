import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { userTokens } from '../styles/userTokens';
import { useAdminData } from '../../context/AdminDataContext';
import Icon2D from '../../components/common/Icon2D';

export default function UserLoginScreen({ onSwitchToAdmin }) {
  const { login, staffUsers, showToast } = useAdminData();

  const [authMode, setAuthMode] = useState('password'); // 'password' | 'otp'
  const [phone, setPhone] = useState('+91 97123 45672');
  const [password, setPassword] = useState('field@123');
  const [otpCode, setOtpCode] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!phone.trim()) {
      showToast('Please enter your registered mobile number.', 'error');
      return;
    }

    if (authMode === 'password' && !password.trim()) {
      showToast('Please enter your password.', 'error');
      return;
    }

    if (authMode === 'otp' && otpCode.length < 4) {
      showToast('Please enter a valid 4 to 6 digit OTP.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(phone, password);
      setIsLoading(false);
    }, 400);
  };

  const handleSelectQuickStaff = (staff) => {
    setPhone(staff.phone);
    showToast(`Loaded ${staff.name} (${staff.role}) credentials`, 'info');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <View style={styles.headerBox}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoJvText}>JV</Text>
            </View>
            <Text style={styles.brandTitle}>Hen Management</Text>
            <Text style={styles.brandSubtitle}>Field Operations & Weigh-in Portal</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeaderTitle}>Operator Sign In</Text>
            <Text style={styles.cardHeaderSub}>
              Enter credentials to access customer intake and weighing ledgers
            </Text>

            {/* Registered Mobile Phone Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                placeholderTextColor={userTokens.colors.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Password or OTP Flow */}
            {authMode === 'password' ? (
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <TouchableOpacity
                    onPress={() => setIsForgotModalOpen(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.forgotLink}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter password"
                    placeholderTextColor={userTokens.colors.textMuted}
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    activeOpacity={0.7}
                  >
                    <Icon2D name={isPasswordVisible ? 'eye-off' : 'eye'} size={18} color={userTokens.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>6-Digit OTP Code</Text>
                  <TouchableOpacity
                    onPress={() => showToast('Verification code: 391820', 'info')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.forgotLink}>Resend Code</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  placeholder="• • • • • •"
                  placeholderTextColor={userTokens.colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otpCode}
                  onChangeText={setOtpCode}
                />
              </View>
            )}

            {/* Primary Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.loginBtnText}>
                {isLoading ? 'Verifying...' : authMode === 'password' ? 'Sign In to Operations' : 'Verify & Open Portal'}
              </Text>
            </TouchableOpacity>

            {/* Mode Switcher */}
            <TouchableOpacity
              style={styles.switchModeBtn}
              onPress={() => {
                setAuthMode(authMode === 'password' ? 'otp' : 'password');
                setOtpCode('');
              }}
              activeOpacity={0.7}
            >
              <Icon2D name={authMode === 'password' ? 'phone' : 'lock'} size={14} color={userTokens.colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.switchModeText}>
                {authMode === 'password' ? 'Sign In with Phone OTP' : 'Sign In with Password'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Switch to Admin Portal Link */}
          {onSwitchToAdmin ? (
            <TouchableOpacity
              style={styles.adminSwitchRow}
              onPress={onSwitchToAdmin}
              activeOpacity={0.7}
            >
              <Icon2D name="shield" size={14} color={userTokens.colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.adminSwitchText}>
                Administrator? <Text style={styles.adminSwitchBold}>Open Admin Management Portal</Text>
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={isForgotModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsForgotModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Password Recovery</Text>
            <Text style={styles.modalDesc}>
              Enter your registered mobile number. A reset PIN will be dispatched to your SMS inbox.
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="+91 98765 43210"
              placeholderTextColor={userTokens.colors.textMuted}
              keyboardType="phone-pad"
              value={forgotPhone}
              onChangeText={setForgotPhone}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsForgotModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={() => {
                  setIsForgotModalOpen(false);
                  showToast('Password reset link sent to your mobile phone.', 'success');
                }}
              >
                <Text style={styles.modalSubmitText}>Send Code</Text>
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
    backgroundColor: userTokens.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: userTokens.spacing.base,
    justifyContent: 'center',
    minHeight: '100%',
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: userTokens.spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: userTokens.radii.lg,
    backgroundColor: userTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: userTokens.spacing.md,
    ...userTokens.shadows.card,
  },
  logoJvText: {
    color: '#FFFFFF',
    fontWeight: userTokens.typography.bold,
    fontSize: 24,
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: userTokens.typography.xl,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  brandSubtitle: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: userTokens.colors.surface,
    padding: userTokens.spacing.xl,
    borderRadius: userTokens.radii.xl,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.card,
  },
  cardHeaderTitle: {
    fontSize: userTokens.typography.lg,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  cardHeaderSub: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
    marginBottom: userTokens.spacing.lg,
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: userTokens.spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: userTokens.spacing.xs,
  },
  fieldLabel: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
    marginBottom: userTokens.spacing.xs,
  },
  forgotLink: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.primary,
  },
  input: {
    height: 48,
    backgroundColor: userTokens.colors.background,
    borderRadius: userTokens.radii.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    paddingHorizontal: userTokens.spacing.md,
    fontSize: userTokens.typography.sm,
    color: userTokens.colors.textPrimary,
  },
  passwordRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    height: 48,
    justifyContent: 'center',
  },
  otpInput: {
    textAlign: 'center',
    fontSize: userTokens.typography.lg,
    letterSpacing: 8,
    fontWeight: userTokens.typography.bold,
  },
  loginBtn: {
    height: 48,
    backgroundColor: userTokens.colors.primary,
    borderRadius: userTokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: userTokens.spacing.sm,
    ...userTokens.shadows.card,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: userTokens.colors.surface,
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
  },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: userTokens.spacing.base,
    paddingVertical: userTokens.spacing.xs,
  },
  switchModeText: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.primary,
    fontWeight: userTokens.typography.semibold,
  },
  adminSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: userTokens.spacing.xl,
    padding: userTokens.spacing.sm,
  },
  adminSwitchText: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
  },
  adminSwitchBold: {
    color: userTokens.colors.primary,
    fontWeight: userTokens.typography.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: userTokens.spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.lg,
    padding: userTokens.spacing.xl,
    ...userTokens.shadows.float,
  },
  modalTitle: {
    fontSize: userTokens.typography.md,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  modalDesc: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: 4,
    marginBottom: userTokens.spacing.md,
    lineHeight: 18,
  },
  modalInput: {
    height: 48,
    backgroundColor: userTokens.colors.background,
    borderRadius: userTokens.radii.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    paddingHorizontal: userTokens.spacing.md,
    fontSize: userTokens.typography.sm,
    color: userTokens.colors.textPrimary,
    marginBottom: userTokens.spacing.lg,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.md,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: userTokens.radii.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textSecondary,
  },
  modalSubmitBtn: {
    flex: 1,
    height: 44,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.surface,
  }
});
