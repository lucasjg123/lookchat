// aca rutas para usuario /login y registro y demas
import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { validate } from '../middlewares/validate.js';
import {
  validateUserLogin,
  validateUserRegister,
  validateName,
} from '../../helpers/zod/zodUsers.js';
import { refreshToken } from '../middlewares/refresh.js';

export const UsersRouter = (model) => {
  const controller = new UserController(model);

  const usersRouter = Router();
  // definimos las rutas con middleware de validacion con schema personalizado
  usersRouter.post(
    '/register',
    validate(validateUserRegister),
    controller.register
  );
  usersRouter.post('/login', validate(validateUserLogin), controller.login);

  usersRouter.post('/refresh', refreshToken, controller.refreshToken);

  usersRouter.get('/', validate(validateName, 'query'), controller.getByName);

  return usersRouter;
};
