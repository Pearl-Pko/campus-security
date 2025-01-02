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
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { IncidentDraftSchema, IncidentSchema } from "@/schema/incident";
import ProfilePic from "../basic/Profile";
import pallets from "@/constants/pallets";
import { format } from "date-fns";
import { VideoView } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import Content from "./Content";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Button from "../Button";
import { deleteReport } from "@/service/incident";
import { SessionContext, SessionContextType } from "@/context/SessionContext";

export default function PostDetails({ post }: { post: IncidentSchema | IncidentDraftSchema }) {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [post.draft ? 220 : 100], []);

  const user = useContext(SessionContext) as SessionContextType;

  const blankProfile = require("../../../assets/images/blank-profile-picture.png");

  useFocusEffect(
    useCallback(() => {
      // No action on focus
      return () => {
        // Close the modal when screen is unfocused
        bottomSheetRef.current?.dismiss();
      };
    }, []),
  );
  console.log("herefd", post);

  return (
    <View style={{ backgroundColor: "white", padding: 15, flex: 1 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => {
              if (!post.reporterId || post.isAnonymousProfile) return;
              router.navigate(`/profile/${post.reporterId}`);
            }}
          >
            <ProfilePic uri={post.reporter?.avatar} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
          <View style={{ gap: 0 }}>
            <View>
              <Text style={{ fontSize: 13 }}>{post.reporter.displayName}</Text>
              <Text style={{ color: "grey", fontSize: 13 }}>@{post.reporter.username}</Text>
            </View>
          </View>
        </View>
        {post.reporterId && !post.isAnonymousProfile && user?.user?.uid === post.reporterId && (
          <TouchableOpacity onPress={() => bottomSheetRef.current?.present()}>
            <Ionicons name="ellipsis-vertical-outline" size={20} />
          </TouchableOpacity>
        )}
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
        <View style={{ height: 200 }}>
          <Content uri={post.media} />
        </View>
      </View>
      <Text style={{ fontSize: 13, marginTop: 5, color: "grey", alignSelf: "flex-end" }}>
        {format(new Date(post.createdAt), "h:mm MMM d, yyyy")}
      </Text>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        handleComponent={() => <View></View>}
        index={0}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />}
      >
        <View
          style={{
            flex: 1,
            // backgroundColor: "lightgrey",
            alignItems: "center",
            gap: 10,
            padding: 15,
          }}
        >
          {post.draft && (
            <Button
              textStyle={{ fontSize: 16 }}
              title="Publish Draft"
              variant="secondary"
              style={{ flex: 1, width: "100%", borderRadius: 15 }}
              LeftIcon={<Ionicons name="share-outline" size={20} />}
            />
          )}
          {post.draft && (
            <Button
              textStyle={{ fontSize: 16 }}
              title="Edit Draft"
              variant="secondary"
              onPress={() => {
                const route = `post/${encodeURIComponent("url" as string)}/upload`;

                router.push({
                  pathname: route,
                  params: { draftId: post.id },
                });
              }}
              style={{ flex: 1, width: "100%", borderRadius: 15 }}
              LeftIcon={<Ionicons name="create-outline" size={20} />}
            />
          )}
          <Button
            textStyle={{ fontSize: 16 }}
            title={post.draft ? "Delete Draft" : "Delete Post"}
            onPress={async () => {
              if (!user?.user?.uid) return;
              const reportDeleted = await deleteReport(user.user.uid, post.id, post.draft);
              if (reportDeleted) router.push("/profile");
            }}
            variant="secondary"
            style={{ flex: 1, width: "100%", borderRadius: 15 }}
            LeftIcon={<Ionicons name="trash-outline" size={20} />}
          />
        </View>
      </BottomSheetModal>
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
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    gap: 5,
  },
  text: {
    fontSize: 16,
  },
});
