import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum NotificationType {
  NEW_PRODUCT = 'NEW_PRODUCT',
  SUPPORT_UPDATE = 'SUPPORT_UPDATE',
  SURVEY_UPDATE = 'SURVEY_UPDATE',
  ORDER_STATUS = 'ORDER_STATUS',
  PROMOTIONAL = 'PROMOTIONAL',
}

interface NotificationPreferences {
  [NotificationType.NEW_PRODUCT]: boolean;
  [NotificationType.SUPPORT_UPDATE]: boolean;
  [NotificationType.SURVEY_UPDATE]: boolean;
  [NotificationType.ORDER_STATUS]: boolean;
  [NotificationType.PROMOTIONAL]: boolean;
}

interface NotificationPreferencesStore {
  preferences: NotificationPreferences;
  setPreference: (type: NotificationType, enabled: boolean) => void;
  isNotificationEnabled: (type: NotificationType) => boolean;
  getAllPreferences: () => NotificationPreferences;
  getEnabledTypes: () => NotificationType[];
}

const defaultPreferences: NotificationPreferences = {
  [NotificationType.NEW_PRODUCT]: true,
  [NotificationType.SUPPORT_UPDATE]: true,
  [NotificationType.SURVEY_UPDATE]: true,
  [NotificationType.ORDER_STATUS]: true,
  [NotificationType.PROMOTIONAL]: false,
};

export const useNotificationPreferences = create<NotificationPreferencesStore>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,

      setPreference: (type: NotificationType, enabled: boolean) =>
        set((state) => ({
          preferences: { ...state.preferences, [type]: enabled },
        })),

      isNotificationEnabled: (type: NotificationType) => {
        return get().preferences[type] ?? defaultPreferences[type];
      },

      getAllPreferences: () => get().preferences,

      getEnabledTypes: () => {
        return Object.entries(get().preferences)
          .filter(([, enabled]) => enabled)
          .map(([type]) => type as NotificationType);
      },
    }),
    {
      name: 'solventz-notification-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
