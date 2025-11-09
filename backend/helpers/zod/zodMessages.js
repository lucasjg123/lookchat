import { z } from 'zod';

// Validador para ObjectId de Mongo
const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ObjectId format' });

// 📨 Esquema de validación para mensajes
export const validateMessage = z.object({
  chat: objectId,
  content: z
    .string()
    .min(1, 'Message content cannot be empty')
    .trim() // Elimina los espacios al inicio y final
    .max(2000, 'Message content too long'),
  status: z.enum(['sent', 'read']).optional(), // tiene default en mongoose
});
