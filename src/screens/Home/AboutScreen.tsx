import React, { useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Logo } from '../../components/Logo';

type AboutScreenProps = NativeStackScreenProps<any, 'About'>;

/**
 * About Us Screen
 * Displays company information, mission, portfolio, and contact details
 */
export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: 'About SolventZ',
    });
  }, [navigation]);

  const handleContactCall = () => {
    Linking.openURL('tel:+923001234567');
  };

  const handleContactEmail = () => {
    Linking.openURL('mailto:info@solventz.pk');
  };

  const handleContactWhatsApp = () => {
    Linking.openURL('https://wa.me/923001234567');
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://solventz.pk');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <Logo size={100} />
        </View>
        <Text style={styles.heroSubtitle}>Powering a Sustainable Future</Text>
      </View>

      {/* Mission Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionContent}>
          Solventz is a leading provider of innovative and reliable energy solutions, committed to
          powering a sustainable future. Established in 2017, the company has successfully
          delivered over 200 solar projects across Punjab, including notable installations such as
          a 50 kW system for Daily Pakistan. With a strong focus on quality, performance, and
          customer satisfaction, Solventz ensures each project meets the highest standards of
          efficiency and durability. By collaborating with globally recognized brands like Inverex
          and Jolywood, the company brings advanced technology and dependable energy solutions to
          its clients.
        </Text>
      </View>

      {/* Portfolio Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Portfolio</Text>
        <View style={styles.statsContainer}>
          <PortfolioStat number="200+" label="Projects Completed" />
          <PortfolioStat number="2017" label="Established" />
          <PortfolioStat number="50kW" label="Largest System" />
        </View>
      </View>

      {/* Key Values Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Values</Text>
        <ValueCard icon="check-circle" title="Quality" description="Highest standards of efficiency and durability" />
        <ValueCard icon="handshake" title="Customer Focus" description="Dedicated to customer satisfaction" />
        <ValueCard icon="leaf" title="Sustainability" description="Committed to renewable energy solutions" />
        <ValueCard icon="star" title="Innovation" description="Advanced technology and expertise" />
      </View>

      {/* Brands Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Partners</Text>
        <Text style={styles.brandText}>We collaborate with globally recognized brands:</Text>
        <View style={styles.brandContainer}>
          <BrandBadge name="Inverex" />
          <BrandBadge name="Jolywood" />
          <BrandBadge name="Sungrow" />
          <BrandBadge name="Canadian Solar" />
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        <ContactButton
          icon="phone"
          title="Call Us"
          subtitle="+92 300 1234567"
          onPress={handleContactCall}
        />
        <ContactButton
          icon="envelope"
          title="Email Us"
          subtitle="info@solventz.pk"
          onPress={handleContactEmail}
        />
        <ContactButton
          icon="whatsapp"
          title="WhatsApp"
          subtitle="Chat with us on WhatsApp"
          onPress={handleContactWhatsApp}
        />
        <ContactButton
          icon="globe"
          title="Visit Website"
          subtitle="www.solventz.pk"
          onPress={handleVisitWebsite}
        />
      </View>

      {/* Certifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        <View style={styles.certificationContainer}>
          <CertificationBadge icon="shield-alt" text="ISO Certified" />
          <CertificationBadge icon="certificate" text="Licensed" />
          <CertificationBadge icon="award" text="Award Winning" />
        </View>
      </View>

      {/* Social Media Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Follow Us</Text>
        <View style={styles.socialContainer}>
          <SocialButton icon="facebook" />
          <SocialButton icon="instagram" />
          <SocialButton icon="linkedin" />
          <SocialButton icon="twitter" />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 SolventZ. All rights reserved.</Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>•</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

/**
 * Portfolio statistics component
 */
const PortfolioStat: React.FC<{ number: string; label: string }> = ({ number, label }) => (
  <View style={styles.statBox}>
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

/**
 * Value card component
 */
const ValueCard: React.FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <View style={styles.valueCard}>
    <MaterialIcons name={icon as any} size={24} color={colors.primary} />
    <View style={styles.valueContent}>
      <Text style={styles.valueTitle}>{title}</Text>
      <Text style={styles.valueDescription}>{description}</Text>
    </View>
  </View>
);

/**
 * Brand badge component
 */
const BrandBadge: React.FC<{ name: string }> = ({ name }) => (
  <View style={styles.brandBadge}>
    <Text style={styles.brandBadgeText}>{name}</Text>
  </View>
);

/**
 * Contact button component
 */
const ContactButton: React.FC<{ icon: string; title: string; subtitle: string; onPress: () => void }> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => (
  <TouchableOpacity style={styles.contactButton} onPress={onPress}>
    <FontAwesome5 name={icon} size={20} color={colors.primary} />
    <View style={styles.contactContent}>
      <Text style={styles.contactTitle}>{title}</Text>
      <Text style={styles.contactSubtitle}>{subtitle}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
  </TouchableOpacity>
);

/**
 * Certification badge component
 */
const CertificationBadge: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={styles.certBadge}>
    <FontAwesome5 name={icon} size={20} color={colors.primary} />
    <Text style={styles.certText}>{text}</Text>
  </View>
);

/**
 * Social media button component
 */
const SocialButton: React.FC<{ icon: string }> = ({ icon }) => (
  <TouchableOpacity style={styles.socialButton}>
    <FontAwesome5 name={icon} size={24} color={colors.primary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.primary,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    ...Typography.display,
    color: colors.secondary,
    marginBottom: 8,
  },
  heroSubtitle: {
    ...Typography.sectionHeading,
    color: colors.secondary,
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
  sectionTitle: {
    ...Typography.sectionHeading,
    color: colors.secondary,
    marginBottom: 16,
  },
  sectionContent: {
    ...Typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.gray100,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.sectionHeading,
    color: colors.primaryDark,
    marginBottom: 8,
  },
  statLabel: {
    ...Typography.caption,
    color: colors.text,
    textAlign: 'center',
  },
  valueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  valueContent: {
    flex: 1,
    marginLeft: 16,
  },
  valueTitle: {
    ...Typography.button,
    color: colors.secondary,
    marginBottom: 4,
  },
  valueDescription: {
    ...Typography.caption,
    color: colors.textSecondary,
  },
  brandContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  brandText: {
    ...Typography.body,
    color: colors.text,
    marginBottom: 12,
  },
  brandBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  brandBadgeText: {
    ...Typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.gray100,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  contactTitle: {
    ...Typography.button,
    color: colors.secondary,
    marginBottom: 4,
  },
  contactSubtitle: {
    ...Typography.caption,
    color: colors.textSecondary,
  },
  certificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  certBadge: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  certText: {
    ...Typography.caption,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    backgroundColor: colors.surface,
  },
  footerText: {
    ...Typography.caption,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  footerLink: {
    ...Typography.caption,
    color: colors.primaryDark,
  },
  footerDivider: {
    color: colors.textSecondary,
  },
});
