import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, withDecay } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

import { SvgComponent } from '../../components/SvgComponent';
import { ClaySticker } from '../../components/ClaySticker';
import { OpportunityGridData } from '../../components/OpportunityGridTile';

const { width: INITIAL_WIDTH, height: INITIAL_HEIGHT } = Dimensions.get('window');
const MIN_GAP = 55; // Minimum space between bubbles
const CACHE_KEY = '@opportunities_cache';

interface FloatingBubbleData extends OpportunityGridData {
  x: number;
  y: number;
  size: number;
  source: any;
  shadowColor: string;
  rotateDeg: number;
}

// Mock datasets for offline city selection
const GOA_MOCK_DATA: OpportunityGridData[] = [
  {
    id: 'goa_1',
    title: 'beach clean up drive',
    location: 'anjuna, goa',
    startDate: 'Jul 15',
    endDate: 'Jul 20',
    goingCount: 14,
    viewsCount: 280,
    category: 'eco-action',
  },
  {
    id: 'goa_2',
    title: 'surf camp assistant',
    location: 'arambol, goa',
    startDate: 'Jul 18',
    endDate: 'Jul 25',
    goingCount: 8,
    viewsCount: 190,
    category: 'creative',
  },
  {
    id: 'goa_3',
    title: 'sea turtle conservation',
    location: 'morjim, goa',
    startDate: 'Jul 22',
    endDate: 'Aug 05',
    goingCount: 21,
    viewsCount: 410,
    category: 'eco-action',
  },
  {
    id: 'goa_4',
    title: 'ocean plastic sorting',
    location: 'calangute, goa',
    startDate: 'Jul 29',
    endDate: 'Jul 30',
    goingCount: 5,
    viewsCount: 110,
    category: 'eco-action',
  },
];

const MUMBAI_MOCK_DATA: OpportunityGridData[] = [
  {
    id: 'mumbai_1',
    title: 'street teaching drive',
    location: 'dharavi, mumbai',
    startDate: 'Jul 16',
    endDate: 'Jul 30',
    goingCount: 32,
    viewsCount: 520,
    category: 'education',
  },
  {
    id: 'mumbai_2',
    title: 'mobile health camp helper',
    location: 'chembur, mumbai',
    startDate: 'Jul 20',
    endDate: 'Jul 28',
    goingCount: 12,
    viewsCount: 260,
    category: 'medical',
  },
  {
    id: 'mumbai_3',
    title: 'local food distribution',
    location: 'dadar, mumbai',
    startDate: 'Jul 24',
    endDate: 'Jul 25',
    goingCount: 45,
    viewsCount: 380,
    category: 'eco-action',
  },
  {
    id: 'mumbai_4',
    title: 'slum reading room host',
    location: 'kurla, mumbai',
    startDate: 'Jul 29',
    endDate: 'Aug 05',
    goingCount: 9,
    viewsCount: 170,
    category: 'education',
  },
];

const BANGALORE_MOCK_DATA: OpportunityGridData[] = [
  {
    id: 'blr_1',
    title: 'community design workshop',
    location: 'indiranagar, blr',
    startDate: 'Jul 15',
    endDate: 'Jul 17',
    goingCount: 18,
    viewsCount: 490,
    category: 'design',
  },
  {
    id: 'blr_2',
    title: 'lake rejuvenation drive',
    location: 'bellandur, blr',
    startDate: 'Jul 19',
    endDate: 'Jul 20',
    goingCount: 29,
    viewsCount: 340,
    category: 'eco-action',
  },
  {
    id: 'blr_3',
    title: 'animal shelter assistant',
    location: 'sarjapur, blr',
    startDate: 'Jul 22',
    endDate: 'Jul 31',
    goingCount: 25,
    viewsCount: 430,
    category: 'creative',
  },
  {
    id: 'blr_4',
    title: 'junior ui design mentor',
    location: 'koramangala, blr',
    startDate: 'Jul 28',
    endDate: 'Jul 29',
    goingCount: 7,
    viewsCount: 220,
    category: 'design',
  },
];

const ONLINE_DEFAULT_DATA: OpportunityGridData[] = [
  ...BANGALORE_MOCK_DATA,
  ...GOA_MOCK_DATA,
  ...MUMBAI_MOCK_DATA,
];

// Map categories/titles to authentic high-quality 3D clay graphics from thiings.co Vercel Storage
const getStickerSource = (category: string, title: string = '') => {
  const normCat = category.toLowerCase();
  const normTitle = title.toLowerCase();

  // 1. Eco / cleanups / outdoor actions
  if (normTitle.includes('clean') || normTitle.includes('lake') || normTitle.includes('plastic')) {
    // Safety tape / caution tape
    return { uri: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-A9sQjcc9dRjdteLYbnzeg9RTGbXcDi.png' };
  }
  if (normTitle.includes('turtle') || normTitle.includes('animal') || normTitle.includes('conserv')) {
    // Black bird / Satin bowerbird
    return { uri: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-l7vk1RS9AFoVKEnVfmdeCYg7DME9JW.png' };
  }

  // 2. Design / creative / workshops
  if (normTitle.includes('design') || normTitle.includes('mentor') || normTitle.includes('creative')) {
    // Robotics Hackathon Laptop/arm
    return { uri: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-TmIleKuNC8usUe2GixbxEEvRi6S9wN.png' };
  }
  if (normTitle.includes('workshop') || normTitle.includes('camp')) {
    // Seaside pier / dock
    return { uri: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-vAcnTyxslohl83rANb7qHIJMfJd7Ia.png' };
  }

  // 3. Food/beverage distribution
  if (normTitle.includes('food') || normTitle.includes('distribution')) {
    // Shrimp Taco
    return { uri: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-CAU75Aa302ajFIseCWvXb7Ak2B2898.png' };
  }

  // 4. Education / teaching
  if (normCat.includes('edu') || normTitle.includes('teach') || normTitle.includes('reading')) {
    // Privacy policy / padlock document
    return { uri: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-vSXxF8u21GdIWRr8AtFn5sK74jIZN8.png' };
  }

  // 5. Medical
  if (normCat.includes('medi') || normTitle.includes('health')) {
    // Heating pad
    return { uri: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-8M1Ro1jRAFD5QFkEs7CKq8ElFuSbKb.png' };
  }

  // 6. Surf / Travel / Goa
  if (normTitle.includes('surf') || normTitle.includes('goa')) {
    // Lemonade
    return { uri: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ZhJKGhu1yVw0r8GsIUtr99PEKislWX.png' };
  }

  // Fallback defaults
  return { uri: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-j2RvL2vCjIPa5FakNO5QjPP6JY6ezI.png' }; // Spy/Agent
};

// Map categories to colored shadows
const getShadowColor = (category: string) => {
  const normCat = category.toLowerCase();
  if (normCat.includes('design') || normCat.includes('brand') || normCat.includes('creative')) {
    return 'rgba(226, 149, 120, 0.4)';
  }
  if (normCat.includes('clean') || normCat.includes('nature') || normCat.includes('eco')) {
    return 'rgba(140, 213, 255, 0.4)';
  }
  if (normCat.includes('travel') || normCat.includes('trip') || normCat.includes('goa')) {
    return 'rgba(245, 198, 165, 0.4)';
  }
  return 'rgba(255, 158, 158, 0.4)';
};

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Dynamic canvas size (1.35x screen size to allow comfortable sticker spacing while preventing empty screen voids)
  const canvasWidth = screenWidth * 1.35;
  const canvasHeight = screenHeight * 1.35;

  // Scroll translation shared values for infinite panning
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Drag start state
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const [opportunities, setOpportunities] = useState<OpportunityGridData[]>([]);
  const [bubbles, setBubbles] = useState<FloatingBubbleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isCachedState, setIsCachedState] = useState(false);

  // Selected opportunity for bottom sheet




  // Generate spaced coordinate structures for loaded opportunities
  const buildSpacedBubbles = useCallback(
    (data: OpportunityGridData[]): FloatingBubbleData[] => {
      const list: FloatingBubbleData[] = [];

      data.forEach((opp, i) => {
        const size = 100;
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

        list.push({
          ...opp,
          x,
          y,
          size,
          source: getStickerSource(opp.category, opp.title),
          shadowColor: getShadowColor(opp.category),
          rotateDeg: Math.random() * 20 - 10,
        });
      });

      return list;
    },
    [canvasWidth, canvasHeight]
  );

  // Load cache from AsyncStorage
  const loadCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setOpportunities(parsed);
        setBubbles(buildSpacedBubbles(parsed));
        setIsCachedState(true);
      }
    } catch (e) {
      console.log('Error reading storage cache:', e);
    }
  };

  // Write to AsyncStorage
  const saveCache = async (data: OpportunityGridData[]) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      setIsCachedState(false);
    } catch (e) {
      console.log('Error saving to storage cache:', e);
    }
  };

  // Simulate remote API fetch
  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    setError(false);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const freshData = ONLINE_DEFAULT_DATA;
      setOpportunities(freshData);
      setBubbles(buildSpacedBubbles(freshData));
      await saveCache(freshData);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [buildSpacedBubbles]);

  // Load cache first, then run initial background fetch
  useEffect(() => {
    const initialize = async () => {
      await loadCache();
      await fetchOpportunities();
    };
    initialize();
  }, [fetchOpportunities]);



  // Seed default city options when API fails and no cache exists
  const handleSelectDefaultOption = async (city: 'goa' | 'mumbai' | 'bangalore') => {
    let selectedData: OpportunityGridData[] = [];
    if (city === 'goa') selectedData = GOA_MOCK_DATA;
    else if (city === 'mumbai') selectedData = MUMBAI_MOCK_DATA;
    else if (city === 'bangalore') selectedData = BANGALORE_MOCK_DATA;

    setOpportunities(selectedData);
    setBubbles(buildSpacedBubbles(selectedData));
    await saveCache(selectedData);
    setError(false);
  };



  // Drag gesture configuration with momentum inertia
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
        clamp: undefined,
      });
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: undefined,
      });
    });

  // Loading initial state layout
  if (loading && opportunities.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#FF7C54" />
        <Text style={styles.loadingText}>loading floating canvas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Floating Canvas Area */}
      <GestureDetector gesture={panGesture}>
        <View style={StyleSheet.absoluteFill}>
          {/* Layout 1: Regular Opportunities Bubbles */}
          {!error && bubbles.map((bubble) => (
            <ClaySticker
              key={bubble.id}
              id={bubble.id}
              x={bubble.x}
              y={bubble.y}
              size={bubble.size}
              translateX={translateX}
              translateY={translateY}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              source={bubble.source}
            />
          ))}

          {/* Layout 2: Offline Fallback Selector Bubbles (when API fails and no cache exists) */}
          {error && opportunities.length === 0 && (
            <>
              {/* Floating city selector bubbles */}
              <ClaySticker
                id="choice_goa"
                x={screenWidth * 0.2}
                y={screenHeight * 0.3}
                size={120}
                translateX={translateX}
                translateY={translateY}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                onPress={() => handleSelectDefaultOption('goa')}
                source={null}
                label="goa"
              />
              <ClaySticker
                id="choice_mumbai"
                x={screenWidth * 0.75}
                y={screenHeight * 0.4}
                size={125}
                translateX={translateX}
                translateY={translateY}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                onPress={() => handleSelectDefaultOption('mumbai')}
                source={null}
                label="mumbai"
              />
              <ClaySticker
                id="choice_blr"
                x={screenWidth * 0.45}
                y={screenHeight * 0.6}
                size={130}
                translateX={translateX}
                translateY={translateY}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                onPress={() => handleSelectDefaultOption('bangalore')}
                source={null}
                label="blr"
              />
            </>
          )}
        </View>
      </GestureDetector>

      {/* Floating Brand Header */}
      <View style={[styles.fixedHeader, { top: insets.top + 10 }]}>
        <SvgComponent />
      </View>

      {/* Offline Alert info at the top if selector bubbles are active */}
      {error && opportunities.length === 0 && (
        <View style={[styles.offlinePanel, { top: insets.top + 70 }]}>
          <Text style={styles.offlineHeading}>api offline / no cache</Text>
          <Text style={styles.offlineSub}>
            tap one of the floating city bubbles to load default mock opportunities:
          </Text>
        </View>
      )}




    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCF7', // Warm premium off-white background
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 14,
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#8A8884',
  },
  fixedHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  offlinePanel: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E4DF',
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  offlineHeading: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5C5C',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  offlineSub: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500',
    color: '#8A8884',
    textAlign: 'center',
    lineHeight: 14,
  },


});
