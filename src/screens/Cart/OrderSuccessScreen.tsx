import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { CartStackParamList } from '../../navigation/CartStack';

type Props = {
  navigation: any;
  route: RouteProp<CartStackParamList, 'OrderSuccess'>;
};

export const OrderSuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderNumber } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <FontAwesome name="check" size={48} color="#fff" />
      </View>
      <Text style={styles.title}>Order Placed!</Text>
      <Text style={styles.subtitle}>Your order has been placed successfully.</Text>
      <View style={styles.orderCard}>
        <Text style={styles.orderLabel}>Order Number</Text>
        <Text style={styles.orderNumber}>{orderNumber}</Text>
      </View>
      <Text style={styles.info}>You will receive a confirmation notification shortly. Track your order status from the Orders tab.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 30 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#34C759', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#555', marginBottom: 24 },
  orderCard: { backgroundColor: '#F5F5F5', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  orderLabel: { fontSize: 12, color: '#888', marginBottom: 4, textTransform: 'uppercase', fontWeight: '600' },
  orderNumber: { fontSize: 20, fontWeight: 'bold', color: '#FF5A5A' },
  info: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 20, marginBottom: 30 },
  button: { backgroundColor: '#FF5A5A', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
