import {
  View,
  Text,
  Button as RnButton,
  ButtonProps,
  TouchableOpacity,
  TouchableOpacityProps,
  ColorValue,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native";
import React from "react";

type variant = "primary" | "secondary" | "white";

type Props = TouchableOpacityProps & {
  variant?: variant;
  title: string;
  LeftIcon?: React.ReactElement;
  textStyle?: StyleProp<TextStyle>
};
export default function Button({
  variant = "primary",
  style,
  textStyle,
  LeftIcon,
  disabled,
  ...props
}: Props) {
  const textColorVariants: Record<variant, ColorValue> = {
    primary: "#FFFFFF",
    secondary: "#000000",
    white: "#000000",
  };

  const backgroundColorVariants: Record<variant, ColorValue> = {
    primary: "#FE2C55",
    secondary: "#EEEEEE",
    white: "#FFFFFF",
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        {
          backgroundColor: backgroundColorVariants[variant],
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 6,
          flexDirection: "row",
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      {...props}
    >
      {LeftIcon}
      <Text
        style={[{ color: textColorVariants[variant], paddingHorizontal: 5, paddingVertical: 10 }, textStyle]}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},
});
