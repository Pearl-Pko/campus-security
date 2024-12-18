import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Header from "@/component/basic/Header";
import PageWrapper from "@/component/basic/PageWrapper";
import pallets from "@/constants/pallets";
import { Ionicons } from "@expo/vector-icons";
import { logoutUser } from "@/service/auth";
import { useRouter } from "expo-router";

export default function drawer() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/profile");
  }
  return (
    <PageWrapper style={{ backgroundColor: pallets.colors.secondary }}>
      <Header />
      <Text style={{ fontSize: 20, fontWeight: 600, paddingVertical: 20 }}>
        Settings and privacy
      </Text>
      <Text>Account</Text>
      <TouchableOpacity style={{ backgroundColor: "white", padding: 13, marginTop: 5, borderRadius: 10 , justifyContent: "space-between", flexDirection: "row", alignItems: "center"}} onPress={() => handleLogout()}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Ionicons name="exit-outline" size={25} color={"grey"} />
          <Text>Log out</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color={"grey"} />
      </TouchableOpacity>
    </PageWrapper>
  );
}
