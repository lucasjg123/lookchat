// le pasamos el schema y el realizal a validacion
// export const validate = (schema) => (req, res, next) => {
//   const validated = schema.safeParse(req.body);
//   if (!validated.success)
//     return res
//       .status(400)
//       .json({ error: 'invalid data', details: validated.error.issues });

//   req.validatedData = validated.data;
//   next();
// };

// middleware actual
export const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    const data = req[source]; // seleccionamos el req.tipo
    const validated = schema.safeParse(data); // validamos con el schema proporcionado

    if (!validated.success) {
      return res.status(400).json({
        error: 'invalid data',
        details: validated.error.issues,
      });
    }
    // se guarda en su respectivo req.validatedBody o req.validatedParams
    req[`validated${source[0].toUpperCase()}${source.slice(1)}`] =
      validated.data;

    next();
  };
