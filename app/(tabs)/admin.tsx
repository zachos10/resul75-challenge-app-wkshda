
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import { AthleteScore, DayProgress } from '../../types/challenge';
import Icon from '../../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LEADERBOARD_KEY = 'resul75_leaderboard';
const ADMIN_DATA_KEY = 'resul75_admin_data';

interface AthleteDetails extends AthleteScore {
  recentActivity: {
    day: number;
    completedTasks: string[];
    totalPoints: number;
    date: string;
  }[];
}

export default function AdminScreen() {
  const [athletes, setAthletes] = useState<AthleteDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteDetails | null>(null);

  const generateMockAthleteData = (): AthleteDetails[] => {
    const mockAthletes = [
      'Alex Johnson', 'Sarah Wilson', 'Mike Chen', 'Emma Davis', 'Chris Brown',
      'Lisa Garcia', 'David Miller', 'Jessica Taylor', 'Ryan Anderson', 'Amanda White'
    ];

    return mockAthletes.map((name, index) => {
      const recentActivity = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const completedTasks = [];
        const taskNames = ['Progress Photo', 'Water Intake', 'Healthy Diet', 'Workout', 'No Alcohol'];
        const numCompleted = Math.floor(Math.random() * 5) + 1;
        
        for (let j = 0; j < numCompleted; j++) {
          if (!completedTasks.includes(taskNames[j])) {
            completedTasks.push(taskNames[j]);
          }
        }

        // Sometimes add weekly challenge
        if (Math.random() > 0.7) {
          completedTasks.push('Weekly Challenge');
        }

        recentActivity.push({
          day: i + 1,
          completedTasks,
          totalPoints: completedTasks.length * 10,
          date: date.toISOString().split('T')[0],
        });
      }

      return {
        athleteId: `athlete_${index}`,
        athleteName: name,
        totalScore: Math.floor(Math.random() * 500) + 100,
        completedTasks: Math.floor(Math.random() * 50) + 10,
        currentStreak: Math.floor(Math.random() * 20) + 1,
        lastUpdated: new Date().toISOString(),
        recentActivity,
      };
    });
  };

  const loadAthleteData = async () => {
    try {
      console.log('Loading athlete data for admin');
      setLoading(true);
      
      // In a real app, this would fetch from a backend
      const stored = await AsyncStorage.getItem(ADMIN_DATA_KEY);
      let athleteData: AthleteDetails[] = [];

      if (stored) {
        athleteData = JSON.parse(stored);
      } else {
        athleteData = generateMockAthleteData();
        await AsyncStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(athleteData));
      }

      // Sort by total score
      athleteData.sort((a, b) => b.totalScore - a.totalScore);
      setAthletes(athleteData);
    } catch (error) {
      console.error('Error loading athlete data:', error);
      setAthletes(generateMockAthleteData());
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadAthleteData();
    Alert.alert('Success', 'Athlete data refreshed successfully!');
  };

  const exportData = () => {
    Alert.alert(
      'Export Data',
      'In a real app, this would export athlete data to CSV or send to your backend.',
      [{ text: 'OK' }]
    );
  };

  const viewAthleteDetails = (athlete: AthleteDetails) => {
    setSelectedAthlete(athlete);
  };

  useEffect(() => {
    loadAthleteData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Loading Admin Panel...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedAthlete) {
    return (
      <SafeAreaView style={commonStyles.container}>
        {/* Athlete Detail Header */}
        <View style={styles.detailHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedAthlete(null)}
          >
            <Icon name="arrow-back" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.detailTitle}>{selectedAthlete.athleteName}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Athlete Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{selectedAthlete.totalScore}</Text>
                <Text style={styles.statLabel}>Total Points</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{selectedAthlete.completedTasks}</Text>
                <Text style={styles.statLabel}>Tasks Done</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{selectedAthlete.currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity (Last 7 Days)</Text>
            {selectedAthlete.recentActivity.map((activity, index) => (
              <View key={index} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityDate}>
                    {new Date(activity.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.activityPoints}>
                    {activity.totalPoints} points
                  </Text>
                </View>
                <View style={styles.taskList}>
                  {activity.completedTasks.map((task, taskIndex) => (
                    <View key={taskIndex} style={styles.taskChip}>
                      <Icon name="checkmark-circle" size={16} color={colors.success} />
                      <Text style={styles.taskName}>{task}</Text>
                    </View>
                  ))}
                </View>
                {activity.completedTasks.length === 0 && (
                  <Text style={styles.noTasksText}>No tasks completed</Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Panel</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={refreshData}>
            <Icon name="refresh" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={exportData}>
            <Icon name="download" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Challenge Overview</Text>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>{athletes.length}</Text>
              <Text style={styles.overviewLabel}>Total Athletes</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>
                {Math.round(athletes.reduce((sum, a) => sum + a.totalScore, 0) / athletes.length)}
              </Text>
              <Text style={styles.overviewLabel}>Avg Score</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>
                {athletes.filter(a => a.currentStreak >= 7).length}
              </Text>
              <Text style={styles.overviewLabel}>7+ Day Streaks</Text>
            </View>
          </View>
        </View>

        {/* Athletes List */}
        <View style={styles.athletesList}>
          <Text style={styles.sectionTitle}>All Athletes</Text>
          {athletes.map((athlete, index) => (
            <TouchableOpacity
              key={athlete.athleteId}
              style={styles.athleteCard}
              onPress={() => viewAthleteDetails(athlete)}
            >
              <View style={styles.athleteRank}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              
              <View style={styles.athleteInfo}>
                <Text style={styles.athleteName}>{athlete.athleteName}</Text>
                <Text style={styles.athleteStats}>
                  {athlete.completedTasks} tasks • {athlete.currentStreak} day streak
                </Text>
                <Text style={styles.lastUpdated}>
                  Last active: {new Date(athlete.lastUpdated).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.athleteScore}>
                <Text style={styles.scoreText}>{athlete.totalScore}</Text>
                <Text style={styles.scoreLabel}>points</Text>
              </View>

              <Icon name="chevron-forward" size={20} color={colors.grey} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Admin Actions */}
        <View style={styles.adminActions}>
          <Text style={styles.sectionTitle}>Admin Actions</Text>
          
          <TouchableOpacity style={styles.adminButton} onPress={exportData}>
            <Icon name="document-text" size={24} color={colors.primary} />
            <View style={styles.adminButtonText}>
              <Text style={styles.adminButtonTitle}>Export Data</Text>
              <Text style={styles.adminButtonSubtitle}>Download athlete progress report</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.adminButton} onPress={refreshData}>
            <Icon name="sync" size={24} color={colors.primary} />
            <View style={styles.adminButtonText}>
              <Text style={styles.adminButtonTitle}>Refresh Data</Text>
              <Text style={styles.adminButtonSubtitle}>Update athlete information</Text>
            </View>
          </TouchableOpacity>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  overviewCard: {
    backgroundColor: colors.card,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  overviewLabel: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 4,
  },
  athletesList: {
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
  athleteRank: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.grey,
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
  athleteStats: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  lastUpdated: {
    fontSize: 10,
    color: colors.grey,
    marginTop: 2,
  },
  athleteScore: {
    alignItems: 'center',
    marginRight: 12,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.grey,
  },
  adminActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  adminButtonText: {
    marginLeft: 16,
  },
  adminButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  adminButtonSubtitle: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  // Athlete Detail Styles
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  detailTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  statsCard: {
    backgroundColor: colors.card,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  },
  activitySection: {
    paddingHorizontal: 20,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  taskList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  taskChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  taskName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  noTasksText: {
    fontSize: 14,
    color: colors.grey,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
