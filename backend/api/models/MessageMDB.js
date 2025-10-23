import { Schema, model } from 'mongoose';

const messageSchema = new Schema(
  {
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['sent', 'read'],
      default: 'sent',
    },
  },
  { timestamps: true } // crea createdAt y updatedAt
);
messageSchema.index({ chat: 1, createdAt: -1 });

const Message = model('Message', messageSchema);

export class MessageModel {
  //func crud
  static async create(msg) {
    try {
      return await new Message(msg).save();
    } catch (error) {
      console.error('Error saving message:', error);
      throw new Error('Failed to save message');
    }
  }

  static async getByChatID(chatId) {
    try {
      return Message.find({ chat: chatId }).sort({ createdAt: -1 }).limit(20);
    } catch (error) {
      console.error('Error getting messages:', error);
      throw new Error('Failed to get messages');
    }
  }

  // ===== Estos los  dejo hechos pero debo comtemplarlos en el WS

  //delete
  static async delete(id) {
    try {
      return Message.deleteOne({ _id: id });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Failed to delete message');
    }
  }

  //update

  static async update(id, msg) {
    try {
      return await Message.updateOne(
        { _id: id }, // Condición para encontrar el artículo por su ID
        { ...msg } // Nuevos datos del msg
      );
    } catch (error) {
      console.error('Error updating message:', error);
      throw new Error('Failed to update message');
    }
  }
}
