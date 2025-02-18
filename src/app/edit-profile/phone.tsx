import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import PageWrapper from "@/component/basic/PageWrapper";
import { UserProfileSchema } from "@/schema/profile";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/component/basic/Header";
import pallets from "@/constants/pallets";
import { TextInput } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import Error from "@/component/basic/Error";
import { isEqual } from "lodash";
import { updateUserProfile } from "@/service/auth";
import { SessionContext, SessionContextType } from "@/context/SessionContext";
import FullScreenLoader from "@/component/basic/FullScreenLoader";

const EditPhoneNumber = UserProfileSchema.pick({
  phoneNumber: true,
});

type EditUserName = z.infer<typeof EditPhoneNumber>;

export default function name() {
  const router = useRouter();
  const params = useLocalSearchParams<EditUserName>();
  const user = useContext(SessionContext) as SessionContextType;
  const { control, formState, getValues, handleSubmit } = useForm<EditUserName>({
    resolver: zodResolver(EditPhoneNumber),
    mode: "onChange",
    defaultValues: {
      phoneNumber: params.phoneNumber,
    },
  });

  const canSubmit =
    formState.isValid && formState.isDirty && !isEqual(getValues(), formState.defaultValues);

  const submit = async () => {
    if (!user?.user?.uid) return;

    const dd = await updateUserProfile(user.user.uid, getValues());
    console.log("dd", dd);
    router.back();
  };

  return (
    <PageWrapper>
      <Header
        LeftIcon={<Text>Cancel</Text>}
        title="Phone Number"
        RightIcon={
          <TouchableOpacity disabled={!canSubmit} onPress={handleSubmit(() => submit())}>
            <Text style={[{ color: pallets.colors.primary }, !canSubmit && { opacity: 0.4 }]}>
              Save
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={{ marginTop: 15 }}>
        <Text style={{ color: "grey", fontWeight: "600" }}>Phone Number</Text>
        <View style={{ gap: 3 }}>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { value, onChange } }) => {
              return (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  // placeholder="Username"
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
          <Error title={formState.errors.phoneNumber?.message} />
        </View>
      </View>
      <FullScreenLoader visible={formState.isSubmitting}/>
    </PageWrapper>
  );
}
