import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const days = [
    { day: "Sun", date: 4, completed: true },
    { day: "Mon", date: 5, completed: true },
    { day: "Tue", date: 6, completed: true },
    { day: "Wed", date: 7, active: true },
    { day: "Thu", date: 8 },
    { day: "Fri", date: 9 },
    { day: "Sat", date: 10 },
  ];

  const habits = [
    {
      id: 1,
      icon: "🚶",
      title: "Walk for 30 minutes after meals",
      subtitle: "Achieve daily goal in 2700 steps!",
      completed: true,
    },
    {
      id: 2,
      icon: "🥩",
      title: "Eat 30 grams of protein per meal",
      subtitle: "Protein helps with satiety, fat loss and glucose regulation",
      completed: false,
    },
    {
      id: 3,
      icon: "💧",
      title: "Drink 8 glass of water",
      subtitle: "Stay hydrated and healthy!",
      completed: false,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=50&h=50&fit=crop&crop=face" }}
            style={styles.avatar}
          />
          <View style={styles.streakContainer}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakCount}>0</Text>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.calendar}>
        {days.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={[styles.dayText, day.active && styles.activeDayText]}>
              {day.day}
            </Text>
            <View style={[
              styles.dateCircle,
              day.completed && styles.completedCircle,
              day.active && styles.activeCircle
            ]}>
              <Text style={[
                styles.dateText,
                day.completed && styles.completedDateText,
                day.active && styles.activeDateText
              ]}>
                {day.date}
              </Text>
              {day.completed && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Coach Message */}
      <View style={styles.coachMessage}>
        <View style={styles.coachHeader}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face" }}
            style={styles.coachAvatar}
          />
          <Text style={styles.coachName}>Jane, Nutritionist</Text>
          <TouchableOpacity style={styles.closeButton}>
            <Ionicons name="close" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
        <Text style={styles.coachText}>
          💪 Keep going! Complete the tasks and don't lose your streak!
        </Text>
      </View>

      {/* My Focus Section */}
      <View style={styles.focusSection}>
        <View style={styles.focusHeader}>
          <View>
            <Text style={styles.focusTitle}>My Focus</Text>
            <Text style={styles.focusSubtitle}>2 tasks pending</Text>
          </View>
          <View style={styles.progressRing}>
            <Text style={styles.progressText}>1/3</Text>
          </View>
        </View>

        {/* Habits List */}
        {habits.map((habit, index) => (
          <View key={habit.id}>
            <View style={styles.habitItem}>
              <View style={styles.habitCheck}>
                {habit.completed ? (
                  <Ionicons name="checkmark-circle" size={24} color="#34d399" />
                ) : (
                  <View style={styles.uncheckedCircle} />
                )}
              </View>
              <View style={styles.habitContent}>
                <Text style={styles.habitTitle}>
                  {habit.icon} {habit.title}
                </Text>
                <Text style={styles.habitSubtitle}>{habit.subtitle}</Text>
              </View>
              <TouchableOpacity style={styles.logButton}>
                <Text style={styles.logButtonText}>Log</Text>
              </TouchableOpacity>
            </View>
            {index < habits.length - 1 && <View style={styles.habitSeparator} />}
          </View>
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
    padding: 20,
    paddingTop: 60,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  streakCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  calendar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayContainer: {
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  activeDayText: {
    color: "#1f2937",
    fontWeight: "600",
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  completedCircle: {
    backgroundColor: "#34d399",
  },
  activeCircle: {
    backgroundColor: "#1f2937",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  completedDateText: {
    color: "#fff",
  },
  activeDateText: {
    color: "#fff",
  },
  checkmark: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#059669",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  coachMessage: {
    backgroundColor: "#fef3c7",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  coachHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  coachAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  coachName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  closeButton: {
    padding: 4,
  },
  coachText: {
    fontSize: 14,
    color: "#1f2937",
    lineHeight: 20,
  },
  focusSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  focusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  focusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  focusSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  progressRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fbbf24",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  habitSeparator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 20,
  },
  habitCheck: {
    marginRight: 12,
  },
  uncheckedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  habitContent: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  habitSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  logButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
});
