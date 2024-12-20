import { CreateIncidentDTO, IncidentSchema } from "@/schema/incident";
import firestore, {
  collection,
  GeoPoint,
  getFirestore,
  query,
  serverTimestamp,
  where,
} from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { getUserProfile } from "./auth";
import { useEffect, useState } from "react";

export const createIncidentReport = async (dto: CreateIncidentDTO) => {
  const reference = storage().ref(
    `/incidents/${dto.useAnonymousReporting ? "anonymous" : dto.reporterId}/${Date.now()}`,
  );
  const task = reference.putFile(dto.contentUri);

  await task;
  console.log("uploadd");


  const downloadUrl = await reference.getDownloadURL();
  const userProfile =
    dto.reporterId && !dto.useAnonymousReporting
      ? await getUserProfile(dto.reporterId)
      : { displayName: "Anonymous", avatar: null, username: "Anonymous" };

  console.log("dd");
  await firestore()
    .collection("users")
    .doc(`${dto.useAnonymousReporting ? "anonymous" : dto.reporterId}`)
    .collection("incidents")
    .doc("published")
    .collection("post")
    .add({
      reporterId: dto.useAnonymousReporting ? null : dto.reporterId || null,
      title: dto.title || null,
      description: dto.description || null,
      status: "open",
      location: dto.location ? new GeoPoint(dto.location.latitude, dto.location.longitude) : null,
      address: dto.address || null,
      media: downloadUrl,
      reporter: userProfile,
      publishedAt: dto.draft ? null : serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    .catch((error) => {
      console.error(error);
    });
  console.log("never");
};

export const useGetUserIncidents =  (uid: string, draft: boolean) : IncidentSchema[] => {
  const [incidents, setIncidents] = useState<IncidentSchema[]>([]);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .doc(uid)
      .collection("incidents")
      .doc(draft ? "draft" : "published")
      .collection("post")
      .onSnapshot((snapshot) => {
        setIncidents(
          snapshot.docs.map((doc) => {
            return doc.data() as IncidentSchema;
          }),
        );
      });

    return () => {
      unsubscribe();
    };
  }, [uid, draft]);

  return incidents;
};

export const useGetAllIncidents = () : IncidentSchema[] => {
  const [incidents, setIncidents] = useState<IncidentSchema[]>([]);
  useEffect(() => {
    const unsubscribe = firestore()
      .collectionGroup("post")
      .onSnapshot((snapshot) => {
        setIncidents(
          snapshot.docs.map((doc) => {
            return doc.data() as IncidentSchema;
          }),
        );
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return incidents;
}