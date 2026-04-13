/**
 * Sliding Window Wrapper Component
 * Handles smooth transitions between multiple selection screens
 */

import React, { useState } from 'react';
import { View, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export interface SlidingWindowProps {
  children: React.ReactNode[];
  currentStep: number;
  onStepChange?: (step: number) => void;
}

/**
 * SlidingWindow Component
 * Provides animated sliding transitions between windows
 */
export function SlidingWindow({ children, currentStep, onStepChange }: SlidingWindowProps) {
  const [animatedValue] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: -currentStep * width,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentStep, animatedValue]);

  const childArray = React.Children.toArray(children);

  return (
    <View className="flex-1 relative overflow-hidden">
      <Animated.View
        style={{
          transform: [{ translateX: animatedValue }],
          flexDirection: 'row',
          width: width * childArray.length,
          height: '100%',
        }}
      >
        {childArray.map((child, index) => (
          <View key={index} style={{ width, height: '100%' }}>
            {child}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

export default SlidingWindow;
