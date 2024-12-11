import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Svg, { Circle } from "react-native-svg";
import { Camera, CameraType, CameraView, FlashMode, useCameraPermissions } from "expo-camera";
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
import { useRouter } from "expo-router";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(TextInput);

const radius = 40;
const gap = 5;
const duration = 60 * 1000;
const circumference = radius * Math.PI * 2;

export default function video() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");

  const [permission, requestPermission] = useCameraPermissions();
  const paused = useSharedValue<boolean>(true);
  const cameraRef = useRef<CameraView>(null);
  const [recording, setRecording] = useState<boolean>(false);

  const router = useRouter();

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const strokeOffset = useSharedValue(1);

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: strokeOffset.value * circumference,
    };
  });

  // const animatedTextProps = useAnimatedProps(() => {
  //   return {
  //     text: `${Math.round((1 - strokeOffset.value) * 100)}%`,
  //   } as any;
  // });

  const animatedTextProps = useAnimatedProps(() => {
    const timeInSeconds = Math.floor((1 - strokeOffset.value) * (duration / 1000));
    const seconds = timeInSeconds % 60;
    const minutes = Math.floor(timeInSeconds / 60) % 60;

    return {
      text: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    } as any;
  });

  const startRecording = async () => {
    paused.value = false;
    setRecording(true);
    // const video = await cameraRef.current?.recordAsync();
    console.log("video", video?.uri);
  };

  const endRecording = () => {
    paused.value = true;
    setRecording(false);
    // cameraRef.current?.stopRecording();
  };

  useEffect(() => {
    strokeOffset.value = withPause(
      withTiming(0, { duration: duration, easing: Easing.linear }),
      paused,
    );
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
      <View style={{ flex: 1, marginVertical: 40 }}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          flash={flash}
        ></CameraView>
        <View style={styles.overlay}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: recording ? "flex" : "none",
            }}
          >
            <AnimatedText
              editable={false}
              // value={percentage.value}
              style={{
                color: "white",
                // fontSize: 24,
                fontWeight: "bold",
                backgroundColor: "red",
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
              animatedProps={animatedTextProps}
            />
            {/* <Text>a</Text> */}
          </View>
          {/* {recording ? (
          ) : (
          )} */}
          {!recording && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleFlash()}>
                <Ionicons
                  name={flash === "on" ? "flash-outline" : "flash-off-outline"}
                  size={30}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          )}
          {/* {!recording && (
           
          )} */}

          {/* <View style={{backgroundColor: "black"}}>
            <Text>kl</Text>
          </View> */}
          <View style={{ height: 100, justifyContent: "center" }}>
            <Pressable
              onPressIn={() => {
                startRecording();
              }}
              onPressOut={() => {
                endRecording();
              }}
              style={styles.svg}
            >
              <Svg viewBox="0 0 100 100" width={100} height={100}>
                <AnimatedCircle
                  animatedProps={animatedCircleProps}
                  cx="50"
                  transform="rotate(-90 50 50)"
                  cy="50"
                  r={radius}
                  stroke="rgb(246, 79, 89)"
                  strokeWidth="5"
                  fill="transparent"
                  // fill="rgba(255,255,255,0.2)"
                  strokeDasharray={circumference}
                />
                <Circle cx="50" cy="50" fill="white" r={radius - gap} />
              </Svg>
            </Pressable>

            {!recording && (
              <View style={{ alignSelf: "flex-end" }}>
                <TouchableOpacity onPress={() => toggleCameraFacing()}>
                  <Ionicons name="sync-outline" size={35} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
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
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    padding: 20,
    // backgroundColor: "blue",
    justifyContent: "space-between",
    // alignItems: ""
    // alignItems: ""
  },
  svg: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }], // Center alignment
  },
});
