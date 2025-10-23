import { z } from 'zod';

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ObjectId format' });

export const validateID = z.object({
  id: objectId,
});
