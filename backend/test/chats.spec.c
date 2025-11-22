import req from 'supertest';
import app from '../app.js';
import { connection } from '../helpers/connectionMDB.js';
import mongoose from 'mongoose';

const Chat = mongoose.model('Chat'); // modelo Mongoose
const User = mongoose.model('User');

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

const user3 = {
  name: 'getUser3',
  mail: 'getUser3@mail.com',
  password: '123456',
};

const userNoChat = {
  name: 'userNoChat',
  mail: 'userNoChat@mail.com',
  password: '123456',
};

let accessToken, accessTokenNoChat;

beforeAll(async () => {
  await connection(); // conecta a MongoDB

  const usersEndpoint = '/api/users';

  await Chat.deleteMany({});
  await User.deleteMany({});

  // 1️⃣ Registrar los dos usuarios
  await req(app).post(`${usersEndpoint}/register`).send(user);
  await req(app).post(`${usersEndpoint}/register`).send(user2);
  await req(app).post(`${usersEndpoint}/register`).send(user3);
  await req(app).post(`${usersEndpoint}/register`).send(userNoChat);

  // 2️⃣ Logear a uno de ellos para obtener el token
  const resLogin = await req(app).post(`${usersEndpoint}/login`).send(user);
  const resLoginNoChat = await req(app)
    .post(`${usersEndpoint}/login`)
    .send(userNoChat);

  accessToken = resLogin.body.accessToken;
  // console.log('access token:', accessToken);
  accessTokenNoChat = resLoginNoChat.body.accessToken;
});

afterAll(async () => {
  await Chat.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close(); // cierra la conexión al final
});
// describe('', () => {});
describe('POST /api/chats/', () => {
  const endpoint = '/api/chats/';
  // console.log('Res register:', resRegister);
  describe('when sending valid data', () => {
    // test('', () => {})
    let res;
    beforeAll(async () => {
      const newChat = {
        users: [user2.name],
      };
      res = await req(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newChat);
      // console.log('resp create chat:', res);
    });

    test('should responds with status 201 and JSON content', async () => {
      // console.log('acess token from test: ', accessToken);
      expect(res.statusCode).toBe(201);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });

    test('should responds with a valid user', async () => {
      expect(res.body).toHaveProperty('_id');
      expect(res.body._id).toBeTruthy();
    });
  });

  describe('when sending invalid data', () => {
    // formato no correcto ejm numeros y asi (vacio)
    const invalidData = ['', 34343, 'sd', '+{};'];

    test('should responds with 400 and validation error message', async () => {
      for (const name of invalidData) {
        let res = await req(app)
          .post(endpoint)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ users: [name] });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch(/invalid data/i);
      }
    });
  });

  describe('when sending a userName not registered', () => {
    test('should respond with status 404 a message error', async () => {
      const newChat = {
        users: ['xocas'],
      };
      res = await req(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newChat);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/User not found/i);
    });
  });

  describe('when required fields are missing', () => {
    test('should respond with status 400 a message error', async () => {
      const newChat = {};
      res = await req(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newChat);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/invalid data/i);
    });
  });

  describe('when a chat is already create', () => {
    test('should respond with status 409 a message error', async () => {
      //create chat twice
      const newChat = {
        users: [user2.name],
      };
      res = await req(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newChat);
      res = await req(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newChat);

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/Chat already exist/i);
    });
  });
});

describe('GET /api/chats/', () => {
  const endpoint = '/api/chats/';

  beforeAll(async () => {
    // Crear algunos chats
    await req(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ users: [user2.name] });

    await req(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ users: [user3.name] });
  });

  // recibir 0 chats osea [] y recibir chats[3]

  describe('when sending a user login', () => {
    describe('when user has chats', () => {
      let res;
      beforeEach(async () => {
        res = await req(app)
          .get(endpoint)
          .set('Authorization', `Bearer ${accessToken}`);
      });

      test('should responds with status 200 and JSON content', async () => {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );
      });

      test('should responds with a object array', async () => {
        expect(Array.isArray(res.body)).toBe(true);
      });
    });

    describe('when user has not chats', () => {
      // registrar otro user mas y este q no tenga chat con el main asi vemos q devuelva 0
      let res;
      beforeEach(async () => {
        res = await req(app)
          .get(endpoint)
          .set('Authorization', `Bearer ${accessTokenNoChat}`);
      });

      test('should responds with status 200 and JSON content', async () => {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );
      });

      test('should respond with an empty array', async () => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(0); // This checks that the array is empty
      });
    });
  });
});
