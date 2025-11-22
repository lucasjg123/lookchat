import jwt from 'jwt-simple';
import 'dotenv/config';

export const refreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  let payload;
  try {
    // 1. Verificar Firma y Decodificar. Esto lanzará error para tokens malformados o con firma incorrecta.
    payload = jwt.decode(refreshToken, process.env.SECRETO_REFRESH);
  } catch (err) {
    // Captura errores de firma incorrecta, malformación y, posiblemente, expiración (depende de jwt-simple).
    if (err && /expired/i.test(err.message)) {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    // Para todos los demás errores de decodificación (firma incorrecta, malformación, etc.)
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  // 2. Validar Tipo
  if (!payload.tipo) {
    // Si la propiedad 'tipo' falta, tratamos el token como inválido (no apto para nuestro esquema)
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  if (payload.tipo !== 'refresh') {
    // Si la propiedad 'tipo' existe pero el valor es incorrecto (ej. 'access')
    return res.status(401).json({ error: 'Invalid token type' });
  }

  // OK
  req.user = { id: payload.id };
  next();
};
