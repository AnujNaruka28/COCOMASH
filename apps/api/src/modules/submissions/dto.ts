import { z } from "zod";

export const executeCodeSchema = z.object({
    roomId: z.string(),
    exerciseId: z.string().optional(),
    userId: z.string(),
    sourceCode: z.string().max(100000),
    language: z.enum(["python", "javascript", "cpp"]),
    type: z.enum(["run", "submit"]),
})

export type ExecuteCodeDTO = z.infer<typeof executeCodeSchema>
