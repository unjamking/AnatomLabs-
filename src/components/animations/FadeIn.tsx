import React, { useCallback } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { ViewStyle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ANIMATION_DURATION, EASING } from './config';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
  from?: number;
  to?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = ANIMATION_DURATION.normal,
  style,
  from = 0,
  to = 1,
}: FadeInProps) {
  const opacity = useSharedValue(to); // Start at target to prevent flash

  useFocusEffect(
    useCallback(() => {
      // Reset and animate
      opacity.value = from;
      opacity.value = withDelay(
        delay,
        withTiming(to, {
          duration,
          easing: EASING.easeOut,
        })
      );

      return () => {
        opacity.value = to; // Ensure visible when leaving
      };
    }, [delay, duration, from, to])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
