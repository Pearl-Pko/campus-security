import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "@/component/basic/Header";
import PageWrapper from "@/component/basic/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "react-native-gesture-handler";
import Button from "@/component/Button";
import { Controller, useForm } from "react-hook-form";
import { LoginUserWithEmailSchema } from "@/schema/auth";
import Error from "@/component/basic/Error";
import { signInUser, signupUser } from "@/service/auth";
import { useRouter } from "expo-router";

export default function signin() {
  const { control, formState, setValue, watch, getValues } = useForm<LoginUserWithEmailSchema>({
    resolver: zodResolver(LoginUserWithEmailSchema),
    mode: "onChange",
  });
  const router = useRouter();

  console.log("da", formState.errors.email?.message);
  const handleSignUp = async () => {
    const { email, password } = getValues();
    const result = await signupUser(email, password);
    if (typeof result === "string") {
    } else {
      router.push("/profile");
    }
  };

  return (
    <PageWrapper>
      <Header title="Sign Up" titleStyle={{ fontWeight: "bold" }} />
      <View style={{ padding: 15, justifyContent: "space-between", flex: 1 }}>
        <View style={{ gap: 10 }}>
          <View style={{ gap: 3 }}>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => {
                return (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Email"
                    style={{
                      borderWidth: 0,
                      borderBottomWidth: 1,
                      paddingVertical: 4,
                      borderColor: "lightgrey",
                    }}
                  />
                );
              }}
            />
            <Error title={formState.errors.email?.message} />
          </View>
          <View style={{ gap: 3 }}>
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => {
                return (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Password"
                    style={{
                      borderWidth: 0,
                      borderBottomWidth: 1,
                      paddingVertical: 4,
                      borderColor: "lightgrey",
                    }}
                  />
                );
              }}
            />
            <Error title={formState.errors.password?.message} />
          </View>
        </View>
        <Button disabled={!formState.isValid} title="Continue" onPress={() => handleSignUp()} />
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
