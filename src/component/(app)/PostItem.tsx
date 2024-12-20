import { View, Text, Image, TouchableHighlight, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { IncidentSchema } from "@/schema/incident";
import ProfilePic from "../basic/Profile";
import pallets from "@/constants/pallets";
import { format } from "date-fns";
import { VideoView } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Ionicons } from "@expo/vector-icons";

export default function PostItem({ post }: { post: IncidentSchema }) {
  console.log(post);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);

  const generateThumbnail = async (contentUri: string) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(contentUri, {
        time: 15000,
      });
      return uri;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      if (post.media) {
        setVideoThumbnail(await generateThumbnail(post.media));
      }
    })();
  }, [post]);

  console.log(videoThumbnail);

  return (
    <TouchableHighlight underlayColor="#EEEEEE" style={{backgroundColor: "white", padding: 15 }} onPress={() => {}}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        <ProfilePic uri={post.reporter.avatar} style={{ width: 40, height: 40 }} />
        <View style={{ gap: 0, flex: 1 }}>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Text style={{ fontSize: 13 }}>{post.reporter.displayName}</Text>
            <Text style={{ color: "grey", fontSize: 13 }}>@{post.reporter.username}</Text>
            <View
              style={{ backgroundColor: "lightgrey", width: 5, height: 5, borderRadius: 100 }}
            ></View>
            <Text style={{ color: "grey", fontSize: 13 }}>
              {format(new Date(post.createdAt.seconds * 1000), "MMM d, yyyy")}
            </Text>
          </View>
          <View style={{ gap: 2 }}>
            <View>
              <Text style={{ fontWeight: 600 }}>{post.title}</Text>
              <Text>{post.description}</Text>
            </View>
            <View style={{ position: "relative" }}>
              {videoThumbnail && (
                <>
                  <Image
                    style={{
                      width: "auto",
                      height: 200,
                      borderRadius: 15,
                      flex: 1,
                      resizeMode: "cover",
                    }}
                    source={{ uri: videoThumbnail }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="play" color="white" size={30} />
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}
