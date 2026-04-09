import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useCartStore, CartItem } from '../../store/cartStore';
import { FontAwesome } from '@expo/vector-icons';

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = items.length > 0 ? 500 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Add some products before checking out.');
      return;
    }
    navigation.navigate('Checkout');
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.product.images?.[0] || 'https://via.placeholder.com/80' }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>{item.product.name}</Text>
        <Text style={styles.brand}>{item.product.brand}</Text>
        <Text style={styles.price}>₨ {item.product.price.toLocaleString()}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => removeItem(item.product.id)}
          style={styles.deleteBtn}
        >
          <FontAwesome name="trash" size={16} color="#FF3B30" />
        </TouchableOpacity>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="shopping-cart" size={60} color="#ddd" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Browse our catalog and add products you love.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      {/* Order Summary */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₨ {subtotal.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>₨ {deliveryFee.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>₨ {grandTotal.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  list: { padding: 15, paddingBottom: 250 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#f0f0f0' },
  details: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 2 },
  brand: { fontSize: 12, color: '#888', marginBottom: 4 },
  price: { fontSize: 15, fontWeight: 'bold', color: '#FF5A5A' },
  actions: { alignItems: 'center', justifyContent: 'space-between' },
  deleteBtn: { padding: 6 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 6 },
  qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  qtyText: { fontSize: 14, fontWeight: '600', minWidth: 24, textAlign: 'center' },
  summaryBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0', shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#555' },
  summaryValue: { fontSize: 14, color: '#1A1A2E', fontWeight: '500' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#FF5A5A' },
  checkoutBtn: { backgroundColor: '#FF5A5A', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 30 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E', marginTop: 20 },
  emptySubtitle: { fontSize: 14, color: '#888', marginTop: 8, textAlign: 'center' },
});
