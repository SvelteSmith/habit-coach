import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Typography } from "../../constants/typography";

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const weeklyData = [
    { day: "Mon", completed: 2, total: 3 },
    { day: "Tue", completed: 3, total: 3 },
    { day: "Wed", completed: 3, total: 3 },
    { day: "Thu", completed: 1, total: 3 },
    { day: "Fri", completed: 2, total: 3 },
    { day: "Sat", completed: 3, total: 3 },
    { day: "Sun", completed: 2, total: 3 },
  ];

  const timeFilters = ["Week", "Month", "3M", "Year"];

  const achievements = [
    { icon: "🔥", title: "7-Day Streak", description: "Complete habits for 7 consecutive days", unlocked: true },
    { icon: "💪", title: "Consistency King", description: "90% completion rate for a month", unlocked: true },
    { icon: "🏆", title: "Habit Master", description: "Complete 100 total habits", unlocked: false },
    { icon: "⭐", title: "Perfect Week", description: "100% completion for a week", unlocked: false },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download-outline" size={20} color="Colors.primary" />
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Time Filter */}
      <View style={styles.filterContainer}>
        {timeFilters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.filterChip, index === 0 && styles.activeFilterChip]}
          >
            <Text style={[styles.filterText, index === 0 && styles.activeFilterText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Overview Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>16</Text>
          <Text style={styles.statLabel}>Completed This Week</Text>
          <View style={styles.statTrend}>
            <Ionicons name="trending-up" size={16} color="Colors.primary" />
            <Text style={styles.trendText}>+12%</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>76%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
          <View style={styles.statTrend}>
            <Ionicons name="trending-up" size={16} color="Colors.primary" />
            <Text style={styles.trendText}>+5%</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
          <View style={styles.statTrend}>
            <Ionicons name="flame" size={16} color="#f59e0b" />
            <Text style={styles.trendText}>Days</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>127</Text>
          <Text style={styles.statLabel}>Total Completed</Text>
          <View style={styles.statTrend}>
            <Ionicons name="checkmark-circle" size={16} color="Colors.primary" />
            <Text style={styles.trendText}>All time</Text>
          </View>
        </View>
      </View>

      {/* Weekly Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
        <View style={styles.chart}>
          {weeklyData.map((data, index) => (
            <View key={index} style={styles.chartColumn}>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar,
                    { height: (data.completed / data.total) * 80 }
                  ]} 
                />
                <View style={[styles.barBackground, { height: 80 }]} />
              </View>
              <Text style={styles.chartLabel}>{data.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Habit Performance */}
      <View style={styles.performanceContainer}>
        <Text style={styles.sectionTitle}>Habit Performance</Text>
        <View style={styles.habitProgress}>
          <View style={styles.habitProgressItem}>
            <View style={styles.habitProgressHeader}>
              <Text style={styles.habitProgressIcon}>🚶</Text>
              <Text style={styles.habitProgressTitle}>Walking</Text>
            </View>
            <Text style={styles.habitProgressPercentage}>85%</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '85%' }]} />
            </View>
          </View>
          <View style={styles.habitProgressItem}>
            <View style={styles.habitProgressHeader}>
              <Text style={styles.habitProgressIcon}>🥩</Text>
              <Text style={styles.habitProgressTitle}>Protein Intake</Text>
            </View>
            <Text style={styles.habitProgressPercentage}>67%</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '67%' }]} />
            </View>
          </View>
          <View style={styles.habitProgressItem}>
            <View style={styles.habitProgressHeader}>
              <Text style={styles.habitProgressIcon}>💧</Text>
              <Text style={styles.habitProgressTitle}>Water Intake</Text>
            </View>
            <Text style={styles.habitProgressPercentage}>92%</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '92%' }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsList}>
          {achievements.map((achievement, index) => (
            <View key={index} style={[styles.achievementCard, !achievement.unlocked && styles.lockedAchievement]}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementTitle, !achievement.unlocked && styles.lockedText]}>
                  {achievement.title}
                </Text>
                <Text style={[styles.achievementDescription, !achievement.unlocked && styles.lockedText]}>
                  {achievement.description}
                </Text>
              </View>
              {achievement.unlocked && (
                <Ionicons name="checkmark-circle" size={24} color="Colors.primary" />
              )}
            </View>
          ))}
        </View>
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
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportText: {
    fontSize: 14,
    fontWeight: "500",
    color: "Colors.primary",
    marginLeft: 4,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeFilterChip: {
    backgroundColor: "Colors.primary",
    borderColor: "Colors.primary",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeFilterText: {
    color: "#fff",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#fff",
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  statTrend: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "500",
    color: "Colors.primary",
    marginLeft: 4,
  },
  chartContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  chartColumn: {
    alignItems: "center",
    flex: 1,
  },
  barContainer: {
    position: "relative",
    width: 20,
    alignItems: "center",
  },
  bar: {
    backgroundColor: "Colors.primary",
    width: 20,
    borderRadius: 4,
    position: "absolute",
    bottom: 0,
  },
  barBackground: {
    backgroundColor: "#f3f4f6",
    width: 20,
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
  },
  performanceContainer: {
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
  habitProgress: {},
  habitProgressItem: {
    marginBottom: 20,
  },
  habitProgressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  habitProgressIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  habitProgressTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    flex: 1,
  },
  habitProgressPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "Colors.primary",
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: "Colors.primary",
    borderRadius: 4,
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  achievementsList: {},
  achievementCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  lockedText: {
    color: "#9ca3af",
  },
});