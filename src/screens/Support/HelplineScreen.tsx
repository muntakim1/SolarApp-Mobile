import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const FAQ_ITEMS = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3-7 business days depending on your location. Express delivery is available for select areas.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), Bank Transfer, and Online Payment through our secure gateway.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled while in "Pending" status. Once processing begins, cancellation is not available.' },
  { q: 'Do you offer installation services?', a: 'Yes! Submit a survey request through the app and our team will schedule a site visit and provide a full project quote.' },
  { q: 'What is the warranty on solar panels?', a: 'Warranty varies by brand. Most panels carry a 10-25 year performance warranty. Check individual product pages for details.' },
];

export const HelplineScreen: React.FC = () => {
  const [expandedIdx, setExpandedIdx] = React.useState<number | null>(null);

  const handleCall = () => Linking.openURL('tel:+923001234567');
  const handleWhatsApp = () => Linking.openURL('https://wa.me/923001234567?text=Hi%20SolventZ%2C%20I%20need%20help');
  const handleEmail = () => Linking.openURL('mailto:support@solventz.com');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Help & Support</Text>
      <Text style={styles.subtitle}>We're here to help. Reach out through any channel below.</Text>

      {/* Contact Cards */}
      <View style={styles.contactRow}>
        <TouchableOpacity style={styles.contactCard} onPress={handleCall}>
          <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
            <FontAwesome name="phone" size={22} color="#34C759" />
          </View>
          <Text style={styles.contactLabel}>Call Us</Text>
          <Text style={styles.contactValue}>+92 300 1234567</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp}>
          <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
            <FontAwesome name="whatsapp" size={24} color="#25D366" />
          </View>
          <Text style={styles.contactLabel}>WhatsApp</Text>
          <Text style={styles.contactValue}>Chat with us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
          <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
            <FontAwesome name="envelope" size={20} color="#FF8B5A" />
          </View>
          <Text style={styles.contactLabel}>Email</Text>
          <Text style={styles.contactValue}>support@</Text>
        </TouchableOpacity>
      </View>

      {/* Operating Hours */}
      <View style={styles.hoursCard}>
        <FontAwesome name="clock-o" size={18} color="#FF5A5A" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.hoursTitle}>Operating Hours</Text>
          <Text style={styles.hoursText}>Mon - Sat: 9:00 AM - 6:00 PM</Text>
          <Text style={styles.hoursText}>Sun: Closed</Text>
        </View>
      </View>

      {/* FAQ */}
      <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
      {FAQ_ITEMS.map((faq, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.faqItem}
          onPress={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          activeOpacity={0.7}
        >
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>{faq.q}</Text>
            <FontAwesome name={expandedIdx === idx ? 'chevron-up' : 'chevron-down'} size={12} color="#888" />
          </View>
          {expandedIdx === idx && <Text style={styles.faqAnswer}>{faq.a}</Text>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4, marginBottom: 20 },
  contactRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  contactCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  contactLabel: { fontSize: 13, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 2 },
  contactValue: { fontSize: 11, color: '#888' },
  hoursCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  hoursTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 4 },
  hoursText: { fontSize: 13, color: '#555' },
  faqTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 12 },
  faqItem: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', flex: 1, marginRight: 10 },
  faqAnswer: { fontSize: 13, color: '#555', lineHeight: 20, marginTop: 10 },
});
