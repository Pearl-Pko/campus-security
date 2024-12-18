import { View, Text, Image, ImageSourcePropType, StyleProp, ImageStyle } from "react-native";
import React from "react";

export default function Profile({
  style,
  uri
}: {
  style?: StyleProp<ImageStyle>;
  uri?: string
}) {
  const blankProfile = require("../../../assets/images/blank-profile-picture.png");

  return (
    <View>
      <Image
        style={[{ width: 50, height: 50, borderRadius: 100 }, style]}
        source={uri ? {uri} : blankProfile}
      />
    </View>
  );
}
