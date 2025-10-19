import z from 'zod';

const baseUserSchema = z.object({
  name: z.string().min(3, { message: 'nick too short' }).optional(),
  mail: z.email('invalid mail').optional(),
  password: z.string().min(5, { message: 'password too short' }),
});

export const validateUserRegister = baseUserSchema.extend({
  name: z.string().min(3),
  mail: z.email(),
});

export const validateUserLogin = baseUserSchema.refine(
  (data) => data.name || data.mail,
  {
    message: 'name or mail is required',
    path: ['name'],
  }
);
