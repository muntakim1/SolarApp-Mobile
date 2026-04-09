import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { orderService, Order, OrderItem } from '../../services/orderService';
import { OrdersStackParamList } from '../../navigation/OrdersStack';

const TIMELINE_STEPS = ['pending', 'processing', 'packed', 'shipped', 'delivered'];

type Props = {
  route: RouteProp<OrdersStackParamList, 'OrderDetail'>;
};

export const OrderDetailScreen: React.FC<Props> = ({ route }) => {
  const { order } = route.params;
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await orderService.getOrderItems(order.id);
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Order Header */}
      <View style={styles.headerCard}>
        <Text style={styles.orderNumber}>{order.order_number}</Text>
        <Text style={styles.date}>{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </View>

      {/* Status Timeline */}
      { order.status !== 'cancelled' && (
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.timeline}>
            {TIMELINE_STEPS.map((step, idx) => {
              const isComplete = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <View key={step} style={styles.timelineStep}>
                  <View style={[styles.dot, isComplete && styles.dotComplete, isCurrent && styles.dotCurrent]} />
                  {idx < TIMELINE_STEPS.length - 1 && (
                    <View style={[styles.line, isComplete && styles.lineComplete]} />
                  )}
                  <Text style={[styles.stepLabel, isComplete && styles.stepLabelComplete]}>{step.charAt(0).toUpperCase() + step.slice(1)}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {order.status === 'cancelled' && (
        <View style={styles.cancelledBanner}>
          <Text style={styles.cancelledText}>This order has been cancelled.</Text>
        </View>
      )}

      {/* Items */}
      <Text style={styles.sectionTitle}>Items</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#FF5A5A" />
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.product_snapshot.name}</Text>
              <Text style={styles.itemSku}>SKU: {item.product_snapshot.sku}</Text>
            </View>
            <Text style={styles.itemQty}>×{item.quantity}</Text>
            <Text style={styles.itemTotal}>₨ {item.line_total.toLocaleString()}</Text>
          </View>
        ))
      )}

      {/* Totals */}
      <View style={styles.divider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Subtotal</Text>
        <Text style={styles.totalValue}>₨ {order.subtotal.toLocaleString()}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Delivery</Text>
        <Text style={styles.totalValue}>₨ {order.delivery_fee.toLocaleString()}</Text>
      </View>
      <View style={[styles.totalRow, { marginTop: 8 }]}>
        <Text style={styles.grandTotalLabel}>Grand Total</Text>
        <Text style={styles.grandTotalValue}>₨ {order.grand_total.toLocaleString()}</Text>
      </View>

      {/* Address */}
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      <View style={styles.addressCard}>
        <Text style={styles.addressText}>{order.delivery_address.street}</Text>
        <Text style={styles.addressText}>{order.delivery_address.city}, {order.delivery_address.province}</Text>
        {order.delivery_address.postal_code ? <Text style={styles.addressText}>Postal: {order.delivery_address.postal_code}</Text> : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  headerCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  orderNumber: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E' },
  date: { fontSize: 13, color: '#888', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 12, marginTop: 16 },
  timelineContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  timeline: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  timelineStep: { alignItems: 'center', flex: 1 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#E0E0E0', zIndex: 1 },
  dotComplete: { backgroundColor: '#34C759' },
  dotCurrent: { backgroundColor: '#FF5A5A', borderWidth: 3, borderColor: '#FFD4D4', width: 20, height: 20, borderRadius: 10 },
  line: { position: 'absolute', top: 7, left: '50%', right: '-50%', height: 2, backgroundColor: '#E0E0E0' },
  lineComplete: { backgroundColor: '#34C759' },
  stepLabel: { fontSize: 10, color: '#888', marginTop: 6, textAlign: 'center' },
  stepLabelComplete: { color: '#1A1A2E', fontWeight: '600' },
  cancelledBanner: { backgroundColor: '#FFEBEE', padding: 16, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
  cancelledText: { color: '#C62828', fontSize: 14, fontWeight: '600' },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 8 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  itemSku: { fontSize: 11, color: '#888', marginTop: 2 },
  itemQty: { fontSize: 14, color: '#888', marginHorizontal: 12 },
  itemTotal: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 16 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalLabel: { fontSize: 14, color: '#888' },
  totalValue: { fontSize: 14, color: '#1A1A2E' },
  grandTotalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E' },
  grandTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#FF5A5A' },
  addressCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 },
  addressText: { fontSize: 14, color: '#555', lineHeight: 22 },
});
