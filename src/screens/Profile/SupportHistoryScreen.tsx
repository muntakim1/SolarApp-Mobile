import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { colors, Typography as typography } from '../../constants';
import { supportService, SupportTicket } from '../../services/supportService';

interface SupportStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
}

export default function SupportHistoryScreen() {
  const insets = useSafeAreaInsets();
  const user = useSelector((state: RootState) => state.auth.user);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  const fetchSupportHistory = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [historyData, statsData] = await Promise.all([
        supportService.getSupportHistory(user.id, 50, 0),
        supportService.getSupportStats(user.id),
      ]);

      setTickets(historyData.tickets);
      setStats(statsData);
    } catch (error) {
      console.error('[SupportHistoryScreen] Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSupportHistory();
  }, [fetchSupportHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSupportHistory();
  }, [fetchSupportHistory]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return colors.success;
      case 'in_progress':
        return colors.warning;
      case 'open':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: 'Open',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
    };
    return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return colors.error;
      case 'billing':
        return colors.primary;
      case 'installation':
        return colors.success;
      case 'warranty':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            Support History
          </Text>
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
            }}
          >
            Track all your support tickets
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              {/* Total Tickets */}
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
                  Total
                </Text>
                <Text
                  style={{
                    ...typography.sectionHeading,
                    color: colors.text,
                  }}
                >
                  {stats.totalTickets}
                </Text>
              </View>

              {/* Open Tickets */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 12,
                  borderColor: colors.error,
                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.error,
                    marginBottom: 4,
                  }}
                >
                  Open
                </Text>
                <Text
                  style={{
                    ...typography.sectionHeading,
                    color: colors.error,
                  }}
                >
                  {stats.openTickets}
                </Text>
              </View>

              {/* Resolved */}
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
                  Resolved
                </Text>
                <Text
                  style={{
                    ...typography.sectionHeading,
                    color: colors.success,
                  }}
                >
                  {stats.resolvedTickets}
                </Text>
              </View>
            </View>

            {/* Avg Resolution Time */}
            <View
              style={{
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
                Average Resolution Time
              </Text>
              <Text
                style={{
                  ...typography.sectionHeading,
                  color: colors.surface,
                }}
              >
                {stats.averageResolutionTime} hours
              </Text>
            </View>
          </View>
        )}

        {/* Tickets List */}
        {tickets.length > 0 ? (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            {tickets.map((ticket) => (
              <View
                key={ticket.id}
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
                    setExpandedTicketId(expandedTicketId === ticket.id ? null : ticket.id)
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
                        #{ticket.id.slice(0, 8).toUpperCase()}
                      </Text>
                      <Text
                        style={{
                          ...typography.caption,
                          color: colors.textSecondary,
                          marginTop: 2,
                        }}
                      >
                        {ticket.subject}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: getStatusColor(ticket.status),
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
                        {getStatusLabel(ticket.status)}
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
                    <View
                      style={{
                        backgroundColor: getCategoryColor(ticket.category),
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          ...typography.caption,
                          color: colors.surface,
                          fontSize: 11,
                        }}
                      >
                        {ticket.category.toUpperCase()}
                      </Text>
                    </View>
                    <Text
                      style={{
                        ...typography.caption,
                        color: colors.textSecondary,
                      }}
                    >
                      {formatDate(ticket.created_at)}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Expanded Details */}
                {expandedTicketId === ticket.id && (
                  <View
                    style={{
                      borderTopColor: colors.border,
                      borderTopWidth: 1,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      gap: 12,
                    }}
                  >
                    {/* Description */}
                    <View>
                      <Text
                        style={{
                          ...typography.label,
                          color: colors.textSecondary,
                          marginBottom: 4,
                        }}
                      >
                        Description
                      </Text>
                      <Text
                        style={{
                          ...typography.caption,
                          color: colors.text,
                          lineHeight: 18,
                        }}
                      >
                        {ticket.description}
                      </Text>
                    </View>

                    {/* Attachments */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                      <View>
                        <Text
                          style={{
                            ...typography.label,
                            color: colors.textSecondary,
                            marginBottom: 8,
                          }}
                        >
                          Attachments ({ticket.attachments.length})
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 8,
                          }}
                        >
                          {ticket.attachments.map((url, idx) => (
                            <TouchableOpacity
                              key={idx}
                              style={{
                                width: 80,
                                height: 80,
                                borderRadius: 8,
                                overflow: 'hidden',
                                backgroundColor: colors.background,
                              }}
                            >
                              <Image
                                source={{ uri: url }}
                                style={{ width: '100%', height: '100%' }}
                              />
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Action Button */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.primary,
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginTop: 8,
                      }}
                    >
                      <Text
                        style={{
                          ...typography.button,
                          color: colors.surface,
                        }}
                      >
                        Add Reply
                      </Text>
                    </TouchableOpacity>
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
              No support tickets yet
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
                Submit a Ticket
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
