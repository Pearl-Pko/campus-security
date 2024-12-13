import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Tab() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>

      <Link href="preview/da" asChild>
        <TouchableOpacity
          style={{
            backgroundColor: "#1E96FC",
            position: "absolute",
            width: 60,
            height: 60,
            borderRadius: 100,
            right: 20,
            bottom: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome name="plus" color="white" size={20} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
