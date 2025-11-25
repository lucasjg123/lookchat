import { Schema, model } from 'mongoose';

const chatSchema = new Schema(
  {
    // Tipo de chat: privado o grupal
    type: {
      type: String,
      enum: ['private', 'group'],
      default: 'private',
    },
    // Participantes del chat
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    // Último mensaje (para mostrar en listado rápido)
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    // Solo para grupos
    name: { type: String }, // nombre del grupo (si aplica)
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }], // admins del grupo
  },
  { timestamps: true } // crea createdAt y updatedAt
);

// Índices recomendados
chatSchema.index({ users: 1, updatedAt: -1 });

const Chat = model('Chat', chatSchema);

export class ChatModel {
  static async create(chat) {
    try {
      return await Chat(chat).save();
    } catch (error) {
      console.error('Error saving chat:', error);
      throw new Error('Failed to save chat');
    }
  }

  static async getOneByUsersID(userIds) {
    try {
      return Chat.findOne({
        type: 'private',
        users: { $all: userIds, $size: 2 },
      });
    } catch (error) {
      throw new Error('Failed to get chat');
    }
  }

  static async getByUserID(userId) {
    try {
      return Chat.find({ users: userId })
        .populate('users', 'name') // ← ACA SE TRAE EL nombre de cada usuario
        .populate('lastMessage', 'content sender createdAt')
        .sort({ updatedAt: -1 })
        .limit(10);
    } catch (error) {
      console.error('Error getting chat:', error);
      throw new Error('Failed to get chat');
    }
  }

  static async update(chat) {
    try {
      const { _id, ...data } = chat; // separamos el id del resto

      return await Chat.updateOne(
        { _id }, // condición
        data // datos a actualizar
      );
    } catch (error) {
      console.error('Error updating chat:', error);
      throw new Error('Failed to update chat');
    }
  }
}
