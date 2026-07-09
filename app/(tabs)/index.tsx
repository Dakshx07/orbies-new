import React from 'react';
import { StyleSheet, View, Dimensions, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, withDecay } from 'react-native-reanimated';

import { SvgComponent } from '../../components/SvgComponent';
import { Bubble } from '../../components/Bubble';

const { width: INITIAL_WIDTH, height: INITIAL_HEIGHT } = Dimensions.get('window');
const MIN_GAP = 95; // Minimum space between bubble borders

interface BubbleData {
  id: string;
  x: number;
  y: number;
  size: number;
}

// Non-overlapping Dart Throwing generator based on target canvas size
const generateSpacedBubbles = (canvasWidth: number, canvasHeight: number): BubbleData[] => {
  const list: BubbleData[] = [];
  const sizes = [55, 70, 75, 90, 100, 115, 120, 135, 150]; // Varied sizes
  const numBubbles = 15; // Moderate count to keep them well spaced out

  for (let i = 0; i < numBubbles; i++) {
    const size = sizes[i % sizes.length];
    let x = 0;
    let y = 0;
    let attempts = 0;
    let foundPlace = false;

    while (attempts < 1000 && !foundPlace) {
      x = Math.random() * (canvasWidth - size - 40) + 20;
      y = Math.random() * (canvasHeight - size - 40) + 20;

      let overlap = false;
      for (const other of list) {
        const dx = x + size / 2 - (other.x + other.size / 2);
        const dy = y + size / 2 - (other.y + other.size / 2);
        const distance = Math.hypot(dx, dy);
        const minDistance = (size + other.size) / 2 + MIN_GAP;

        if (distance < minDistance) {
          overlap = true;
          break;
        }
      }

      if (!overlap) {
        foundPlace = true;
      }
      attempts++;
    }

    list.push({ id: `bubble_${i}`, x, y, size });
  }

  return list;
};

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Dynamic canvas size (2x the screen area)
  const canvasWidth = screenWidth * 2.0;
  const canvasHeight = screenHeight * 2.0;

  // Scroll translation shared values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Drag start state
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Initialize bubbles state ONCE using initial dimensions
  const [bubbles, setBubbles] = React.useState<BubbleData[]>(() =>
    generateSpacedBubbles(INITIAL_WIDTH * 2.0, INITIAL_HEIGHT * 2.0)
  );

  // Dynamic non-overlapping pop/respawn handler
  const handlePop = React.useCallback(
    (id: string) => {
      setBubbles((prev) => {
        const bubbleIndex = prev.findIndex((b) => b.id === id);
        if (bubbleIndex === -1) return prev;

        const size = prev[bubbleIndex].size;
        const otherBubbles = prev.filter((b) => b.id !== id);

        let x = 0;
        let y = 0;
        let attempts = 0;
        let foundPlace = false;

        while (attempts < 1000 && !foundPlace) {
          x = Math.random() * (canvasWidth - size - 40) + 20;
          y = Math.random() * (canvasHeight - size - 40) + 20;

          let overlap = false;
          for (const other of otherBubbles) {
            const dx = x + size / 2 - (other.x + other.size / 2);
            const dy = y + size / 2 - (other.y + other.size / 2);
            const distance = Math.hypot(dx, dy);
            const minDistance = (size + other.size) / 2 + MIN_GAP;

            if (distance < minDistance) {
              overlap = true;
              break;
            }
          }

          if (!overlap) {
            foundPlace = true;
          }
          attempts++;
        }

        const next = [...prev];
        next[bubbleIndex] = { id, x, y, size };
        return next;
      });
    },
    [canvasWidth, canvasHeight]
  );

  // Pan gesture configuration with withDecay physics for scroll momentum/inertia
  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd((event) => {
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: undefined, // Infinite bounds
      });
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: undefined, // Infinite bounds
      });
    });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Floating Canvas Gestures */}
      <GestureDetector gesture={panGesture}>
        <View style={StyleSheet.absoluteFill}>
          {bubbles.map((bubble) => (
            <Bubble
              key={bubble.id}
              id={bubble.id}
              x={bubble.x}
              y={bubble.y}
              size={bubble.size}
              translateX={translateX}
              translateY={translateY}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              onPop={handlePop}
            />
          ))}
        </View>
      </GestureDetector>

      {/* Fixed Brand Header Logo (Top notch safe zone) */}
      <View style={[styles.headerContainer, { top: insets.top + 10 }]}>
        <SvgComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCF7', // Warm off-white background
  },
  headerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none', // Allow gesture events to pass through the header area
  },
});
