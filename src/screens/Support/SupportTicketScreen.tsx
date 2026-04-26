import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { supportService } from '../../services/supportService';
import { colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

const CATEGORIES = [
  { key: 'product_defect', label: 'Product Defect' },
  { key: 'installation_issue', label: 'Installation Issue' },
  { key: 'billing', label: 'Billing Dispute' },
  { key: 'general', label: 'General Query' },
];

interface SelectedImage {
  uri: string;
  name: string;
  type: string;
}

export const SupportTicketScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [category, setCategory] = useState('general');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleAddImage = async () => {
    if (selectedImages.length >= 3) {
      Alert.alert('Limit Reached', 'You can only attach up to 3 images');
      return;
    }

    const options = ['Camera', 'Photo Library', 'Cancel'];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 2, userInterfaceStyle: 'light' },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            await pickFromCamera();
          } else if (buttonIndex === 1) {
            await pickFromLibrary();
          }
        }
      );
    } else {
      Alert.alert('Add Photo', 'Choose a source', [
        { text: 'Camera', onPress: pickFromCamera },
        { text: 'Photo Library', onPress: pickFromLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const pickFromCamera = async () => {
    try {
      setUploadingImage(true);
      const ImagePicker = await import('expo-image-picker');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        const newImage: SelectedImage = {
          uri: image.uri,
          name: `photo_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
        setSelectedImages((prev) => [...prev, newImage]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo');
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const pickFromLibrary = async () => {
    try {
      setUploadingImage(true);
      const ImagePicker = await import('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery permission is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        const filename = image.uri.split('/').pop() || `image_${Date.now()}.jpg`;
        const newImage: SelectedImage = {
          uri: image.uri,
          name: filename,
          type: 'image/jpeg',
        };
        setSelectedImages((prev) => [...prev, newImage]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Error', 'Subject is required.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Description is required.');
      return;
    }

    setLoading(true);
    try {
      await supportService.submitTicket({
        category,
        subject,
        description,
        attachments: selectedImages,
      });
      Alert.alert('Ticket Submitted!', 'Your support ticket has been created. Our team will respond within 48 hours.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Submit a Support Ticket</Text>
      <Text style={styles.subtitle}>Describe your issue and our team will get back to you.</Text>

      {/* Category Selection */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.chip, category === cat.key && styles.chipActive]}
            onPress={() => setCategory(cat.key)}
          >
            <Text style={[styles.chipText, category === cat.key && styles.chipTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Subject */}
      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        placeholder="Brief summary of your issue"
        maxLength={100}
        value={subject}
        onChangeText={setSubject}
        placeholderTextColor="#ccc"
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
        placeholder="Describe your issue in detail..."
        multiline
        maxLength={1000}
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="#ccc"
      />
      <Text style={styles.charCount}>{description.length}/1000</Text>

      {/* Image Upload */}
      <View style={styles.imageSection}>
        <View style={styles.imageHeader}>
          <Text style={styles.label}>Attach Images (Optional)</Text>
          <Text style={styles.imageCount}>{selectedImages.length}/3</Text>
        </View>

        {/* Image Preview Grid */}
        <View style={styles.imageGrid}>
          {selectedImages.map((image, index) => (
            <View key={index} style={styles.imagePreviewContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={() => handleRemoveImage(index)}
              >
                <MaterialIcons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Image Button */}
          {selectedImages.length < 3 && (
            <TouchableOpacity
              style={styles.addImageBtn}
              onPress={handleAddImage}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <>
                  <MaterialIcons name="add-a-photo" size={28} color={colors.primary} />
                  <Text style={styles.addImageText}>Add Photo</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.imageNote}>
          Max 3 images, 5MB each. Formats: JPEG, PNG
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitBtnText}>Submit Ticket</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
  title: { ...Typography.screenTitle, color: colors.dark, marginBottom: 4 },
  subtitle: { ...Typography.body, color: '#888', marginBottom: 24 },
  label: { ...Typography.button, color: colors.dark, marginBottom: 8, marginTop: 16, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    ...Typography.body,
    color: colors.dark,
    backgroundColor: colors.white,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText: { ...Typography.caption, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: colors.secondary, fontWeight: '600' },
  charCount: { fontSize: 11, color: '#aaa', textAlign: 'right', marginTop: 4 },
  imageSection: { marginTop: 24 },
  imageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  imageCount: { ...Typography.caption, color: colors.primary, fontWeight: '600' },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  imagePreviewContainer: {
    width: '30%',
    aspectRatio: 1,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageBtn: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
  },
  addImageText: { ...Typography.caption, color: colors.primary, marginTop: 4, fontWeight: '600' },
  imageNote: { ...Typography.caption, color: '#888', marginTop: 8 },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 28,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { ...Typography.button, color: colors.secondary, fontWeight: '600' },
});
