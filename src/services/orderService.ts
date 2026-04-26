import { supabase } from './supabaseClient';
import type { Order, OrderItem } from '../types';

export type { Order, OrderItem };

export const orderService = {
  async getMyOrders(): Promise<Order[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Order[];
  },

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) throw new Error(error.message);
    return data as OrderItem[];
  },

  async placeOrder(params: {
    userId: string;
    items: { product: { id: string; name: string; sku: string; price: number }; quantity: number }[];
    deliveryAddress: { street: string; city: string; province: string; postal_code: string };
    paymentMethod: string;
  }): Promise<Order> {
    const subtotal = params.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const deliveryFee = 500;
    const grandTotal = subtotal + deliveryFee;
    const orderNumber = `SVZ-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: params.userId,
          order_number: orderNumber,
          status: 'pending',
          delivery_address: params.deliveryAddress,
          payment_method: params.paymentMethod,
          payment_status: 'unpaid',
          subtotal,
          delivery_fee: deliveryFee,
          grand_total: grandTotal,
        },
      ])
      .select()
      .single();

    if (orderError || !orderData) {
      throw new Error(orderError?.message || 'Failed to create order');
    }

    // Insert order items
    const orderItems = params.items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product.id,
      product_snapshot: {
        name: item.product.name,
        sku: item.product.sku,
        price: item.product.price,
      },
      quantity: item.quantity,
      unit_price: item.product.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      throw new Error('Failed to save order items: ' + itemsError.message);
    }

    return orderData as Order;
  },

  async cancelOrder(orderId: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .eq('status', 'pending'); // Can only cancel pending orders

    if (error) throw new Error(error.message);
  },

  async getPurchaseHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    orders: Order[];
    total: number;
  }> {
    // Get total count
    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) throw new Error(countError.message);

    // Get paginated orders with items in a single query
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return {
      orders: data as Order[],
      total: count || 0,
    };
  },

  async getOrderStats(userId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  }> {
    const { data, error } = await supabase
      .from('orders')
      .select('grand_total')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);

    const orders = data || [];
    const totalSpent =
      orders.reduce((sum, order) => sum + (order.grand_total || 0), 0) || 0;

    return {
      totalOrders: orders.length,
      totalSpent,
      averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0,
    };
  },
};
