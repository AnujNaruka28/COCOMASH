import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long")
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
