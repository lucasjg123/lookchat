import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
//validacion
import { validate } from '../middlewares/validate.js';
// validadores xd
import { validateChat } from '../../helpers/zodChats.js';
import { validateID } from '../../helpers/zodID.js';

export const ChatsRouter = (model) => {
  const controller = new ChatController(model);
  const chatsRouter = Router();

  chatsRouter.post('/', validate(validateChat), controller.create);
  chatsRouter.get(
    '/users/:id',
    validate(validateID, 'params'),
    controller.getByUserID
  );
};
