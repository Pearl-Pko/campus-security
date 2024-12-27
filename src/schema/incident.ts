import { z } from "zod";
import { UserProfileSchema } from "./profile";

export const FireStoreTimeStamp = z.object({ nanoseconds: z.number(), seconds: z.number() });

export const IncidentSchema = z.object({
  id: z.string(),
  reporterId: z.string().nullable(),
  description: z.string().nullable(),
  status: z.enum(["open", "in_progress", "closed"]),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .nullable(),
  address: z.string().nullable(),
  publishedAt: z.date().nullable(),
  reporter: UserProfileSchema,
  media: z.string(),
  createdAt: FireStoreTimeStamp,
  updatedAt: z.object({ nanoseconds: z.number(), seconds: z.number() }),
});

export type IncidentSchema = z.infer<typeof IncidentSchema>;

export const CreateIncidentSchema = IncidentSchema.pick({
  reporterId: true,
  description: true,
  location: true,
  media: true,
  address: true,
}).extend({
  draft: z.boolean(),
  useCurrentLocation: z.boolean(),
  useAnonymousReporting: z.boolean(),
  contentUri: z.string(),
});

export type CreateIncidentDTO = z.infer<typeof CreateIncidentSchema>;

export const SoS = z.object({
  longitude: z.number(),
  latitude: z.number(),
  userId: z.string().nullable(),
  id: z.string(),
  lastUpdated: z.date(),
});

export type Sos = z.infer<typeof SoS>;
