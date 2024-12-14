import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import Button from "@//component/Button";
import { Ionicons } from "@expo/vector-icons";

export default function url() {
  let {url} = useLocalSearchParams();
  url = decodeURIComponent(url as string);

  const navigation = useNavigation();
  const router = useRouter();

  // const url =
  //   "file:///data/user/0/com.schoolproj.campus/cache/Camera/f6f5f6ab-4f60-41fc-9ef1-03d450467a96.mp4";

  const player = useVideoPlayer(url as string, (player) => {
    player.loop = true;
    player.play();
  });


  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

  useEffect(() => {
    navigation.setOptions({ headerShown: false, headerTitle: "dwl", header: () => null });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <VideoView style={styles.video} player={player} nativeControls={false}></VideoView>
        <View style={{ position: "absolute", paddingVertical: 20, paddingHorizontal: 10 }}>
          <TouchableOpacity onPress={() => {router.back()}}>
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
        <Button onPress={() => {router.push("upload")}} style={{ flex: 1 }} title="Next" />
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
