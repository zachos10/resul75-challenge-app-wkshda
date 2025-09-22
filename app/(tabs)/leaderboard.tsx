
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useChallengeData } from '../../hooks/useChallengeData';
import { AthleteScore } from '../../types/challenge';
import { Athlete } from '../../types/athlete';
import Icon from '../../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LEADERBOARD_KEY = 'resul75_leaderboard';
const ATHLETES_KEY = 'resul75_athletes';

export default function LeaderboardScreen() {
  const { challengeData, loading } = useChallengeData();
  const [leaderboard, setLeaderboard] = useState<AthleteScore[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaderboard = async () => {
    try {
      console.log('Loading leaderboard data');
      
      // Load registered athletes
      const athletesData = await AsyncStorage.getItem(ATHLETES_KEY);
      const athletes: Athlete[] = athletesData ? JSON.parse(athletesData) : [];
      
      // Convert athletes to leaderboard format
      const leaderboardData: AthleteScore[] = athletes
        .filter(athlete => athlete.isActive)
        .map(athlete => ({
          athleteId: athlete.id,
          athleteName: athlete.name,
          totalScore: athlete.totalScore,
          completedTasks: athlete.completedTasks,
          currentStreak: athlete.currentStreak,
          lastUpdated: new Date().toISOString(),
        }));

      // If no registered athletes, add some demo data
      if (leaderboardData.length === 0) {
        const demoAthletes = generateDemoLeaderboard();
        leaderboardData.push(...demoAthletes);
      }

      // Add current user if not already in leaderboard and has challenge data
      if (challengeData) {
        const userIndex = leaderboardData.findIndex(
          athlete => athlete.athleteId === challengeData.athleteId
        );

        const userScore: AthleteScore = {
          athleteId: challengeData.athleteId,
          athleteName: challengeData.athleteName,
          totalScore: challengeData.totalScore,
          completedTasks: challengeData.days.reduce((total, day) => {
            const taskCount = day.tasks.filter(task => task.completed).length;
            const weeklyCount = day.weeklyChallenge?.completed ? 1 : 0;
            return total + taskCount + weeklyCount;
          }, 0),
          currentStreak: calculateCurrentStreak(challengeData.days, challengeData.currentDay),
          lastUpdated: new Date().toISOString(),
        };

        if (userIndex >= 0) {
          leaderboardData[userIndex] = userScore;
        } else {
          leaderboardData.push(userScore);
        }
      }

      // Sort by total score
      leaderboardData.sort((a, b) => b.totalScore - a.totalScore);
      
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboard(generateDemoLeaderboard());
    }
  };

  const generateDemoLeaderboard = (): AthleteScore[] => {
    const demoAthletes = [
      'Alex Johnson', 'Sarah Wilson', 'Mike Chen', 'Emma Davis', 'Chris Brown',
      'Lisa Garcia', 'David Miller', 'Jessica Taylor', 'Ryan Anderson', 'Amanda White'
    ];

    return demoAthletes.map((name, index) => ({
      athleteId: `demo_athlete_${index}`,
      athleteName: name,
      totalScore: Math.floor(Math.random() * 500) + 100,
      completedTasks: Math.floor(Math.random() * 50) + 10,
      currentStreak: Math.floor(Math.random() * 20) + 1,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const calculateCurrentStreak = (days: any[], currentDay: number): number => {
    let streak = 0;
    for (let i = currentDay - 1; i >= 0; i--) {
      if (days[i]?.allCompleted) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const refreshLeaderboard = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  useEffect(() => {
    if (!loading) {
      loadLeaderboard();
    }
  }, [loading, challengeData]);

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Loading Leaderboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return colors.grey;
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/1610e06d-3ce0-4c86-b31d-40575532c8cc.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshLeaderboard}
          disabled={refreshing}
        >
          <Icon 
            name="refresh" 
            size={20} 
            color={colors.primary} 
          />
          <Text style={styles.refreshText}>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <View style={styles.podium}>
            {/* Second Place */}
            <View style={[styles.podiumPlace, styles.secondPlace]}>
              <Text style={styles.podiumRank}>🥈</Text>
              <Text style={styles.podiumName}>{leaderboard[1].athleteName}</Text>
              <Text style={styles.podiumScore}>{leaderboard[1].totalScore}</Text>
            </View>

            {/* First Place */}
            <View style={[styles.podiumPlace, styles.firstPlace]}>
              <Text style={styles.podiumRank}>🥇</Text>
              <Text style={styles.podiumName}>{leaderboard[0].athleteName}</Text>
              <Text style={styles.podiumScore}>{leaderboard[0].totalScore}</Text>
            </View>

            {/* Third Place */}
            <View style={[styles.podiumPlace, styles.thirdPlace]}>
              <Text style={styles.podiumRank}>🥉</Text>
              <Text style={styles.podiumName}>{leaderboard[2].athleteName}</Text>
              <Text style={styles.podiumScore}>{leaderboard[2].totalScore}</Text>
            </View>
          </View>
        )}

        {/* Full Leaderboard */}
        <View style={styles.leaderboardList}>
          <Text style={styles.sectionTitle}>Full Rankings</Text>
          {leaderboard.map((athlete, index) => {
            const rank = index + 1;
            const isCurrentUser = challengeData?.athleteId === athlete.athleteId;
            
            return (
              <View 
                key={athlete.athleteId} 
                style={[
                  styles.athleteCard,
                  isCurrentUser && styles.currentUserCard
                ]}
              >
                <View style={styles.rankContainer}>
                  <Text style={[styles.rankText, { color: getRankColor(rank) }]}>
                    {getRankIcon(rank)}
                  </Text>
                </View>

                <View style={styles.athleteInfo}>
                  <Text style={[
                    styles.athleteName,
                    isCurrentUser && styles.currentUserText
                  ]}>
                    {athlete.athleteName}
                    {isCurrentUser && ' (You)'}
                  </Text>
                  <View style={styles.athleteStats}>
                    <Text style={styles.statText}>
                      {athlete.completedTasks} tasks • {athlete.currentStreak} day streak
                    </Text>
                  </View>
                </View>

                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>{athlete.totalScore}</Text>
                  <Text style={styles.scoreLabel}>points</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="information-circle" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            Earn 10 points for each completed task. Rankings update in real-time as athletes complete their challenges!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLogo: {
    width: 120,
    height: 40,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 8,
  },
  podiumPlace: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 100,
  },
  firstPlace: {
    height: 120,
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  secondPlace: {
    height: 100,
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  thirdPlace: {
    height: 80,
    borderColor: '#CD7F32',
    borderWidth: 2,
  },
  podiumRank: {
    fontSize: 24,
    marginBottom: 8,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumScore: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  leaderboardList: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  athleteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currentUserCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.backgroundAlt,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '800',
  },
  athleteInfo: {
    flex: 1,
    marginLeft: 16,
  },
  athleteName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  currentUserText: {
    color: colors.primary,
  },
  athleteStats: {
    marginTop: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.grey,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.grey,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.grey,
    lineHeight: 20,
  },
});
