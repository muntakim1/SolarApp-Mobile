import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

type SavedAddressData = {
  id: string;
  label: string;
  address: string;
  city: string;
  isDefault: boolean;
};

type SavedAddressesScreenProps = NativeStackScreenProps<any, 'SavedAddresses'>;

/**
 * Saved Addresses Screen
 * Manage delivery adresses
 */
export const SavedAddressesScreen: React.FC<SavedAddressesScreenProps> = ({ navigation }) => {
  const [addresses, setAddresses] = useState<SavedAddressData[]>([
    { id: '1', label: 'Home', address: 'House 123, Street ABC, Sector D', city: 'Lahore', isDefault: true },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    label: '',
    address: '',
    city: '',
  });

  useEffect(() => {
    navigation.setOptions({
      title: 'Saved Addresses',
    });
  }, [navigation]);

  const handleAddNew = () => {
    setFormData({ label: '', address: '', city: '' });
    setEditingId(null);
    setShowAddModal(true);
  };

  const handleEdit = (address: SavedAddressData) => {
    setFormData({
      label: address.label,
      address: address.address,
      city: address.city,
    });
    setEditingId(address.id);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setAddresses((prev) => prev.filter((a) => a.id !== id));
        },
      },
    ]);
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleSaveAddress = () => {
    if (!formData.label || !formData.address || !formData.city) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, ...formData } : a
        )
      );
    } else {
      const newAddress: SavedAddressData = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddress]);
    }

    setShowAddModal(false);
    setFormData({ label: '', address: '', city: '' });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AddressCard
            address={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
            onSetDefault={() => handleSetDefault(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="location-off" size={48} color={colors.primary} />
            <Text style={styles.emptyText}>No addresses saved</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
        <MaterialIcons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Address</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.formLabel}>Label (e.g., Home, Office)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter label"
                value={formData.label}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, label: text }))}
              />

              <Text style={styles.formLabel}>Full Address</Text>
              <TextInput
                style={[styles.formInput, { height: 80 }]}
                placeholder="Enter your full address"
                value={formData.address}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, address: text }))}
                multiline
              />

              <Text style={styles.formLabel}>City/Region</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter city"
                value={formData.city}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, city: text }))}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/**
 * Address card component
 */
const AddressCard: React.FC<{
  address: SavedAddressData;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}> = ({ address, onEdit, onDelete, onSetDefault }) => (
  <View style={styles.addressCard}>
    <View style={styles.addressHeader}>
      <View style={styles.labelContainer}>
        <MaterialIcons name="location-on" size={20} color={colors.primary} />
        <Text style={styles.addressLabel}>{address.label}</Text>
      </View>
      {address.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      )}
    </View>

    <Text style={styles.addressText}>{address.address}</Text>
    <Text style={styles.addressCity}>{address.city}</Text>

    <View style={styles.actionButtons}>
      {!address.isDefault && (
        <TouchableOpacity style={styles.actionBtn} onPress={onSetDefault}>
          <MaterialIcons name="check-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.actionBtnText}>Set as Default</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
        <MaterialIcons name="edit" size={18} color={colors.primary} />
        <Text style={styles.actionBtnText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
        <MaterialIcons name="delete" size={18} color={colors.error} />
        <Text style={[styles.actionBtnText, { color: colors.error }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray,
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    ...Typography.body,
    color: '#888',
    marginTop: 12,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressLabel: {
    ...Typography.button,
    color: colors.dark,
    fontWeight: '600',
  },
  defaultBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    ...Typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  addressText: {
    ...Typography.body,
    color: colors.dark,
    marginBottom: 4,
  },
  addressCity: {
    ...Typography.caption,
    color: '#888',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.light_gray,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnText: {
    ...Typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    ...Typography.button,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
  },
  modalTitle: {
    ...Typography.sectionHeading,
    color: colors.dark,
  },
  modalForm: {
    padding: 16,
  },
  formLabel: {
    ...Typography.button,
    color: colors.dark,
    marginBottom: 8,
    fontWeight: '600',
  },
  formInput: {
    borderWidth: 1,
    borderColor: colors.light_gray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    ...Typography.body,
    color: colors.dark,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    ...Typography.button,
    color: '#fff',
  },
});
