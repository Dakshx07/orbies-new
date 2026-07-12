import React, { useRef } from 'react';
import { StyleSheet, View, Image, Text, Pressable, Animated } from 'react-native';
import AnimatedReanimated, {
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';

interface ClayStickerProps {
  id: string;
  x: number;
  y: number;
  size: number;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  canvasWidth: number;
  canvasHeight: number;
  onPress?: (id: string) => void;
  source?: any;
  label?: string; // Optional text label (used for city choice options)
}

export const ClaySticker: React.FC<ClayStickerProps> = ({
  id,
  x,
  y,
  size,
  translateX,
  translateY,
  canvasWidth,
  canvasHeight,
  onPress,
  source,
  label,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Reanimated style for translating and wrapping the sticker infinitely
  const stickerAnimatedStyle = useAnimatedStyle(() => {
    const buffer = size + 30;
    const rangeX = canvasWidth + 2 * buffer;
    const rangeY = canvasHeight + 2 * buffer;

    // Center wrap math
    const rawX = x + translateX.value + buffer;
    const rawY = y + translateY.value + buffer;

    const wrappedX = (((rawX % rangeX) + rangeX) % rangeX) - buffer;
    const wrappedY = (((rawY % rangeY) + rangeY) % rangeY) - buffer;

    return {
      transform: [
        { translateX: wrappedX },
        { translateY: wrappedY },
      ],
    };
  });

  return (
    <AnimatedReanimated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
        stickerAnimatedStyle,
      ]}
    >
      <Pressable
        onPressIn={onPress ? handlePressIn : undefined}
        onPressOut={onPress ? handlePressOut : undefined}
        onPress={onPress ? () => onPress(id) : undefined}
        disabled={!onPress}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View
          style={[
            styles.innerWrapper,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Render pure transparent 3D Clay Icon (No bubble shape, no borders, no wobble) */}
          {source && !label && (
            <Image
              source={source}
              style={styles.clayImage}
            />
          )}

          {/* Render clean text badge for offline selection options */}
          {label && (
            <View style={styles.labelCard}>
              <Text style={styles.labelText}>{label.toLowerCase()}</Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </AnimatedReanimated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  innerWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clayImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
  labelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FF7C54',
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  labelText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '850',
    color: '#FF7C54',
    textAlign: 'center',
  },
});
