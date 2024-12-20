import { View, Text, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import PageWrapper from "@/component/basic/PageWrapper";
import Header from "@/component/basic/Header";
import { useUserProfile } from "@/service/auth";
import ProfilePic from "@/component/basic/Profile";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Post from "@/component/(app)/profile/Post";
import Media from "@/component/(app)/profile/Media";
import { SessionContext, SessionContextType } from "@/context/SessionContext";

export default function User() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = useUserProfile(id);
  const user = useContext(SessionContext) as SessionContextType;

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "first", title: "Post" },
    { key: "second", title: "Media" },
  ]);

  const renderScene = SceneMap({
    first: Post,
    second: Media,
  });
  // useEffect(() => {
  //   if (user == id) {
  //     <Redirect/>
  //   }
  // }, [user, id])

  return (
    <PageWrapper style={{ paddingHorizontal: 0 }}>
      <View style={{ paddingHorizontal: 15 }}>
        <Header title={profile.data?.displayName} titleStyle={{ fontWeight: 600 }} />
      </View>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <View style={{ marginBottom: 10 }}>
          <ProfilePic uri={profile.data?.avatar} />
        </View>
        <Text>@{profile.data?.username}</Text>
        <Text>{profile.data?.bio}</Text>
      </View>
      <View style={{ flex: 1, marginTop: 5, width: "100%", backgroundColor: "red" }}>
        <TabView
          style={{ backgroundColor: "white", padding: 0, margin: 0 }}
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
    </PageWrapper>
  );
}
