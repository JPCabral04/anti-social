import request from 'supertest';
import { app } from '../app';
import { clearUsers } from '../services/userService';

describe('Authentication Test', () => {
  beforeEach(async () => {
    await clearUsers();
  });

  // REGISTER
  it('Deve registrar um usuário (201)', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('Não deve registrar email inválido (400)', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Joao',
      email: 'invalido',
      password: '123456',
    });

    expect(res.status).toBe(400);
  });

  it('Não deve registrar email duplicado (409)', async () => {
    await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const res = await request(app).post('/auth/register').send({
      name: 'Outro',
      email: 'john@example.com',
      password: '654321',
    });

    expect(res.status).toBe(409);
  });

  // LOGIN
  it('Deve logar e retornar token (200)', async () => {
    await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('Não deve logar com senha errada (401)', async () => {
    await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: 'xxxxxx',
    });

    expect(res.status).toBe(401);
  });

  it('Não deve logar com email inexistente (401)', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'naoexiste@example.com',
      password: '123456',
    });

    expect(res.status).toBe(401);
  });

  describe('Token inválido', () => {
    it('Não deve aceitar token malformado (401)', async () => {
      await request(app).post('/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      });

      const res = await request(app)
        .get('/users/fake-id')
        .set('Authorization', 'Bearer token-invalido-malformado');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Token inválido');
    });

    it('Não deve aceitar token expirado (401)', async () => {
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { id: 'fake-id' },
        process.env.JWT_SECRET!,
        { expiresIn: '-1h' }, // Token expirado
      );

      const res = await request(app)
        .get('/users/fake-id')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Token inválido');
    });
  });
});
