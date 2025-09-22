
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../styles/commonStyles';
import { DayProgress } from '../types/challenge';
import TaskList from './TaskList';
import Icon from './Icon';

interface DayDetailModalProps {
  visible: boolean;
  dayData: DayProgress | null;
  onClose: () => void;
  onTaskToggle: (taskId: string, completed: boolean) => void;
}

export default function DayDetailModal({ visible, dayData, onClose, onTaskToggle }: DayDetailModalProps) {
  if (!dayData) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const completedTasks = dayData.tasks.filter(task => task.completed).length;
  const totalTasks = dayData.tasks.length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.dayTitle}>Day {dayData.day}</Text>
            <Text style={styles.dateText}>{formatDate(dayData.date)}</Text>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {completedTasks}/{totalTasks} Tasks Completed
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(completedTasks / totalTasks) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <TaskList 
            tasks={dayData.tasks}
            onTaskToggle={onTaskToggle}
            day={dayData.day}
          />
          
          {dayData.weeklyChallenge && (
            <View style={styles.weeklyChallenge}>
              <Text style={styles.weeklyChallengeTitle}>Weekly Challenge</Text>
              <Text style={styles.weeklyChallengeText}>{dayData.weeklyChallenge}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  dayTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  weeklyChallenge: {
    margin: 20,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  weeklyChallengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  weeklyChallengeText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
