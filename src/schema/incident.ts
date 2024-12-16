import { z } from "zod";

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
    media: z.string(), 
    createdAt: z.date(), 
    updatedAt: z.date(), 
})

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
    useAnonymousReporting: z.boolean()
})



export type CreateIncidentDTO = z.infer<typeof CreateIncidentSchema>;