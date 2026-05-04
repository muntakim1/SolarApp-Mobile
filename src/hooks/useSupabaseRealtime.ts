import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { sendLocalNotification } from './useRealtimeNotifications';
import { NotificationType } from '../store/notificationPreferencesStore';
import { EventBus } from '../utils/EventBus';

export const useSupabaseRealtime = () => {
  useEffect(() => {
    let unsubscribeProducts: () => void;
    let unsubscribeOrders: () => void;
    let unsubscribeTickets: () => void;

    const setupSubscriptions = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      // Products Subscription
      const productsChannel = supabase
        .channel('products_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          (payload) => {
            EventBus.emit('products_updated', payload.new);
            
            if (payload.eventType === 'INSERT') {
              sendLocalNotification(
                'New Product Alert!',
                `Check out our new product: ${payload.new.name}`,
                { type: NotificationType.NEW_PRODUCT, relatedId: payload.new.id }
              );
            } else if (payload.eventType === 'UPDATE' && payload.new.stock_quantity > 0 && payload.old?.stock_quantity === 0) {
              sendLocalNotification(
                'Back in Stock!',
                `${payload.new.name} is now back in stock!`,
                { type: NotificationType.PROMOTIONAL, relatedId: payload.new.id }
              );
            }
          }
        )
        .subscribe();

      unsubscribeProducts = () => {
        supabase.removeChannel(productsChannel);
      };

      if (user) {
        // Orders Subscription
        const ordersChannel = supabase
          .channel('orders_realtime')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
            (payload) => {
              EventBus.emit('orders_updated', payload.new);
              
              if (payload.new.status !== payload.old?.status) {
                sendLocalNotification(
                  'Order Status Updated',
                  `Your order #${payload.new.order_number} is now ${payload.new.status}`,
                  { type: NotificationType.ORDER_STATUS, relatedId: payload.new.id }
                );
              }
            }
          )
          .subscribe();

        unsubscribeOrders = () => {
          supabase.removeChannel(ordersChannel);
        };

        // Support Tickets Subscription
        const ticketsChannel = supabase
          .channel('tickets_realtime')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'support_tickets', filter: `user_id=eq.${user.id}` },
            (payload) => {
              EventBus.emit('tickets_updated', payload.new);
              
              if (payload.new.status !== payload.old?.status) {
                sendLocalNotification(
                  'Support Ticket Updated',
                  `Ticket "${payload.new.subject}" status changed to ${payload.new.status}`,
                  { type: NotificationType.SUPPORT_UPDATE, relatedId: payload.new.id }
                );
              }
            }
          )
          .subscribe();

        unsubscribeTickets = () => {
          supabase.removeChannel(ticketsChannel);
        };
      }
    };

    setupSubscriptions();

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeTickets) unsubscribeTickets();
    };
  }, []);
};
