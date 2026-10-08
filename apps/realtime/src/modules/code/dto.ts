import z from "zod";


const codeChangeSchema = z.object({
    roomId: z.string(),
    update: z.any()
});

const codeSyncSchema = z.object({
    update: z.any()
});

const codeAwarenessSchema = z.object({
    roomId: z.string(),
    update: z.any()
});

const codeStateRequestSchema = z.object({
    roomId: z.string()
})

const codeStateSchema = z.object({
    state: z.any()
})

export type CodeChangeDTO = z.infer<typeof codeChangeSchema>;
export type CodeSyncDTO = z.infer<typeof codeSyncSchema>;
export type CodeStateRequestDTO = z.infer<typeof codeStateRequestSchema>;
export type CodeStateDTO = z.infer<typeof codeStateSchema>;
export type CodeAwarenessDTO = z.infer<typeof codeAwarenessSchema>;

export { 
    codeChangeSchema, 
    codeSyncSchema, 
    codeStateRequestSchema,
    codeStateSchema,
    codeAwarenessSchema
};