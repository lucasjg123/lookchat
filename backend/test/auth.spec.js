import jwt from 'jwt-simple';
import 'dotenv/config';
import req from 'supertest';
import app from '../app.js';

const endpoint = '/api/chats/';

// ENDPOINT random con auth
describe('GET /api/chats/', () => {
  describe('when not sending token', () => {
    test('should respond with a status 401 and error message', async () => {
      const res = await req(app).get(endpoint);

      // console.log('res not sending tokenn: ', res.body);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/Access token is required/i);
    });
  });

  describe('when sending invalid token', () => {
    const invalidTokens = [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.aW52YWxpZHNpZ25hdHVyZQ',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.D0eYo7h3H4gD0m9GjFD7Gwe0O_X8MLe0hpwJMQ1FJqY',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.6FGiU5hHfrLqHV_4pNm5ZLQPy1buH4tsfZoSloq7vM8',
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxMjM0NTY3ODkwfQ.ujS3iO8Dh_i5DzojrhGpmGjrXqU2CCHbL8yNSj0hRjM',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.FQ1QmlciqK6byO5h0rmgnZyQbPtQODXK9JKle4_bOlo',
    ];

    test('should respond with a status 401 and error message', async () => {
      for (const token of invalidTokens) {
        const res = await req(app)
          .get(endpoint)
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch(/Invalid access token/i);
      }
    });
  });

  describe('when sending token with invalid type', () => {
    test('should respond with 401 and "Invalid token type"', async () => {
      const invalidTypeToken = jwt.encode(
        {
          id: '123',
          tipo: 'refresh', // ❌ tipo incorrecto
          exp: Math.floor(Date.now() / 1000) + 60,
        },
        process.env.SECRETO
      );

      const res = await req(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${invalidTypeToken}`);

      console.log('resp back tok:', res.body);
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toMatch(/Invalid token type/i);
    });
  });

  describe('when sending token without type property', () => {
    test('should respond with 401 and "Invalid token type"', async () => {
      const missingTipoToken = jwt.encode(
        {
          id: '123',
          exp: Math.floor(Date.now() / 1000) + 60,
        },
        process.env.SECRETO
      );

      const res = await req(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${missingTipoToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toMatch(/Invalid access token/i);
    });
  });

  describe('when sending expired access token', () => {
    test('should respond with 401 and "Refresh token expired"', async () => {
      const expiredToken = jwt.encode(
        {
          id: '123',
          tipo: 'refresh',
          exp: Math.floor(Date.now() / 1000) - 10, // ❌ ya expirado
        },
        process.env.SECRETO
      );

      const res = await req(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toMatch(/Access token expired/i);
    });
  });
});
