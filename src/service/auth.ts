import { ReactNativeFirebase } from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export const signupUser = async (email: string, password: string) => {
    try {

        return (await auth().createUserWithEmailAndPassword(email, password));
    }
    catch(error) {
        let err = error as {code: string};

        console.error(err);
        return err.code;
    }
}

export const signInUser = async (email: string, password: string) => {
    try {

        return await auth().signInWithEmailAndPassword(email, password);
    }
    catch (error) {
        let err = error as {code: string};

        console.error(err);
        return err.code;
    }

}

export const logoutUser = async () => {
    await auth().signOut();
}