// src/components/common/ParallaxScrollView.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

interface ParallaxScrollViewProps {
  children: React.ReactNode;
}

export const ParallaxScrollView: React.FC<ParallaxScrollViewProps> = ({ children }) => {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView
      style={styles.scrollView}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      {children}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});