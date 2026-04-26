import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { orderService, Order, OrderItem } from '../../services/orderService';
import { OrdersStackParamList } from '../../navigation/OrdersStack';
import { colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

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
        <ActivityIndicator size="small" color={colors.primary} />
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
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
  headerCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  orderNumber: { fontSize: 20, fontWeight: 'bold', color: colors.secondary },
  date: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.secondary, marginBottom: 12, marginTop: 16 },
  timelineContainer: { backgroundColor: colors.surface, borderRadius: 12, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  timeline: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  timelineStep: { alignItems: 'center', flex: 1 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.gray300, zIndex: 1 },
  dotComplete: { backgroundColor: colors.success },
  dotCurrent: { backgroundColor: colors.primary, borderWidth: 3, borderColor: colors.secondary, width: 18, height: 18, borderRadius: 9 },
  line: { position: 'absolute', top: 7, left: '50%', right: '-50%', height: 2, backgroundColor: colors.gray300 },
  lineComplete: { backgroundColor: colors.success },
  stepLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
  stepLabelComplete: { color: colors.secondary, fontWeight: '600' },
  cancelledBanner: { backgroundColor: colors.errorLight, padding: 16, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
  cancelledText: { color: colors.error, fontSize: 14, fontWeight: '600' },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 14, borderRadius: 10, marginBottom: 8 },
  itemName: { fontSize: 14, fontWeight: '600', color: colors.secondary },
  itemSku: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  itemQty: { fontSize: 14, color: colors.textSecondary, marginHorizontal: 12 },
  itemTotal: { fontSize: 14, fontWeight: '600', color: colors.secondary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalLabel: { fontSize: 14, color: colors.textSecondary },
  totalValue: { fontSize: 14, color: colors.secondary },
  grandTotalLabel: { fontSize: 16, fontWeight: 'bold', color: colors.secondary },
  grandTotalValue: { fontSize: 18, fontWeight: 'bold', color: colors.primaryDark },
  addressCard: { backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 16 },
  addressText: { fontSize: 14, color: colors.text, lineHeight: 22 },
});
