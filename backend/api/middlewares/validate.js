// le pasamos el schema y el realizal a validacion
// export const validate = (schema) => (req, res, next) => {
//   const validated = schema.safeParse(req.body);

//   if (!validated.success)
//     return res
//       .status(400)
//       .json({ error: 'invalid data', details: validated.error.issues });

//   req.validatedBody = validated.data;
//   next();
// };
// para validar post y get
export const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    const data = req[source];
    const validated = schema.safeParse(data);

    if (!validated.success) {
      return res.status(400).json({
        error: 'invalid data',
        details: validated.error.issues,
      });
    }

    // Guardamos los datos validados en un campo genérico
    req.validatedBody = validated.data;
    next();
  };
