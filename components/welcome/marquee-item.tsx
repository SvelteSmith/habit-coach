import React, { FC, memo } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";

const screenWidth = Dimensions.get("screen").width;

export const _itemWidth = screenWidth * 0.6;

type Props = {
  index: number;
  imageSrc: any;
  scrollOffsetX: SharedValue<number>;
  allItemsWidth: number;
  gradient?: string[];
};

const MarqueeItemComponent: FC<Props> = ({ index, imageSrc, scrollOffsetX, allItemsWidth, gradient = ["#34d399", "#22c55e", "#16a34a"] }) => {
  const shift = (allItemsWidth - screenWidth) / 2;
  const initialLeft = index * _itemWidth - shift;

  const rContainerStyle = useAnimatedStyle(() => {
    const normalizedOffset =
      ((scrollOffsetX.value % allItemsWidth) + allItemsWidth) % allItemsWidth;
    const left = ((initialLeft - normalizedOffset) % allItemsWidth) + shift;

    const rotation = interpolate(left, [0, screenWidth - _itemWidth], [-0.6, 0.6]);
    const translateY = interpolate(
      left,
      [0, (screenWidth - _itemWidth) / 2, screenWidth - _itemWidth],
      [1, -0.5, 1]
    );

    return {
      left,
      transform: [{ rotateZ: `${rotation}deg` }, { translateY }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          height: "100%",
          padding: 8,
          width: _itemWidth,
          transformOrigin: "bottom",
        },
        rContainerStyle,
      ]}
    >
      <View style={{ flex: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
        <View style={{ flex: 1, borderRadius: 24, overflow: "hidden" }}>
          <Image source={imageSrc} style={{ height: "100%", width: "100%" }} />
          <Animated.View
            entering={FadeIn}
            style={{
              position: "absolute",
              bottom: 0,
              width: _itemWidth,
              height: "100%",
            }}
          >
            <MaskedView
              maskElement={
                <LinearGradient
                  locations={[0, 0.4, 0.7, 1]}
                  colors={["transparent", "transparent", "black", "black"]}
                  style={StyleSheet.absoluteFillObject}
                />
              }
              style={StyleSheet.absoluteFillObject}
            >
              <Image source={imageSrc} style={{ height: "100%", width: "100%" }} />
              <BlurView intensity={100} style={StyleSheet.absoluteFillObject} />
            </MaskedView>
          </Animated.View>
          <View style={[StyleSheet.absoluteFillObject, { alignItems: "center", justifyContent: "flex-end", padding: 24 }]}>
            <LinearGradient
              colors={[`${gradient[0]}80`, `${gradient[1]}66`]}
              style={{ borderRadius: 20, height: 32, width: "50%", marginBottom: 12 }}
            />
            <LinearGradient
              colors={[`${gradient[1]}60`, `${gradient[2]}50`]}
              style={{ borderRadius: 20, height: 20, width: "75%", marginBottom: 4 }}
            />
            <LinearGradient
              colors={[`${gradient[1]}60`, `${gradient[2]}50`]}
              style={{ borderRadius: 20, height: 20, width: "50%" }}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export const MarqueeItem = memo(MarqueeItemComponent);