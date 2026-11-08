export const tokens = {
  colors: {
    primary: '#2563EB',        // Approved JV Brand Blue
    primaryLight: '#DBEAFE',   // Light Blue - Active badges, selected states
    primaryHover: '#1D4ED8',
    secondary: '#0D9488',      // Secondary Teal - Billing, Payment, Mandi Action
    secondaryLight: '#CCFBF1', // Soft Teal
    secondaryHover: '#0F766E',
    background: '#F8FAFC',     // Approved JV Light Canvas
    surface: '#FFFFFF',        // Pure White Cards & Modals
    textPrimary: '#0F172A',    // Dark Slate
    textSecondary: '#64748B',  // Slate Gray
    textMuted: '#94A3B8',      // Light Slate
    border: '#DBEAFE',         // Approved JV Soft Blue Border
    borderFocus: '#2563EB',    // Focus Blue
    success: '#16A34A',        // Green - Settled / Paid
    successLight: '#DCFCE7',
    warning: '#F59E0B',        // Amber - Pending Due
    warningLight: '#FEF3C7',
    error: '#DC2626',          // Red
    errorLight: '#FEE2E2',
    margaBadge: '#2563EB',     // Blue for Marga (Male)
    margeeBadge: '#0D9488',    // Teal for Margee (Female)
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radii: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    pill: 24,
    full: 9999,
  },
  typography: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    display: 28,
    bold: '700',
    semibold: '600',
    medium: '500',
    regular: '400',
  },
  touchTarget: {
    minHeight: 48,
    minWidth: 48,
  },
  shadows: {
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    float: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
    },
    nav: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 8,
    }
  }
};
