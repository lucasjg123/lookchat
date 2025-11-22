import { createAccessToken } from '../../helpers/jwt.js';
import { AppError } from '../../helpers/errors.js';

export class UserController {
  constructor(model) {
    this.model = model;
  }

  register = async (req, res) => {
    try {
      // we register the user
      const result = await this.model.register(req.validatedBody);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof AppError)
        return res.status(error.statusCode).json({ error: error.message });

      // console.error('Unexpected error in register:', error);
      return res.status(500).json({ error: 'Failed to register user' });
    }
  };

  login = async (req, res) => {
    try {
      const result = await this.model.login(req.validatedBody);
      return res.status(200).json(result); // 200 para una respuesta exitosa
    } catch (error) {
      if (error instanceof AppError)
        return res.status(error.statusCode).json({ error: error.message });

      // console.error('Unexpected error in login:', error);
      return res.status(500).json({ error: 'Failed to login user' });
    }
  };

  getByName = async (req, res) => {
    try {
      const result = await this.model.getByName(req.validatedBody);
      return res.status(200).json(result); // 200 para una respuesta exitosa
    } catch (error) {
      if (error instanceof AppError)
        return res.status(error.statusCode).json({ error: error.message });

      // console.error('Unexpected error in login:', error);
      return res.status(500).json({ error: 'Failed to get users' });
    }
  };

  refreshToken = async (req, res) => {
    try {
      // Esto llega desde el middleware
      const payload = req.user; // { id, tipo, exp }

      // buscar usuario real
      const user = await this.model.getById(payload.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // generar nuevo accessToken
      const accessToken = createAccessToken(user);

      return res.json({ accessToken });
    } catch (error) {
      console.error('Error en refreshToken:', error);
      return res.status(500).json({ error: 'Error verifying refresh token' });
    }
  };
}
