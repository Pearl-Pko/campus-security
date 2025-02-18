import { View, Text, Modal, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import pallets from "@/constants/pallets";

const FullScreenLoader = ({ visible }: { visible: boolean }) => {
  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" animating color={pallets.colors.primary} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default FullScreenLoader;
