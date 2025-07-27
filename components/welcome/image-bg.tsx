import React, { FC, memo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type Props = {
  itemKey: string;
  source: any;
  bgColor?: string;
  gradient?: string[];
};

const ImageBg: FC<Props> = ({ itemKey, source, bgColor = 'rgba(31, 41, 55, 0.7)', gradient }) => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <AnimatedImage
        key={itemKey}
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        source={source}
        style={StyleSheet.absoluteFill}
        blurRadius={100}
      />
      
      {gradient ? (
        <AnimatedLinearGradient
          key={`gradient-${itemKey}`}
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          colors={[
            `${gradient[0]}33`, // 20% opacity - very subtle
            `${gradient[1]}26`, // 15% opacity - lighter
            `${gradient[2]}40`, // 25% opacity - slightly more visible
            '#1f2937D9' // Dark overlay at bottom (85% opacity) - less intense
          ]}
          locations={[0, 0.4, 0.75, 1]}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View 
          key={`overlay-${itemKey}`}
          style={[StyleSheet.absoluteFill, { backgroundColor: bgColor }]} 
        />
      )}
    </View>
  );
};

export default memo(ImageBg);