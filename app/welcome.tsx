import { View, Pressable, useWindowDimensions, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { runOnJS, useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { Marquee } from "../components/welcome/marquee";
import { _itemWidth } from "../components/welcome/marquee-item";
import ImageBg from "../components/welcome/image-bg";
import useDebounce from "../hooks/use-debounce";
import { ColorProvider, useColors } from "../components/welcome/color-provider";
import { router } from "expo-router";
import { Colors } from "../constants/colors";
import { Typography } from "../constants/typography";

// High-quality images from Unsplash
const habits = [
  {
    id: 1,
    image: { uri: "https://images.unsplash.com/photo-1571019613914-85ed37a5b2d7?w=800&h=600&fit=crop&crop=center" },
    title: "Stay Active",
    subtitle: "Build healthy exercise habits",
  },
  {
    id: 2,
    image: { uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop&crop=center" },
    title: "Eat Well",
    subtitle: "Track nutrition and healthy eating",
  },
  {
    id: 3,
    image: { uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center" },
    title: "Find Peace",
    subtitle: "Practice mindfulness and meditation",
  },
  {
    id: 4,
    image: { uri: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=600&fit=crop&crop=center" },
    title: "Rest Better",
    subtitle: "Optimize your sleep patterns",
  },
  {
    id: 5,
    image: { uri: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center" },
    title: "Track Progress",
    subtitle: "See your improvements over time",
  },
];

function WelcomeContent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [debouncedActiveIndex] = useDebounce(activeIndex, 500);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { getColorsForImage } = useColors();

  const scrollOffsetX = useSharedValue(0);
  const allItemsWidth = habits.length * _itemWidth;

  useAnimatedReaction(
    () => scrollOffsetX.value,
    (currentValue) => {
      const normalizedOffset = ((currentValue % allItemsWidth) + allItemsWidth) % allItemsWidth;
      const shift = width / 2;
      const activeItemIndex = Math.abs(Math.floor((normalizedOffset + shift) / _itemWidth));

      if (activeItemIndex === habits.length) {
        runOnJS(setActiveIndex)(0);
      }

      if (
        activeItemIndex >= 0 &&
        activeItemIndex < habits.length &&
        activeItemIndex !== activeIndex
      ) {
        runOnJS(setActiveIndex)(activeItemIndex);
      }
    }
  );

  const currentHabit = habits[debouncedActiveIndex];
  const currentColors = getColorsForImage(currentHabit.image.uri);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom }
      ]}
    >
      <ImageBg
        itemKey={currentHabit.id.toString()}
        source={currentHabit.image}
        bgColor={currentColors.background}
        gradient={currentColors.gradient}
      />
      
      {/* Carousel Section */}
      <View style={styles.carouselSection}>
        <Marquee 
          events={habits.map(habit => ({
            ...habit,
            gradient: getColorsForImage(habit.image.uri).gradient
          }))} 
          scrollOffsetX={scrollOffsetX} 
        />
      </View>
      
      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.textContent}>
          {/* App Title */}
          <Text style={styles.appTitle}>Habit Coach</Text>
          
          {/* Current Habit Info */}
          <Text style={styles.habitTitle}>{currentHabit.title}</Text>
          <Text style={styles.habitSubtitle}>{currentHabit.subtitle}</Text>
          
          {/* Feature Points */}
          <View style={styles.featurePoints}>
            <View style={styles.featurePoint}>
              <Text style={styles.featureText}>🎯 Set personalized goals</Text>
            </View>
            <View style={styles.featurePoint}>
              <Text style={styles.featureText}>📊 Track your progress</Text>
            </View>
            <View style={styles.featurePoint}>
              <Text style={styles.featureText}>🤖 Get AI coaching support</Text>
            </View>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.signUpButton}
            onPress={() => {
              router.push("/auth/signup" as any);
            }}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>
          
          <Pressable
            style={styles.signInButton}
            onPress={() => {
              router.push("/auth/login" as any);
            }}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function Welcome() {
  const imageUris = habits.map(habit => habit.image.uri);
  
  return (
    <ColorProvider imageUris={imageUris}>
      <WelcomeContent />
    </ColorProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f2937",
  },
  carouselSection: {
    height: "55%",
    paddingTop: 40,
  },
  contentSection: {
    height: "45%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  textContent: {
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  appTitle: {
    ...Typography.styles.heading,
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  habitTitle: {
    ...Typography.styles.heading,
    color: Colors.primary,
    marginBottom: 6,
    textAlign: "center",
  },
  habitSubtitle: {
    ...Typography.styles.body,
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
    textAlign: "center",
  },
  featurePoints: {
    width: "100%",
    alignItems: "flex-start",
  },
  featurePoint: {
    marginBottom: 8,
  },
  featureText: {
    ...Typography.styles.body,
    color: "rgba(255, 255, 255, 0.9)",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signUpButtonText: {
    ...Typography.styles.button,
    fontSize: 18,
    color: Colors.textInverse,
  },
  signInButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  signInButtonText: {
    ...Typography.styles.button,
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
  },
});