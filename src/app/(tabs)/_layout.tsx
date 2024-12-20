import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Pressable, TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "black", headerShown: false,

      tabBarButton: (props) => <Pressable {...props} android_ripple={{ color: 'transparent' }}/>
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-post"
        options={{
          tabBarStyle: {
            display: "none", 
            height: 0
            // backgroundColor: 'red'
          },
          tabBarIcon: ({ color }) => (
            <View
              style={{
                backgroundColor: "black",
                // padding: 10,
                width: 50,
                borderRadius: 10,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="add" color="white" size={25} />
            </View>
          ),
          tabBarLabel: () => <View></View>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
