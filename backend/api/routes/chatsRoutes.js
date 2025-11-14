import { Router } from 'express';
import { ChatController } from '../controllers/ChatController.js';
//validacion
import { validate } from '../middlewares/validate.js';
// validadores xd
import { validateChat } from '../../helpers/zod/zodChats.js';

export const ChatsRouter = (model, modelUser) => {
  const controller = new ChatController(model, modelUser);
  const chatsRouter = Router();

  chatsRouter.post('/', validate(validateChat), controller.create);
  chatsRouter.get('/', controller.getByUserID);

  return chatsRouter;
};
