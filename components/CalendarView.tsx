
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import { DayProgress } from '../types/challenge';
import Icon from './Icon';

interface CalendarViewProps {
  days: DayProgress[];
  currentDay: number;
  onDayPress: (day: number) => void;
}

export default function CalendarView({ days, currentDay, onDayPress }: CalendarViewProps) {
  const renderDay = (dayData: DayProgress) => {
    const isToday = dayData.day === currentDay;
    const isPast = dayData.day < currentDay;
    const isFuture = dayData.day > currentDay;
    
    let backgroundColor = colors.card;
    let borderColor = colors.border;
    let textColor = colors.textSecondary;
    
    if (isToday) {
      backgroundColor = colors.primary;
      textColor = colors.background;
      borderColor = colors.primary;
    } else if (dayData.allCompleted) {
      backgroundColor = colors.success;
      textColor = colors.background;
      borderColor = colors.success;
    } else if (isPast) {
      backgroundColor = colors.error;
      textColor = colors.textSecondary;
      borderColor = colors.error;
    }

    return (
      <TouchableOpacity
        key={dayData.day}
        style={[
          styles.dayContainer,
          { backgroundColor, borderColor }
        ]}
        onPress={() => onDayPress(dayData.day)}
      >
        <Text style={[styles.dayNumber, { color: textColor }]}>
          {dayData.day}
        </Text>
        <View style={styles.statusIcon}>
          {dayData.allCompleted ? (
            <Icon name="checkmark" size={16} color={textColor} />
          ) : isPast && !dayData.allCompleted ? (
            <Icon name="close" size={16} color={textColor} />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderWeek = (weekDays: DayProgress[]) => (
    <View key={`week-${weekDays[0]?.day}`} style={styles.weekRow}>
      {weekDays.map(renderDay)}
    </View>
  );

  const weeks: DayProgress[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>75 Day Challenge</Text>
        <Text style={styles.subtitle}>Day {currentDay} of 75</Text>
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
          <Text style={styles.legendText}>Missed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.card }]} />
          <Text style={styles.legendText}>Future</Text>
        </View>
      </View>

      <View style={styles.calendar}>
        {weeks.map(renderWeek)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  calendar: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.background,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
