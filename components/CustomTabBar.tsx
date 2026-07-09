import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  // Find current active route index mapping to index (Home) or two (Explore)
  const activeRouteName = state.routes[state.index].name;

  const navigateToTab = (tabName: string) => {
    navigation.navigate(tabName);
  };

  return (
    <View style={[styles.container, { bottom: insets.bottom + 16 }]}>
      <View style={styles.bar}>
        {/* Item 1: Home (Index Tab) */}
        <Pressable
          onPress={() => navigateToTab('index')}
          style={styles.tabButton}
        >
          {activeRouteName === 'index' ? (
            <View style={styles.activeIconCircle}>
              <Feather name="home" size={18} color="#000000" />
            </View>
          ) : (
            <Feather name="home" size={18} color="rgba(255, 255, 255, 0.85)" />
          )}
        </Pressable>

        {/* Item 2: Search (Two Tab) */}
        <Pressable
          onPress={() => navigateToTab('two')}
          style={styles.tabButton}
        >
          {activeRouteName === 'two' ? (
            <View style={styles.activeIconCircle}>
              <Feather name="search" size={18} color="#000000" />
            </View>
          ) : (
            <Feather name="search" size={18} color="rgba(255, 255, 255, 0.85)" />
          )}
        </Pressable>

        {/* Item 3: Likes (Heart - Placeholder) */}
        <View style={styles.tabButton}>
          <Feather name="heart" size={18} color="rgba(255, 255, 255, 0.85)" />
        </View>

        {/* Item 4: Messages (Paper Airplane - Placeholder) */}
        <View style={styles.tabButton}>
          <Feather name="send" size={17} color="rgba(255, 255, 255, 0.85)" style={styles.sendIcon} />
        </View>

        {/* Item 5: Profile (Avatar - Placeholder) */}
        <View style={styles.tabButton}>
          <View style={styles.avatarPlaceholder} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    pointerEvents: 'box-none',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#737373', // Rich graphite gray capsule
    borderRadius: 26,
    height: 52,
    width: 290,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF', // Selected tab white circle highlight
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  sendIcon: {
    transform: [{ rotate: '-15deg' }, { translateY: -1 }],
  },
  avatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEFCF7', // Warm off-white avatar circle matching brand theme
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
});
