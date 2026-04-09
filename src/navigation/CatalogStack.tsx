import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CatalogScreen } from '../screens/Catalog/CatalogScreen';
import { ProductDetailScreen } from '../screens/Catalog/ProductDetailScreen';
import { Product } from '../services/productService';

export type CatalogStackParamList = {
  CatalogList: undefined;
  ProductDetail: { product: Product };
};

const Stack = createNativeStackNavigator<CatalogStackParamList>();

export const CatalogStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerTintColor: '#FF5A5A' }}>
      <Stack.Screen name="CatalogList" component={CatalogScreen} options={{ title: 'Products' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={({ route }) => ({ title: route.params.product.name })} />
    </Stack.Navigator>
  );
};
