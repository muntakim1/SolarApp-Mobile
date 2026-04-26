import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { useNotificationPreferences, NotificationType } from '../store/notificationPreferencesStore';

export const configureNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

interface NotificationData {
  [key: string]: unknown;
  type: NotificationType | 'order_update' | 'survey_scheduled' | 'ticket_reply' | 'quote_sent';
  id?: string;
  relatedId?: string;
}

export const useRealtimeNotifications = () => {
  const navigation = useNavigation();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const { isNotificationEnabled } = useNotificationPreferences();

  useEffect(() => {
    requestNotificationPermissions();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('[Notifications] Received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationResponse(response, navigation, isNotificationEnabled);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [navigation, isNotificationEnabled]);

  return { sendLocalNotification, scheduleLocalNotification };
};

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.warn('[Notifications] Error requesting permissions:', error);
    return false;
  }
};

export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: NotificationData
): Promise<void> => {
  try {
    if (data?.type) {
      const { isNotificationEnabled } = useNotificationPreferences.getState();
      if (!isNotificationEnabled(data.type as NotificationType)) return;
    }

    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: data as Record<string, unknown>, sound: 'default', badge: 1 },
      trigger: null,
    });
  } catch (error) {
    console.warn('[Notifications] Error sending notification:', error);
  }
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  delaySeconds: number,
  data?: NotificationData
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: data as Record<string, unknown>, sound: 'default', badge: 1 },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delaySeconds },
    });
  } catch (error) {
    console.warn('[Notifications] Error scheduling notification:', error);
  }
};

const handleNotificationResponse = (
  response: Notifications.NotificationResponse,
  navigation: any,
  isNotificationEnabled: (type: NotificationType) => boolean
) => {
  const data = response.notification.request.content.data as NotificationData;
  if (!data?.type) return;

  const typedType = data.type as NotificationType;
  const isPreferenceType = Object.values(NotificationType).includes(typedType);
  if (isPreferenceType && !isNotificationEnabled(typedType)) return;

  switch (data.type) {
    case NotificationType.NEW_PRODUCT:
    case NotificationType.PROMOTIONAL:
      navigation.navigate('Catalog');
      break;

    case NotificationType.SUPPORT_UPDATE:
    case 'ticket_reply':
      navigation.navigate('Profile', { screen: 'SupportHistory' });
      break;

    case NotificationType.SURVEY_UPDATE:
    case 'survey_scheduled':
    case 'quote_sent':
      navigation.navigate('Profile', { screen: 'SurveyHistory' });
      break;

    case NotificationType.ORDER_STATUS:
    case 'order_update':
      navigation.navigate('Cart', { screen: 'PurchaseHistory' });
      break;

    default:
      console.warn('[Notifications] Unknown notification type:', data.type);
  }
};

export const updateNotificationBadge = async (count: number): Promise<void> => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.warn('[Notifications] Error updating badge:', error);
  }
};

export const clearAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.warn('[Notifications] Error clearing notifications:', error);
  }
};
