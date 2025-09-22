
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useChallengeData } from '../../hooks/useChallengeData';
import CalendarView from '../../components/CalendarView';
import DayDetailModal from '../../components/DayDetailModal';

export default function CalendarScreen() {
  const { challengeData, loading, updateTaskCompletion, updateWeeklyChallengeCompletion } = useChallengeData();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Loading Calendar...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!challengeData) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Error loading calendar</Text>
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

  const handleWeeklyChallengeToggle = (completed: boolean) => {
    if (selectedDay) {
      updateWeeklyChallengeCompletion(selectedDay, completed);
    }
  };

  const selectedDayData = selectedDay ? challengeData.days.find(d => d.day === selectedDay) : null;

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>75-Day Calendar</Text>
        <Text style={styles.subtitle}>
          Day {challengeData.currentDay} of {challengeData.totalDays}
        </Text>
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
        onWeeklyChallengeToggle={handleWeeklyChallengeToggle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
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
  subtitle: {
    fontSize: 16,
    color: colors.grey,
    marginTop: 4,
  },
});
