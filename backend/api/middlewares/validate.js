// le pasamos el schema y el realizal a validacion
export const validate = (schema) => (req, res, next) => {
  const validated = schema.safeParse(req.body);
  if (!validated.success)
    return res
      .status(400)
      .json({ error: 'invalid data', details: validated.error.issues });

  req.validatedData = validated.data;
  next();
};
