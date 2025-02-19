import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export const useAppState = (callback: () => void) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    console.log("rate how many");
    callback();

    // const subscription = AppState.addEventListener("change", (nextAppState) => {
    //   console.log("ds", appState.current, nextAppState);
    //   if (appState.current.match(/inactive|background/) && nextAppState === "active") {
    //     callback();
    //     console.log("even");
    //   }
    //   //   console.log("yeah");
    //   appState.current = nextAppState;
    // });
    // return () => subscription.remove();
  }, [callback]);
};
