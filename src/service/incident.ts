import {
  CreateIncidentDraftDto,
  CreateIncidentDTO,
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

export const createIncidentReport = async (dto: CreateIncidentDTO) => {
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

    const userProfile = reporterId
      ? await getUserProfile(reporterId)
      : { displayName: "Anonymous", avatar: null, username: "Anonymous" };

    const draftInfo = {
      useAnonymousReporting: dto.useAnonymousReporting || null,
      useCurrentLocation: dto.useCurrentLocation || null,
    };
    const incident = await firestore()
      .collection("users")
      .doc(reporterId || "anonymous")
      .collection("incidents")
      .doc(dto.draft ? "draft" : "published")
      .collection("post")
      .add({
        reporterId: reporterId,
        description: dto.description || null,
        status: "open",
        draft: dto.draft,
        location: dto.location ? new GeoPoint(dto.location.latitude, dto.location.longitude) : null,
        address: dto.address || null,
        media: downloadUrl,
        reporter: userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(dto.draft ? draftInfo : {}),
      });
    await incident.update({
      id: incident.id,
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

export function useGetIncident<T>(id?: string) {
  if (!id) return null;

  const [incident, setIncident] = useState<T | null>(null);
  useEffect(() => {
    const unsubscribe = firestore()
      .collectionGroup("post")
      .where("id", "==", id)
      .onSnapshot((snapshot) => {
        if (!snapshot?.docs || snapshot?.docs?.length === 0) return;

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
        } as T);
      });

    return () => {
      unsubscribe();
    };
  }, [id]);

  return incident;
}

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
