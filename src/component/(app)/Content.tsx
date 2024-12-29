import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Content({ uri }: { uri: string }) {
  const router = useRouter();
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"video" | "image" | null>(null);
  const generateThumbnail = async (contentUri: string) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(contentUri, {
        // time: 15000,
      });
      return uri;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  const getContentType = async () => {
    const response = await fetch(uri, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    if (contentType && (contentType.includes("video") || contentType.includes("image"))) {
      setMediaType(contentType.includes("video") ? "video" : "image");
    } else {
      setMediaType(null);
    }
  };

  useEffect(() => {
    getContentType();
  }, [uri]);

  useEffect(() => {
    (async () => {
      if (uri && mediaType === "video") {
        setVideoThumbnail(await generateThumbnail(uri));
      }
    })();
  }, [uri, mediaType]);

  const handlePress = () => {
    if (!mediaType) return;

  // the firebase url is encoded twice to avoid decoding issues with expo router in the subsequent screen
    const route = `preview/${encodeURIComponent(encodeURIComponent(uri))}`;
    router.navigate({ pathname: route, params: { mode: mediaType } });
  };

  return (
    <Pressable style={{ position: "relative" }} onPress={() => handlePress()}>
      <Image
        style={[styles.image, { backgroundColor: "black" }]}
        source={{
          uri: mediaType === "video" ? (videoThumbnail ? videoThumbnail : undefined) : uri,
        }}
      />
      {mediaType === "video" && videoThumbnail && (
        <View style={styles.icon}>
          <Ionicons name="play" color="white" size={30} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "auto",
    // height: 200,
    height: "100%",
    borderRadius: 15,
    resizeMode: "cover",
  },
  icon: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
