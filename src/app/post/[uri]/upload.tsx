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
import { GooglePlaceData } from "react-native-google-places-autocomplete";
import { UploadContext, UploadContextType } from "./_layout";
import * as Location from "expo-location";

export default function upload() {
  const router = useRouter();
  let { url } = useLocalSearchParams<{ url: string }>();
  url = decodeURIComponent(url as string);
  const { location, setLocation } = useContext(UploadContext) as UploadContextType;

  const user = useContext(SessionContext) as SessionContextType;

  const { control, getValues, watch } = useForm<CreateIncidentDTO>();

  const handlePost = async (draft: boolean = false) => {
    const form = getValues();

    let currentLocation: Location.LocationObject | null = null;
    let currentAddress: Location.LocationGeocodedAddress[] | null = null;

    if (form.useCurrentLocation) {
      currentLocation = await Location.getCurrentPositionAsync();
      currentAddress = await Location.reverseGeocodeAsync(currentLocation.coords);
    }

    const result = await createIncidentReport({
      ...form,
      draft,
      reporterId: user?.user?.uid || null,
      address:
        (form.useCurrentLocation
          ? currentAddress?.[0].formattedAddress
          : location?.formatted_address) || null,
      location:
        form.useCurrentLocation && currentLocation
          ? {
              latitude: currentLocation?.coords.latitude || 0,
              longitude: currentLocation?.coords.longitude || 0,
            }
          : location?.geometry.location
            ? {
                latitude: location?.geometry.location.lat || 0,
                longitude: location?.geometry.location.lng || 0,
              }
            : null,
      contentUri: url,
    });
    console.log("after", result);
    router.push("/profile");
  };

  const useCurrentLocation = watch("useCurrentLocation");

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 15 }}>
      <Header LeftIcon={<Ionicons name="chevron-back-outline" size={25} />} />
      <View style={{ justifyContent: "space-between", flex: 1, marginTop: 15 }}>
        <View style={{ gap: 5 }}>
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
            {!useCurrentLocation && (
              <TouchableOpacity
                style={{ flexDirection: "row", justifyContent: "space-between" }}
                onPress={() => router.push(`post/${encodeURIComponent(url as string)}/location`)}
              >
                <View style={{ gap: 5, flexDirection: "row" }}>
                  <Ionicons size={20} name="location-outline" />
                  <Text>{location?.name || "Location"}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setLocation(null);
                  }}
                >
                  <Ionicons
                    name={location ? "close-outline" : "chevron-forward-outline"}
                    size={25}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
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
          </View>

          <View>
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
            <Text style={{color: "grey", fontStyle: "italic"}}>Your profile would not be associated with this incident report</Text>
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