import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import Button from "@/component/Button";
import { Ionicons } from "@expo/vector-icons";

export default function url() {
  const { url, mode } = useLocalSearchParams<{ url: string; mode: "video" | "picture" }>();
  const decodedUrl = decodeURIComponent(url as string);

  const navigation = useNavigation();
  const router = useRouter();

  const player = useVideoPlayer(url as string, (player) => {
    player.loop = true;
    player.play();
  });
  
  const handleDownload = () => {};

  const handleNext = () => {
    const route = `post/${encodeURIComponent(url as string)}/upload`;
    router.push(route);
  };

  // 
  console.log("mode",mode,url )


  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

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
          <View style={{flex: 1}}>
            <Image source={{uri: url}} style={{height: "100%", width: "100%", flex: 1, resizeMode: "cover"}}/>
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
          onPress={() => {}}
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
