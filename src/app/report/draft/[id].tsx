import { View, Text } from "react-native";
import React, { useContext } from "react";
import { useGetIncident, useGetIncidentDraft } from "@/service/incident";
import { useLocalSearchParams } from "expo-router";
import PostItem from "@/component/(app)/PostItem";
import Header from "@/component/basic/Header";
import PageWrapper from "@/component/basic/PageWrapper";
import PostDetails from "@/component/(app)/PostDetails";
import { IncidentSchema } from "@/schema/incident";
import { SessionContext, SessionContextType } from "@/context/SessionContext";

export default function Report() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useContext(SessionContext) as SessionContextType;

  const incident = useGetIncidentDraft(user?.user?.uid!, id);
  return (
    <PageWrapper style={{ flex: 1, paddingHorizontal: 0 }}>
      <View style={{ paddingHorizontal: 15 }}>
        <Header />
      </View>
      {incident && <PostDetails post={incident} />}
    </PageWrapper>
  );
}
