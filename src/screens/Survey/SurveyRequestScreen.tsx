import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { surveyService } from '../../services/surveyService';

const PROPERTY_TYPES = ['residential', 'commercial', 'industrial', 'agricultural'];

export const SurveyRequestScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Personal Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2: Property Info
  const [propertyType, setPropertyType] = useState('residential');
  const [address, setAddress] = useState('');
  const [monthlyBill, setMonthlyBill] = useState('');

  // Step 3: Schedule
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');

  const validateStep1 = () => {
    if (!fullName || fullName.length < 3) { Alert.alert('Error', 'Full name must be at least 3 characters.'); return false; }
    if (!phone) { Alert.alert('Error', 'Phone number is required.'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!address) { Alert.alert('Error', 'Property address is required.'); return false; }
    if (!monthlyBill || parseFloat(monthlyBill) < 1000) { Alert.alert('Error', 'Monthly bill must be at least PKR 1,000.'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!preferredDate) { Alert.alert('Error', 'Please enter a preferred survey date (YYYY-MM-DD).'); return; }
    setLoading(true);
    try {
      await surveyService.submitSurvey({
        full_name: fullName,
        phone,
        property_type: propertyType,
        address,
        monthly_bill: parseFloat(monthlyBill),
        preferred_date: preferredDate,
        notes: notes || undefined,
      });
      Alert.alert('Success!', 'Your survey request has been submitted. We will contact you shortly.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit survey.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Progress Indicator */}
      <View style={styles.progressRow}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={styles.progressItem}>
            <View style={[styles.progressDot, s <= step && styles.progressDotActive]} />
            <Text style={[styles.progressLabel, s <= step && styles.progressLabelActive]}>
              {s === 1 ? 'Personal' : s === 2 ? 'Property' : 'Schedule'}
            </Text>
          </View>
        ))}
      </View>

      {step === 1 && (
        <View>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="Enter your full name" value={fullName} onChangeText={setFullName} />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} placeholder="+92 3XX XXXXXXX" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <TouchableOpacity style={styles.nextBtn} onPress={() => validateStep1() && setStep(2)}>
            <Text style={styles.nextBtnText}>Next →</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <Text style={styles.label}>Property Type</Text>
          <View style={styles.chipRow}>
            {PROPERTY_TYPES.map((pt) => (
              <TouchableOpacity
                key={pt}
                style={[styles.chip, propertyType === pt && styles.chipActive]}
                onPress={() => setPropertyType(pt)}
              >
                <Text style={[styles.chipText, propertyType === pt && styles.chipTextActive]}>
                  {pt.charAt(0).toUpperCase() + pt.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Property Address</Text>
          <TextInput style={styles.input} placeholder="Full address including city" value={address} onChangeText={setAddress} />
          <Text style={styles.label}>Monthly Electricity Bill (PKR)</Text>
          <TextInput style={styles.input} placeholder="e.g. 15000" keyboardType="numeric" value={monthlyBill} onChangeText={setMonthlyBill} />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={() => validateStep2() && setStep(3)}>
              <Text style={styles.nextBtnText}>Next →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={styles.sectionTitle}>Schedule Survey</Text>
          <Text style={styles.label}>Preferred Survey Date</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={preferredDate} onChangeText={setPreferredDate} />
          <Text style={styles.label}>Additional Notes (optional)</Text>
          <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Any special instructions..." multiline maxLength={500} value={notes} onChangeText={setNotes} />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.submitBtnText}>{loading ? 'Submitting...' : 'Submit Request'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  progressRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24, gap: 20 },
  progressItem: { alignItems: 'center' },
  progressDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E0E0E0', marginBottom: 6 },
  progressDotActive: { backgroundColor: '#FF5A5A' },
  progressLabel: { fontSize: 11, color: '#888' },
  progressLabelActive: { color: '#FF5A5A', fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  input: { height: 48, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 15, fontSize: 15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F9F9F9' },
  chipActive: { borderColor: '#FF5A5A', backgroundColor: '#FFF5F5' },
  chipText: { fontSize: 13, color: '#555' },
  chipTextActive: { color: '#FF5A5A', fontWeight: '600' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  nextBtn: { flex: 1, backgroundColor: '#FF5A5A', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backBtn: { flex: 1, borderWidth: 1, borderColor: '#E0E0E0', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  backBtnText: { color: '#555', fontSize: 16, fontWeight: '600' },
  submitBtn: { flex: 1, backgroundColor: '#34C759', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
