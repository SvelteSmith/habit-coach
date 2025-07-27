import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { PanGestureHandler, Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";
import { Colors } from "../../constants/colors";
import { Typography } from "../../constants/typography";

export default function Index() {
  const [habits, setHabits] = useState([
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
  ]);

  const toggleHabit = (habitId: number) => {
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const days = [
    { day: "Sun", date: 4, completed: true },
    { day: "Mon", date: 5, completed: true },
    { day: "Tue", date: 6, completed: true },
    { day: "Wed", date: 7, active: true },
    { day: "Thu", date: 8 },
    { day: "Fri", date: 9 },
    { day: "Sat", date: 10 },
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
        {habits.map((habit, index) => {
          const translateX = useSharedValue(0);
          
          const pan = Gesture.Pan()
            .onUpdate((event) => {
              translateX.value = Math.min(0, event.translationX);
            })
            .onEnd((event) => {
              if (event.translationX < -100) {
                runOnJS(toggleHabit)(habit.id);
              }
              translateX.value = withSpring(0);
            });

          const animatedStyle = useAnimatedStyle(() => {
            return {
              transform: [{ translateX: translateX.value }],
            };
          });

          return (
            <View key={habit.id}>
              <GestureDetector gesture={pan}>
                <Animated.View style={[styles.habitItem, animatedStyle]}>
                  <View style={styles.habitCheck}>
                    {habit.completed ? (
                      <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                    ) : (
                      <View style={styles.uncheckedCircle} />
                    )}
                  </View>
                  <View style={styles.habitContent}>
                    <Text style={[
                      styles.habitTitle,
                      habit.completed && styles.completedHabitTitle
                    ]}>
                      {habit.icon} {habit.title}
                    </Text>
                    <Text style={[
                      styles.habitSubtitle,
                      habit.completed && styles.completedHabitSubtitle
                    ]}>{habit.subtitle}</Text>
                  </View>
                </Animated.View>
              </GestureDetector>
              {index < habits.length - 1 && <View style={styles.habitSeparator} />}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.shadow,
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
    ...Typography.styles.subheading,
    color: Colors.textPrimary,
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
    ...Typography.styles.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  activeDayText: {
    ...Typography.styles.label,
    color: Colors.textPrimary,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  completedCircle: {
    backgroundColor: Colors.success,
  },
  activeCircle: {
    backgroundColor: Colors.primary,
  },
  dateText: {
    ...Typography.styles.title,
    color: Colors.textSecondary,
  },
  completedDateText: {
    color: Colors.textInverse,
  },
  activeDateText: {
    color: Colors.textInverse,
  },
  checkmark: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#16A34A",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  coachMessage: {
    backgroundColor: "#FEF3C7",
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
    ...Typography.styles.label,
    flex: 1,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  coachText: {
    ...Typography.styles.bodySmall,
    color: Colors.textPrimary,
  },
  focusSection: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
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
    ...Typography.styles.subheading,
    color: Colors.textPrimary,
  },
  focusSubtitle: {
    ...Typography.styles.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  progressText: {
    ...Typography.styles.caption,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  habitSeparator: {
    height: 1,
    backgroundColor: Colors.border,
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
    borderColor: Colors.border,
  },
  habitContent: {
    flex: 1,
  },
  habitTitle: {
    ...Typography.styles.title,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  habitSubtitle: {
    ...Typography.styles.bodySmall,
    color: Colors.textSecondary,
  },
  completedHabitTitle: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  completedHabitSubtitle: {
    opacity: 0.5,
  },
});
