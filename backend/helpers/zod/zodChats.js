// helpers/zod/zodChats.js
import { z } from 'zod';

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ObjectId format' });

export const validateChat = z
  .object({
    type: z.enum(['private', 'group']).optional(), // "private" por defecto en mongoose
    users: z.array(objectId).nonempty('Users array cannot be empty'), // ahora son nombres, no ObjectIds
    name: z.string().optional(),
    admins: z.array(z.string()).optional(), // si en el futuro querés admins por nombre
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
