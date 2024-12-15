import Button from "@/component/Button";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useRef } from "react";
import { useRouter } from "expo-router";
import { SessionContext, SessionContextType } from "@/context/SessionContext";
import { logoutUser } from "@/service/auth";
import PageWrapper from "@/component/basic/PageWrapper";

export default function Tab() {
  const router = useRouter();
  const user = useContext(SessionContext) as SessionContextType;

  return (
    <PageWrapper>
      <View style={styles.content}>
        {!user?.user ? (
          <>
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
          </>
        ) : (
          <>
            <Text>{user.user.email}</Text>
            <Button title="Sign out" onPress={() => logoutUser()} />
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
    justifyContent: "center", 
    alignItems: "center"
  }
});
