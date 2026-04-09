import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { supabase } from '../../services/supabaseClient';
import { clearAuth } from '../../store/slices/authSlice';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

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
    { icon: 'clipboard', label: 'Request a Survey', screen: 'SurveyRequest', color: '#FF8B5A' },
    { icon: 'life-ring', label: 'Submit Support Ticket', screen: 'SupportTicket', color: '#FF5A5A' },
    { icon: 'headphones', label: 'Help & Support', screen: 'Helpline', color: '#34C759' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* User Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <FontAwesome name="user" size={32} color="#fff" />
        </View>
        <Text style={styles.userName}>{user?.email || 'Guest'}</Text>
        <Text style={styles.userId}>ID: {user?.id?.slice(0, 8) || 'N/A'}</Text>
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
        <FontAwesome name="sign-out" size={18} color="#FF3B30" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>SolventZ v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { paddingBottom: 40 },
  header: { backgroundColor: '#FF5A5A', paddingTop: 50, paddingBottom: 30, alignItems: 'center' },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  userId: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  menuSection: { backgroundColor: '#fff', marginTop: 16, marginHorizontal: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, color: '#1A1A2E', fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, marginHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#FFD4D4', borderRadius: 10, backgroundColor: '#fff' },
  logoutText: { marginLeft: 10, fontSize: 15, color: '#FF3B30', fontWeight: '600' },
  version: { textAlign: 'center', fontSize: 12, color: '#ccc', marginTop: 20 },
});
