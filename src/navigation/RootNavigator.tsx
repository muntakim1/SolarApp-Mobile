import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { supabase } from '../services/supabaseClient';
import { setAuthSession, setAuthLoading } from '../store/slices/authSlice';
import { RootState } from '../store';
import { View, ActivityIndicator } from 'react-native';

import { colors } from '../constants/colors';

export const RootNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setAuthSession({ user: session?.user ?? null, session }));
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setAuthSession({ user: session?.user ?? null, session }));
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

console.log('Rendering RootNavigator, isAuthenticated:', isAuthenticated);
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
