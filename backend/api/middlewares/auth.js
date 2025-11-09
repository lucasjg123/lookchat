import jwt from 'jwt-simple';
import 'dotenv/config';

export const auth = (request, response, next) => {
  const tokenRecibido = request.headers.authorization;

  if (!tokenRecibido)
    return response.status(401).json({ error: 'No token provided' });

  // reemplazamos comillas por vacio
  const token = tokenRecibido.startsWith('Bearer ')
    ? tokenRecibido.slice(7)
    : tokenRecibido;

  try {
    const payload = jwt.decode(token, process.env.SECRETO); // Verifica la firma y decodifica el token

    if (payload.exp <= Date.now() / 1000)
      // `exp` en JWT está en segundos, no en milisegundos
      return response.status(401).json({ error: 'Expired token' });

    request.user = payload; //{id, name, mail}
  } catch (e) {
    // Si el token es inválido o ha expirado, el error será capturado aquí
    return response.status(401).json({ error: 'Authentication Error' });
  }

  next(); // pasamos a la ruta
};
