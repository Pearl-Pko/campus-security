import { z } from "zod";

export const UserProfileSchema = z.object({
    email: z.string().email(),
    username: z.string(), 
    displayName: z.string(),
    bio: z.string().max(80).nullable(), 
    avatar: z.string()

})

export type UserProfileSchema = z.infer<typeof UserProfileSchema>;
