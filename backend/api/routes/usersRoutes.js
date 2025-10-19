// aca rutas para usuario /login y registro y demas
import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { validate } from '../middlewares/validate.js';
import {
  validateUserLogin,
  validateUserRegister,
} from '../../helpers/zodUsers.js';

export const UsersRouter = (model) => {
  const controlador = new UserController(model);

  const usersRouter = Router();
  // definimos las rutas con middleware de validacion con schema personalizado
  usersRouter.post(
    '/register',
    validate(validateUserRegister),
    controlador.register
  );
  usersRouter.post('/login', validate(validateUserLogin), controlador.login);

  return usersRouter;
};
