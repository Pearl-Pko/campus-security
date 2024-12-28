import { View, Text } from "react-native";
import React, { createContext, useState } from "react";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { Stack } from "expo-router";

export type UploadContextType = {
  location: GooglePlaceDetail | null;
  setLocation: (location: GooglePlaceDetail | null) => void;
};
export const UploadContext = createContext<UploadContextType | null>(null);

export default function _layout() {
  const [location, setLocation] = useState<GooglePlaceDetail | null>(null);

  return (
    <UploadContext.Provider value={{location, setLocation}}>
      <Stack screenOptions={{headerShown: false}}/>
    </UploadContext.Provider>
  );
}
