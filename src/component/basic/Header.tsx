import { View, Text, TouchableOpacity, StyleProp, TextStyle } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  LeftIcon?: React.ReactElement;
  RightIcon?: React.ReactElement;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  onPressLeft?: () => void;
};

export default function Header({ LeftIcon, RightIcon, title, titleStyle, onPressLeft }: Props) {
  const router = useRouter();
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
      <View
        style={{ position: "absolute", left: 0, alignItems: "center", justifyContent: "center" }}
      >
        <TouchableOpacity
          onPress={() => {
            // if (onP)
            router.back();
          }}
        >
          {LeftIcon || <Ionicons name="arrow-back-outline" size={25} />}
        </TouchableOpacity>
      </View>
      <Text style={titleStyle}>{title}</Text>
      <View style={{ position: "absolute", right: 0 }}>
        {/* <TouchableOpacity onPress={onPressRight}>{RightIcon}</TouchableOpacity> */}
        {RightIcon}
      </View>
    </View>
  );
}
