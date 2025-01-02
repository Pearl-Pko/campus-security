import {
  CreateIncidentDraftDto,
  CreateIncidentDTO,
  CreateSoSSchema,
  FireStoreTimeStamp,
  IncidentDraftSchema,
  IncidentSchema,
  Sos,
} from "@/schema/incident";
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
import uuid from "react-native-uuid";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export const createIncidentReport = async (
  user: FirebaseAuthTypes.User | null,
  dto: CreateIncidentDTO,
) => {
  try {
    console.log("kl");
    const reference = storage().ref(
      `/incidents/${dto.useAnonymousReporting && !dto.draft ? "anonymous" : dto.reporterId}/${Date.now()}`,
    );
    const task = reference.putFile(dto.contentUri);

    await task;
    console.log("uploadd");

    const downloadUrl = await reference.getDownloadURL();
    const reporterId = dto.useAnonymousReporting && !dto.draft ? null : dto.reporterId;

    const userProfile =
      reporterId && !user?.isAnonymous
        ? await getUserProfile(reporterId)
        : { displayName: "Anonymous", avatar: null, username: "Anonymous" };

    const draftInfo = {
      useAnonymousReporting: dto.useAnonymousReporting || null,
      useCurrentLocation: dto.useCurrentLocation || null,
    };

    const id = uuid.v4();

    console.log("is anon", user?.isAnonymous);

    const incident = await firestore()
      .collection("users")
      .doc(reporterId || "anonymous")
      .collection("incidents")
      .doc(dto.draft ? "draft" : "published")
      .collection("post")
      .doc(id)
      .set({
        id: id,
        reporterId: reporterId,
        description: dto.description || null,
        status: "open",
        draft: dto.draft,
        isAnonymousProfile: user?.isAnonymous ? true : false,
        location: dto.location ? new GeoPoint(dto.location.latitude, dto.location.longitude) : null,
        address: dto.address || null,
        media: downloadUrl,
        reporter: userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(dto.draft ? draftInfo : {}),
      });

    console.log("never");
    return incident;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const editIncidentDraftReport = async (id: string, dto: CreateIncidentDTO) => {
  try {
    const userProfile = await getUserProfile(dto.reporterId!);
    const incident = await firestore()
      .collection("users")
      .doc(dto.reporterId!)
      .collection("incidents")
      .doc("draft")
      .collection("post")
      .doc(id)
      .set(
        {
          reporterId: dto.reporterId,
          description: dto.description || null,
          status: "open",
          location: dto.location
            ? new GeoPoint(dto.location.latitude, dto.location.longitude)
            : null,
          address: dto.address || null,
          reporter: userProfile,
          updatedAt: serverTimestamp(),
          useAnonymousReporting: dto.useAnonymousReporting || null,
          useCurrentLocation: dto.useCurrentLocation || null,
        },
        { merge: true },
      );
    return incident;
  } catch (error) {
    console.error(error);
  }
};

export const createIncidentDraftReport = async (dto: CreateIncidentDraftDto) => {
  const reference = storage().ref(
    `/incidents/${dto.useAnonymousReporting ? "anonymous" : dto.reporterId}/${Date.now()}`,
  );
  const task = reference.putFile(dto.contentUri);

  await task;

  const downloadUrl = await reference.getDownloadURL();

  const userProfile = await getUserProfile(dto.reporterId);
  const incident = await firestore()
    .collection("users")
    .doc(dto.reporterId)
    .collection("incidents")
    .doc("draft")
    .collection("post")
    .add({
      reporterId: dto.reporterId,
      description: dto.description || null,
      status: "open",
      location: dto.location ? new GeoPoint(dto.location.latitude, dto.location.longitude) : null,
      address: dto.address || null,
      media: downloadUrl,
      reporter: userProfile,
      useCurrentLocation: dto.useCurrentLocation,
      useAnonymousReporting: dto.useAnonymousReporting,
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
            const { createdAt, updatedAt, ...data } = doc.data();

            return {
              ...data,
              id: doc.id,
              createdAt: createdAt ? new Date(createdAt.seconds * 1000) : Date.now(),
              updatedAt: updatedAt ? new Date(updatedAt.seconds * 1000) : Date.now(),
            } as IncidentSchema;
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
      .where("draft", "==", false)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        setIncidents(
          snapshot.docs.map((doc) => {
            const { createdAt, updatedAt, ...data } = doc.data();
            return {
              ...data,
              id: doc.id,
              createdAt: createdAt ? new Date(createdAt.seconds * 1000) : Date.now(),
              updatedAt: updatedAt ? new Date(updatedAt.seconds * 1000) : Date.now(),
            } as IncidentSchema;
          }),
        );
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return incidents;
};

export const useGetIncidentDraft = (uid: string | undefined, postId: string | undefined, enabled: boolean = true) => {
  try {
    if (!uid || !postId) return null;
    
    const [incident, setIncident] = useState<IncidentDraftSchema | null>(null);

    useEffect(() => {
      if (!enabled) return;

      const unsuscribe = firestore()
        .collection("users")
        .doc(uid)
        .collection("incidents")
        .doc("draft")
        .collection("post")
        .doc(postId)
        .onSnapshot((snapshot) => {
          try {
            if (!snapshot.exists) {
              setIncident(null);
              return;
            }

            const { createdAt, updatedAt, ...data } = snapshot.data() as any;

            setIncident({
              ...data,
              createdAt: createdAt ? new Date(createdAt.seconds * 1000) : Date.now(),
              updatedAt: updatedAt ? new Date(updatedAt.seconds * 1000) : Date.now(),
            } as IncidentDraftSchema);
          } catch (error) {
            console.error(error);
            setIncident(null);
          }
        });

      return () => {
        unsuscribe();
      };
    }, [uid, postId, enabled]);

    return incident;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export function useGetIncident(id?: string) {
  if (!id) return null;

  const [incident, setIncident] = useState<IncidentSchema | null>(null);
  useEffect(() => {
    const unsubscribe = firestore()
      .collectionGroup("post")
      .where("draft", "==", false)
      .where("id", "==", id)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        try {
          if (snapshot.docs.length === 0) {
            setIncident(null);
            return;
          }

          console.log("snaphsot", snapshot.docs);

          const { createdAt, updatedAt, ...data } = snapshot.docs?.[0].data();

          console.log("see na", {
            ...data,
            createdAt: createdAt ? new Date(createdAt.seconds * 1000) : Date.now(),
            updatedAt: updatedAt ? new Date(updatedAt.seconds * 1000) : Date.now(),
          });
          setIncident({
            ...data,
            createdAt: createdAt ? new Date(createdAt.seconds * 1000) : Date.now(),
            updatedAt: updatedAt ? new Date(updatedAt.seconds * 1000) : Date.now(),
          } as IncidentSchema);
        } catch (error) {
          console.error(error);
          setIncident(null);
        }
      });

    return () => {
      unsubscribe();
    };
  }, [id]);

  return incident;
}

export const sendSoS = async (user: FirebaseAuthTypes.User | null, sos: CreateSoSSchema) => {
  try {
    return await firestore()
      .collection("users")
      .doc(user?.uid || "anonymous")
      .collection("sos")
      .doc(sos.id)
      .set({
        longitude: sos.longitude,
        latitude: sos.latitude,
        userId: sos.userId,
        id: sos.id,
        isAnonymousProfile: user?.isAnonymous ? true : false,
        lastUpdated: Timestamp.fromDate(sos.lastUpdated),
      });
  } catch (error) {
    console.error(error);
  }
};

export const publishDraft = () => {};

export const editDraft = () => {};

export const deleteReport = async (uid: string, postId: string, draft: boolean) => {
  try {
    const doc = firestore()
      .collection("users")
      .doc(uid)
      .collection("incidents")
      .doc(draft ? "draft" : "published")
      .collection("post")
      .doc(postId);
    await doc.delete();

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
