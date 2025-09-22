
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export interface ProgressPhoto {
  id: string;
  day: number;
  uri: string;
  timestamp: string;
  type: 'camera' | 'gallery';
}

class PhotoService {
  private readonly STORAGE_KEY = 'resul75_progress_photos';

  async saveProgressPhoto(day: number, uri: string, type: 'camera' | 'gallery'): Promise<ProgressPhoto> {
    try {
      console.log(`Saving progress photo for day ${day}`);
      
      const photo: ProgressPhoto = {
        id: `photo_${day}_${Date.now()}`,
        day,
        uri,
        timestamp: new Date().toISOString(),
        type
      };

      const existingPhotos = await this.getProgressPhotos();
      const updatedPhotos = [...existingPhotos, photo];
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPhotos));
      console.log('Progress photo saved successfully');
      
      return photo;
    } catch (error) {
      console.error('Error saving progress photo:', error);
      throw new Error('Failed to save progress photo');
    }
  }

  async getProgressPhotos(): Promise<ProgressPhoto[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading progress photos:', error);
      return [];
    }
  }

  async getPhotosForDay(day: number): Promise<ProgressPhoto[]> {
    try {
      const allPhotos = await this.getProgressPhotos();
      return allPhotos.filter(photo => photo.day === day);
    } catch (error) {
      console.error('Error loading photos for day:', error);
      return [];
    }
  }

  async deletePhoto(photoId: string): Promise<boolean> {
    try {
      console.log(`Deleting photo: ${photoId}`);
      
      const existingPhotos = await this.getProgressPhotos();
      const updatedPhotos = existingPhotos.filter(photo => photo.id !== photoId);
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPhotos));
      console.log('Photo deleted successfully');
      
      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  }

  async requestCameraPermissions(): Promise<boolean> {
    try {
      console.log('Requesting camera permissions...');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  async requestMediaLibraryPermissions(): Promise<boolean> {
    try {
      console.log('Requesting media library permissions...');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  }

  async takePhoto(): Promise<ImagePicker.ImagePickerResult> {
    return await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
  }

  async pickFromGallery(): Promise<ImagePicker.ImagePickerResult> {
    return await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
  }

  async clearAllPhotos(): Promise<boolean> {
    try {
      console.log('Clearing all progress photos...');
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing photos:', error);
      return false;
    }
  }

  async getPhotoStats(): Promise<{totalPhotos: number, photosByDay: {[day: number]: number}}> {
    try {
      const allPhotos = await this.getProgressPhotos();
      const photosByDay: {[day: number]: number} = {};
      
      allPhotos.forEach(photo => {
        photosByDay[photo.day] = (photosByDay[photo.day] || 0) + 1;
      });

      return {
        totalPhotos: allPhotos.length,
        photosByDay
      };
    } catch (error) {
      console.error('Error getting photo stats:', error);
      return { totalPhotos: 0, photosByDay: {} };
    }
  }
}

export const photoService = new PhotoService();
