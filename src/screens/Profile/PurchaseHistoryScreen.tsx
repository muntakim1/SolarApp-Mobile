import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { colors, Typography as typography } from '../../constants';
import { orderService } from '../../services/orderService';

interface OrderWithItems {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  grand_total: number;
  delivery_address: {
    street: string;
    city: string;
  };
  items?: Array<{
    product_snapshot: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

interface Stats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
}

export default function PurchaseHistoryScreen() {
  const insets = useSafeAreaInsets();
  const user = useSelector((state: RootState) => state.auth.user);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchPurchaseHistory = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [historyData, statsData] = await Promise.all([
        orderService.getPurchaseHistory(user.id, 50, 0),
        orderService.getOrderStats(user.id),
      ]);

      setOrders(historyData.orders);
      setStats(statsData);
    } catch (error) {
      console.error('[PurchaseHistoryScreen] Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPurchaseHistory();
  }, [fetchPurchaseHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPurchaseHistory();
  }, [fetchPurchaseHistory]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
          <Text
            style={{
              ...typography.sectionHeading,
              color: colors.text,
              marginBottom: 8,
            }}
          >
            Purchase History
          </Text>
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
            }}
          >
            View all your orders and invoices
          </Text>
        </View>

        {/* Statistics Cards */}
        {stats && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingBottom: 16,
              gap: 12,
            }}
          >
            {/* Total Spent */}
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                padding: 16,
              }}
            >
              <Text
                style={{
                  ...typography.caption,
                  color: colors.surface,
                  marginBottom: 4,
                  opacity: 0.8,
                }}
              >
                Total Spent
              </Text>
              <Text
                style={{
                  ...typography.screenTitle,
                  color: colors.surface,
                }}
              >
                {formatCurrency(stats.totalSpent)}
              </Text>
            </View>

            {/* Row: Total Orders & Average */}
            <View
              style={{
                flexDirection: 'row',
                gap: 12,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.textSecondary,
                    marginBottom: 4,
                  }}
                >
                  Total Orders
                </Text>
                <Text
                  style={{
                    ...typography.sectionHeading,
                    color: colors.text,
                  }}
                >
                  {stats.totalOrders}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.textSecondary,
                    marginBottom: 4,
                  }}
                >
                  Average Order
                </Text>
                <Text
                  style={{
                    ...typography.sectionHeading,
                    color: colors.text,
                  }}
                >
                  {formatCurrency(stats.averageOrderValue)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Orders List */}
        {orders.length > 0 ? (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            {orders.map((order, idx) => (
              <View
                key={order.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 12,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                {/* Collapsed View */}
                <TouchableOpacity
                  onPress={() =>
                    setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                  }
                  activeOpacity={0.6}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: colors.surface,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        ...typography.button,
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      {order.order_number}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          ...typography.caption,
                          color: colors.textSecondary,
                        }}
                      >
                        {formatDate(order.created_at)}
                      </Text>
                      <View
                        style={{
                          backgroundColor: getStatusColor(order.status),
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            ...typography.caption,
                            color: colors.surface,
                            fontSize: 11,
                          }}
                        >
                          {getStatusLabel(order.status)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ marginLeft: 12, alignItems: 'flex-end' }}>
                    <Text
                      style={{
                        ...typography.button,
                        color: colors.primary,
                        marginBottom: 4,
                      }}
                    >
                      {formatCurrency(order.grand_total)}
                    </Text>
                    <Text
                      style={{
                        ...typography.caption,
                        color: colors.textSecondary,
                      }}
                    >
                      {order.items?.length || 0} items
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Expanded Details */}
                {expandedOrderId === order.id && (
                  <View
                    style={{
                      borderTopColor: colors.border,
                      borderTopWidth: 1,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      gap: 12,
                    }}
                  >
                    {/* Delivery Address */}
                    <View>
                      <Text
                        style={{
                          ...typography.label,
                          color: colors.textSecondary,
                          marginBottom: 4,
                        }}
                      >
                        Delivery Address
                      </Text>
                      <Text
                        style={{
                          ...typography.caption,
                          color: colors.text,
                          lineHeight: 18,
                        }}
                      >
                        {order.delivery_address?.street}
                        {'\n'}
                        {order.delivery_address?.city}
                      </Text>
                    </View>

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <View>
                        <Text
                          style={{
                            ...typography.label,
                            color: colors.textSecondary,
                            marginBottom: 8,
                          }}
                        >
                          Items
                        </Text>
                        {order.items.map((item, itemIdx) => (
                          <View
                            key={itemIdx}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              paddingVertical: 6,
                              paddingLeft: 8,
                              borderLeftColor: colors.primary,
                              borderLeftWidth: 2,
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  ...typography.caption,
                                  color: colors.text,
                                }}
                              >
                                {item.product_snapshot.name}
                              </Text>
                            </View>
                            <Text
                              style={{
                                ...typography.caption,
                                color: colors.text,
                                marginHorizontal: 8,
                              }}
                            >
                              ×{item.quantity}
                            </Text>
                            <Text
                              style={{
                                ...typography.label,
                                color: colors.primary,
                              }}
                            >
                              {formatCurrency(item.product_snapshot.price * item.quantity)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Action Button */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.primary,
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginTop: 8,
                      }}
                    >
                      <Text
                        style={{
                          ...typography.button,
                          color: colors.surface,
                        }}
                      >
                        View Invoice
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 40,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                ...typography.body,
                color: colors.textSecondary,
                marginBottom: 12,
              }}
            >
              No purchase history yet
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  ...typography.button,
                  color: colors.surface,
                }}
              >
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
