/**
 * SolventZ Design System — Typography Scale
 * PRD §7.2 Typography
 * Font Family: Inter (primary), System Default (fallback)
 */
import { TextStyle, Platform } from 'react-native';

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
    color: '#1A1A2E',
    lineHeight: 40,
  },
  screenTitle: {
    fontFamily,
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A2E',
    lineHeight: 32,
  },
  sectionHeading: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    lineHeight: 26,
  },
  body: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    color: '#555555',
    lineHeight: 22,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    color: '#888888',
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
    color: '#555555',
    lineHeight: 20,
  },
};
