import { db } from "@/component/(app)/AppProvider";
import { CreateIncidentDTO } from "@/schema/incident";
import firestore, { GeoPoint, getFirestore, serverTimestamp } from "@react-native-firebase/firestore";

export const createIncidentReport = async (dto: CreateIncidentDTO) => {
 return await firestore().collection("incidents")
    .add({
      reporterId: dto.useAnonymousReporting ? null : dto.reporterId || null,
      title: dto.title,
      description: dto.description || null,
      status: "open",
      location: dto.location ? new GeoPoint(dto.location.latitude, dto.location.longitude) : null,
      address: dto.address || null,
      media: null,
      publishedAt: dto.draft ? null : serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
};
