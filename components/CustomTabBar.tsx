import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

// --- Custom Reicon Components from reicon.dev ---

interface ReiconProps {
  color: string;
  size?: number;
}

const ReiconHome: React.FC<ReiconProps> = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.44661 15.3975C9.11385 15.1508 8.64413 15.2206 8.39748 15.5534C8.15082 15.8862 8.22062 16.3559 8.55339 16.6025C9.5258 17.3233 10.715 17.75 12 17.75C13.285 17.75 14.4742 17.3233 15.4466 16.6025C15.7794 16.3559 15.8492 15.8862 15.6025 15.5534C15.3559 15.2206 14.8862 15.1508 14.5534 15.3975C13.825 15.9373 12.9459 16.25 12 16.25C11.0541 16.25 10.175 15.9373 9.44661 15.3975Z"
      fill={color}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 1.25C11.2919 1.25 10.6485 1.45282 9.95055 1.79224C9.27585 2.12035 8.49642 2.60409 7.52286 3.20832L5.45628 4.4909C4.53509 5.06261 3.79744 5.5204 3.2289 5.95581C2.64015 6.40669 2.18795 6.86589 1.86131 7.46263C1.53535 8.05812 1.38857 8.69174 1.31819 9.4407C1.24999 10.1665 1.24999 11.0541 1.25 12.1672V13.7799C1.24999 15.6837 1.24998 17.1866 1.4027 18.3616C1.55937 19.567 1.88856 20.5401 2.63236 21.3094C3.37958 22.0824 4.33046 22.4277 5.50761 22.5914C6.64849 22.75 8.10556 22.75 9.94185 22.75H14.0581C15.8944 22.75 17.3515 22.75 18.4924 22.5914C19.6695 22.4277 20.6204 22.0824 21.3676 21.3094C22.1114 20.5401 22.4406 19.567 22.5973 18.3616C22.75 17.1866 22.75 15.6838 22.75 13.7799V12.1672C22.75 11.0541 22.75 10.1665 22.6818 9.4407C22.6114 8.69174 22.4646 8.05812 22.1387 7.46263C21.8121 6.86589 21.3599 6.40669 20.7711 5.95581C20.2026 5.5204 19.4649 5.06262 18.5437 4.49091L16.4771 3.20831C15.5036 2.60409 14.7241 2.12034 14.0494 1.79224C13.3515 1.45282 12.7081 1.25 12 1.25ZM8.27953 4.50412C9.29529 3.87371 10.0095 3.43153 10.6065 3.1412C11.1882 2.85833 11.6002 2.75 12 2.75C12.3998 2.75 12.8118 2.85833 13.3935 3.14119C13.9905 3.43153 14.7047 3.87371 15.7205 4.50412L17.7205 5.74537C18.6813 6.34169 19.3559 6.76135 19.8591 7.1467C20.3487 7.52164 20.6303 7.83106 20.8229 8.18285C21.0162 8.53589 21.129 8.94865 21.1884 9.58104C21.2492 10.2286 21.25 11.0458 21.25 12.2039V13.725C21.25 15.6959 21.2485 17.1012 21.1098 18.1683C20.9736 19.2163 20.717 19.8244 20.2892 20.2669C19.8649 20.7058 19.2871 20.9664 18.2858 21.1057C17.2602 21.2483 15.9075 21.25 14 21.25H10C8.09247 21.25 6.73983 21.2483 5.71422 21.1057C4.71286 20.9664 4.13514 20.7058 3.71079 20.2669C3.28301 19.8244 3.02642 19.2163 2.89019 18.1683C2.75149 17.1012 2.75 15.6959 2.75 13.725V12.2039C2.75 11.0458 2.75076 10.2286 2.81161 9.58104C2.87103 8.94865 2.98385 8.53589 3.17709 8.18285C3.36965 7.83106 3.65133 7.52164 4.14092 7.1467C4.6441 6.76135 5.31869 6.34169 6.27953 5.74537L8.27953 4.50412Z"
      fill={color}
    />
  </Svg>
);

const ReiconSearch: React.FC<ReiconProps> = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.489 17.5497C14.8753 18.922 12.7843 19.75 10.5 19.75C5.39137 19.75 1.25 15.6086 1.25 10.5C1.25 5.39137 5.39137 1.25 10.5 1.25C15.6086 1.25 19.75 5.39137 19.75 10.5C19.75 12.7843 18.922 14.8753 17.5497 16.489L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L16.489 17.5497ZM2.75 10.5C2.75 6.21979 6.21979 2.75 10.5 2.75C14.7802 2.75 18.25 6.21979 18.25 10.5C18.25 12.589 17.4235 14.485 16.0796 15.8788C16.0408 15.905 16.004 15.9353 15.9697 15.9697C15.9353 16.004 15.905 16.0408 15.8788 16.0796C14.485 17.4235 12.589 18.25 10.5 18.25C6.21979 18.25 2.75 14.7802 2.75 10.5Z"
      fill={color}
    />
  </Svg>
);

const ReiconHeart: React.FC<ReiconProps> = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.25 9.47438C1.25 5.6858 3.85795 2.25 7.89333 2.25C9.76025 2.25 11.1058 3.06969 12 3.91063C12.8942 3.06969 14.2398 2.25 16.1067 2.25C20.1421 2.25 22.75 5.6858 22.75 9.47438C22.75 13.301 20.4395 16.37 18.0621 18.4936C15.6837 20.6183 13.0963 21.9251 12.2372 22.2115L12 22.2906L11.7628 22.2115C10.9037 21.9251 8.31635 20.6183 5.93786 18.4936C3.56046 16.37 1.25 13.301 1.25 9.47438ZM7.89333 3.75C4.87317 3.75 2.75 6.3142 2.75 9.47438C2.75 12.6733 4.68954 15.3672 6.93714 17.375C8.96385 19.1854 11.1258 20.3336 12 20.6978C12.8742 20.3336 15.0361 19.1854 17.0629 17.375C19.3105 15.3672 21.25 12.6733 21.25 9.47438C21.25 6.3142 19.1268 3.75 16.1067 3.75C14.3941 3.75 13.2603 4.66987 12.5731 5.48383L12 6.16259L11.4269 5.48383C10.7397 4.66987 9.60595 3.75 7.89333 3.75Z"
      fill={color}
    />
  </Svg>
);

const ReiconSend: React.FC<ReiconProps> = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.5615 5.64099C23.4636 3.04509 20.9861 0.522263 18.3803 1.44085L3.44476 6.70576C0.578346 7.71619 0.500509 11.7624 3.32388 12.8849L3.3397 12.891L8.29288 14.7318C8.75501 14.9178 9.12031 15.2916 9.2978 15.764L11.222 20.6243C12.3084 23.4996 16.3744 23.4454 17.3839 20.5402L22.5615 5.64099ZM18.8789 2.85553C20.2743 2.36365 21.643 3.71458 21.1447 5.14861L15.9671 20.0478C15.4171 21.6302 13.2126 21.6573 12.6238 20.0902L10.6996 15.2299C10.6224 15.0256 10.5257 14.8311 10.4119 14.6487L14.0303 11.0303C14.3232 10.7374 14.3232 10.2626 14.0303 9.96967C13.7374 9.67678 13.2626 9.67678 12.9697 9.96967L9.34872 13.5906C9.18799 13.4915 9.01788 13.4058 8.83985 13.335L8.82404 13.3289L3.87079 11.4881C2.34161 10.8732 2.38813 8.6687 3.94344 8.12043L18.8789 2.85553Z"
      fill={color}
    />
  </Svg>
);

// --- Custom Animated Tab Button ---

interface TabButtonProps {
  active: boolean;
  onPress?: () => void;
  children: (color: string) => React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onPress, children }) => {
  const activeAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(activeAnim, {
      toValue: active ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [active]);

  const scale = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const iconColor = active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)';

  return (
    <Pressable onPress={onPress} style={styles.tabButton}>
      <Animated.View
        style={[
          styles.activeIconCircle,
          {
            opacity: activeAnim,
            transform: [{ scale }],
          },
        ]}
      />
      <View style={styles.iconContentContainer}>
        {children(iconColor)}
      </View>
    </Pressable>
  );
};

// --- Custom Tab Bar Component ---

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const activeRouteName = state.routes[state.index].name;

  const navigateToTab = (tabName: string) => {
    navigation.navigate(tabName);
  };

  return (
    <View style={[styles.container, { bottom: insets.bottom + 16 }]}>
      <View style={styles.bar}>
        {/* Item 1: Search (Two Tab) */}
        <TabButton
          active={activeRouteName === 'two'}
          onPress={() => navigateToTab('two')}
        >
          {(color) => <ReiconSearch color={color} size={25} />}
        </TabButton>

        {/* Item 2: Likes (Heart - Placeholder) */}
        <TabButton active={false}>
          {(color) => <ReiconHeart color={color} size={25} />}
        </TabButton>

        {/* Item 3: Home (Index Tab) */}
        <TabButton
          active={activeRouteName === 'index'}
          onPress={() => navigateToTab('index')}
        >
          {(color) => <ReiconHome color={color} size={25} />}
        </TabButton>

        {/* Item 4: Messages (Send - Placeholder) */}
        <TabButton active={false}>
          {(color) => <ReiconSend color={color} size={25} />}
        </TabButton>

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
    borderRadius: 32, // Perfect capsule shape for 64px height (64 / 2 = 32)
    height: 64, // Exact Figma height specification
    width: 284, // Exact Figma width specification
    paddingHorizontal: 12, // Tight spacing between icons
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeIconCircle: {
    position: 'absolute',
    width: 40, // Centered highlight circle
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Premium soft translucent highlight matching Figma
  },
  iconContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
