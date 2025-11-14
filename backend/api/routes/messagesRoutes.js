import { Router } from 'express';
import { MessageController } from '../controllers/MessageController.js';
import { validate } from '../middlewares/validate.js';
import { validateMessage } from '../../helpers/zod/zodMessages.js';

export const MessagesRouter = (model) => {
  const controller = new MessageController(model);

  const messagesRouter = Router();

  messagesRouter.post('/', validate(validateMessage), controller.create);
  messagesRouter.get('/chat/:id', controller.getByChatID);

  return messagesRouter;
};
