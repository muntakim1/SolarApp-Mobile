import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { supportService } from '../../services/supportService';

const CATEGORIES = [
  { key: 'product_defect', label: 'Product Defect' },
  { key: 'installation_issue', label: 'Installation Issue' },
  { key: 'billing', label: 'Billing Dispute' },
  { key: 'general', label: 'General Query' },
];

export const SupportTicketScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [category, setCategory] = useState('general');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim()) { Alert.alert('Error', 'Subject is required.'); return; }
    if (!description.trim()) { Alert.alert('Error', 'Description is required.'); return; }

    setLoading(true);
    try {
      await supportService.submitTicket({ category, subject, description });
      Alert.alert('Ticket Submitted!', 'Your support ticket has been created. Our team will respond within 48 hours.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Submit a Support Ticket</Text>
      <Text style={styles.subtitle}>Describe your issue and our team will get back to you.</Text>

      <Text style={styles.label}>Category</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.chip, category === cat.key && styles.chipActive]}
            onPress={() => setCategory(cat.key)}
          >
            <Text style={[styles.chipText, category === cat.key && styles.chipTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Subject</Text>
      <TextInput style={styles.input} placeholder="Brief summary of your issue" maxLength={100} value={subject} onChangeText={setSubject} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
        placeholder="Describe your issue in detail..."
        multiline
        maxLength={1000}
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.charCount}>{description.length}/1000</Text>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitBtnText}>{loading ? 'Submitting...' : 'Submit Ticket'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F9F9F9' },
  chipActive: { borderColor: '#FF5A5A', backgroundColor: '#FFF5F5' },
  chipText: { fontSize: 13, color: '#555' },
  chipTextActive: { color: '#FF5A5A', fontWeight: '600' },
  charCount: { fontSize: 11, color: '#aaa', textAlign: 'right', marginTop: 4 },
  submitBtn: { backgroundColor: '#FF5A5A', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 28 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
