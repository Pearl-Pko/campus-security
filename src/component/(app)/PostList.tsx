import { View, Text } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { IncidentSchema } from "@/schema/incident";
import PostItem from "./PostItem";

export default function PostList({ incidents }: { incidents: IncidentSchema[] }) {
  return (
    <FlatList
      keyExtractor={(item) => item.id}
      data={incidents}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#DDDDDD" }}></View>}
      renderItem={({ item }) => {
        return <PostItem post={item} />;
      }}
    />
  );
}
