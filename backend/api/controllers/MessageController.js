export class MessageController {
  constructor(model) {
    this.model = model;
  }

  create = async (req, res) => {
    try {
      const newMsg = await this.model.create(req.validated.data);
      return res.status(201).json(newMsg);
    } catch {
      return res.status(500).json({ error: 'Failed to saved message' });
    }
  };

  getByChatID = async (req, res) => {
    try {
      const messages = await this.model.getByChatID(req.validated.data.id); // ver esto de validar y del .id
      res.status(200).json({ messages });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get messages' });
    }
  };

  delete = async (req, res) => {
    try {
      const deleted = await this.model.delete(req.validated.data.id);

      if (!deleted)
        return res.status(404).json({ message: 'Message not found' });

      return res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete message' });
    }
  };

  update = async (req, res) => {
    try {
      const updated = await this.model.update(
        req.validated.data.id,
        req.validated.msg
      );

      if (!updated)
        return res.status(404).json({ message: 'Message not found' });

      return res.status(200).json({ message: 'Message updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update messages' });
    }
  };
}
