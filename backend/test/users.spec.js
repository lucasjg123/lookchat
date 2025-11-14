import app from '../app.js';
import bcrypt from 'bcrypt';
import req from 'supertest';
import { connection } from '../helpers/connectionMDB.js';
import mongoose from 'mongoose';
import { en } from 'zod/v4/locales';

// jest.setTimeout(20000); // evita timeout en hooks lentos

const User = mongoose.model('User'); // modelo Mongoose

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

beforeAll(async () => {
  await connection(); // conecta a MongoDB
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close(); // cierra la conexión al final
});
// describe('', ()=>{})
describe('POST /api/users/register', () => {
  const endpoint = '/api/users/register';

  // Limpia la colección antes de cada test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('when sending valid data', () => {
    const newUser = {
      name: 'ricarditoTest',
      mail: 'ricardo@gmail.com',
      password: 'asldkfjaslkf',
    };

    let res;
    beforeEach(async () => {
      res = await req(app).post(endpoint).send(newUser);
    });

    test('should respond with status 201 and JSON content', () => {
      expect(res.statusCode).toBe(201);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });

    test('should respond with a message "user created"', () => {
      expect(res.body).toHaveProperty('message', 'user created');
    });

    test('should save the user in DB', async () => {
      const userInDB = await User.findOne({ mail: newUser.mail });
      expect(userInDB).not.toBeNull();
      expect(userInDB.name).toBe(newUser.name);
    });
  });
  // ejm correo mal enviado name con 2 letras etc. vverificar con zod
  describe('when sending invalid data', () => {
    const invalidData = [
      { name: 'ricardito', mail: 'not-an-email', password: '12345' },
      { name: 'ricardito', mail: 'ricardo@gmail', password: '12345' },
      { name: 'ricardito', mail: 'ricardo@gmail.com', password: 12345678 },
      { name: 'ricardito', mail: 'ricardo@gmail.com', password: '1234' },
      { name: 'ri', mail: 'ricardo@gmail', password: '12345' },
      { name: 33333, mail: 'ricardo@gmail', password: '12345' },
    ];

    test('should responds with 400 and validation error message', async () => {
      for (const body of invalidData) {
        const res = await req(app).post(endpoint).send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch(/invalid data/i);
      }
    });
  });

  describe('when required fields are missing', () => {
    const invalidBodies = [
      {},
      { name: 'ricardo' },
      { mail: 'ricardo@gmail.com' },
      { password: 'asldjfalskjdf444' },
      { name: 'ricardo', mail: 'ricardo@gmail.com' },
      { mail: 'ricardo@gmail.com', password: 'asldjfalskjdf444' },
      { name: 'ricardo', password: 'asldjfalskjdf444' },
    ];

    test('should respond with 400 and error message', async () => {
      for (const body of invalidBodies) {
        const res = await req(app).post(endpoint).send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch(/invalid data/i);
      }
    });
  });

  describe('when a user is already registered', () => {
    const existingUser = {
      name: 'ricarditoTest',
      mail: 'ricardo@gmail.com',
      password: 'asldkfjaslkf',
    };

    const createUserAndPost = async () => {
      await User.create(existingUser); // guardamos en DB
      return await req(app).post(endpoint).send(existingUser);
    };

    let res;
    beforeEach(async () => {
      res = await createUserAndPost();
    });

    test('should respond with status 409 and JSON content', () => {
      expect(res.statusCode).toBe(409);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });

    test('should respond with error "already exists"', () => {
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/user already exists/i);
    });
  });
});

describe('POST /api/users/login', () => {
  const endpoint = '/api/users/login';
  const plainPassword = 'asldkfjaslkf';
  const user = {
    name: 'ricarditoTest',
    mail: 'ricardo@gmail.com',
    password: plainPassword,
  };

  // Create a user before all test
  beforeAll(async () => {
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await User.create({ ...user, password: hashedPassword }); // puedo hacerlo mediante el /register y listo
  });

  let res;
  beforeEach(async () => {
    res = await req(app).post(endpoint).send(user);
  });

  describe('when sending a user registered with valid data', () => {
    // test('should respond with', ()=>{})
    test('should responds with status 200 and JSON content', () => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });

    test('should responds with a valid user object', () => {
      expect(res.body).toHaveProperty('user');
      expect(typeof res.body.user).toBe('object');

      expect(res.body.user).toHaveProperty('name');
      expect(res.body.user.name).toBeTruthy();
    });

    test('should responds with valid JWT tokens', () => {
      const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.accessToken).toMatch(jwtRegex);
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body.refreshToken).toMatch(jwtRegex);
    });
  });

  describe('when required fields are missing', () => {
    const invalidBodies = [
      {},
      { name: 'ricardo' },
      { mail: 'ricardo@gmail.com' },
      { password: 'asldjfalskjdf444' },
      { name: 'ricardo', mail: 'ricardo@gmail.com' },
    ];

    test('should respond with 400 and an error message', async () => {
      for (const body of invalidBodies) {
        const res = await req(app).post(endpoint).send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch(/invalid data/i);
      }
    });
  });

  describe('when sending a user not registered', () => {
    test('should responds with 401 and descriptive error', async () => {
      const fakeUser = {
        mail: 'notexist@gmail.com',
        password: 'wrongpassword',
      };

      const res = await req(app).post(endpoint).send(fakeUser);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/user not found/i);
    });
  });

  // middleware validate.js
  describe('when sending invalid data', () => {
    const invalidData = [
      { mail: 'not-an-email', password: '12345' },
      { mail: 'ricardo@gmail', password: '12345' },
      { mail: 'ricardo@gmail.com', password: 12345678 }, // password numérico
    ];

    test('should responds with 400 and validation error message', async () => {
      for (const body of invalidData) {
        const res = await req(app).post(endpoint).send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch(/invalid data/i);
      }
    });
  });

  describe('when sending a user registered but incorrect password ', () => {
    test('should responds with 401 and descriptive error', async () => {
      const incorrectPasswordUser = {
        mail: 'ricardo@gmail.com',
        password: 'wrongpassword',
      };

      const res = await req(app).post(endpoint).send(incorrectPasswordUser);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/invalid password/i);
    });
  });
});

describe('GET /api/users?name=asd', () => {
  const endpoint = '/api/users';
  let accessToken;
  beforeAll(async () => {
    // registrar 3 users
    await req(app).post(`${endpoint}/register`).send(user);
    await req(app).post(`${endpoint}/register`).send(user2);
    await req(app).post(`${endpoint}/register`).send(user3);

    //logear uno
    // 2️⃣ Logear a uno de ellos para obtener el token
    const resLogin = await req(app).post(`${endpoint}/login`).send(user);

    accessToken = resLogin.body.accessToken;
  });

  describe('when sending valid data', () => {
    const names = ['ri', 'r', 'ma', 'g', 'to'];

    test('should respond with status 200 and json', async () => {
      for (const name of names) {
        console.log('enivamos el name: ', name);
        let res = await req(app)
          .get(`${endpoint}?name=${name}`)
          .set('Authorization', `Bearer ${accessToken}`);
        console.log('resp back', res.body);
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );
        expect(Array.isArray(res.body)).toBe(true);

        // Verificar que todos los elementos del arreglo sean objetos
        res.body.forEach((item) => {
          expect(typeof item).toBe('object');
          expect(item).not.toBeNull(); // Asegurarse de que no sea `null`
        });
      }
    });
  });

  //when sendin invalid data

  // when  not match username
});
