import req from 'supertest';
import app from '../app.js';
import { connection } from '../helpers/connectionMDB.js';
import mongoose from 'mongoose';
import { id } from 'zod/v4/locales';

const Message = mongoose.model('Message');
const Chat = mongoose.model('Chat');
const User = mongoose.model('User');

let accessToken, id_chat, id_chatNoMsg, accessToken2;

const user = {
  name: 'ricarditoTest',
  mail: 'ricardo@gmail.com',
  password: 'asldkfjaslkf',
};

const user2 = {
  name: 'manolitoTest',
  mail: 'manolito@gmail.com',
  password: 'asldkfjaslkf',
};

const userNoMsg = {
  name: 'userNoChat',
  mail: 'userNoChat@mail.com',
  password: '123456',
};

beforeAll(async () => {
  await connection(); // conecta a MongoDB

  const usersEndpoint = '/api/users';
  const chatsEndpoint = '/api/chats';

  await Chat.deleteMany({});
  await User.deleteMany({});
  await Message.deleteMany({});

  // Registrar los dos usuarios
  await req(app).post(`${usersEndpoint}/register`).send(user);
  await req(app).post(`${usersEndpoint}/register`).send(user2);
  await req(app).post(`${usersEndpoint}/register`).send(userNoMsg);

  // Logear a uno de ellos para obtener el token
  const resLogin = await req(app).post(`${usersEndpoint}/login`).send(user);
  const resLogin2 = await req(app).post(`${usersEndpoint}/login`).send(user2);
  await req(app).post(`${usersEndpoint}/login`).send(userNoMsg);
  accessToken = resLogin.body.accessToken;
  accessToken2 = resLogin2.body.accessToken;

  // create chat between users
  const newChat = {
    users: [user2.name],
  };
  const resChat = await req(app)
    .post(chatsEndpoint)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(newChat);
  id_chat = resChat.body._id;

  const newChatNoMsg = {
    users: [userNoMsg.name],
  };
  const resChatNoMsg = await req(app)
    .post(chatsEndpoint)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(newChatNoMsg);
  id_chatNoMsg = resChatNoMsg.body._id;
  // console.log('resp chat no msg;', resChatNoMsg.body);
});

afterAll(async () => {
  await Chat.deleteMany({});
  await User.deleteMany({});
  await Message.deleteMany({});
  await mongoose.connection.close(); // cierra la conexión al final
});
// post  guardar los msj en la bd
describe('POST /api/messages/', () => {
  const endpoint = '/api/messages/';

  describe('when sending valid data', () => {
    // test('', () => {})
    let res;
    beforeAll(async () => {
      // console.log('id_chat', id_chat);
      const newMessage = {
        chat: id_chat,
        content: 'hola',
      };
      res = await req(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newMessage);
    });

    test('should responds with status 201 and JSON content', async () => {
      expect(res.statusCode).toBe(201);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });

    test('should responds with a valid message', async () => {
      expect(res.body).toHaveProperty('_id');
      expect(res.body._id).toBeTruthy();
    });
  });

  // ejm: solo espacios  . usar func qutie espacion y si no teien ningun caracter declinar
  describe('when sending invalid data', () => {
    const invalidData = ['', '    '];

    const newMessage = {
      chat: id_chat,
    };

    test('should respond with 400 and validation error message', async () => {
      for (const content of invalidData) {
        let res = await req(app)
          .post(endpoint)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ...newMessage, content });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch(/invalid data/i);
      }
    });
  });

  // describe('when sending invalid id_chat', () => {

  // });
});
//get lo msj de x chat

describe('GET /api/messages/chat/:id', () => {
  const endpoint = '/api/messages/chat';
  let res;
  beforeAll(async () => {
    const newMessage = {
      chat: id_chat,
      content: 'hola',
    };
    const newMessage2 = {
      chat: id_chat,
      content: 'chau',
    };
    res = await req(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newMessage);
    res = await req(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${accessToken2}`)
      .send(newMessage2);
  });
  // crear unos mensaje
  describe('when request messages chat', () => {
    describe('when chat has messages', () => {
      let res;
      beforeEach(async () => {
        res = await req(app)
          .get(`${endpoint}/${id_chat}`)
          .set('Authorization', `Bearer ${accessToken}`);
      });

      test('should responds with status 200 and JSON content', async () => {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );
      });

      test('should responds with a object array', async () => {
        // console.log('mesg:', res.body);
        expect(Array.isArray(res.body)).toBe(true);

        // Verifica que cada elemento del array sea un objeto
        res.body.forEach((item) => {
          expect(typeof item).toBe('object'); // Cada elemento debe ser un objeto
          expect(item).not.toBeNull(); // Asegura que no sea null
        });
      });
    });

    describe('when chat has not messages', () => {
      let res;
      // console.log('id_chat no msg:', id_chatNoMsg);
      beforeEach(async () => {
        res = await req(app)
          .get(`${endpoint}/${id_chatNoMsg}`)
          .set('Authorization', `Bearer ${accessToken}`);
      });

      test('should responds with status 200 and JSON content', async () => {
        // console.log('resp:', res.body);
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );
      });

      test('should responds with an empty array', async () => {
        expect(Array.isArray(res.body)).toBe(true);

        expect(res.body).toHaveLength(0); // This checks that the array is empty
      });
    });
  });
});
