import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes, onAuthStateChanged } from "@react-native-firebase/auth";

export type SessionContextType = {
  user?: FirebaseAuthTypes.User | null;
} | null;
export const SessionContext = React.createContext<SessionContextType>(null);

export default function SessionProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);
  return <SessionContext.Provider value={{ user: user }}>{children}</SessionContext.Provider>;
}
