export class MessageController {
  constructor(model, modelChat) {
    this.model = model;
    this.modelChat = modelChat;
  }

  create = async (req, res) => {
    try {
      let newMsg = req.validatedBody;
      newMsg.sender = req.user.id;
      let msgCreated = await this.model.create(newMsg);
      // console.log(msgCreated);

      // actuliazamos chat con lastmessage
      await this.modelChat.update({
        _id: msgCreated.chat,
        lastMessage: msgCreated._id,
      });

      return res.status(201).json(msgCreated);
    } catch (error) {
      console.log('Error en create:', error);
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
