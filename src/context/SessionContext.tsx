import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes, onAuthStateChanged } from "@react-native-firebase/auth";

export type SessionContextType = {
  user: FirebaseAuthTypes.User | null;
  currentPageUserId: string;
  setCurrentPageUserId: (userId: string) => void;
} | null;
export const SessionContext = React.createContext<SessionContextType>(null);

export default function SessionProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [currentPageUserId, setCurrentPageUserId] = useState<string>("");

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (!user) {
        auth().signInAnonymously();
        setUser(null);
      }
      else 
        setUser(user);
    });
  }, []);

  console.log("anonymous", user?.isAnonymous, user?.uid);
  return (
    <SessionContext.Provider value={{ user: user, currentPageUserId, setCurrentPageUserId }}>
      {children}
    </SessionContext.Provider>
  );
}
