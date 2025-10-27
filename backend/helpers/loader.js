//middle ware de auth

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
  app.use('/api/users', UsersRouter(UserModel));
  app.use('/api/chats', ChatsRouter(ChatModel));
  app.use('/api/messages', MessagesRouter(MessageModel));
  app.get('/asd', (req, res) => {
    res.json({ message: 'hola' });
  });
}
