import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartScreen } from '../screens/Cart/CartScreen';
import { CheckoutScreen } from '../screens/Cart/CheckoutScreen';
import { OrderSuccessScreen } from '../screens/Cart/OrderSuccessScreen';
import { SavedAddressesScreen } from '../screens/Cart/SavedAddressesScreen';

import { colors } from '../constants/colors';

export type CartStackParamList = {
  CartMain: undefined;
  Checkout: undefined;
  OrderSuccess: { orderNumber: string };
  SavedAddresses: undefined;
};

const Stack = createNativeStackNavigator<CartStackParamList>();

export const CartStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.secondary }}>
      <Stack.Screen name="CartMain" component={CartScreen} options={{ title: 'My Cart' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} options={{ title: 'Saved Addresses' }} />
    </Stack.Navigator>
  );
};
