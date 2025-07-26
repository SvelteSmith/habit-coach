import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CoachScreen() {
  const messages = [
    {
      id: 1,
      type: "coach",
      text: "Good morning! How are you feeling about your habits today?",
      time: "9:00 AM",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 2,
      type: "user",
      text: "I'm feeling motivated! I completed my morning walk.",
      time: "9:15 AM"
    },
    {
      id: 3,
      type: "coach",
      text: "That's fantastic! 🎉 I noticed you've been consistent with your walking habit. How about we work on increasing your water intake today?",
      time: "9:16 AM",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 4,
      type: "user",
      text: "Good idea! I'll set a reminder.",
      time: "9:20 AM"
    },
    {
      id: 5,
      type: "coach",
      text: "Perfect! I've set up some gentle reminders for you. Remember, small consistent steps lead to big changes. You're doing amazing! 💪",
      time: "9:21 AM",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face"
    }
  ];

  const coachingAreas = [
    { icon: "🏃", title: "Exercise Motivation", description: "Get personalized workout tips" },
    { icon: "🥗", title: "Nutrition Guidance", description: "Meal planning and healthy eating" },
    { icon: "💭", title: "Mindfulness", description: "Stress management and meditation" },
    { icon: "💤", title: "Sleep Optimization", description: "Better sleep habits and routines" },
  ];

  const quickActions = [
    { icon: "💡", title: "Get Tips", color: "#3b82f6" },
    { icon: "🎯", title: "Set Goals", color: "#34d399" },
    { icon: "📊", title: "Review Progress", color: "#f59e0b" },
    { icon: "🤔", title: "Ask Question", color: "#8b5cf6" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.coachInfo}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face" }}
            style={styles.coachAvatar}
          />
          <View>
            <Text style={styles.coachName}>Jane Wilson</Text>
            <Text style={styles.coachTitle}>Your Personal Coach</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsContainer}>
        {quickActions.map((action, index) => (
          <TouchableOpacity key={index} style={[styles.quickActionCard, { borderLeftColor: action.color }]}>
            <Text style={styles.quickActionIcon}>{action.icon}</Text>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Coaching Areas */}
      <View style={styles.coachingAreasContainer}>
        <Text style={styles.sectionTitle}>Coaching Areas</Text>
        <View style={styles.coachingAreasGrid}>
          {coachingAreas.map((area, index) => (
            <TouchableOpacity key={index} style={styles.coachingAreaCard}>
              <Text style={styles.coachingAreaIcon}>{area.icon}</Text>
              <Text style={styles.coachingAreaTitle}>{area.title}</Text>
              <Text style={styles.coachingAreaDescription}>{area.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chat Messages */}
      <View style={styles.chatContainer}>
        <Text style={styles.sectionTitle}>Recent Conversation</Text>
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <View key={message.id} style={[
              styles.messageRow,
              message.type === "user" ? styles.userMessageRow : styles.coachMessageRow
            ]}>
              {message.type === "coach" && (
                <Image source={{ uri: message.avatar }} style={styles.messageAvatar} />
              )}
              <View style={[
                styles.messageBubble,
                message.type === "user" ? styles.userMessage : styles.coachMessage
              ]}>
                <Text style={[
                  styles.messageText,
                  message.type === "user" ? styles.userMessageText : styles.coachMessageText
                ]}>
                  {message.text}
                </Text>
                <Text style={[
                  styles.messageTime,
                  message.type === "user" ? styles.userMessageTime : styles.coachMessageTime
                ]}>
                  {message.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type your message..."
          placeholderTextColor="#9ca3af"
          multiline
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  coachInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  coachAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  coachName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  coachTitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  settingsButton: {
    padding: 8,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  quickActionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: "center",
    minWidth: 100,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
  },
  coachingAreasContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  coachingAreasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  coachingAreaCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coachingAreaIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  coachingAreaTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  coachingAreaDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  userMessageRow: {
    justifyContent: "flex-end",
  },
  coachMessageRow: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessage: {
    backgroundColor: "#34d399",
  },
  coachMessage: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  userMessageText: {
    color: "#fff",
  },
  coachMessageText: {
    color: "#1f2937",
  },
  messageTime: {
    fontSize: 12,
  },
  userMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  coachMessageTime: {
    color: "#9ca3af",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    color: "#1f2937",
  },
  sendButton: {
    backgroundColor: "#34d399",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});