
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { useChallengeData } from '../hooks/useChallengeData';
import CalendarView from '../components/CalendarView';
import DayDetailModal from '../components/DayDetailModal';
import ProgressStats from '../components/ProgressStats';
import IntegrationStatus from '../components/IntegrationStatus';
import SimpleBottomSheet from '../components/BottomSheet';
import Icon from '../components/Icon';

export default function MainScreen() {
  const { challengeData, loading, updateTaskCompletion, resetChallenge } = useChallengeData();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Loading RESUL75...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!challengeData) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Error loading challenge data</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDayPress = (day: number) => {
    console.log('Day pressed:', day);
    setSelectedDay(day);
  };

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (selectedDay) {
      updateTaskCompletion(selectedDay, taskId, completed);
    }
  };

  const handleResetChallenge = () => {
    Alert.alert(
      'Reset Challenge',
      'Are you sure you want to reset your entire challenge? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetChallenge();
            setShowSettings(false);
          }
        }
      ]
    );
  };

  const selectedDayData = selectedDay ? challengeData.days.find(d => d.day === selectedDay) : null;

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowStats(true)}
        >
          <Icon name="stats-chart" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <Text style={styles.appTitle}>RESUL75</Text>
          <Text style={styles.appSubtitle}>CHALLENGE</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowSettings(true)}
        >
          <Icon name="settings" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <CalendarView
        days={challengeData.days}
        currentDay={challengeData.currentDay}
        onDayPress={handleDayPress}
      />

      {/* Day Detail Modal */}
      <DayDetailModal
        visible={selectedDay !== null}
        dayData={selectedDayData}
        onClose={() => setSelectedDay(null)}
        onTaskToggle={handleTaskToggle}
      />

      {/* Stats Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showStats}
        onClose={() => setShowStats(false)}
      >
        <ProgressStats challengeData={challengeData} />
      </SimpleBottomSheet>

      {/* Settings Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
      >
        <View style={styles.settingsContent}>
          <IntegrationStatus />
          
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>About RESUL75</Text>
            <Text style={styles.sectionText}>
              Complete 5 daily tasks for 75 consecutive days:
              {'\n'}• Progress Photo (Camera Integration ✅)
              {'\n'}• Water Intake (YAZIO Integration 🔗)
              {'\n'}• Healthy Diet (YAZIO Integration 🔗)
              {'\n'}• Workout (STRAVA Integration 🔗)
              {'\n'}• No Alcohol
              {'\n'}• Weekly Challenge
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetChallenge}
          >
            <Text style={styles.resetButtonText}>Reset Challenge</Text>
          </TouchableOpacity>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  settingsContent: {
    padding: 20,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  settingsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
    color: colors.primary,
  },
  resetButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
