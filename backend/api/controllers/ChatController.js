export class ChatController {
  constructor(model, modelUser) {
    this.model = model;
    this.modelUser = modelUser;
  }

  create = async (req, res) => {
    try {
      // "users: userNames", renombra users por userNames
      const { users, type, name, admins } = req.validatedBody;
      const currentUserId = req.user.id;

      users.push(currentUserId);

      // validamos q existan los users
      const foundUsers = await this.modelUser.get({
        _id: { $in: users },
      });

      // 3. Validar que existan todos
      if (foundUsers.length !== users.length) {
        return res.status(404).json({
          error: 'Some users do not exist',
        });
      }

      // SI ES PRIVADO: verificar si ya existe el chat
      const existingChat = await this.model.getOneByUsersID(users);

      if (existingChat) return res.status(200).json(existingChat);
      // return res.status(409).json({ error: 'Chat already exist' });

      const chatData = {
        type,
        users,
        name,
        admins,
      };

      const newChat = await this.model.create(chatData);
      return res.status(201).json(newChat);
    } catch (error) {
      console.error('SAPE Error al crear chat:', error);
      return res.status(500).json({ error: 'Failed to create chat' });
    }
  };

  getByUserID = async (req, res) => {
    try {
      const chats = await this.model.getByUserID(req.user.id);
      res.status(200).json(chats);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get chats' });
    }
  };
}
