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
            <Ionicons name="star" size={18} color="#FF7A00" style={styles.starIcon} />
          )}
        </View>

        {/* Middle Info Column */}
        <View style={styles.infoColumn}>
          <Text style={styles.titleText}>
            {opportunity.title} • {opportunity.location}
          </Text>

          {/* Metadata Row (Dates & Attendees side-by-side in one row) */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="briefcase" size={14} color="#FF7A00" style={styles.rowIcon} />
              <Text style={styles.infoText}>
                {opportunity.startDate} → {opportunity.endDate}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Feather name="users" size={14} color="#FF7A00" style={styles.rowIcon} />
              <Text style={styles.infoText}>
                {opportunity.goingCount} going!
              </Text>
            </View>
          </View>

          {/* Button Actions Row (now inside infoColumn, next to square box) */}
          <View style={styles.actionsRow}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1 }}>
              <Pressable
                onPress={handleJoinPress}
                style={[
                  styles.joinButton,
                  joined && styles.joinedButtonState
                ]}
              >
                <Feather 
                  name={joined ? "check" : "plus"} 
                  size={13} 
                  color="#FFF" 
                  style={styles.btnIcon} 
                />
                <Text style={styles.joinButtonText}>
                  {joined ? "Joined" : "Join"}
                </Text>
              </Pressable>
            </Animated.View>

            <Pressable style={styles.inviteButton}>
              <Feather name="user-plus" size={13} color="#000" style={styles.btnIcon} />
              <Text style={styles.inviteButtonText}>Invite</Text>
            </Pressable>
          </View>
        </View>

        {/* Right Views Indicator */}
        <View style={styles.viewsContainer}>
          <Feather name="eye" size={14} color="#A3A3A3" style={styles.eyeIcon} />
          <Text style={styles.viewsText}>{opportunity.viewsCount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    marginBottom: 24, // Keep spacing between cards
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imagePlaceholder: {
    width: 106,
    height: 107,
    borderRadius: 24, // Exact Figma specification
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    position: 'relative',
  },
  starIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  infoColumn: {
    flex: 1,
    marginLeft: 12, // Reduced to give more space for text column
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 6,
    lineHeight: 20,
    letterSpacing: -0.2,
    paddingRight: 40, // Reduced from 55 since views count is flat and needs less space
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Compact spacing
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 14, // Compact size matching target design subtext
    fontWeight: '500',
    color: '#000000',
    letterSpacing: -0.1,
  },
  viewsContainer: {
    position: 'absolute',
    top: 2,
    right: 2,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 8,
    gap: 6, // Compact spacing
  },
  joinButton: {
    backgroundColor: '#000000',
    borderRadius: 100,
    height: 34,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinedButtonState: {
    backgroundColor: '#2E7D32', // Green for joined confirmation
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  inviteButton: {
    flex: 1,
    backgroundColor: '#FFF1E0', // Soft peach/beige button background matching screenshot
    borderRadius: 100,
    height: 34,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 0, 0.08)',
  },
  inviteButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  btnIcon: {
    marginRight: 4,
  },
});
