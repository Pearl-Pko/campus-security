import { Stack } from "expo-router";
import AppProvider from "../component/(app)/AppProvider";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="video" />
        <Stack.Screen name="preview" />
      </Stack>
    </AppProvider>
  );
}
