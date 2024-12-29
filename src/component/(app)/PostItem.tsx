import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { IncidentSchema } from "@/schema/incident";
import ProfilePic from "../basic/Profile";
import pallets from "@/constants/pallets";
import { format } from "date-fns";
import { VideoView } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SessionContext, SessionContextType } from "@/context/SessionContext";
import Content from "./Content";

export default function PostItem({ post }: { post: IncidentSchema }) {
  const router = useRouter();
  const user = useContext(SessionContext) as SessionContextType;

  return (
    <TouchableHighlight
      underlayColor="#EEEEEE"
      style={{ backgroundColor: "white", padding: 15 }}
      onPress={() => {
        router.navigate(`/report/${post.id}`);
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        <TouchableOpacity
          onPress={() => {
            if (!post.reporterId) return;
            if (user?.currentPageUserId !== post.reporterId)
              router.navigate(`/profile/${post.reporterId}`);
          }}
        >
          <ProfilePic uri={post.reporter?.avatar} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
        <View style={{ gap: 5, flex: 1 }}>
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
          <View style={{ gap: 5 }}>
            <View>
              <Text numberOfLines={5}>{post.description}</Text>
            </View>
            <View style={{height: 200}}>
              <Content uri={post.media} />
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}
