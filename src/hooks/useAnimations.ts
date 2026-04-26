import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

/**
 * Hook for fade-in animation
 * @param duration Animation duration in milliseconds (default: 500)
 * @returns Animated style object for fade-in
 */
export const useFadeIn = (duration: number = 500) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration,
      easing: Easing.inOut(Easing.ease),
    });
  }, [duration]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
};

/**
 * Hook for slide-up animation
 * @param duration Animation duration in milliseconds (default: 500)
 * @returns Animated style object for slide-up
 */
export const useSlideUp = (duration: number = 500) => {
  const translateY = useSharedValue(50);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [duration]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
};

/**
 * Hook for spring bounce animation
 * @returns Animated style object for spring bounce
 */
export const useBounceIn = () => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 0.7,
      mass: 1,
      overshootClamping: false,
    });
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
};

/**
 * Hook for scale animation
 * @param duration Animation duration in milliseconds (default: 300)
 * @returns Animated style object for scale
 */
export const useScaleIn = (duration: number = 300) => {
  const scale = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  }, [duration]);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
};
