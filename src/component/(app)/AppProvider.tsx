import { View, Text } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import SessionProvider from "@/context/SessionContext";

export default function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SessionProvider>{children}</SessionProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
