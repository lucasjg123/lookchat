export class MessageController {
  constructor(model) {
    this.model = model;
  }

  create = async (req, res) => {
    try {
      let newMsg = req.validatedBody;
      newMsg.sender = req.user.id;
      msgCreated = await this.model.create(newMsg);
      return res.status(201).json(msgCreated);
    } catch {
      return res.status(500).json({ error: 'Failed to save message' });
    }
  };

  getByChatID = async (req, res) => {
    try {
      const messages = await this.model.getByChatID(req.params.id); // ver esto de validar y del .id
      res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get messages' });
    }
  };

  // delete = async (req, res) => {
  //   try {
  //     const deleted = await this.model.delete(req.params.id);

  //     if (!deleted)
  //       return res.status(404).json({ message: 'Message not found' });

  //     return res.status(200).json({ message: 'Message deleted successfully' });
  //   } catch (error) {
  //     return res.status(500).json({ error: 'Failed to delete message' });
  //   }
  // };

  // update = async (req, res) => {
  //   try {
  //     const updated = await this.model.update(
  //       req.validated.data.id,
  //       req.validated.msg
  //     );

  //     if (!updated)
  //       return res.status(404).json({ message: 'Message not found' });

  //     return res.status(200).json({ message: 'Message updated successfully' });
  //   } catch (error) {
  //     return res.status(500).json({ error: 'Failed to update messages' });
  //   }
  // };
}
