import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { colors } from '../constants/colors';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  marginsVertical?: number;
  count?: number;
}

/**
 * Animated skeleton loading component
 * Shows pulsing grey bars while data is loading
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  marginsVertical = 8,
  count = 3,
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.skeleton,
            {
              width: width as number,
              height,
              borderRadius,
              marginVertical: marginsVertical,
            },
            animatedStyle,
          ]}
        />
      ))}
    </View>
  );
};

/**
 * Product card skeleton - simulates a product card loading state
 */
export const ProductCardSkeleton: React.FC<{ count?: number }> = ({ count = 2 }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: count * 2 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.productCard, animatedStyle]}
        >
          <View style={styles.productImage} />
          <SkeletonLoader width="80%" height={12} borderRadius={4} count={2} />
        </Animated.View>
      ))}
    </View>
  );
};

/**
 * Cart item skeleton
 */
export const CartItemSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.cartItem, animatedStyle]}
        >
          <View style={styles.cartImage} />
          <View style={styles.cartContent}>
            <SkeletonLoader width="70%" height={14} borderRadius={4} count={1} />
            <SkeletonLoader width="50%" height={12} borderRadius={4} count={1} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

/**
 * Order list skeleton
 */
export const OrderListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.orderCard, animatedStyle]}
        >
          <View style={styles.orderHeader}>
            <SkeletonLoader width="40%" height={14} borderRadius={4} count={1} />
            <SkeletonLoader width="30%" height={12} borderRadius={4} count={1} />
          </View>
          <SkeletonLoader width="80%" height={12} borderRadius={4} count={2} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.light_gray,
    borderRadius: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  productImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.light_gray,
    borderRadius: 8,
    marginBottom: 8,
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cartImage: {
    width: 80,
    height: 80,
    backgroundColor: colors.light_gray,
    borderRadius: 8,
    marginRight: 12,
  },
  cartContent: {
    flex: 1,
    justifyContent: 'space-around',
  },
  orderCard: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
