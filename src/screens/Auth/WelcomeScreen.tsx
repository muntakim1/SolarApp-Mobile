import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

import { Logo } from '../../components/Logo';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Logo size={140} />
        <Text style={styles.subtitle}>Solar Solutions Platform</Text>
        <Text style={styles.tagline}>
          Pakistan's trusted partner for solar energy — panels, inverters, batteries and beyond.
        </Text>
      </View>


      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 28,
  },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  subtitle: { ...Typography.sectionHeading, color: colors.secondary, marginTop: 24, marginBottom: 16 },

  tagline: {
    ...Typography.body,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  actions: { gap: 12 },
  primaryButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { ...Typography.button, color: '#fff', fontSize: 16 },
  secondaryButton: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryButtonText: { ...Typography.button, color: colors.primary, fontSize: 16 },
});
