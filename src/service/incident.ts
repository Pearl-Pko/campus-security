import { CreateIncidentDTO, IncidentSchema, Sos } from "@/schema/incident";
import firestore, {
  collection,
  GeoPoint,
  getFirestore,
  query,
  serverTimestamp,
  Timestamp,
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
  const incident = await firestore()
    .collection("users")
    .doc(`${dto.useAnonymousReporting ? "anonymous" : dto.reporterId}`)
    .collection("incidents")
    .doc(dto.draft ? "draft" : "published")
    .collection("post")
    .add({
      reporterId: dto.useAnonymousReporting ? null : dto.reporterId || null,
      description: dto.description || null,
      status: "open",
      location: dto.location ? new GeoPoint(dto.location.latitude, dto.location.longitude) : null,
      address: dto.address || null,
      media: downloadUrl,
      reporter: userProfile,
      publishedAt: dto.draft ? null : serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  await incident.update({
    id: incident.id,
  });
  console.log("never");
  return incident;
};

export const useGetUserIncidents = (uid: string, draft: boolean): IncidentSchema[] => {
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

export const useGetAllIncidents = (): IncidentSchema[] => {
  const [incidents, setIncidents] = useState<IncidentSchema[]>([]);
  useEffect(() => {
    const unsubscribe = firestore()
      .collectionGroup("post")
      .onSnapshot((snapshot) => {
        setIncidents(
          snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id } as IncidentSchema;
          }),
        );
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return incidents;
};

export const useGetIncident = (id: string) => {
  const [incident, setIncident] = useState<IncidentSchema | null>(null);
  useEffect(() => {
    const unsubscribe = firestore()
      .collectionGroup("post")
      .where("id", "==", id)
      .onSnapshot((snapshot) => {
        if (!snapshot?.docs || snapshot?.docs?.length === 0) return;

        setIncident({ ...snapshot.docs?.[0].data() } as IncidentSchema);
      });

    return () => {
      unsubscribe();
    };
  }, [id]);

  return incident;
};

export const sendSoS = async ({ longitude, latitude, userId, id, lastUpdated }: Sos) => {
  return await firestore()
    .collection("sos")
    .doc(id)
    .set({
      longitude: longitude,
      latitude: latitude,
      userId: userId,
      id: id,
      lastUpdated: Timestamp.fromDate(lastUpdated),
    });
};

export const publishDraft = () => {};

export const editDraft = () => {};

export const deleteReport = async (id: string) => {
  try {
    const querySnapshot = await firestore()
      .collectionGroup("post")
      .where("id", "==", id)
      .orderBy("createdAt", "asc")
      .get();

    if (querySnapshot.empty) return;

    await querySnapshot.docs[0].ref.delete();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
