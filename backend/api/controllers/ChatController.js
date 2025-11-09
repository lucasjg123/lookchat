export class ChatController {
  constructor(model, modelUser) {
    this.model = model;
    this.modelUser = modelUser;
  }

  create = async (req, res) => {
    try {
      const currentUserId = req.user.id;
      // "users: userNames", renombra users por userNames
      const { users: userNames, type, name, admins } = req.validatedBody;

      // Get users id by names [modelo]. *pasar a user model*
      const foundUsers = await this.modelUser.get({
        name: { $in: userNames },
      });

      if (foundUsers.length !== userNames.length)
        return res.status(404).json({ error: 'User not found' });

      // creamos array solo con ids ['3434', '3555]
      const userIds = foundUsers.map((u) => u._id);

      // agregamos el id
      userIds.push(currentUserId);

      const chatData = {
        type,
        users: userIds,
        name,
        admins,
      };
      // SI ES PRIVADO: verificar si ya existe el chat
      const existingChat = await this.model.getOneByUsersID(userIds);

      if (existingChat)
        return res.status(409).json({ error: 'Chat already exist' });

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
