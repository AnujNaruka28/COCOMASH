import { z } from 'zod';

const createRoomSchema = z.object({
  name: z.string().min(0).max(100).optional().default(''),
  room_type: z.enum(['normal', 'playground']),
  max_participants: z.number().min(2).max(10),
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
  id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, "Invalid UUID"),
});

const paginationSchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '10')),
});

export type CreateRoomDto = z.infer<typeof createRoomSchema>;
export type RoomResponse = z.infer<typeof roomResponseSchema>;
export type GetRoomByIdDto = z.infer<typeof getRoomByIdSchema>;
export type PaginationDto = z.infer<typeof paginationSchema>;

export {
  createRoomSchema,
  roomResponseSchema,
  getRoomByIdSchema,
  paginationSchema
};