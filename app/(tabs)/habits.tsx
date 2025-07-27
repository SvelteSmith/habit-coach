import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Typography } from "../../constants/typography";

export default function HabitsScreen() {
  const habits = [
    {
      id: 1,
      icon: "🚶",
      title: "Walk for 30 minutes after meals",
      frequency: "Daily",
      streak: 3,
      category: "Exercise",
      isActive: true,
    },
    {
      id: 2,
      icon: "🥩",
      title: "Eat 30 grams of protein per meal",
      frequency: "3x Daily",
      streak: 1,
      category: "Nutrition",
      isActive: true,
    },
    {
      id: 3,
      icon: "💧",
      title: "Drink 8 glasses of water",
      frequency: "Daily",
      streak: 0,
      category: "Health",
      isActive: true,
    },
    {
      id: 4,
      icon: "📚",
      title: "Read for 20 minutes",
      frequency: "Daily",
      streak: 7,
      category: "Learning",
      isActive: false,
    },
  ];

  const categories = ["All", "Exercise", "Nutrition", "Health", "Learning", "Mindfulness"];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <TouchableOpacity style={styles.addButton}>
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
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Total Habits</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>11</Text>
          <Text style={styles.statLabel}>Total Streak</Text>
        </View>
      </View>

      {/* Habits List */}
      <View style={styles.habitsList}>
        <Text style={styles.sectionTitle}>Active Habits</Text>
        {habits.filter(habit => habit.isActive).map((habit) => (
          <TouchableOpacity key={habit.id} style={styles.habitCard}>
            <View style={styles.habitHeader}>
              <View style={styles.habitTitleRow}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <View style={styles.habitInfo}>
                  <Text style={styles.habitTitle}>{habit.title}</Text>
                  <Text style={styles.habitFrequency}>{habit.frequency} • {habit.category}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.habitStats}>
              <View style={styles.streakContainer}>
                <Ionicons name="flame" size={16} color="#f59e0b" />
                <Text style={styles.streakText}>{habit.streak} day streak</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Paused Habits</Text>
        {habits.filter(habit => !habit.isActive).map((habit) => (
          <TouchableOpacity key={habit.id} style={[styles.habitCard, styles.pausedHabitCard]}>
            <View style={styles.habitHeader}>
              <View style={styles.habitTitleRow}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <View style={styles.habitInfo}>
                  <Text style={[styles.habitTitle, styles.pausedHabitTitle]}>{habit.title}</Text>
                  <Text style={styles.habitFrequency}>{habit.frequency} • {habit.category}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.resumeButton}>
                <Ionicons name="play" size={16} color="Colors.primary" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
});