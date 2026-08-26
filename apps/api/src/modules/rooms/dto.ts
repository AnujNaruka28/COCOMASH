import { z } from 'zod';

const createRoomSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  room_type: z.enum(['normal', 'playground']).default('normal'),
  max_participants: z.number().min(2).max(10).default(4),
  display_name: z.string().min(1).max(50),
});

const roomResponseSchema = z.object({
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

const getRoomByIdSchema = z.object({
  id: z.string(),
});

export type CreateRoomDto = z.infer<typeof createRoomSchema>;
export type RoomResponse = z.infer<typeof roomResponseSchema>;
export type GetRoomByIdDto = z.infer<typeof getRoomByIdSchema>;

export {
  createRoomSchema,
  roomResponseSchema,
  getRoomByIdSchema
};