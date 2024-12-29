import { View, Text, FlatList } from "react-native";
import React, { useContext } from "react";
import { SessionContext, SessionContextType } from "@/context/SessionContext";
import { useGetUserIncidents } from "@/service/incident";
import Content from "../Content";

export default function Media() {
  const user = useContext(SessionContext) as SessionContextType;
  const incidents = useGetUserIncidents(user?.user?.uid || "", false);
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        numColumns={3}
        data={incidents}
        columnWrapperStyle={{ flex: 1 , gap: 7}}
    
        contentContainerStyle={{  padding: 15 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <View style={{flex: 1, height: 130}}>
              <Content uri={item.media} />
            </View>
          );
        }}
      />
    </View>
  );
}
