import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useNotificationPreferences, NotificationType } from '../store/notificationPreferencesStore';

interface NotificationData {
  [key: string]: unknown;
  type: NotificationType | 'order_update' | 'survey_scheduled' | 'ticket_reply' | 'quote_sent';
  id?: string;
  relatedId?: string;
}

export const configureNotifications = () => {
  // No-op for Toast
};

export const requestNotificationPermissions = async (): Promise<boolean> => {
  return true; // No-op
};

let globalNavigation: any = null;

export const useRealtimeNotifications = () => {
  const navigation = useNavigation();

  useEffect(() => {
    globalNavigation = navigation;
  }, [navigation]);

  return { sendLocalNotification, scheduleLocalNotification };
};

export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: NotificationData
): Promise<void> => {
  try {
    if (data?.type) {
      const { isNotificationEnabled } = useNotificationPreferences.getState();
      const typedType = data.type as NotificationType;
      const isPreferenceType = Object.values(NotificationType).includes(typedType);
      if (isPreferenceType && !isNotificationEnabled(typedType)) return;
    }

    Toast.show({
      type: 'info',
      text1: title,
      text2: body,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      onPress: () => {
        if (data && globalNavigation) {
           handleNotificationResponse(data, globalNavigation);
        }
        Toast.hide();
      }
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
  setTimeout(() => {
    sendLocalNotification(title, body, data);
  }, delaySeconds * 1000);
};

const handleNotificationResponse = (
  data: NotificationData,
  navigation: any
) => {
  if (!data?.type) return;

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

export const updateNotificationBadge = async (count: number): Promise<void> => {};
export const clearAllNotifications = async (): Promise<void> => {
  Toast.hide();
};
