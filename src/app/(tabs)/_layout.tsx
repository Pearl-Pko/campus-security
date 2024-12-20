import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false}}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarActiveTintColor: "black",
          

          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarActiveTintColor: "black",
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
