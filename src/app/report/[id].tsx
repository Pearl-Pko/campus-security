import { View, Text } from "react-native";
import React from "react";
import { useGetIncident } from "@/service/incident";
import { useLocalSearchParams } from "expo-router";
import PostItem from "@/component/(app)/PostItem";
import Header from "@/component/basic/Header";
import PageWrapper from "@/component/basic/PageWrapper";
import PostDetails from "@/component/(app)/PostDetails";

export default function Post() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const incident = useGetIncident(id);

  // console.log(ïncident)
  console.log("reporting");
  return (
    <PageWrapper style={{ flex: 1, paddingHorizontal: 0 }}>
      <View style={{paddingHorizontal: 15}}>
        <Header />
      </View>
      {incident && <PostDetails post={incident} />}
    </PageWrapper>
  );
}
