
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useChallengeData } from '../../hooks/useChallengeData';
import { Athlete } from '../../types/athlete';
import Icon from '../../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { challengeData, loading } = useChallengeData();
  const [currentAthlete, setCurrentAthlete] = useState<Athlete | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    loadCurrentAthlete();
  }, []);

  const loadCurrentAthlete = async () => {
    try {
      console.log('Loading current athlete profile');
      const athleteData = await AsyncStorage.getItem('current_athlete');
      if (athleteData) {
        const athlete = JSON.parse(athleteData) as Athlete;
        setCurrentAthlete(athlete);
        console.log('Loaded athlete profile:', athlete.name);
      }
    } catch (error) {
      console.error('Error loading athlete profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('current_athlete');
              router.replace('/welcome');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleResetChallenge = () => {
    Alert.alert(
      'Reset Challenge',
      'Are you sure you want to reset your challenge? This will delete all your progress and cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              // Reset challenge data
              await AsyncStorage.removeItem('resul75_challenge_data');
              
              // Reset athlete score
              if (currentAthlete) {
                const athletesData = await AsyncStorage.getItem('resul75_athletes');
                if (athletesData) {
                  const athletes: Athlete[] = JSON.parse(athletesData);
                  const athleteIndex = athletes.findIndex(a => a.id === currentAthlete.id);
                  
                  if (athleteIndex >= 0) {
                    athletes[athleteIndex] = {
                      ...athletes[athleteIndex],
                      totalScore: 0,
                      completedTasks: 0,
                      currentStreak: 0,
                    };
                    await AsyncStorage.setItem('resul75_athletes', JSON.stringify(athletes));
                  }
                }
              }
              
              Alert.alert('Success', 'Your challenge has been reset. You can start fresh!');
            } catch (error) {
              console.error('Error resetting challenge:', error);
              Alert.alert('Error', 'Failed to reset challenge. Please try again.');
            }
          },
        },
      ]
    );
  };

  const calculateCompletionRate = () => {
    if (!challengeData) return 0;
    const completedDays = challengeData.days.filter(day => day.allCompleted).length;
    return Math.round((completedDays / challengeData.totalDays) * 100);
  };

  const calculateAverageTasksPerDay = () => {
    if (!challengeData) return 0;
    const totalTasks = challengeData.days.reduce((total, day) => {
      const taskCount = day.tasks.filter(task => task.completed).length;
      const weeklyCount = day.weeklyChallenge?.completed ? 1 : 0;
      return total + taskCount + weeklyCount;
    }, 0);
    return Math.round((totalTasks / challengeData.currentDay) * 10) / 10;
  };

  if (loading || profileLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Loading Profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentAthlete) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Icon name="person-circle" size={80} color={colors.grey} />
          <Text style={styles.noProfileTitle}>No Profile Found</Text>
          <Text style={styles.noProfileText}>
            Please sign up to create your profile and start the challenge.
          </Text>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/1610e06d-3ce0-4c86-b31d-40575532c8cc.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Icon name="person-circle" size={80} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{currentAthlete.name}</Text>
              <Text style={styles.profileEmail}>{currentAthlete.email}</Text>
              <Text style={styles.joinDate}>
                Joined {new Date(currentAthlete.joinDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Challenge Stats */}
        {challengeData && (
          <View style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Challenge Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{challengeData.totalScore}</Text>
                <Text style={styles.statLabel}>Total Points</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{challengeData.currentDay}</Text>
                <Text style={styles.statLabel}>Current Day</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{calculateCompletionRate()}%</Text>
                <Text style={styles.statLabel}>Completion Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentAthlete.currentStreak}</Text>
                <Text style={styles.statLabel}>Current Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentAthlete.completedTasks}</Text>
                <Text style={styles.statLabel}>Tasks Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{calculateAverageTasksPerDay()}</Text>
                <Text style={styles.statLabel}>Avg Tasks/Day</Text>
              </View>
            </View>
          </View>
        )}

        {/* Achievement Badges */}
        <View style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgesContainer}>
            {currentAthlete.totalScore >= 100 && (
              <View style={styles.badge}>
                <Icon name="star" size={24} color={colors.primary} />
                <Text style={styles.badgeText}>First 100 Points</Text>
              </View>
            )}
            {currentAthlete.currentStreak >= 7 && (
              <View style={styles.badge}>
                <Icon name="flame" size={24} color={colors.secondary} />
                <Text style={styles.badgeText}>7-Day Streak</Text>
              </View>
            )}
            {currentAthlete.currentStreak >= 30 && (
              <View style={styles.badge}>
                <Icon name="trophy" size={24} color={colors.primary} />
                <Text style={styles.badgeText}>30-Day Streak</Text>
              </View>
            )}
            {currentAthlete.completedTasks >= 50 && (
              <View style={styles.badge}>
                <Icon name="checkmark-circle" size={24} color={colors.success} />
                <Text style={styles.badgeText}>50 Tasks Done</Text>
              </View>
            )}
            {challengeData && calculateCompletionRate() >= 50 && (
              <View style={styles.badge}>
                <Icon name="medal" size={24} color={colors.primary} />
                <Text style={styles.badgeText}>Halfway Hero</Text>
              </View>
            )}
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleResetChallenge}>
            <Icon name="refresh" size={24} color={colors.secondary} />
            <View style={styles.actionButtonText}>
              <Text style={styles.actionButtonTitle}>Reset Challenge</Text>
              <Text style={styles.actionButtonSubtitle}>Start over from day 1</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.grey} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
            <Icon name="log-out" size={24} color={colors.error} />
            <View style={styles.actionButtonText}>
              <Text style={[styles.actionButtonTitle, { color: colors.error }]}>Sign Out</Text>
              <Text style={styles.actionButtonSubtitle}>Your progress will be saved</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.grey} />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <Icon name="information-circle" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>RESUL75 CHALLENGE</Text>
            <Text style={styles.infoText}>
              Transform your life in 75 days with daily tasks, progress tracking, and community competition.
            </Text>
          </View>
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
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginRight: 120, // Balance the logo
  },
  profileCard: {
    backgroundColor: colors.card,
    margin: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: colors.grey,
  },
  statsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 4,
    textAlign: 'center',
  },
  achievementsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  actionsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    flex: 1,
    marginLeft: 16,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  actionButtonSubtitle: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  noProfileTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  noProfileText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
});
