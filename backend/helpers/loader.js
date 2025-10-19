//middle ware de auth

//rutas
import { UsersRouter } from '../api/routes/usersRoutes.js';
// modelos
import { UserModel } from '../api/models/UserMDB.js';

export function loaderApp(app) {
  // Aquí inyectás las dependencias necesarias
  app.use('/api/users', UsersRouter(UserModel));
}
