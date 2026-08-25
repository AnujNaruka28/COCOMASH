import { z } from 'zod';

// Create Room DTO
export const createRoomSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  room_type: z.enum(['normal', 'playground']).default('normal'),
  max_participants: z.number().min(2).max(10).default(4),
  display_name: z.string().min(1).max(50), // For the creator
});

export type CreateRoomDto = z.infer<typeof createRoomSchema>;

// Join Room DTO
export const joinRoomSchema = z.object({
  display_name: z.string().min(1).max(50),
});

export type JoinRoomDto = z.infer<typeof joinRoomSchema>;

// Room Response DTO
export const roomResponseSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  room_type: z.enum(['normal', 'playground']),
  status: z.enum(['waiting', 'active', 'ended', 'expired']),
  max_participants: z.number(),
  creator_id: z.string(),
  created_at: z.date(),
  expires_at: z.date(),
  participant_count: z.number(),
});

export type RoomResponse = z.infer<typeof roomResponseSchema>;