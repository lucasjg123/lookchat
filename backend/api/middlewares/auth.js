import jwt from 'jwt-simple';
import 'dotenv/config';

export const auth = (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  // reemplazamos comillas por vacio
  const token = accessToken.startsWith('Bearer ')
    ? accessToken.slice(7)
    : accessToken;

  let payload;
  try {
    // 1. Verificar Firma y Decodificar. Esto lanzará error para tokens malformados o con firma incorrecta.
    payload = jwt.decode(token, process.env.SECRETO);
  } catch (err) {
    // Captura errores de firma incorrecta, malformación y, posiblemente, expiración (depende de jwt-simple).
    if (err && /expired/i.test(err.message)) {
      return res.status(401).json({ error: 'Access token expired' });
    }
    // Para todos los demás errores de decodificación (firma incorrecta, malformación, etc.)
    return res.status(401).json({ error: 'Invalid access token' });
  }

  // 2. Validar Tipo
  if (!payload.tipo) {
    // Si la propiedad 'tipo' falta, tratamos el token como inválido (no apto para nuestro esquema)
    return res.status(401).json({ error: 'Invalid access token' });
  }

  if (payload.tipo !== 'access') {
    // Si la propiedad 'tipo' existe pero el valor es incorrecto (ej. 'access')
    return res.status(401).json({ error: 'Invalid token type' });
  }

  // OK
  req.user = payload;
  next();
};

// import jwt from 'jwt-simple';
// import 'dotenv/config';

// export const auth = (request, response, next) => {
//   const tokenRecibido = request.headers.authorization;

//   if (!tokenRecibido)
//     return response.status(401).json({ error: 'No token provided' });

//   // reemplazamos comillas por vacio
//   const token = tokenRecibido.startsWith('Bearer ')
//     ? tokenRecibido.slice(7)
//     : tokenRecibido;

//   try {
//     const payload = jwt.decode(token, process.env.SECRETO); // Verifica la firma y decodifica el token

//     if (payload.exp <= Date.now() / 1000)
//       // `exp` en JWT está en segundos, no en milisegundos
//       return response.status(401).json({ error: 'Expired token' });

//     request.user = payload; //{id, name, mail}
//   } catch (e) {
//     // Si el token es inválido o ha expirado, el error será capturado aquí
//     return response.status(401).json({ error: 'Authentication Error' });
//   }

//   next(); // pasamos a la ruta
// };
