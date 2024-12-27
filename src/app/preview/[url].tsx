import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import PageWrapper from "@/component/basic/PageWrapper";
import Header from "@/component/basic/Header";

export default function preview() {
  const { url, mode } = useLocalSearchParams<{ url: string; mode: "video" | "picture" }>();

  const decodedUrl = decodeURIComponent(url as string);

  const player = useVideoPlayer(url as string, (player) => {
    // player.loop = true;
    player.play();
  });

  console.log("url", url, decodedUrl);

  return (
    <PageWrapper style={{ paddingHorizontal: 0 }}>
      <View style={{ paddingHorizontal: 15 }}>
        <Header />
      </View>
      <View style={{marginTop: 15, flex: 1}}>
        {mode === "video" ? (
          <VideoView style={{flex: 1}} player={player} nativeControls={true}></VideoView>
        ) : (
          <View style={{ flex: 1 }}>
            <Image
              source={{ uri: url }}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
          </View>
        )}
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({});
