import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Pressable,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

import { LinearGradient } from 'expo-linear-gradient';
import { ExploreTextSvg } from '../../components/ExploreTextSvg';
import { OpportunityCard, OpportunityData } from '../../components/OpportunityCard';

// Dummy list of opportunities with rich realistic data
const INITIAL_OPPORTUNITIES: OpportunityData[] = [
  {
    id: 'opp_1',
    title: 'Beach Cleanup',
    location: 'Goa',
    startDate: 'Jul 1',
    endDate: 'Jul 20',
    goingCount: 8,
    viewsCount: 23,
    isFeatured: true,
  },
  {
    id: 'opp_2',
    title: 'Brand Designer',
    location: 'Goa',
    startDate: 'Jul 1',
    endDate: 'Jul 20',
    goingCount: 2,
    viewsCount: 14,
    isFeatured: true,
  },
  {
    id: 'opp_3',
    title: 'Brand Designer',
    location: 'Mumbai',
    startDate: 'Jul 1',
    endDate: 'Jul 20',
    goingCount: 2,
    viewsCount: 14,
    isFeatured: true,
  },
  {
    id: 'opp_4',
    title: 'Brand Designer',
    location: 'Goa',
    startDate: 'Jul 1',
    endDate: 'Jul 20',
    goingCount: 2,
    viewsCount: 14,
    isFeatured: false,
  },
  {
    id: 'opp_5',
    title: 'Tree Plantation Drive',
    location: 'Bangalore',
    startDate: 'Aug 10',
    endDate: 'Aug 15',
    goingCount: 18,
    viewsCount: 45,
    isFeatured: false,
  },
  {
    id: 'opp_6',
    title: 'UX Intern',
    location: 'Mumbai',
    startDate: 'Sep 1',
    endDate: 'Sep 30',
    goingCount: 5,
    viewsCount: 32,
    isFeatured: true,
  }
];

const FILTER_TAGS = ['All', 'Near me', 'Free', 'Paid', 'Trending'];

// Featured banner item datasets
interface BannerData {
  id: string;
  eyebrow: string;
  title: string;
  subText: string;
  bgImage: string;
}

const FEATURED_BANNERS: BannerData[] = [
  {
    id: 'b1',
    eyebrow: 'EVENT',
    title: 'World Tarot Day',
    subText: 'Discover the magic of tarot reading',
    bgImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600',
  },
  {
    id: 'b2',
    eyebrow: 'SPOTLIGHT',
    title: 'Design Masterclass',
    subText: 'Sharpen your product design craft',
    bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600',
  },
  {
    id: 'b3',
    eyebrow: 'CAMPAIGN',
    title: 'Goa Beach Cleanup',
    subText: 'Join the green movement this July',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
  },
];

// Swelling diamond gold symbol from Figma screenshot
const EventSymbol: React.FC = () => (
  <Svg width={18} height={42} viewBox="0 0 18 42" fill="none">
    <Path
      d="M9 2V12M9 30V40"
      stroke="url(#gold_grad)"
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Path
      d="M9 12C12.5 15.5 13.5 21 9 30C4.5 21 5.5 15.5 9 12Z"
      fill="url(#gold_grad)"
    />
    <Path
      d="M9 17L11.5 21L9 25L6.5 21L9 17Z"
      fill="#FFFFFF"
    />
    <Defs>
      <SvgLinearGradient id="gold_grad" x1="9" y1="2" x2="9" y2="40" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#FFD23F" />
        <Stop offset="0.5" stopColor="#FF9F1C" />
        <Stop offset="1" stopColor="#FF5400" />
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Filter list logic based on active search text and horizontal tag selection
  const filteredOpportunities = useMemo(() => {
    return INITIAL_OPPORTUNITIES.filter((opp) => {
      // 1. Text Search matching
      const matchesSearch =
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Tag filter mapping
      if (selectedTag === 'All') return true;
      if (selectedTag === 'Near me') return opp.location === 'Goa';
      if (selectedTag === 'Free') return opp.title.includes('Cleanup') || opp.title.includes('Drive');
      if (selectedTag === 'Paid') return opp.title.includes('Designer') || opp.title.includes('Intern');
      if (selectedTag === 'Trending') return opp.viewsCount > 20;

      return true;
    });
  }, [searchQuery, selectedTag]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <FlatList
        data={filteredOpportunities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OpportunityCard opportunity={item} />}
        ListHeaderComponent={
          <View style={[styles.headerWrapper, { paddingTop: insets.top + 8 }]}>
            {/* 1. Explore Cursive SVG Header */}
            <View style={styles.logoRow}>
              <ExploreTextSvg />
            </View>

            {/* 2. Interactive Search Box */}
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#000000B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
            </View>

            {/* 3. Horizontal Tags Scroll list — edge-to-edge, no container clipping */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tagsScrollView}
              contentContainerStyle={styles.tagsScrollContainer}
            >
              {FILTER_TAGS.map((tag) => {
                const isActive = selectedTag === tag;
                return (
                  <Pressable
                    key={tag}
                    onPress={() => setSelectedTag(tag)}
                    style={[styles.tagPill, isActive && styles.tagPillActive]}
                  >
                    <Text style={[styles.tagText, isActive && styles.tagTextActive]}>
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* 4. Large Spotlight Card Carousel/Banner with Liquid Glass Styles */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.bannerScrollView, { width: screenWidth }]}
              contentContainerStyle={styles.bannerContainer}
              snapToInterval={screenWidth - 68}
              decelerationRate="fast"
              contentOffset={{ x: screenWidth - 68, y: 0 }}
            >
              {FEATURED_BANNERS.map((banner) => (
                <ImageBackground
                  key={banner.id}
                  source={{ uri: banner.bgImage }}
                  style={[styles.bannerCard, { width: screenWidth - 80 }]}
                  imageStyle={styles.bannerCardImage}
                >
                  <LinearGradient
                    colors={['rgba(0, 18, 163, 0.4)', 'rgba(0, 0, 0, 0.72)']}
                    start={{ x: 0.2, y: 0 }}
                    end={{ x: 0.8, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                  />

                  <View style={styles.bannerContentRow}>
                    <View style={styles.symbolContainer}>
                      <EventSymbol />
                    </View>

                    <View style={styles.bannerTextColumn}>
                      <Text style={styles.bannerEyebrowText}>{banner.eyebrow}</Text>
                      <Text style={styles.bannerTitleText} numberOfLines={1}>{banner.title}</Text>
                      <Text style={styles.bannerSubText} numberOfLines={1}>{banner.subText}</Text>
                    </View>
                  </View>

                  <View style={styles.chevronCircle}>
                    <Feather name="chevron-right" size={16} color="#FFFFFF" />
                  </View>
                </ImageBackground>
              ))}
            </ScrollView>

            {/* 5. Section Header Text Row — Caveat handwritten font */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitleText}>All opportunities</Text>
              <Text style={styles.sectionCountText}>{filteredOpportunities.length} found!</Text>
            </View>
          </View>
        }
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + 84 }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="search" size={48} color="#D6D6D6" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No opportunities found matching search criteria.</Text>
          </View>
        }
      />

      {/* Bottom Gradient Fade-out Overlay */}
      <LinearGradient
        colors={['rgba(254, 252, 247, 0)', 'rgba(254, 252, 247, 0.95)', '#FEFCF7']}
        locations={[0, 0.5, 1]}
        style={[styles.bottomFadeOverlay, { height: insets.bottom + 90 }]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCF7', // Warm off-white cream background
  },
  bottomFadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  headerWrapper: {
    paddingTop: 8,
    marginBottom: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginLeft: 2,   // Figma: left: 40px (listContainer already adds 20)
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 28,
    height: 44,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
  },
  tagsScrollView: {
    marginHorizontal: -20,
  },
  tagsScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 2,
    paddingBottom: 16,
    gap: 8,
  },
  tagPill: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagPillActive: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  tagTextActive: {
    color: '#FFFFFF',
  },
  bannerScrollView: {
    marginHorizontal: -20,
    width: '100%',
  },
  bannerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 40, // Allows symmetric 28px peek on both left & right edges
    marginBottom: 24,
    gap: 12,
  },

  bannerCard: {
    height: 104, // Slightly taller for premium layout
    borderRadius: 24, // Sleek capsule shape matching opportunity card
    overflow: 'hidden',
    justifyContent: 'center',
    position: 'relative',
  },
  bannerCardImage: {
    borderRadius: 24,
  },
  bannerContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 64, // Keep spacing for chevron circle
  },
  symbolContainer: {
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTextColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerEyebrowText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B0C8FF', // Light purple/blue eyebrow text
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  bannerTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  bannerSubText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  chevronCircle: {
    position: 'absolute',
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glassmorphic background chevron
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
    paddingTop: 6, // Top clearance for tall cursive letters
  },
  sectionTitleText: {
    fontFamily: 'Caveat_700Bold',  // Figma Hand equivalent
    fontSize: 24,
    color: '#1A1A1A',
  },
  sectionCountText: {
    fontFamily: 'Caveat_700Bold',  // Figma Hand equivalent
    fontSize: 22,
    color: '#FF7A00',
    paddingRight: 8, // Safety padding to prevent cursive exclamation mark clipping
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A3A3A3',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
