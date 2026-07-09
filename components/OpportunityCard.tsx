import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export interface OpportunityData {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  goingCount: number;
  viewsCount: number;
  isFeatured?: boolean;
}

interface OpportunityCardProps {
  opportunity: OpportunityData;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const [joined, setJoined] = useState(false);
  
  // Animation value for Join button press feedback
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleJoinPress = () => {
    // Micro scale bounce feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.0,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setJoined(!joined);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Left Featured Square */}
        <View style={styles.imagePlaceholder}>
          {opportunity.isFeatured && (
            <Ionicons name="star" size={24} color="#FF7A00" style={styles.starIcon} />
          )}
        </View>

        {/* Middle Info Column */}
        <View style={styles.infoColumn}>
          <Text style={styles.titleText}>
            {opportunity.title} • {opportunity.location}
          </Text>

          {/* Date Row */}
          <View style={styles.infoRow}>
            <Feather name="briefcase" size={14} color="#FF7A00" style={styles.rowIcon} />
            <Text style={styles.infoText}>
              {opportunity.startDate} → {opportunity.endDate}
            </Text>
          </View>

          {/* Attendees Row */}
          <View style={styles.infoRow}>
            <Feather name="users" size={14} color="#FF7A00" style={styles.rowIcon} />
            <Text style={styles.infoText}>
              {opportunity.goingCount} going!
            </Text>
          </View>
        </View>

        {/* Right Views Indicator */}
        <View style={styles.viewsContainer}>
          <Feather name="eye" size={14} color="#A3A3A3" style={styles.eyeIcon} />
          <Text style={styles.viewsText}>{opportunity.viewsCount}</Text>
        </View>
      </View>

      {/* Bottom Button Actions Row */}
      <View style={styles.actionsRow}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1.1 }}>
          <Pressable
            onPress={handleJoinPress}
            style={[
              styles.joinButton,
              joined && styles.joinedButtonState
            ]}
          >
            <Feather 
              name={joined ? "check" : "plus"} 
              size={14} 
              color="#FFF" 
              style={styles.btnIcon} 
            />
            <Text style={styles.joinButtonText}>
              {joined ? "Joined" : "Join"}
            </Text>
          </Pressable>
        </Animated.View>

        <Pressable style={styles.inviteButton}>
          <Feather name="user-plus" size={14} color="#000" style={styles.btnIcon} />
          <Text style={styles.inviteButtonText}>Invite</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    // Soft shadow for premium look
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imagePlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    // Exact orange star in Figma design
  },
  infoColumn: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rowIcon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
    letterSpacing: -0.1,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eyeIcon: {
    marginRight: 4,
  },
  viewsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A3A3A3',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  joinButton: {
    backgroundColor: '#000000',
    borderRadius: 100,
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinedButtonState: {
    backgroundColor: '#2E7D32', // Green for joined confirmation
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  inviteButton: {
    flex: 1,
    backgroundColor: '#FFF1E0', // Soft peach/beige button background matching screenshot
    borderRadius: 100,
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 0, 0.08)',
  },
  inviteButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  btnIcon: {
    marginRight: 4,
  },
});
