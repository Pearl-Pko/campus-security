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
  isAnonymousProfile: z.boolean(),
  draft: z.boolean(),
  media: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type IncidentSchema = z.infer<typeof IncidentSchema>;

export const IncidentDraftSchema = z.object({
  id: z.string(),
  reporterId: z.string(),
  description: z.string().nullable(),
  status: z.enum(["open", "in_progress", "closed"]),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .nullable(),
  address: z.string().nullable(),
  reporter: UserProfileSchema,
  media: z.string(),
  draft: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isAnonymousProfile: z.boolean(),
  useCurrentLocation: z.boolean(),
  useAnonymousReporting: z.boolean(),
});

export type IncidentDraftSchema = z.infer<typeof IncidentDraftSchema>;

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

export const CreateIncidentDraftSchema = IncidentDraftSchema.omit({
  media: true,
}).extend({
  contentUri: z.string(),
});

export type CreateIncidentDraftDto = z.infer<typeof CreateIncidentDraftSchema>;

export const SoS = z.object({
  longitude: z.number(),
  latitude: z.number(),
  userId: z.string().nullable(),
  id: z.string(),
  lastUpdated: z.date(),
  isAnonymousProfile: z.boolean(),
});

export type Sos = z.infer<typeof SoS>;

export const CreateSoSSchema = SoS.omit({
  isAnonymousProfile: true,
});

export type CreateSoSSchema = z.infer<typeof CreateSoSSchema>;
