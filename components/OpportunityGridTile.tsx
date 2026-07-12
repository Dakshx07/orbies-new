import React, { useRef } from 'react';
import { StyleSheet, View, Text, Image, Pressable, Animated } from 'react-native';

export interface OpportunityGridData {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  goingCount: number;
  viewsCount: number;
  category: string;
}

interface OpportunityGridTileProps {
  item: OpportunityGridData;
  source: any; // Image source passed from the parent component
  onPress?: () => void;
}

export const OpportunityGridTile: React.FC<OpportunityGridTileProps> = ({ item, source, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={styles.tileContainer}
    >
      <Animated.View
        style={[
          styles.tileCard,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* 3D clay icon area */}
        <View style={styles.iconContainer}>
          <Image source={source} style={styles.clayImage} />
        </View>

        {/* Info area */}
        <View style={styles.infoContainer}>
          <Text style={styles.titleText} numberOfLines={2}>
            {item.title.toLowerCase()}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{item.location.toLowerCase()}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaText}>{item.category.toLowerCase()}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tileContainer: {
    flex: 1,
    padding: 6,
    maxWidth: '50%', // 2 columns layout
  },
  tileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E4DF', // Soft, clean off-white border
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 180,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: '100%',
    aspectRatio: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6', // Things.co minimal background tint
    borderRadius: 10,
    marginBottom: 10,
  },
  clayImage: {
    width: '78%',
    height: '78%',
    resizeMode: 'contain',
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  titleText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  metaText: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500',
    color: '#8A8884',
  },
  dot: {
    fontSize: 8,
    color: '#8A8884',
    marginHorizontal: 4,
  },
});
