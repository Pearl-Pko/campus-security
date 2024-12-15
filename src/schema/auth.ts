import { z } from "zod";

export const LoginUserWithEmailSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    // Minimum length of 12 characters
    .min(6, { message: "Password must be at least 6 characters long" })

    // Maximum length to prevent potential DOS attacks
    .max(64, { message: "Password must not exceed 64 characters" })

    // Require at least one uppercase letter
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })

    // Require at least one lowercase letter
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })

    // Require at least one number
    .regex(/[0-9]/, { message: "Password must contain at least one number" })

    // Require at least one special character
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
      message: "Password must contain at least one special character",
    }),
});

export type LoginUserWithEmailSchema = z.infer<typeof LoginUserWithEmailSchema>;
