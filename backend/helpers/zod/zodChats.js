import { z } from 'zod';

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ObjectId format' });

export const validateChat = z
  .object({
    type: z.enum(['private', 'group']).optional(), // default ya en mongoose
    users: z
      .array(objectId) // 24 chars ObjectId
      .nonempty('Users array cannot be empty'),
    name: z.string().optional(),
    admins: z.array(objectId).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'group') return data.name?.length > 0;
      return true;
    },
    {
      message: 'Group chats must have a name',
      path: ['name'],
    }
  );
