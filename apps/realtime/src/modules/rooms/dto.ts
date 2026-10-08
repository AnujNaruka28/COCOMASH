
import z from "zod";

export const roomJoinSchema = z.object({
    roomId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, "Invalid UUID"),
    userId: z.string().min(1, "User ID is required"),
    displayName: z
        .string()
        .trim()
        .min(1, "Display name is required")
        .max(50, "Display name is too long"),
});

export const roomStartSchema = z.object({
    roomId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, "Invalid UUID"),
});

export const roomLanguageChangeSchema = z.object({
    roomId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, "Invalid UUID"),
    userId: z.string().min(1, "User ID is required"),
    language: z.string().min(1, "Language is required"),
});

export type RoomJoinDTO = z.infer<typeof roomJoinSchema>;
export type RoomStartDTO = z.infer<typeof roomStartSchema>;
export type RoomLanguageChangeDTO = z.infer<typeof roomLanguageChangeSchema>;
