
import z from "zod";

export const roomJoinSchema = z.object({
    roomId: z.uuid(),
    displayName: z
        .string()
        .trim()
        .min(1, "Display name is required")
        .max(50, "Display name is too long"),
});

export type RoomJoinDTO = z.infer<typeof roomJoinSchema>;
