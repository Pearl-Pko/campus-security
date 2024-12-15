import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Error({ title }: { title?: string }) {
  return (
    title && (
      <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
        <Ionicons name="warning-outline" color="red" size={15} />
        <Text style={{ color: "red" }}>{title}</Text>
      </View>
    )
  );
}
