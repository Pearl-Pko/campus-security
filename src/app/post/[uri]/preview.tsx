import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import Button from "@/component/Button";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

export default function uri() {
  const { uri, mode } = useLocalSearchParams<{ uri: string; mode: "video" | "picture" }>();
  const decodedUrl = decodeURIComponent(uri as string);

  const navigation = useNavigation();
  const router = useRouter();

  const player = useVideoPlayer(uri as string, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need media library permissions to save files.");
        return;
      }

      if (Platform.OS === "android") {
        await MediaLibrary.saveToLibraryAsync(uri);
        alert("File has been downloaded");
      } else if (Platform.OS === "ios") {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {}
  };

  const handleNext = () => {
    const route = `post/${encodeURIComponent(uri as string)}/upload`;
    router.push(route);
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false, headerTitle: "dwl", header: () => null });
  }, [navigation]);

  console.log("stay");
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {mode === "video" ? (
          <VideoView style={styles.video} player={player} nativeControls={false}></VideoView>
        ) : (
          <View style={{ flex: 1 }}>
            <Image
              source={{ uri: uri }}
              style={{ height: "100%", width: "100%", flex: 1, resizeMode: "cover" }}
            />
          </View>
        )}
        <View style={{ position: "absolute", paddingVertical: 20, paddingHorizontal: 10 }}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="arrow-back-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: "row", padding: 10, gap: 5 }}>
        <Button
          variant="white"
          style={{ flex: 1 }}
          onPress={() => {
            handleDownload();
          }}
          title="Download"
          LeftIcon={<Ionicons name="download-outline" size={20} />}
        />
        <Button
          onPress={() => {
            handleNext();
          }}
          style={{ flex: 1 }}
          title="Next"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  video: {
    flex: 1,
    position: "relative",
    // borderRadius: 100,
    // width: 350,
    // height: 275,
  },
});
