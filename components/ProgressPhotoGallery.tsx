
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../styles/commonStyles';
import { photoService, ProgressPhoto } from '../services/photoService';
import Icon from './Icon';

interface ProgressPhotoGalleryProps {
  day: number;
}

export default function ProgressPhotoGallery({ day }: ProgressPhotoGalleryProps) {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, [day]);

  const loadPhotos = async () => {
    try {
      console.log(`Loading photos for day ${day}`);
      const dayPhotos = await photoService.getPhotosForDay(day);
      setPhotos(dayPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = (photo: ProgressPhoto) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this progress photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await photoService.deletePhoto(photo.id);
            if (success) {
              setPhotos(prev => prev.filter(p => p.id !== photo.id));
              Alert.alert('Success', 'Photo deleted successfully');
            } else {
              Alert.alert('Error', 'Failed to delete photo');
            }
          }
        }
      ]
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading photos...</Text>
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Icon name="camera-outline" size={48} color={colors.grey} />
          <Text style={styles.emptyText}>No progress photos yet</Text>
          <Text style={styles.emptySubtext}>Tap the Progress Photo task to take your first photo!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Photos ({photos.length})</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photoScroll}
      >
        {photos.map((photo) => (
          <View key={photo.id} style={styles.photoContainer}>
            <Image source={{ uri: photo.uri }} style={styles.photo} />
            
            <View style={styles.photoOverlay}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePhoto(photo)}
              >
                <Icon name="trash" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.photoInfo}>
              <Text style={styles.photoTime}>{formatTimestamp(photo.timestamp)}</Text>
              <View style={styles.photoType}>
                <Icon 
                  name={photo.type === 'camera' ? 'camera' : 'images'} 
                  size={12} 
                  color={colors.primary} 
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 20,
  },
  photoScroll: {
    paddingHorizontal: 20,
  },
  photoContainer: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photo: {
    width: 120,
    height: 160,
    backgroundColor: colors.backgroundAlt,
  },
  photoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  deleteButton: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 6,
    opacity: 0.9,
  },
  photoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  photoTime: {
    fontSize: 12,
    color: colors.grey,
  },
  photoType: {
    padding: 2,
  },
});
