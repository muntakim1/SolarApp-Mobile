import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrderListScreen } from '../screens/Orders/OrderListScreen';
import { OrderDetailScreen } from '../screens/Orders/OrderDetailScreen';
import { Order } from '../services/orderService';

export type OrdersStackParamList = {
  OrderList: undefined;
  OrderDetail: { order: Order };
};

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export const OrdersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: '#FF5A5A' }}>
      <Stack.Screen name="OrderList" component={OrderListScreen} options={{ title: 'My Orders' }} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={({ route }) => ({ title: route.params.order.order_number })} />
    </Stack.Navigator>
  );
};
