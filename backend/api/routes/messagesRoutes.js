import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { validate } from '../middlewares/validate';
import { validateID } from '../../helpers/zod/zodID';
import { validateMessage } from '../../helpers/zod/zodMessages';

export const MessagesRouter = (model) => {
  const controller = new MessageController(model);

  const messagesRouter = Router();

  messagesRouter.post('/', validate(validateMessage), controller.create);
  messagesRouter.get('/chat/:id', validate(validateID), controller.getByChatID);
};
