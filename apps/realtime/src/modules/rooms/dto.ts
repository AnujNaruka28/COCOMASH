
import z from "zod";

export const roomJoinSchema = z.object({
    roomId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, "Invalid UUID"),
    displayName: z
        .string()
        .trim()
        .min(1, "Display name is required")
        .max(50, "Display name is too long"),
});

export type RoomJoinDTO = z.infer<typeof roomJoinSchema>;
