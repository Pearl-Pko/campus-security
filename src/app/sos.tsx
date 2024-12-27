import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import PageWrapper from "@/component/basic/PageWrapper";
import Header from "@/component/basic/Header";
import * as Location from "expo-location";
import { sendSoS } from "@/service/incident";
import { SessionContext, SessionContextType } from "@/context/SessionContext";

export default function sos() {
  const [sosActive, setSosActive] = useState(false);
  const user = useContext(SessionContext) as SessionContextType;

  const fetchLocationInRealtime = async () => {
    console.log("sos active");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const id = Date.now();

      return await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 2},
        (location) => {
          sendSoS({
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
    }
    return null;
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


  return (
    <PageWrapper style={{ backgroundColor: sosActive ? "red" : "white" }}>
      <Header />
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
