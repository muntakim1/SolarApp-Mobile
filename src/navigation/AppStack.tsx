import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { CatalogStack } from './CatalogStack';
import { CartStack } from './CartStack';
import { OrdersStack } from './OrdersStack';
import { ProfileStack } from './ProfileStack';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { useCartStore } from '../store/cartStore';
import { useSupabaseRealtime } from '../hooks/useSupabaseRealtime';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';

import { colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

export const AppStack = () => {
  const itemCount = useCartStore((state) => state.getItemCount());
  
  useRealtimeNotifications();
  useSupabaseRealtime();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Catalog') iconName = 'th-large';
          else if (route.name === 'Cart') iconName = 'shopping-cart';
          else if (route.name === 'Orders') iconName = 'list-alt';
          else if (route.name === 'Profile') iconName = 'user';

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Catalog" component={CatalogStack} />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.secondary, color: colors.primary, fontSize: 11 },
        }}
      />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              navigation.navigate('Profile', { screen: 'Profile' });
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};
