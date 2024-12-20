import { z } from "zod";
import { UserProfileSchema } from "./profile";

export const IncidentSchema = z.object({
    id: z.string(), 
    reporterId: z.string().nullable(), 
    title: z.string(), 
    description: z.string().nullable(), 
    status: z.enum(["open", "in_progress", "closed"]),
    location: z.object({
        latitude: z.number(), 
        longitude: z.number(),
    }).nullable(), 
    address: z.string().nullable(),
    publishedAt: z.date().nullable(),
    reporter: UserProfileSchema, 
    media: z.string(), 
    createdAt: z.object({nanoseconds: z.number(), seconds: z.number()}), 
    updatedAt: z.object({nanoseconds: z.number(), seconds: z.number()}), 
})

export type IncidentSchema = z.infer<typeof IncidentSchema>;

export const CreateIncidentSchema = IncidentSchema.pick({
    reporterId: true, 
    title: true, 
    description: true ,
    location: true ,
    media: true, 
    address: true, 
}).extend({
    draft: z.boolean(), 
    useCurrentLocation: z.boolean(), 
    useAnonymousReporting: z.boolean(), 
    contentUri: z.string()
})



export type CreateIncidentDTO = z.infer<typeof CreateIncidentSchema>;