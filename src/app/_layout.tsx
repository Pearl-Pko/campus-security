import { Stack } from "expo-router";
import AppProvider from "../component/(app)/AppProvider";
import firebase from '@react-native-firebase/app';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        {/* <Stack.Screen name="preview" /> */}
      </Stack>
    </AppProvider>
  );
}
