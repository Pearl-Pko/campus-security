import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../component/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { CreateIncidentDTO } from "@/schema/incident";
import Header from "@/component/basic/Header";
import { Checkbox } from "react-native-paper";
import pallets from "@/constants/pallets";
import { createIncidentReport } from "@/service/incident";
import { SessionContext, SessionContextType } from "@/context/SessionContext";

export default function upload() {
  const router = useRouter();
  let { url } = useLocalSearchParams();
  url = decodeURIComponent(url as string);
  const user = useContext(SessionContext) as SessionContextType;

  const { control, getValues } = useForm<CreateIncidentDTO>();

  const handlePost = async (draft: boolean = false) => {
    const form = getValues();

    const result = await createIncidentReport({ ...form, draft, reporterId: user?.user?.uid || null });
    console.log("after", result);
    router.push("/profile");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 15 }}>
      <Header LeftIcon={<Ionicons name="chevron-back-outline" size={25} />} />
      <View style={{ justifyContent: "space-between", flex: 1, marginTop: 15 }}>
        <View style={{ gap: 5 }}>
          <View style={{ gap: 3 }}>
            <Text style={{ fontWeight: "600", fontSize: 15 }}>Add Title</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { value, onChange } }) => {
                return (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    multiline
                    // numberOfLines={10}
                    placeholder="Add title"
                    textAlignVertical="top"
                  />
                );
              }}
            />
          </View>
          <View style={{ gap: 3 }}>
            <Text style={{ fontWeight: "600", fontSize: 15 }}>Describe the incident</Text>

            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange } }) => {
                return (
                  <TextInput
                    value={value || ""}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={10}
                    placeholder="Add Description"
                    textAlignVertical="top"
                  />
                );
              }}
            />
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 15, fontWeight: 600 }}>Where did this incident happen?</Text>
            <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ gap: 5, flexDirection: "row" }}>
                <Ionicons size={20} name="location-outline" />
                <Text>Location</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={25} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Controller
              control={control}
              name="useCurrentLocation"
              render={({ field: { value, onChange } }) => {
                return (
                  <Checkbox.Android
                    uncheckedColor="grey"
                    color={"blue"}
                    status={value ? "checked" : "unchecked"}
                    onPress={() => onChange(!value)}
                  />
                );
              }}
            />
            <Text>Use current location</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Controller
              control={control}
              name="useAnonymousReporting"
              render={({ field: { value, onChange } }) => {
                return (
                  <Checkbox.Android
                    uncheckedColor="grey"
                    color={"blue"}
                    status={value ? "checked" : "unchecked"}
                    onPress={() => onChange(!value)}
                  />
                );
              }}
            />
            <Text>Report anonymously</Text>
          </View>
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
            onPress={async () => await handlePost()}
            LeftIcon={<Ionicons name="share-outline" color="white" size={20} />}
          />
        </View>
      </View>
    </View>
  );
}
