import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import PageWrapper from "@/component/basic/PageWrapper";
import Header from "@/component/basic/Header";
import * as Location from "expo-location";
import { sendSoS } from "@/service/incident";
import { SessionContext, SessionContextType } from "@/context/SessionContext";
import pallets from "@/constants/pallets";
import { useAppState } from "@/hooks/useAppState";

export default function sos() {
  const [sosActive, setSosActive] = useState(false);
  // const
  const user = useContext(SessionContext) as SessionContextType;
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  const fetchLocationInRealtime = async () => {
    console.log("sos active");

    if (!locationPermission?.granted) return null;
    const id = Date.now();

    return await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 2 },
      (location) => {
        if (!user) return;

        sendSoS(user.user, {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          lastUpdated: new Date(location.timestamp),
          id: id.toString(),
          userId: user?.user?.uid || null,
        });
        console.log(location.coords); // Latitude, Longitude
        // sendLocationToContacts(location.coords);
      },
    );
  };

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      if (sosActive) subscription = await fetchLocationInRealtime();
    })();

    return () => {
      subscription?.remove();
      subscription = null;
    };
  }, [sosActive]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // const handleAppStateChange = useCallback(() => {
  //   // if (!locationPermission?.granted)
  //     requestLocationPermission();

  // }, []); // Add dependencies if needed

  // useAppState(handleAppStateChange)

  return (
    <PageWrapper style={{ backgroundColor: sosActive ? "red" : "white" }}>
      <Header />
      {locationPermission?.granted ? (
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
          <TouchableOpacity
            onLongPress={() => {
              setSosActive(!sosActive);
            }}
            style={[styles.sos, { backgroundColor: sosActive ? "white" : "red" }]}
          >
            <Text
              style={{
                fontSize: 120,
                lineHeight: 120,
                textAlign: "center",
                color: sosActive ? "red" : "white",
              }}
            >
              sos
            </Text>
          </TouchableOpacity>
          <Text style={{ textAlign: "center", marginTop: 25, color: sosActive ? "white" : "red" }}>
            {sosActive
              ? "Please standy, we are currently requesting for help"
              : `After long pressing the SOS button, we will contact the nearest emergency service to your
          current location`}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 15 }}>
          <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>
            To use the SOS feature, you need to allow access to your location
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openSettings().catch(() => {
                Alert.alert("Failed to open settings");
              });
            }}
            style={{
              backgroundColor: pallets.colors.primary,
              width: "100%",
              alignItems: "center",
              padding: 20,
              borderRadius: 15,
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      )}
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  sos: {
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});
