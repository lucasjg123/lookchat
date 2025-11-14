import z from 'zod';

const baseUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      'Username can only contain letters, numbers, underscores, and dots'
    )
    .optional(),
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

export const validateName = z.object({
  name: z
    .string()
    .min(1, 'Username is required and must be at least 1 character long')
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      'Username can only contain letters, numbers, underscores, and dots'
    ),
});
