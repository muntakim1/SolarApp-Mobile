import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useCartStore } from '../../store/cartStore';
import { orderService } from '../../services/orderService';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const PAYMENT_METHODS = [
  { key: 'cod', label: 'Cash on Delivery' },
  { key: 'bank_transfer', label: 'Bank Transfer' },
  { key: 'online_payment', label: 'Online Payment' },
];

export const CheckoutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { items, getSubtotal, clearCart } = useCartStore();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const subtotal = getSubtotal();
  const deliveryFee = 500;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!street || !city || !province) {
      Alert.alert('Validation Error', 'Please fill in all address fields.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'You must be logged in to place an order.');
      return;
    }

    setLoading(true);
    try {
      const order = await orderService.placeOrder({
        userId: user.id,
        items: items.map((item) => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
            price: item.product.price,
          },
          quantity: item.quantity,
        })),
        deliveryAddress: { street, city, province, postal_code: postalCode },
        paymentMethod,
      });

      clearCart();
      navigation.replace('OrderSuccess', { orderNumber: order.order_number });
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      <TextInput style={styles.input} placeholder="Street Address" value={street} onChangeText={setStreet} />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="Province" value={province} onChangeText={setProvince} />
      <TextInput style={styles.input} placeholder="Postal Code" value={postalCode} onChangeText={setPostalCode} keyboardType="number-pad" />

      <Text style={styles.sectionTitle}>Payment Method</Text>
      {PAYMENT_METHODS.map((pm) => (
        <TouchableOpacity
          key={pm.key}
          style={[styles.paymentOption, paymentMethod === pm.key && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod(pm.key)}
        >
          <View style={[styles.radio, paymentMethod === pm.key && styles.radioActive]} />
          <Text style={styles.paymentLabel}>{pm.label}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Order Summary</Text>
      {items.map((item) => (
        <View key={item.product.id} style={styles.itemRow}>
          <Text style={styles.itemName} numberOfLines={1}>{item.product.name} × {item.quantity}</Text>
          <Text style={styles.itemPrice}>₨ {(item.product.price * item.quantity).toLocaleString()}</Text>
        </View>
      ))}
      <View style={styles.divider} />
      <View style={styles.itemRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>₨ {subtotal.toLocaleString()}</Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.summaryLabel}>Delivery</Text>
        <Text style={styles.summaryValue}>₨ {deliveryFee.toLocaleString()}</Text>
      </View>
      <View style={[styles.itemRow, { marginTop: 8 }]}>
        <Text style={styles.totalLabel}>Grand Total</Text>
        <Text style={styles.totalValue}>₨ {grandTotal.toLocaleString()}</Text>
      </View>

      <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder} disabled={loading}>
        <Text style={styles.placeOrderText}>{loading ? 'Placing Order...' : 'Place Order'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', marginTop: 20, marginBottom: 12 },
  input: { height: 48, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 15, marginBottom: 12, fontSize: 15 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, marginBottom: 10 },
  paymentOptionActive: { borderColor: '#FF5A5A', backgroundColor: '#FFF5F5' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#ccc', marginRight: 12 },
  radioActive: { borderColor: '#FF5A5A', backgroundColor: '#FF5A5A' },
  paymentLabel: { fontSize: 15, color: '#1A1A2E' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemName: { flex: 1, fontSize: 14, color: '#555', marginRight: 10 },
  itemPrice: { fontSize: 14, color: '#1A1A2E', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  summaryLabel: { fontSize: 14, color: '#888' },
  summaryValue: { fontSize: 14, color: '#1A1A2E' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#FF5A5A' },
  placeOrderBtn: { backgroundColor: '#FF5A5A', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  placeOrderText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
