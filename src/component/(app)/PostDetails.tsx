import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { IncidentSchema } from "@/schema/incident";
import ProfilePic from "../basic/Profile";
import pallets from "@/constants/pallets";
import { format } from "date-fns";
import { VideoView } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Content from "./Content";

export default function PostDetails({ post }: { post: IncidentSchema }) {
  const router = useRouter();
  const blankProfile = require("../../../assets/images/blank-profile-picture.png");

  return (
    <View style={{ backgroundColor: "white", padding: 15, flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        <TouchableOpacity onPress={() => router.dismissTo(`/profile/${post.reporterId}`)}>
          <ProfilePic uri={post.reporter?.avatar} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
        <View style={{ gap: 0, flex: 1 }}>
          <View>
            <Text style={{ fontSize: 13 }}>{post.reporter.displayName}</Text>
            <Text style={{ color: "grey", fontSize: 13 }}>@{post.reporter.username}</Text>
          </View>
        </View>
      </View>
      {post.address && (
        <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
          <Ionicons name="location-outline" size={15} />
          <Text style={{ fontSize: 13, color: "grey", flex: 1 }}>{post.address}</Text>
        </View>
      )}
      <View style={{ gap: 2, marginTop: 5 }}>
        <View>
          <Text>{post.description}</Text>
        </View>
        <View style={{height: 200}}>
          <Content uri={post.media} />
        </View>
      </View>
      <Text style={{ fontSize: 13, marginTop: 5, color: "grey", alignSelf: "flex-end" }}>
        {format(new Date(post.createdAt.seconds * 1000), "h:mm MMM d, yyyy")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "auto",
    height: 200,
    borderRadius: 15,
    // flex: 1,
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
