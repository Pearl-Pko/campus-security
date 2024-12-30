import { View, Text } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import SessionProvider from "@/context/SessionContext";
import { PaperProvider } from "react-native-paper";
import "react-native-get-random-values";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

if (__DEV__) {
  auth().useEmulator("http://localhost:9099");
  firestore().useEmulator("localhost", 8080);
  storage().useEmulator("localhost", 9199);
}

export default function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <PaperProvider settings={{ rippleEffectEnabled: false }}>
          <SessionProvider>{children}</SessionProvider>
        </PaperProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
