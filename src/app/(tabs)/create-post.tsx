import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  AppState,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Svg, { Circle } from "react-native-svg";
import {
  Camera,
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { withPause } from "react-native-redash";
import { useFocusEffect, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getMediaType, waitUntil } from "@/util/util";
import { useAppState } from "@/hooks/useAppState";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(TextInput);

const radius = 40;
const gap = 5;
const duration = 60 * 1000;
const circumference = radius * Math.PI * 2;

export default function video() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [key, setKey] = useState(0);
  // useAppState(() => {
  //   requestCameraPermission();
  //   requestMicrophonePermission();
  // });

  const [mode, setMode] = useState<"video" | "picture" | null>(null);
  // const [pictureUri, setPictureUri] = useState("");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const paused = useSharedValue<boolean>(true);
  const cameraRef = useRef<CameraView>(null);
  const [recording, setRecording] = useState<boolean>(false);

  const router = useRouter();

  const placeholder = require("@assets/images/placeholder.jpeg");

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

  const startCapture = async (mode: "picture" | "video") => {
    setMode(mode);
    if (mode == "video") {
      paused.value = false;
      setRecording(true);
      const video = await cameraRef.current?.recordAsync({});
      if (!video?.uri) return;
      console.log("start vdeo");

      const route = `post/${encodeURIComponent(video.uri)}/preview`;
      router.navigate({ pathname: route, params: { mode } });
    } else if (mode == "picture") {
    }
  };

  const endCapture = async () => {
    if (mode === "video") {
      paused.value = true;
      setRecording(false);

      cameraRef.current?.stopRecording();
      console.log("end video");
    } else if (mode == "picture") {
      const picture = await cameraRef.current?.takePictureAsync({});

      if (!picture?.uri) return;

      const route = `post/${encodeURIComponent(picture?.uri)}/preview`;
      router.navigate({ pathname: route, params: { mode } });
    }
    setMode(null);
  };

  // useEffect(() => {
  //   // cancelAnimation(strokeOffset);
  // }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const route = `post/${encodeURIComponent(result.assets[0].uri)}/preview`;
      console.log("there", route);
      router.navigate({
        pathname: route,
        params: { mode: getMediaType(result.assets[0].mimeType!) },
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      strokeOffset.value = 1;

      strokeOffset.value = withPause(
        withTiming(0, { duration: duration, easing: Easing.linear }),
        paused,
      );
      console.log("stroke offset focused", strokeOffset.value);

      setKey((key) => key + 1);

      return () => {
        console.log("Screen is unfocused");
        paused.value = true;
        setMode(null);
        strokeOffset.value = 1;
        console.log("stroke offset unfocused", strokeOffset.value);
      };
    }, []),
  );


  useEffect(() => {
    requestCameraPermission();
    requestMicrophonePermission();
  }, [])

  if (!cameraPermission) {
    return <View />;
  }

  // if (!permission.granted) {
  //   return (
  //     <View>
  //       <Text>Allow Campus Secuirty to access your camera</Text>
  //       <Button onPress={requestPermission} title="grant permission" />
  //     </View>
  //   );
  // }

  const permissionGranted = cameraPermission.granted && microphonePermission?.granted;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, marginVertical: 40 }}>
        {permissionGranted ? (
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            mode="video"
            flash={flash}
          ></CameraView>
        ) : (
          <>
            <LinearGradient
              colors={["#08A4BD", "rgba(242, 223, 215, 0.6)"]}
              style={styles.camera}
            />
            {/* <Text style={{backgroundColor: "white"}}>kdls</Text> */}
          </>
        )}
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
              <TouchableOpacity
                onPress={() => toggleFlash()}
                disabled={!permissionGranted}
                style={!permissionGranted && { opacity: 0.4 }}
              >
                <Ionicons
                  name={flash === "on" ? "flash-outline" : "flash-off-outline"}
                  size={30}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          )}
          {!permissionGranted && (
            <View style={{ justifyContent: "center", alignItems: "center", padding: 20, gap: 15 }}>
              <Text
                style={{ color: "white", fontSize: 20, textAlign: "center", fontWeight: "bold" }}
              >
                Allow Campus security to access your camera and microphone
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Linking.openSettings().catch(() => {
                    Alert.alert("Failed to open settings");
                  });
                }}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.15)",
                  width: "100%",
                  alignItems: "center",
                  padding: 20,
                  borderRadius: 15,
                }}
              >
                <Text style={{ color: "white", fontSize: 20 }}>Open Settings</Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              height: 100,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {!recording && (
              <TouchableOpacity onPress={() => pickImage()}>
                <Image
                  source={placeholder}
                  style={{ height: 50, resizeMode: "cover", width: 50, borderRadius: 10 }}
                />
              </TouchableOpacity>
            )}
            <Pressable
              onPressIn={() => {
                startCapture("picture");
              }}
              onLongPress={() => {
                startCapture("video");
              }}
              onPressOut={() => {
                endCapture();
              }}
              disabled={!permissionGranted}
              style={[styles.svg, !permissionGranted && { opacity: 0.4 }]}
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
              <View>
                <TouchableOpacity
                  disabled={!permissionGranted}
                  style={!permissionGranted && { opacity: 0.4 }}
                  onPress={() => toggleCameraFacing()}
                >
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
