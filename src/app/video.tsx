import { View, Text, Button, StyleSheet, TextInput, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Svg, { Circle } from "react-native-svg";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { withPause } from "react-native-redash";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(TextInput);

const radius = 40;
const circumference = radius * Math.PI * 2;

export default function video() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const paused = useSharedValue<boolean>(true);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const strokeOffset = useSharedValue(1);
  const percentage = useDerivedValue(() => {
    const number = ((circumference - strokeOffset.value) / circumference) * 100;

    return withTiming(number, { duration: 10000, easing: Easing.linear });
  });

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: strokeOffset.value * circumference,
    };
  });

  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: `${Math.round((1 - strokeOffset.value) * 100)}%`,
    } as any;
  });

  const startRecording = () => {
    paused.value = false;
  }

  const endRecording = () => {
    paused.value = true;
  }

  useEffect(() => {
    strokeOffset.value = withPause(withTiming(0, {duration: 5000, easing: Easing.linear}), paused);
    // cancelAnimation(strokeOffset);
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.overlay}>
          <View>
            <Ionicons name="close" size={40} color="white" />
          </View>
          <View>
            <Pressable onPressIn={() => {startRecording()} } onPressOut={() => {endRecording()}}>
              <Svg>
                <AnimatedCircle
                  animatedProps={animatedCircleProps}
                  cx="50"
                  transform="rotate(-90 50 50)"
                  cy="50"
                  r={radius}
                  stroke="rgb(246, 79, 89)"
                  strokeWidth="5"
                  fill="rgba(255,255,255,0.2)"
                  strokeDasharray={circumference}
                />
              </Svg>
            </Pressable>
            <AnimatedText
              // value={percentage.value}
              style={{ color: "white", fontSize: 24, fontWeight: "bold", position: "absolute" }}
              animatedProps={animatedTextProps}
            />
            {/* <View
              style={{
                borderColor: "white",
                borderWidth: 3,
                padding: 4,
                borderRadius: 100,

                marginHorizontal: "auto",
              }}
            >
              <View
                style={{
                  backgroundColor: "red",
                  width: 70,
                  height: 70,
                  borderRadius: 100,
                }}
              ></View>
            </View> */}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
    marginVertical: 40,
  },
  overlay: {
    flex: 1,
    margin: 20,
    justifyContent: "space-between",
  },
});
