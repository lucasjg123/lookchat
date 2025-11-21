//middle ware de auth
import { auth } from '../api/middlewares/auth.js';
//rutas
import { UsersRouter } from '../api/routes/usersRoutes.js';
import { MessagesRouter } from '../api/routes/messagesRoutes.js';
import { ChatsRouter } from '../api/routes/chatsRoutes.js';
// modelos MONGODB
import { UserModel } from '../api/models/UserMDB.js';
import { MessageModel } from '../api/models/MessageMDB.js';
import { ChatModel } from '../api/models/ChatMDB.js';

export function loaderApp(app) {
  // Aquí inyectás las dependencias necesarias
  // rutas públicas
  app.use('/api/users', UsersRouter(UserModel)); // login/register públicos

  // rutas protegidas
  app.use('/api/chats', auth, ChatsRouter(ChatModel, UserModel));
  app.use('/api/messages', auth, MessagesRouter(MessageModel, ChatModel));

  app.get('/asd', (req, res) => {
    res.json({ message: 'hola' });
  });
}
