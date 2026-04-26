import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { orderService, Order } from '../../services/orderService';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../constants/colors';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FFF3E0', text: '#E65100' },
  processing: { bg: '#E3F2FD', text: '#1565C0' },
  packed: { bg: '#E8F5E9', text: '#2E7D32' },
  shipped: { bg: '#F3E5F5', text: '#7B1FA2' },
  delivered: { bg: '#E8F5E9', text: '#1B5E20' },
  cancelled: { bg: '#FFEBEE', text: '#C62828' },
};

const STATUS_FILTERS = ['All', 'pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

export const OrderListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('All');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const filteredOrders =
    activeFilter === 'All' ? orders : orders.filter((o) => o.status === activeFilter);

  const renderOrder = ({ item }: { item: Order }) => {
    const statusColors = STATUS_COLORS[item.status] || STATUS_COLORS['pending'];
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('OrderDetail', { order: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.orderNumber}>{item.order_number}</Text>
          <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.badgeText, { color: statusColors.text }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
          <Text style={styles.total}>₨ {item.grand_total.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Status filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {STATUS_FILTERS.map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterTab, activeFilter === status && styles.filterTabActive]}
            onPress={() => setActiveFilter(status)}
          >
            <Text style={[styles.filterTabText, activeFilter === status && styles.filterTabTextActive]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              {activeFilter === 'All' ? 'No orders yet.' : `No ${activeFilter} orders.`}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  filterScroll: { 
    backgroundColor: colors.surface, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.gray200,
    flexGrow: 0, // Prevent stretching
  },
  filterContent: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginRight: 8,
  },
  filterTabActive: { 
    backgroundColor: colors.primary, 
    borderColor: colors.primary,
  },
  filterTabText: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    fontWeight: '500' 
  },
  filterTabTextActive: { 
    color: colors.secondary, // Black text on yellow background for better contrast
    fontWeight: '700' 
  },
  list: { padding: 15 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  orderNumber: { fontSize: 15, fontWeight: 'bold', color: colors.dark },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 13, color: colors.gray500 },
  total: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  emptyText: { fontSize: 16, color: colors.gray500 },
});
