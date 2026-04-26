import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { supabase } from '../../services/supabaseClient';
import { clearAuth } from '../../store/slices/authSlice';
import { colors } from '../../constants/colors';

interface UserProfile {
  full_name: string;
  phone: string;
  city: string;
}

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState<UserProfile>({ full_name: '', phone: '', city: '' });
  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState<UserProfile>({ full_name: '', phone: '', city: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user?.id]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('users')
      .select('full_name, phone, city')
      .eq('id', user!.id)
      .single();
    if (data) setProfile(data as UserProfile);
  };

  const openEdit = () => {
    setEditData({ ...profile });
    setEditVisible(true);
  };

  const handleSave = async () => {
    if (!editData.full_name.trim()) {
      Alert.alert('Validation', 'Full name is required.');
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('users')
      .update({
        full_name: editData.full_name.trim(),
        phone: editData.phone.trim(),
        city: editData.city.trim(),
      })
      .eq('id', user!.id);
    setSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setProfile({ ...editData });
      setEditVisible(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          dispatch(clearAuth());
        },
      },
    ]);
  };

  const menuItems = [
    { icon: 'clipboard', label: 'Request a Survey', screen: 'SurveyRequest', color: colors.secondary },
    { icon: 'life-ring', label: 'Submit Support Ticket', screen: 'SupportTicket', color: colors.primary },
    { icon: 'headphones', label: 'Help & Support', screen: 'Helpline', color: colors.success },
    { icon: 'info-circle', label: 'About SolventZ', screen: 'About', color: colors.accent },
    { icon: 'shopping-bag', label: 'Purchase History', screen: 'PurchaseHistory', color: '#007AFF' },
    { icon: 'ticket', label: 'Support History', screen: 'SupportHistory', color: colors.warning },
    { icon: 'file-text', label: 'Survey History', screen: 'SurveyHistory', color: '#5AC8FA' },
    { icon: 'bell', label: 'Notification Settings', screen: 'NotificationSettings', color: '#17C0EB' },
  ];

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* User Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <FontAwesome name="user" size={32} color={colors.secondary} />
          </View>
          <Text style={styles.userName}>{profile.full_name || user?.email || 'Guest'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {profile.phone ? <Text style={styles.userMeta}>{profile.phone}</Text> : null}
          {profile.city ? <Text style={styles.userMeta}>{profile.city}</Text> : null}
          <TouchableOpacity style={styles.editBtn} onPress={openEdit}>
            <FontAwesome name="pencil" size={12} color={colors.primary} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <FontAwesome name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <FontAwesome name="chevron-right" size={12} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={18} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>SolventZ v1.0.0</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <FontAwesome name="times" size={20} color={colors.gray500} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.fieldInput}
              value={editData.full_name}
              onChangeText={(v) => setEditData((p) => ({ ...p, full_name: v }))}
              placeholder="Your full name"
            />

            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput
              style={styles.fieldInput}
              value={editData.phone}
              onChangeText={(v) => setEditData((p) => ({ ...p, phone: v }))}
              placeholder="+92 300 0000000"
              keyboardType="phone-pad"
            />

            <Text style={styles.fieldLabel}>City / Region</Text>
            <TextInput
              style={styles.fieldInput}
              value={editData.city}
              onChangeText={(v) => setEditData((p) => ({ ...p, city: v }))}
              placeholder="Lahore"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 40 },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: { fontSize: 18, fontWeight: 'bold', color: colors.secondary },
  userEmail: { fontSize: 13, color: 'rgba(17,17,17,0.8)', marginTop: 2 },
  userMeta: { fontSize: 13, color: 'rgba(17,17,17,0.7)', marginTop: 2 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  editBtnText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  menuSection: {
    backgroundColor: colors.surface,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: { flex: 1, fontSize: 15, color: colors.dark, fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FFD4D4',
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  logoutText: { marginLeft: 10, fontSize: 15, color: colors.error, fontWeight: '600' },
  version: { textAlign: 'center', fontSize: 12, color: '#ccc', marginTop: 20 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.dark },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.gray700, marginBottom: 6 },
  fieldInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 14,
    color: colors.dark,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  saveBtnText: { color: colors.secondary, fontSize: 16, fontWeight: '600' },
});
