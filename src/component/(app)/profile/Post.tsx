import { View, Text } from "react-native";
import React, { useContext } from "react";
import { useGetIncidents } from "@/service/incident";
import { SessionContext, SessionContextType } from "@/context/SessionContext";
import { FlatList } from "react-native-gesture-handler";
import PostItem from "../PostItem";

export default function Post() {
  const user = useContext(SessionContext) as SessionContextType;
  const incidents = useGetIncidents(user?.user?.uid || "", false);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={incidents}
        ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: "#DDDDDD"}}></View>}
        renderItem={({ item }) => {
          return <PostItem post={item} />;
        }}
      />
    </View>
  );
}
