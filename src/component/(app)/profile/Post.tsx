import { View, Text } from "react-native";
import React, { useContext } from "react";
import { useGetUserIncidents } from "@/service/incident";
import { SessionContext, SessionContextType } from "@/context/SessionContext";
import { FlatList } from "react-native-gesture-handler";
import PostItem from "../PostItem";
import PostList from "../PostList";

export default function Post({uid} : {uid: string}) {
  const incidents = useGetUserIncidents(uid, false);

  return (
    <View style={{ flex: 1 }}>
      <PostList incidents={incidents}/>
    </View>
  );
}
