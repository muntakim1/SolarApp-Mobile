import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CatalogScreen } from '../screens/Catalog/CatalogScreen';
import { ProductDetailScreen } from '../screens/Catalog/ProductDetailScreen';
import { WishlistScreen } from '../screens/Profile/WishlistScreen';
import { ComparisonScreen } from '../screens/Products/ComparisonScreen';
import { Product } from '../services/productService';

import { colors } from '../constants/colors';

export type CatalogStackParamList = {
  CatalogList: undefined;
  ProductDetail: { product: Product };
  Wishlist: undefined;
  Comparison: undefined;
};

const Stack = createNativeStackNavigator<CatalogStackParamList>();

export const CatalogStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerTintColor: colors.secondary }}>
      <Stack.Screen name="CatalogList" component={CatalogScreen} options={{ title: 'Products' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={({ route }) => ({ title: route.params.product.name })} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'Wishlist' }} />
      <Stack.Screen name="Comparison" component={ComparisonScreen} options={{ title: 'Compare' }} />
    </Stack.Navigator>
  );
};
