import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, Typography as typography } from '../../constants';
import {
  useNotificationPreferences,
  NotificationType,
} from '../../store/notificationPreferencesStore';

interface NotificationOption {
  type: NotificationType;
  label: string;
  description: string;
  icon?: string;
}

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { preferences, setPreference, isNotificationEnabled } = useNotificationPreferences();

  const notificationOptions: NotificationOption[] = [
    {
      type: NotificationType.NEW_PRODUCT,
      label: 'New Products',
      description: 'Get notified when new solar products are added',
    },
    {
      type: NotificationType.SUPPORT_UPDATE,
      label: 'Support Updates',
      description: 'Receive updates on your support tickets',
    },
    {
      type: NotificationType.SURVEY_UPDATE,
      label: 'Survey Updates',
      description: 'Get notified about your survey requests',
    },
    {
      type: NotificationType.ORDER_STATUS,
      label: 'Order Status',
      description: 'Receive order and delivery updates',
    },
    {
      type: NotificationType.PROMOTIONAL,
      label: 'Promotions',
      description: 'Special offers, discounts, and deals',
    },
  ];

  const toggleNotification = (type: NotificationType) => {
    const currentStatus = isNotificationEnabled(type);
    setPreference(type, !currentStatus);
  };

  const handleEnableAll = () => {
    notificationOptions.forEach((option) => {
      setPreference(option.type, true);
    });
    Alert.alert('Success', 'All notifications enabled');
  };

  const handleDisableAll = () => {
    Alert.alert('Disable All', 'Are you sure you want to disable all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disable',
        style: 'destructive',
        onPress: () => {
          notificationOptions.forEach((option) => {
            setPreference(option.type, false);
          });
        },
      },
    ]);
  };

  const enabledCount = Object.values(preferences).filter(Boolean).length;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
          <Text
            style={{
              ...typography.sectionHeading,
              color: colors.text,
              marginBottom: 8,
            }}
          >
            Notification Settings
          </Text>
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
            }}
          >
            Manage which notifications you receive
          </Text>
        </View>

        {/* Summary Card */}
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text
            style={{
              ...typography.label,
              color: colors.surface,
              opacity: 0.8,
              marginBottom: 4,
            }}
          >
            Notifications Enabled
          </Text>
          <Text
            style={{
              ...typography.sectionHeading,
              color: colors.surface,
            }}
          >
            {enabledCount} of {notificationOptions.length}
          </Text>
        </View>

        {/* Notification Options */}
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            backgroundColor: colors.surface,
            borderRadius: 12,
            overflow: 'hidden',
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          {notificationOptions.map((option, idx) => (
            <View
              key={option.type}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 14,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomColor: colors.border,
                borderBottomWidth: idx < notificationOptions.length - 1 ? 1 : 0,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...typography.button,
                    color: colors.text,
                    marginBottom: 4,
                  }}
                >
                  {option.label}
                </Text>
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.textSecondary,
                  }}
                >
                  {option.description}
                </Text>
              </View>

              <Switch
                value={isNotificationEnabled(option.type)}
                onValueChange={() => toggleNotification(option.type)}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={isNotificationEnabled(option.type) ? colors.primary : colors.textSecondary}
                style={{ marginLeft: 16 }}
              />
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 24,
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: 'center',
            }}
            onPress={handleEnableAll}
          >
            <Text
              style={{
                ...typography.button,
                color: colors.surface,
              }}
            >
              Enable All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.error,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: 'center',
            }}
            onPress={handleDisableAll}
          >
            <Text
              style={{
                ...typography.button,
                color: colors.surface,
              }}
            >
              Disable All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Information Section */}
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 24,
            backgroundColor: colors.success + '10',
            borderRadius: 12,
            padding: 16,
            borderLeftColor: colors.success,
            borderLeftWidth: 4,
          }}
        >
          <Text
            style={{
              ...typography.label,
              color: colors.success,
              marginBottom: 8,
            }}
          >
            💡 Tip
          </Text>
          <Text
            style={{
              ...typography.caption,
              color: colors.text,
              lineHeight: 18,
            }}
          >
            Even with notifications disabled, you can still check your purchase history, support tickets, and survey requests anytime in the Profile section.
          </Text>
        </View>

        {/* Privacy Notice */}
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 24,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingTop: 16,
          }}
        >
          <Text
            style={{
              ...typography.label,
              color: colors.textSecondary,
              marginBottom: 8,
            }}
          >
            Privacy & Security
          </Text>
          <Text
            style={{
              ...typography.caption,
              color: colors.textSecondary,
              lineHeight: 18,
            }}
          >
            Your notification preferences are saved locally on your device. We will never use notifications to send marketing emails or spam. Your data is secure and encrypted.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
