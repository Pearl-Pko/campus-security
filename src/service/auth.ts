import { UserProfileSchema } from "@/schema/profile";
import { ReactNativeFirebase } from "@react-native-firebase/app";
import auth, { FirebaseAuthTypes, updateProfile } from "@react-native-firebase/auth";
import firestore, { addDoc, doc, setDoc } from "@react-native-firebase/firestore";
import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";

const db = firestore();

// console.log(db.app.options.projectId);
export const signupUser = async (email: string, password: string) => {
  try {
    const user = await auth().createUserWithEmailAndPassword(email, password);
    await completeSignup(user.user);
    return user;
  } catch (error) {
    let err = error as { code: string };

    console.error(err);
    return err.code;
  }
};

const completeSignup = async (user: FirebaseAuthTypes.User) => {
  const displayName = (user.email ?? "random").split("@")[0];
  const username = displayName;

  await updateProfile(user, {
    displayName: displayName,

  });

  const userRef = doc(db, "users", user.uid);

  return await setDoc(userRef, {
    email: user.email,
    username: username,
    displayName: displayName,
    bio: null,
    avatar: null,
    phoneNumber: null
  });
};

export const googleSignIn = async () => {
  try {
    const hasPlayServices = await GoogleSignin.hasPlayServices();
    console.log("hasPlayServices", hasPlayServices);
    const response = await GoogleSignin.signIn();
    console.log("no signin", response);
    if (isSuccessResponse(response)) {
      const googleCredential = auth.GoogleAuthProvider.credential(response.data.idToken);
      const user = await auth().signInWithCredential(googleCredential);
      console.log("user", user);
      
      if (user.additionalUserInfo?.isNewUser) {
        await completeSignup(user.user);
      }

      return user;
    } else {
      return "Operation was cancelled by user";
    }
  } catch (error) {
    let err = error as { code: string };

    console.error(err);
    return err.code;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    let err = error as { code: string };

    console.error(err);
    return err.code;
  }
};

export const logoutUser = async () => {
  await auth().signOut();
  await GoogleSignin.signOut();
};

export const getUserProfile = async (uid: string) => {
  const ref = doc(db, "users", uid);
  return (await ref.get()).data() as UserProfileSchema;
};

export const useUserProfile = (uid?: string | null) => {
  const ref = doc(db, "users", uid || "");
  const [data, setData] = useState<UserProfileSchema | null>(null);

  useEffect(() => {
    if (!uid) return;
    const unsuscribe = ref.onSnapshot((doc) => {
      setData(doc.data() as UserProfileSchema);
    });
    return () => unsuscribe();
  }, [uid]);

  return { data };
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfileSchema>) => {
  const ref = doc(db, "users", uid);

  await auth().currentUser?.updateProfile({
    displayName: data.displayName,
  });

  return await ref.set(data, { merge: true });
};
