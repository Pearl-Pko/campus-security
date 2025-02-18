import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../component/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { CreateIncidentDraftDto, CreateIncidentDTO, IncidentDraftSchema } from "@/schema/incident";
import Header from "@/component/basic/Header";
import { Checkbox } from "react-native-paper";
import pallets from "@/constants/pallets";
import {
  createIncidentReport,
  editIncidentDraftReport,
  useGetIncident,
  useGetIncidentDraft,
} from "@/service/incident";
import { SessionContext, SessionContextType } from "@/context/SessionContext";
import { GooglePlaceData } from "react-native-google-places-autocomplete";
import { UploadContext, UploadContextType } from "./_layout";
import * as Location from "expo-location";
import uri from "./preview";
import FullScreenLoader from "@/component/basic/FullScreenLoader";

export default function upload() {
  const router = useRouter();
  let { uri, draftId } = useLocalSearchParams<{ uri: string; draftId?: string }>();
  uri = decodeURIComponent(uri as string);
  const { location, setLocation } = useContext(UploadContext) as UploadContextType;
  const [locationPermissionStatus, setLocationPermissionStatus] =
    useState<Location.PermissionStatus>();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  const user = useContext(SessionContext) as SessionContextType;

  const draft = useGetIncidentDraft(user?.user?.uid, draftId, true);

  const { control, getValues, watch, formState, reset, handleSubmit } = useForm<CreateIncidentDTO>({
    defaultValues: draft!,
  });

  useEffect(() => {
    if (draft) {
      reset(draft);
    }
  }, [draft]);

  const onSubmit = async (isDraft: boolean = false) => {
    try {
      if (!user) return;

      const form = getValues();

      let currentLocation: Location.LocationObject | null = null;
      let currentAddress: Location.LocationGeocodedAddress[] | null = null;

      if (form.useCurrentLocation) {
        console.log("here");
        currentLocation = await Location.getCurrentPositionAsync();
        currentAddress = await Location.reverseGeocodeAsync(currentLocation.coords);
      }

      const submitForm: CreateIncidentDTO = {
        ...form,
        draft: isDraft,
        reporterId: user?.user?.uid || null,
        address:
          (form.useCurrentLocation
            ? currentAddress?.[0].formattedAddress
            : location
              ? location?.formatted_address
              : draft?.address) || null,
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
              : draft?.location
                ? {
                    latitude: draft.location.latitude || 0,
                    longitude: draft.location.longitude || 0,
                  }
                : null,
        contentUri: uri,
      };

      console.log("submit", submitForm.location);

      if (draftId) {
        const result = await editIncidentDraftReport(draftId, submitForm);
        console.log("after", result);
      } else {
        console.log("tried");
        const result = await createIncidentReport(user.user, submitForm);
        console.log("after", result);
      }
      router.push("/profile");
    } catch (error) {
      Alert.alert("Failed to create incident report");
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const useCurrentLocation = watch("useCurrentLocation");

  console.log("locat", locationPermissionStatus);

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 15 }}>
      <Header
        LeftIcon={<Ionicons name="chevron-back-outline" size={25} />}
        RightIcon={
          draftId ? (
            <TouchableOpacity
              onPress={() => {
                onSubmit(true);
              }}
            >
              <Text style={{ color: pallets.colors.primary }}>Save</Text>
            </TouchableOpacity>
          ) : (
            <View></View>
          )
        }
      />
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
                onPress={() => router.push(`post/${encodeURIComponent(uri as string)}/location`)}
              >
                <View style={{ gap: 5, flexDirection: "row", flex: 1 }}>
                  <Ionicons size={20} name="location-outline" />
                  <Text>{location?.name || draft?.address || "Location"}</Text>
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
            {
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Controller
                    control={control}
                    name="useCurrentLocation"
                    render={({ field: { value, onChange } }) => {
                      return (
                        <Checkbox.Android
                          disabled={!locationPermission?.granted}
                          uncheckedColor="grey"
                          color={"blue"}
                          status={value ? "checked" : "unchecked"}
                          onPress={() => onChange(!value)}
                        />
                      );
                    }}
                  />
                  <Text style={[!locationPermission?.granted && { opacity: 0.5 }]}>Use current location</Text>
                </View>
                {!locationPermission?.granted && <Text style={{ color: "grey", fontStyle: "italic" }}>
                  You need to enable access to location to enable this
                </Text>}
              </View>
            }
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
            <Text style={{ color: "grey", fontStyle: "italic" }}>
              Your profile would not be associated with this incident report
            </Text>
          </View>
        </View>
        {!draftId && (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Button
              style={{ flex: 1 }}
              title="Drafts"
              variant="secondary"
              onPress={() => {
                console.log("did");
                if (!!(!user?.user || user.user.isAnonymous)) {
                  console.log("yea");
                  Alert.alert("Failed", "You need to create an account to create drafts");
                } else handleSubmit(() => onSubmit(true))();
              }}
              LeftIcon={<Ionicons name="folder-open-outline" size={20} />}
            />
            <Button
              style={{ flex: 1 }}
              title="Post"
              variant="primary"
              onPress={handleSubmit(() => onSubmit(false))}
              LeftIcon={<Ionicons name="share-outline" color="white" size={20} />}
            />
          </View>
        )}
      </View>
      <FullScreenLoader visible={formState.isSubmitting} />
    </View>
  );
}
