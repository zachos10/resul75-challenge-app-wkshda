
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../styles/commonStyles';
import { DailyTask } from '../types/challenge';
import Icon from './Icon';
import { integrationService } from '../services/integrationService';
import { photoService } from '../services/photoService';

interface TaskListProps {
  tasks: DailyTask[];
  onTaskToggle: (taskId: string, completed: boolean) => void;
  day: number;
}

export default function TaskList({ tasks, onTaskToggle, day }: TaskListProps) {
  const handleTaskPress = async (task: DailyTask) => {
    console.log('Task pressed:', task.id);
    
    if (task.id === 'progress-photo') {
      await handleProgressPhoto(task);
    } else if (task.requiresApp === 'yazio') {
      await handleYazioIntegration(task);
    } else if (task.requiresApp === 'strava') {
      await handleStravaIntegration(task);
    } else {
      onTaskToggle(task.id, !task.completed);
    }
  };

  const handleProgressPhoto = async (task: DailyTask) => {
    try {
      Alert.alert(
        'Progress Photo',
        'Take a new photo or choose from gallery?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: '📷 Camera', 
            onPress: async () => {
              const hasPermission = await photoService.requestCameraPermissions();
              
              if (!hasPermission) {
                Alert.alert(
                  'Camera Permission Required',
                  'Please allow camera access to take progress photos.',
                  [{ text: 'OK', style: 'default' }]
                );
                return;
              }

              console.log('Opening camera...');
              const result = await photoService.takePhoto();

              if (!result.canceled && result.assets && result.assets[0]) {
                const photo = await photoService.saveProgressPhoto(
                  day, 
                  result.assets[0].uri, 
                  'camera'
                );
                console.log('Photo taken and saved:', photo.id);
                onTaskToggle(task.id, true);
                Alert.alert('Success! 📸', 'Progress photo saved successfully!');
              }
            }
          },
          { 
            text: '🖼️ Gallery', 
            onPress: async () => {
              const hasPermission = await photoService.requestMediaLibraryPermissions();
              
              if (!hasPermission) {
                Alert.alert(
                  'Gallery Permission Required',
                  'Please allow gallery access to select progress photos.',
                  [{ text: 'OK', style: 'default' }]
                );
                return;
              }

              console.log('Opening gallery...');
              const result = await photoService.pickFromGallery();

              if (!result.canceled && result.assets && result.assets[0]) {
                const photo = await photoService.saveProgressPhoto(
                  day, 
                  result.assets[0].uri, 
                  'gallery'
                );
                console.log('Photo selected and saved:', photo.id);
                onTaskToggle(task.id, true);
                Alert.alert('Success! 🖼️', 'Progress photo saved successfully!');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error handling progress photo:', error);
      Alert.alert('Error', 'Failed to access camera/gallery. Please try again.');
    }
  };

  const handleYazioIntegration = async (task: DailyTask) => {
    Alert.alert(
      'YAZIO Integration',
      'Track your nutrition and water intake with YAZIO',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Setup Info',
          onPress: () => integrationService.showIntegrationInstructions('yazio')
        },
        { 
          text: 'Open YAZIO',
          onPress: async () => {
            const result = await integrationService.connectYazio();
            if (result.success) {
              console.log('YAZIO opened successfully');
            }
          }
        },
        { 
          text: task.completed ? 'Mark Incomplete' : 'Mark Complete',
          onPress: () => onTaskToggle(task.id, !task.completed)
        }
      ]
    );
  };

  const handleStravaIntegration = async (task: DailyTask) => {
    Alert.alert(
      'STRAVA Integration',
      'Track your workouts with STRAVA',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Setup Info',
          onPress: () => integrationService.showIntegrationInstructions('strava')
        },
        { 
          text: 'Open STRAVA',
          onPress: async () => {
            const result = await integrationService.connectStrava();
            if (result.success) {
              console.log('STRAVA opened successfully');
            }
          }
        },
        { 
          text: task.completed ? 'Mark Incomplete' : 'Mark Complete',
          onPress: () => onTaskToggle(task.id, !task.completed)
        }
      ]
    );
  };

  const getTaskIcon = (task: DailyTask) => {
    switch (task.icon) {
      case 'camera': return 'camera';
      case 'water': return 'water';
      case 'nutrition': return 'nutrition';
      case 'fitness': return 'fitness';
      case 'close-circle': return 'close-circle';
      default: return 'checkmark-circle';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Day {day} Tasks</Text>
      
      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={[
            styles.taskCard,
            task.completed && styles.completedTask
          ]}
          onPress={() => handleTaskPress(task)}
        >
          <View style={styles.taskContent}>
            <View style={styles.taskIcon}>
              <Icon 
                name={getTaskIcon(task)} 
                size={24} 
                color={task.completed ? colors.success : colors.primary} 
              />
            </View>
            
            <View style={styles.taskInfo}>
              <Text style={[
                styles.taskName,
                task.completed && styles.completedText
              ]}>
                {task.name}
              </Text>
              <Text style={styles.taskDescription}>
                {task.description}
              </Text>
              {task.requiresApp && (
                <Text style={styles.appBadge}>
                  {task.requiresApp.toUpperCase()}
                </Text>
              )}
              {task.id === 'progress-photo' && (
                <Text style={styles.cameraBadge}>
                  📸 TAP TO TAKE PHOTO
                </Text>
              )}
            </View>
            
            <View style={styles.statusIcon}>
              <Icon 
                name={task.completed ? 'checkmark-circle' : 'ellipse-outline'} 
                size={28} 
                color={task.completed ? colors.success : colors.grey} 
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completedTask: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.success,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.grey,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 4,
  },
  appBadge: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  cameraBadge: {
    fontSize: 12,
    color: colors.success,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
    fontWeight: '600',
  },
  statusIcon: {
    marginLeft: 16,
  },
});
