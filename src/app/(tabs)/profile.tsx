import Button from "@/component/Button";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import React, { useContext, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { SessionContext, SessionContextType } from "@/context/SessionContext";
import { logoutUser } from "@/service/auth";
import PageWrapper from "@/component/basic/PageWrapper";
import Header from "@/component/basic/Header";
import Profile from "@/component/basic/Profile";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Post from "@/component/(app)/profile/Post";
import Draft from "@/component/(app)/profile/Draft";

export default function Tab() {
  const router = useRouter();
  const user = useContext(SessionContext) as SessionContextType;

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "first", title: "Draft" },
    { key: "second", title: "Post" },
  ]);

  const renderScene = SceneMap({
    first: Draft,
    second: Post,
  });

  return (
    <PageWrapper>
      <View style={styles.content}>
        {!user?.user ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Ionicons size={90} color="grey" name="person-outline" />
            <Text>Log into an existing account</Text>
            <Button
              title="Login"
              onPress={() => {
                router.push("/signin");
              }}
              style={{ width: "80%", paddingVertical: 5, marginTop: 15 }}
            />
            <Button
              title="Signup"
              variant="primary"
              onPress={() => {
                router.push("/signup");
              }}
              style={{ width: "80%", paddingVertical: 5, marginTop: 15 }}
            />
          </View>
        ) : (
          <>
            <Header
              title={user.user.displayName || "Empty"}
              RightIcon={
                <TouchableOpacity onPress={() => router.push("/drawer") }>
                  <Ionicons name="menu-outline" size={25} />
                </TouchableOpacity>
              }
              LeftIcon={<></>}

            />
            <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
              <View style={{ marginTop: 20 }}>
                <Profile />
              </View>
              <View style={{ marginTop: 10 }}>
                <Button
                  title="Edit profile"
                  variant="secondary"
                  onPress={() => {
                    router.push("/edit-profile");
                  }}
                  style={{ paddingHorizontal: 15 }}
                />
              </View>
              <View style={{ flex: 1, marginTop: 5 }}>
                <TabView
                  style={{ backgroundColor: "white" }}
                  navigationState={{ index, routes }}
                  renderScene={renderScene}
                  onIndexChange={setIndex}
                  // pagerStyle={{backgroundColor: "white"}}
                  renderTabBar={(props) => (
                    <TabBar
                      {...props}
                      style={{ backgroundColor: "white", elevation: 0, shadowOpacity: 0 }}
                      activeColor="black"
                      inactiveColor="grey"
                      indicatorStyle={{ backgroundColor: "black" }}
                      pressOpacity={1}
                      pressColor="transparent"
                      // tabStyle={}
                    />
                  )}
                  initialLayout={{ width: Dimensions.get("window").width }}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  container: {},
  content: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
});
