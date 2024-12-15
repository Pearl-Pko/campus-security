import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Login from "./Login";

const Signup = forwardRef<ModalRefProps, {}>((props, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["80%"], []);

  useImperativeHandle(ref, () => ({
    close() {
      bottomSheetRef.current?.close();
      console.log("pop");
    },
    open() {
      bottomSheetRef.current?.present();
      // bottomSheetRef.current?.snapToIndex(0);
      console.log("why", bottomSheetRef.current);
    },
  }));

  useEffect(() => {
    bottomSheetRef.current?.expand();
    console.log("render");
  }, []);
  // console.log("Open"):K

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing={false}
        handleComponent={() => <View></View>}
        snapPoints={snapPoints}
        index={0}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />}
      >
        <BottomSheetView
          style={{
            flex: 1,
            zIndex: 30,
            backgroundColor: "white",
            borderRadius: 30,
            // position: "absolute",
            // bottom: 0,
            width: "100%",
          }}
        >
          <BottomSheetView style={styles.content}>
            <View style={{ alignSelf: "flex-end" }}>
              <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
                <Ionicons name="close" size={25} />
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 30 }}>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>Log in to Campus App</Text>

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "lightgrey",
                  padding: 10,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  borderRadius: 10,
                  marginTop: 10,
                  gap: 5,
                }}
              >
                <View style={{}}>
                  <Ionicons name="person-outline" size={20} />
                </View>
                <Text style={{ fontWeight: "semibold" }}>Use Email</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
          <View
            style={{
              marginTop: "auto",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              gap: 5,
              backgroundColor: "#EEEEEE",
              flexDirection: "row",
            }}
          >
            <Text>Already have an account</Text>
            <TouchableOpacity>
              <Text style={{ color: "#FE2C55" }}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
      <Login />
    </>
  );
});

export default Signup;
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flex: 1,
    flexDirection: "column",
  },
});
