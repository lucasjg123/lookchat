import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { validate } from '../middlewares/validate';
import { validateMessage } from '../../helpers/zod/zodMessages';

export const MessagesRouter = (model) => {
  const controller = new MessageController(model);

  const messagesRouter = Router();

  messagesRouter.post('/', validate(validateMessage), controller.create);
  messagesRouter.get('/chat/:id', controller.getByChatID);

  return messagesRouter;
};
