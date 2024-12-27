import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import PageWrapper from "@/component/basic/PageWrapper";
import { useGetAllIncidents } from "@/service/incident";
import PostItem from "@/component/(app)/PostItem";
import PostList from "@/component/(app)/PostList";
import pallets from "@/constants/pallets";

export default function Tab() {
  const router = useRouter();
  const incidents = useGetAllIncidents();

  return (
    <PageWrapper style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 600 }}>Reports</Text>
        <TouchableOpacity onPress={() => router.push("/sos")} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={{color: pallets.colors.primary}}>SOS</Text>
          <Ionicons name="megaphone-outline" size={16} color={ pallets.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <PostList incidents={incidents} />
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
});
