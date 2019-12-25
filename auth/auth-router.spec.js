const request = require('supertest');
const usersRouter = require('../users/users-router.js');
const usersModel = require('../users/users-model.js');
const authRouter = require('./auth-router.js');
const db = require('../database/dbConfig.js');
const server = require('../api/server.js');

const defaultUser = { username: 'Rosa', password: 'donuts' };

describe('auth-router.js', () => {
  beforeEach(async () => {
    await db('users').truncate();
    await usersModel.add(defaultUser);
  });

  it('should set environment to testing', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('Register', () => {
    // insert a record
    it('shouldnt allow insertion into database if username isnt unique', async () => {
      return request(server)
        .post('/api/auth/register')
        .send({ username: 'Rosa', password: 'Brandibuck' })
        .then(res => {
          expect(res.status).toBe(500);
        });
    });

    it('should allow insertion into database if username is unique', async () => {
      return request(server)
        .post('/api/auth/register')
        .send({ username: 'Pergrin', password: 'Took' })
        .then(res => {
          expect(res.status).toBe(201);
        });
    });
  });

  describe('Login', () => {
    // insert a record
    it('shouldnt allow someone who is not a user to login', async () => {
      return request(server)
        .post('/api/auth/login')
        .send({ username: 'Merry', password: 'Brandibuck' })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });

    it('shouldnt allow someone to login without a password', async () => {
      return request(server)
        .post('/api/auth/login')
        .send({ username: 'Merry' })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });

    it('should allow someone who is a user to login', async () => {
      return request(server)
        .post('/api/auth/register')
        .send({ username: 'Mickey', password: 'Mouse' })
        .then(res => {
          return request(server)
            .post('/api/auth/login')
            .send({ username: 'Mickey', password: 'Mouse' })
            .then(res => {
              expect(res.status).toBe(200);
            });
        });
    });
  });
});
