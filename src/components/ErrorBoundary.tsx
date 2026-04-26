import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Global Error Boundary component to catch and handle crashes
 * Displays user-friendly error screen and logs errors
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);

    // In production, you would send this to Sentry or similar error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <Text style={styles.emoji}>⚠️</Text>
              <Text style={styles.title}>Oops! Something went wrong</Text>
              <Text style={styles.subtitle}>
                We encountered an unexpected error. Our team has been notified.
              </Text>
            </View>

            {__DEV__ && (
              <>
                <View style={styles.errorBox}>
                  <Text style={styles.errorLabel}>Error Message:</Text>
                  <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
                </View>

                <View style={styles.errorBox}>
                  <Text style={styles.errorLabel}>Stack Trace:</Text>
                  <Text style={styles.stackTrace}>{this.state.errorInfo?.componentStack}</Text>
                </View>
              </>
            )}

            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>What you can try:</Text>
              <Text style={styles.suggestion}>• Close and reopen the app</Text>
              <Text style={styles.suggestion}>• Check your internet connection</Text>
              <Text style={styles.suggestion}>• Clear your app cache</Text>
              <Text style={styles.suggestion}>• Restart your device</Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    ...Typography.screenTitle,
    color: colors.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: colors.dark,
    textAlign: 'center',
    marginTop: 8,
  },
  errorBox: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorLabel: {
    ...Typography.button,
    color: colors.dark,
    marginBottom: 8,
  },
  errorText: {
    ...Typography.caption,
    color: colors.dark,
    fontFamily: 'Courier New',
  },
  stackTrace: {
    ...Typography.caption,
    color: colors.dark,
    fontFamily: 'Courier New',
    lineHeight: 16,
  },
  suggestions: {
    marginVertical: 24,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  suggestionsTitle: {
    ...Typography.sectionHeading,
    color: colors.dark,
    marginBottom: 12,
  },
  suggestion: {
    ...Typography.body,
    color: colors.dark,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  buttonText: {
    ...Typography.button,
    color: '#fff',
  },
});

export default ErrorBoundary;
