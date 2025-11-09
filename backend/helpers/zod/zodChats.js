// helpers/zod/zodChats.js
import { z } from 'zod';

export const validateChat = z
  .object({
    type: z.enum(['private', 'group']).optional(), // "private" por defecto en mongoose
    users: z
      .array(
        z
          .string()
          .min(3, 'Username must be at least 3 characters long')
          .regex(
            /^[a-zA-Z0-9_.]+$/,
            'Username can only contain letters, numbers, underscores, and dots'
          )
      )
      .nonempty('Users array cannot be empty'), // ahora son nombres, no ObjectIds
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
