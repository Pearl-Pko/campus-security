import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Button from "../component/Button";
import { useRouter } from "expo-router";

export default function upload() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 15 }}>
      <TouchableOpacity onPress={() => {router.back()} } style={{ marginBottom: 10 }}>
        <Ionicons name="chevron-back-outline" size={25} />
      </TouchableOpacity>
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <View>
          <TextInput
            multiline
            numberOfLines={10}
            placeholder="Add Description"
            textAlignVertical="top"
          />
          <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{gap: 5, flexDirection: "row"}}>
              <Ionicons size={20} name="location-outline" />
              <Text>Location</Text>
            </View>
            <Ionicons name="chevron-forward-outline"  size={25} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button
            style={{ flex: 1 }}
            title="Drafts"
            variant="secondary"
            LeftIcon={<Ionicons name="folder-open-outline" size={20} />}
          />
          <Button
            style={{ flex: 1 }}
            title="Post"
            variant="primary"
            LeftIcon={<Ionicons name="share-outline" color="white" size={20} />}
          />
        </View>
      </View>
    </View>
  );
}
