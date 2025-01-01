import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/component/basic/Header";
import PageWrapper from "@/component/basic/PageWrapper";
import { googleSignIn, signInUser } from "@/service/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import pallets from "@/constants/pallets";

export default function AuthOptions() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const user = await googleSignIn();
    if (typeof user == "string") {
      alert("Failed to sign in");
      return;
    }
    else {
      router.push("/profile")
    }
  };

  return (
    <PageWrapper style={{ paddingHorizontal: 0 }}>
      <View style={{paddingHorizontal: 15}}>
        <Header titleStyle={{ fontWeight: "bold" }} />
      </View>
      <View style={{ flex: 1, justifyContent: "space-between",}}>
        <View style={{paddingHorizontal: 15}}>
          <Text
            style={{ fontWeight: "bold", fontSize: 25, textAlign: "center", paddingVertical: 35, 
             }}
          >
           Sign up for Campus
          </Text>
          <View style={{ gap: 10 }}>
            <TouchableOpacity style={styles.icon} onPress={() => router.navigate("/signup")}>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <View style={{ position: "absolute", left: 0 }}>
                  <Ionicons name="person-outline" size={15} />
                </View>
                <Text>Continue with email</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={() => handleGoogleSignIn()}>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <View style={{ position: "absolute", left: 0 }}>
                  <Ionicons name="logo-google" size={15} />
                </View>
                <Text>Continue with Google</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
            padding: 15,
            justifyContent: "center",
            backgroundColor: pallets.colors.secondary,
            flexDirection: "row",
          }}
        >
          <Text style={{ alignItems: "center" }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.navigate("/signin-options")}>
            <Text style={{ color: pallets.colors.primary }}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  icon: {
    flexDirection: "row",
    position: "relative",
    borderWidth: 1,
    borderColor: pallets.colors.secondary,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
