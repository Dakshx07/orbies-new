import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  runOnJS,
  cancelAnimation,
  SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface BubbleProps {
  id: string;
  x: number;
  y: number;
  size: number;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  canvasWidth: number;
  canvasHeight: number;
  onPop: (id: string) => void;
}

const NUM_PARTICLES = 8;

interface ParticleProps {
  index: number;
  size: number;
  popProgress: SharedValue<number>;
}

const PopParticle: React.FC<ParticleProps> = ({ index, size, popProgress }) => {
  const angle = (index * 2 * Math.PI) / NUM_PARTICLES;
  const particleSize = size * 0.18;

  const particleAnimatedStyle = useAnimatedStyle(() => {
    if (popProgress.value === 0) {
      return { opacity: 0 };
    }

    const maxDist = size * 0.85;
    const dist = popProgress.value * maxDist;
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;

    const pScale = Math.max(0, 1 - popProgress.value * 1.1);
    const pOpacity = Math.max(0, 1 - popProgress.value * 1.25);

    return {
      transform: [{ translateX: px }, { translateY: py }, { scale: pScale }],
      opacity: pOpacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particleSize,
          height: particleSize,
          borderRadius: particleSize / 2,
          top: size / 2 - particleSize / 2,
          left: size / 2 - particleSize / 2,
        },
        particleAnimatedStyle,
      ]}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.1)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
      />
    </Animated.View>
  );
};

export const Bubble: React.FC<BubbleProps> = ({
  id,
  x,
  y,
  size,
  translateX,
  translateY,
  canvasWidth,
  canvasHeight,
  onPop,
}) => {
  const wobbleTime = useSharedValue(Math.random() * Math.PI * 2);
  const popProgress = useSharedValue(0);
  const isPopping = useSharedValue(false);

  // Organic wobble/bobbing animation
  React.useEffect(() => {
    wobbleTime.value = withRepeat(
      withTiming(wobbleTime.value + Math.PI * 2, {
        duration: 3500 + Math.random() * 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(wobbleTime);
    };
  }, [wobbleTime]);

  const handlePop = () => {
    'worklet';
    if (isPopping.value) return;
    isPopping.value = true;

    popProgress.value = withTiming(
      1,
      {
        duration: 350,
        easing: Easing.out(Easing.ease),
      },
      (finished) => {
        if (finished) {
          runOnJS(onPop)(id);
          // Reset pop states for when the bubble respawns
          popProgress.value = 0;
          isPopping.value = false;
        }
      }
    );
  };

  // Tap gesture for popping the bubble
  const tapGesture = Gesture.Tap().onEnd(() => {
    handlePop();
  });

  // Animated styles for the main bubble
  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    const buffer = size + 30;
    const rangeX = canvasWidth + 2 * buffer;
    const rangeY = canvasHeight + 2 * buffer;

    // Center wrap math
    const rawX = x + translateX.value + buffer;
    const rawY = y + translateY.value + buffer;

    const wrappedX = (((rawX % rangeX) + rangeX) % rangeX) - buffer;
    const wrappedY = (((rawY % rangeY) + rangeY) % rangeY) - buffer;

    // Wobble/deformation math
    const floatOffset = Math.sin(wobbleTime.value) * 6;
    const scaleX = 1 + Math.sin(wobbleTime.value * 1.6) * 0.05;
    const scaleY = 1 - Math.sin(wobbleTime.value * 1.6) * 0.05;
    const skewX = Math.cos(wobbleTime.value) * 0.02;

    const popScale = 1 + popProgress.value * 0.4;
    const popOpacity = popProgress.value > 0 ? Math.max(0, 1 - popProgress.value * 3.5) : 1;

    return {
      transform: [
        { translateX: wrappedX },
        { translateY: wrappedY + floatOffset },
        { scaleX: scaleX * popScale },
        { scaleY: scaleY * popScale },
        { skewX: `${skewX}rad` },
      ],
      opacity: popOpacity,
    };
  });

  // Render expanding splash particles when popped
  const renderParticles = () => {
    return Array.from({ length: NUM_PARTICLES }).map((_, index) => (
      <PopParticle key={index} index={index} size={size} popProgress={popProgress} />
    ));
  };

  const bubbleRadius = size / 2;

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={[
          styles.container,
          {
            width: size,
            height: size,
          },
          bubbleAnimatedStyle,
        ]}>
        {/* Soft Drop Shadow under the bubble */}
        <View
          style={[
            styles.shadow,
            {
              width: size,
              height: size,
              borderRadius: bubbleRadius,
            },
          ]}
        />

        {/* Outer Highlight Border */}
        <View style={[styles.bubbleBody, { borderRadius: bubbleRadius }]}>
          {/* Iridescent Thin Film Color Wash */}
          <LinearGradient
            colors={[
              'rgba(255, 90, 180, 0.16)', // Pink/Magenta hue
              'rgba(70, 210, 255, 0.16)', // Cyan hue
              'rgba(255, 220, 80, 0.08)', // Soft Yellow hue
              'rgba(255, 255, 255, 0.02)',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Inner Glow Border (bright refraction edge) */}
          <View style={[styles.innerGlow, { borderRadius: bubbleRadius - 2 }]} />

          {/* Primary Top-Left Specular Reflection Crescent */}
          <View
            style={[
              styles.primaryHighlight,
              {
                width: size * 0.55,
                height: size * 0.22,
                top: size * 0.07,
                left: size * 0.13,
                borderRadius: size * 0.11,
              },
            ]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.85)', 'rgba(255, 255, 255, 0)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
            />
          </View>

          {/* Secondary Bottom-Right Specular Bounce Reflection */}
          <View
            style={[
              styles.secondaryHighlight,
              {
                width: size * 0.2,
                height: size * 0.2,
                bottom: size * 0.14,
                right: size * 0.14,
                borderRadius: size * 0.1,
              },
            ]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.55)', 'rgba(255, 255, 255, 0)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
            />
          </View>
        </View>

        {/* Pop Particles (Expanding Outward) */}
        {renderParticles()}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  shadow: {
    position: 'absolute',
    backgroundColor: 'rgba(30, 45, 90, 0.03)',
    shadowColor: '#1a2b5c',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 7,
    elevation: 4,
  },
  bubbleBody: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.8,
    borderColor: 'rgba(40, 75, 140, 0.32)',
    overflow: 'hidden',
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    margin: 1.8,
  },
  primaryHighlight: {
    position: 'absolute',
    transform: [{ rotate: '-28deg' }],
  },
  secondaryHighlight: {
    position: 'absolute',
  },
  particle: {
    position: 'absolute',
    borderWidth: 0.8,
    borderColor: 'rgba(40, 75, 140, 0.38)',
    overflow: 'hidden',
  },
});
