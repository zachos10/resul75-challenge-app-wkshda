
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import { ChallengeData } from '../types/challenge';

interface ProgressStatsProps {
  challengeData: ChallengeData;
}

export default function ProgressStats({ challengeData }: ProgressStatsProps) {
  const completedDays = challengeData.days.filter(day => day.allCompleted).length;
  const currentStreak = calculateCurrentStreak(challengeData.days, challengeData.currentDay);
  const longestStreak = calculateLongestStreak(challengeData.days);
  
  const progressPercentage = (completedDays / challengeData.totalDays) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedDays}</Text>
          <Text style={styles.statLabel}>Days Completed</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progressPercentage.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {75 - challengeData.currentDay + 1} days remaining
        </Text>
      </View>
    </View>
  );
}

function calculateCurrentStreak(days: any[], currentDay: number): number {
  let streak = 0;
  for (let i = currentDay - 2; i >= 0; i--) {
    if (days[i].allCompleted) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calculateLongestStreak(days: any[]): number {
  let longestStreak = 0;
  let currentStreak = 0;
  
  for (const day of days) {
    if (day.allCompleted) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return longestStreak;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: colors.grey,
  },
});
