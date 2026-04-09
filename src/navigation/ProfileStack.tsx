import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { SurveyRequestScreen } from '../screens/Survey/SurveyRequestScreen';
import { SupportTicketScreen } from '../screens/Support/SupportTicketScreen';
import { HelplineScreen } from '../screens/Support/HelplineScreen';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  SurveyRequest: undefined;
  SupportTicket: undefined;
  Helpline: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: '#FF5A5A' }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SurveyRequest" component={SurveyRequestScreen} options={{ title: 'Get a Quote' }} />
      <Stack.Screen name="SupportTicket" component={SupportTicketScreen} options={{ title: 'Support Ticket' }} />
      <Stack.Screen name="Helpline" component={HelplineScreen} options={{ title: 'Help & Support' }} />
    </Stack.Navigator>
  );
};
