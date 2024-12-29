import { View, Text, TouchableOpacity} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import PageWrapper from "@/component/basic/PageWrapper";
import Header from "@/component/basic/Header";
import ProfilePic from "@/component/basic/Profile";
import { getUserProfile, useUserProfile } from "@/service/auth";
import { SessionContext, SessionContextType } from "@/context/SessionContext";
import { UserProfileSchema } from "@/schema/profile";
import pallets from "@/constants/pallets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function editprofile() {
  const router = useRouter();
  const user = useContext(SessionContext) as SessionContextType;
  // const [userProfile, setUserProfile] = useState<UserProfileSchema | null>(null);
  const {data: userProfile} = useUserProfile(user?.user?.uid);

  return (
    <PageWrapper>
      <Header title="Edit profile" titleStyle={{ fontWeight: 600 }} />
      <View style={{ marginTop: 40 }}>
        <View style={{ justifyContent: "center", alignItems: "center", gap: 5 }}>
          <ProfilePic uri={userProfile?.avatar} />
          <Text>Change photo</Text>
        </View>
        <Text style={{ color: "grey" }}>About you</Text>
        <View style={{gap: 15, marginTop: 10}}>
          <TouchableOpacity
            onPress={() => router.push({pathname: "/edit-profile/name", params: {displayName: userProfile?.displayName}})}
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text>Name</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{userProfile?.displayName}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color={"grey"} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({pathname: "/edit-profile/username", params: {username: userProfile?.username}})}

            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text>Username</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{userProfile?.username}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color={"grey"} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({pathname: "/edit-profile/bio", params: {bio: userProfile?.bio}})}

            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text>Bio</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{userProfile?.bio}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color={"grey"} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </PageWrapper>
  );
}
