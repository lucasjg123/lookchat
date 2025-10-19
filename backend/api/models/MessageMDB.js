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

const Message = model('Message', messageSchema);

// chat: ObjectId<Chat> (para cuando tengas grupos)

// QUESTIONS
// encriptar mensajes?
// token ??
// ref q significa?
// object id??
