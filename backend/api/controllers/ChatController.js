export class ChatController {
  constructor(model) {
    this.model = model;
  }

  create = async (req, res) => {
    try {
      const newChat = await this.model.create(req.validatedBody);
      return res.status(201).json(newChat);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create chat' });
    }
  };

  getByUserID = async (req, res) => {
    try {
      const chats = await this.model.getByUserID(req.validatedParams.id);
      res.status(200).json({ chats });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get chats' });
    }
  };
}
