import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Colors } from "../../constants/colors";
import { Typography } from "../../constants/typography";
import { useHabits } from "../../hooks/use-habits";

export default function HabitsScreen() {
  const { habits, loading, createHabit, deleteHabit } = useHabits();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: "",
    subtitle: "",
    icon: "🎯",
  });
  const [creating, setCreating] = useState(false);

  const handleCreateHabit = async () => {
    if (!newHabit.title.trim()) {
      Alert.alert('Error', 'Please enter a habit title');
      return;
    }

    try {
      setCreating(true);
      await createHabit({
        title: newHabit.title.trim(),
        subtitle: newHabit.subtitle.trim() || "Track this habit daily",
        icon: newHabit.icon,
      });
      
      setShowCreateModal(false);
      setNewHabit({ title: "", subtitle: "", icon: "🎯" });
      Alert.alert('Success', 'Habit created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteHabit = (habitId: string, habitTitle: string) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habitTitle}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabit(habitId);
              Alert.alert('Success', 'Habit deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete habit. Please try again.');
            }
          },
        },
      ]
    );
  };

  const availableIcons = ["🎯", "🚶", "🥩", "💧", "📚", "🧘", "💪", "🌱", "🏃", "🎨"];

  const categories = ["All", "Exercise", "Nutrition", "Health", "Learning", "Mindfulness"];

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading habits...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowCreateModal(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search habits..."
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryChip, index === 0 && styles.activeCategoryChip]}
          >
            <Text style={[styles.categoryText, index === 0 && styles.activeCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{habits.length}</Text>
          <Text style={styles.statLabel}>Total Habits</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{habits.filter(h => !h.completed).length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{habits.filter(h => h.completed).length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Habits List */}
      <View style={styles.habitsList}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No habits yet!</Text>
            <Text style={styles.emptyStateSubtext}>Tap the + button to create your first habit.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Your Habits</Text>
            {habits.map((habit) => (
              <View key={habit.id} style={styles.habitCard}>
                <View style={styles.habitHeader}>
                  <View style={styles.habitTitleRow}>
                    <Text style={styles.habitIcon}>{habit.icon}</Text>
                    <View style={styles.habitInfo}>
                      <Text style={styles.habitTitle}>{habit.title}</Text>
                      <Text style={styles.habitFrequency}>{habit.subtitle}</Text>
                    </View>
                  </View>
                  <View style={styles.habitActions}>
                    <View style={styles.habitStatus}>
                      {habit.completed ? (
                        <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                      ) : (
                        <View style={styles.uncheckedCircle} />
                      )}
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteHabit(habit.id, habit.title)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </View>

      {/* Create Habit Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Habit</Text>
            <TouchableOpacity onPress={handleCreateHabit} disabled={creating}>
              <Text style={[styles.saveButton, creating && styles.saveButtonDisabled]}>
                {creating ? 'Creating...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Icon Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Icon</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconSelector}>
                {availableIcons.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      newHabit.icon === icon && styles.iconOptionSelected
                    ]}
                    onPress={() => setNewHabit(prev => ({ ...prev, icon }))}
                  >
                    <Text style={styles.iconText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                value={newHabit.title}
                onChangeText={(text) => setNewHabit(prev => ({ ...prev, title: text }))}
                placeholder="e.g., Drink 8 glasses of water"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            {/* Subtitle Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textInputMultiline]}
                value={newHabit.subtitle}
                onChangeText={(text) => setNewHabit(prev => ({ ...prev, subtitle: text }))}
                placeholder="e.g., Stay hydrated and healthy!"
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  addButton: {
    backgroundColor: "Colors.primary",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#1f2937",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeCategoryChip: {
    backgroundColor: "Colors.primary",
    borderColor: "Colors.primary",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeCategoryText: {
    color: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  habitsList: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
    marginTop: 8,
  },
  habitCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pausedHabitCard: {
    opacity: 0.7,
  },
  habitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  habitTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  pausedHabitTitle: {
    color: "#6b7280",
  },
  habitFrequency: {
    fontSize: 14,
    color: "#6b7280",
  },
  moreButton: {
    padding: 4,
  },
  habitStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  resumeButton: {
    backgroundColor: "#ecfdf5",
    padding: 8,
    borderRadius: 8,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.styles.body,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    ...Typography.styles.subheading,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    ...Typography.styles.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  habitActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  habitStatus: {
    padding: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fef2f2",
  },
  uncheckedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: 60,
  },
  modalTitle: {
    ...Typography.styles.subheading,
    color: Colors.textPrimary,
  },
  cancelButton: {
    ...Typography.styles.body,
    color: Colors.textSecondary,
  },
  saveButton: {
    ...Typography.styles.label,
    color: Colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    ...Typography.styles.label,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  iconSelector: {
    paddingVertical: 8,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  iconText: {
    fontSize: 20,
  },
  textInput: {
    ...Typography.styles.body,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
});