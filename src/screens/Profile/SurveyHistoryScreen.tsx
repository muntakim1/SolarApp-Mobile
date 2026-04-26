import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { colors, Typography as typography } from '../../constants';
import { surveyService, Survey } from '../../services/surveyService';

interface SurveyStats {
  totalSurveys: number;
  completedSurveys: number;
  quotedSurveys: number;
  averageQuoteAmount: number;
}

export default function SurveyHistoryScreen() {
  const insets = useSafeAreaInsets();
  const user = useSelector((state: RootState) => state.auth.user);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSurveyId, setExpandedSurveyId] = useState<string | null>(null);

  const fetchSurveyHistory = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [historyData, statsData] = await Promise.all([
        surveyService.getSurveyHistory(user.id, 50, 0),
        surveyService.getSurveyStats(user.id),
      ]);

      setSurveys(historyData.surveys);
      setStats(statsData);
    } catch (error) {
      console.error('[SurveyHistoryScreen] Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSurveyHistory();
  }, [fetchSurveyHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSurveyHistory();
  }, [fetchSurveyHistory]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'scheduled':
        return colors.warning;
      case 'pending':
        return colors.primary;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
          <Text
            style={{
              ...typography.sectionHeading,
              color: colors.text,
              marginBottom: 8,
            }}
          >
            Survey History
          </Text>
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
            }}
          >
            View all your survey requests
          </Text>
        </View>

        {/* Statistics Cards */}
        {stats && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingBottom: 16,
              gap: 12,
            }}
          >
            {/* Total Surveys & Completed */}
            <View
              style={{
                flexDirection: 'row',
                gap: 12,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 12,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.textSecondary,
                    marginBottom: 4,
                  }}
                >
                  Total Surveys
                </Text>
                <Text
                  style={{
                    ...typography.sectionHeading,
                    color: colors.text,
                  }}
                >
                  {stats.totalSurveys}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 12,
                  borderColor: colors.success,
                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.success,
                    marginBottom: 4,
                  }}
                >
                  Completed
                </Text>
                <Text
                  style={{
                    ...typography.sectionHeading,
                    color: colors.success,
                  }}
                >
                  {stats.completedSurveys}
                </Text>
              </View>
            </View>

            {/* Quoted Surveys & Avg Quote */}
            <View
              style={{
                flexDirection: 'row',
                gap: 12,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 12,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.textSecondary,
                    marginBottom: 4,
                  }}
                >
                  Quoted
                </Text>
                <Text
                  style={{
                    ...typography.sectionHeading,
                    color: colors.text,
                  }}
                >
                  {stats.quotedSurveys}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.surface,
                    opacity: 0.8,
                    marginBottom: 4,
                  }}
                >
                  Avg Quote
                </Text>
                <Text
                  style={{
                    ...typography.sectionHeading,
                    color: colors.surface,
                  }}
                >
                  {formatCurrency(stats.averageQuoteAmount)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Surveys List */}
        {surveys.length > 0 ? (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            {surveys.map((survey) => (
              <View
                key={survey.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 12,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                {/* Collapsed View */}
                <TouchableOpacity
                  onPress={() =>
                    setExpandedSurveyId(expandedSurveyId === survey.id ? null : survey.id)
                  }
                  activeOpacity={0.6}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          ...typography.button,
                          color: colors.text,
                        }}
                      >
                        {survey.full_name}
                      </Text>
                      <Text
                        style={{
                          ...typography.caption,
                          color: colors.textSecondary,
                          marginTop: 2,
                        }}
                      >
                        {survey.property_type} • {survey.address}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: getStatusColor(survey.status),
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                        marginLeft: 8,
                      }}
                    >
                      <Text
                        style={{
                          ...typography.caption,
                          color: colors.surface,
                          fontSize: 11,
                        }}
                      >
                        {getStatusLabel(survey.status)}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {survey.quote_amount ? (
                      <Text
                        style={{
                          ...typography.button,
                          color: colors.primary,
                        }}
                      >
                        Quote: {formatCurrency(survey.quote_amount)}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          ...typography.caption,
                          color: colors.textSecondary,
                        }}
                      >
                        Awaiting Quote
                      </Text>
                    )}
                    <Text
                      style={{
                        ...typography.caption,
                        color: colors.textSecondary,
                      }}
                    >
                      {formatDate(survey.created_at)}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Expanded Details */}
                {expandedSurveyId === survey.id && (
                  <View
                    style={{
                      borderTopColor: colors.border,
                      borderTopWidth: 1,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      gap: 12,
                    }}
                  >
                    {/* Survey Details */}
                    <View>
                      <Text
                        style={{
                          ...typography.label,
                          color: colors.textSecondary,
                          marginBottom: 8,
                        }}
                      >
                        Property Details
                      </Text>

                      <View
                        style={{
                          backgroundColor: colors.background,
                          borderRadius: 8,
                          padding: 12,
                          gap: 8,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={{
                              ...typography.caption,
                              color: colors.textSecondary,
                            }}
                          >
                            Phone
                          </Text>
                          <Text
                            style={{
                              ...typography.label,
                              color: colors.text,
                            }}
                          >
                            {survey.phone}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={{
                              ...typography.caption,
                              color: colors.textSecondary,
                            }}
                          >
                            Monthly Bill
                          </Text>
                          <Text
                            style={{
                              ...typography.label,
                              color: colors.text,
                            }}
                          >
                            Rs. {survey.monthly_bill}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={{
                              ...typography.caption,
                              color: colors.textSecondary,
                            }}
                          >
                            Preferred Date
                          </Text>
                          <Text
                            style={{
                              ...typography.label,
                              color: colors.text,
                            }}
                          >
                            {formatDate(survey.preferred_date)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Notes */}
                    {survey.notes && (
                      <View>
                        <Text
                          style={{
                            ...typography.label,
                            color: colors.textSecondary,
                            marginBottom: 4,
                          }}
                        >
                          Notes
                        </Text>
                        <Text
                          style={{
                            ...typography.caption,
                            color: colors.text,
                            lineHeight: 18,
                          }}
                        >
                          {survey.notes}
                        </Text>
                      </View>
                    )}

                    {/* Quote Section */}
                    {survey.quote_amount && (
                      <View>
                        <Text
                          style={{
                            ...typography.label,
                            color: colors.textSecondary,
                            marginBottom: 8,
                          }}
                        >
                          Quote Details
                        </Text>
                        <View
                          style={{
                            backgroundColor: colors.primary,
                            borderRadius: 8,
                            padding: 12,
                          }}
                        >
                          <Text
                            style={{
                              ...typography.sectionHeading,
                              color: colors.surface,
                              marginBottom: 4,
                            }}
                          >
                            {formatCurrency(survey.quote_amount)}
                          </Text>
                          <Text
                            style={{
                              ...typography.caption,
                              color: colors.surface,
                              opacity: 0.8,
                            }}
                          >
                            Estimated system cost
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Action Buttons */}
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          backgroundColor: colors.primary,
                          paddingVertical: 10,
                          borderRadius: 8,
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            ...typography.button,
                            color: colors.surface,
                          }}
                        >
                          Schedule Survey
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          flex: 1,
                          backgroundColor: colors.border,
                          paddingVertical: 10,
                          borderRadius: 8,
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            ...typography.button,
                            color: colors.text,
                          }}
                        >
                          Download PDF
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 40,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                ...typography.body,
                color: colors.textSecondary,
                marginBottom: 12,
              }}
            >
              No survey requests yet
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  ...typography.button,
                  color: colors.surface,
                }}
              >
                Request a Survey
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
