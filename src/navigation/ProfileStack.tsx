import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { SurveyRequestScreen } from '../screens/Survey/SurveyRequestScreen';
import { SupportTicketScreen } from '../screens/Support/SupportTicketScreen';
import { HelplineScreen } from '../screens/Support/HelplineScreen';
import { AboutScreen } from '../screens/Home/AboutScreen';
import PurchaseHistoryScreen from '../screens/Profile/PurchaseHistoryScreen';
import SupportHistoryScreen from '../screens/Profile/SupportHistoryScreen';
import SurveyHistoryScreen from '../screens/Profile/SurveyHistoryScreen';
import NotificationSettingsScreen from '../screens/Profile/NotificationSettingsScreen';

import { colors } from '../constants/colors';

export type ProfileStackParamList = {
  Profile: undefined;
  SurveyRequest: undefined;
  SupportTicket: undefined;
  Helpline: undefined;
  About: undefined;
  PurchaseHistory: undefined;
  SupportHistory: undefined;
  SurveyHistory: undefined;
  NotificationSettings: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.secondary }}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false, title: 'Profile' }} />
      <Stack.Screen name="SurveyRequest" component={SurveyRequestScreen} options={{ title: 'Get a Quote' }} />
      <Stack.Screen name="SupportTicket" component={SupportTicketScreen} options={{ title: 'Support Ticket' }} />
      <Stack.Screen name="Helpline" component={HelplineScreen} options={{ title: 'Help & Support' }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About SolventZ' }} />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} options={{ title: 'Purchase History' }} />
      <Stack.Screen name="SupportHistory" component={SupportHistoryScreen} options={{ title: 'Support History' }} />
      <Stack.Screen name="SurveyHistory" component={SurveyHistoryScreen} options={{ title: 'Survey History' }} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: 'Notifications' }} />
    </Stack.Navigator>
  );
};
