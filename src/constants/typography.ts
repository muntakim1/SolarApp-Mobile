/**
 * SolventZ Design System — Typography Scale
 * PRD §7.2 Typography
 * Font Family: Inter (primary), System Default (fallback)
 */
import { TextStyle, Platform } from 'react-native';
import { colors } from './colors';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const Typography: Record<string, TextStyle> = {
  display: {
    fontFamily,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 40,
  },
  screenTitle: {
    fontFamily,
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 32,
  },
  sectionHeading: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 26,
  },
  body: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    color: colors.gray500,
    lineHeight: 18,
  },
  button: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  label: {
    fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    lineHeight: 20,
  },
};

