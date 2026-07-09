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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

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

  // Render header elements inside FlatList ListHeaderComponent to avoid nesting scrollview warnings
  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      {/* Background Gradient Glow Blur Effect */}
      <View style={styles.glowOverlay}>
        <LinearGradient
          colors={['rgba(255, 122, 0, 0.08)', 'rgba(255, 122, 0, 0.02)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>

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
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* 3. Horizontal Tags Scroll list */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
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

      {/* 4. Large Orange Spotlight Card Carousel/Banner */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bannerContainer}
        snapToInterval={screenWidth - 60}
        decelerationRate="fast"
      >
        {/* Main orange banner block from Figma mockup */}
        <View style={[styles.orangeBanner, { width: screenWidth - 64 }]}>
          <Text style={styles.bannerTitleText}>Goa Beach Cleanup Campaign</Text>
          <Text style={styles.bannerSubText}>Join the movement this July</Text>
          
          <View style={styles.chevronCircle}>
            <Feather name="chevron-right" size={24} color="#FF7A00" />
          </View>
        </View>

        {/* Secondary banner for slider depth effect */}
        <View style={[styles.orangeBanner, styles.orangeBannerSecondary, { width: screenWidth - 64 }]}>
          <Text style={styles.bannerTitleText}>Design Masterclass</Text>
          <Text style={styles.bannerSubText}>Sharpen your product design craft</Text>
          
          <View style={styles.chevronCircle}>
            <Feather name="chevron-right" size={24} color="#FF5100" />
          </View>
        </View>
      </ScrollView>

      {/* 5. Section Header Text Row */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitleText}>All opportunities</Text>
        <Text style={styles.sectionCountText}>{filteredOpportunities.length} found!</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <FlatList
        data={filteredOpportunities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OpportunityCard opportunity={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="search" size={48} color="#D6D6D6" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No opportunities found matching search criteria.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCF7', // Warm off-white cream background
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 110, // Safe padding to prevent floating tab bar overlap
  },
  headerWrapper: {
    paddingTop: 10,
    marginBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  tagsScrollContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    marginBottom: 20,
    gap: 8,
  },
  tagPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagPillActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  tagTextActive: {
    color: '#FFFFFF',
  },
  bannerContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  glowOverlay: {
    position: 'absolute',
    top: 130,
    left: -20,
    right: -20,
    height: 250,
    zIndex: -1,
  },
  orangeBanner: {
    height: 96,
    backgroundColor: '#FF7A00', // Brand Orange
    borderRadius: 32,
    padding: 20,
    justifyContent: 'center',
    position: 'relative',
    // Premium drop shadow (large blurred orange shadow)
    shadowColor: '#FF7A00',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 6,
  },
  orangeBannerSecondary: {
    backgroundColor: '#FF5100', // Crimson orange for secondary carousel card
    shadowColor: '#FF5100',
  },
  bannerTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  bannerSubText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  chevronCircle: {
    position: 'absolute',
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.24,
    lineHeight: 20,
  },
  sectionCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF7A00',
    letterSpacing: -0.2,
    lineHeight: 20,
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
