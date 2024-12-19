import { CreateIncidentDTO } from "@/schema/incident";
import firestore, {
  GeoPoint,
  getFirestore,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

export const createIncidentReport = async (dto: CreateIncidentDTO) => {
  const reference = storage().ref(
    `/incidents/${dto.useAnonymousReporting ? "anonymous" : dto.reporterId}/${Date.now()}`,
  );
  const task = reference.putFile(dto.contentUri);

  await task;
  console.log("uploadd");

  const downloadUrl = await reference.getDownloadURL();

  await firestore()
    .collection("incidents")
    .add({
      reporterId: dto.useAnonymousReporting ? null : dto.reporterId || null,
      title: dto.title,
      description: dto.description || null,
      status: "open",
      location: dto.location ? new GeoPoint(dto.location.latitude, dto.location.longitude) : null,
      address: dto.address || null,
      media: downloadUrl,
      publishedAt: dto.draft ? null : serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  console.log("never");
};
