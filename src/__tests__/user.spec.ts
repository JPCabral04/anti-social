import request from 'supertest';
import { app } from '../app';
import { clearUsers } from '../services/userService';

describe('User Integration Tests', () => {
  beforeEach(async () => {
    await clearUsers(); // Limpa ANTES de cada teste
  });

  afterEach(async () => {
    await clearUsers(); // Limpa DEPOIS também
  });

  // 1) REGISTRO
  it('Deve registrar um usuário (201)', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    // ADICIONE ISSO PARA VER O ERRO NO CONSOLE
    if (res.status !== 201) {
      console.error('Erro retornado pela API:', res.body);
    }

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

  // 2) LOGIN
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

  // 3) GET USER
  it('Deve retornar o próprio usuário (200)', async () => {
    const userRes = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const loginRes = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    const res = await request(app)
      .get(`/users/${userRes.body.id}`)
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userRes.body.id);
  });

  it('Não deve retornar user sem token (401)', async () => {
    const userRes = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const res = await request(app).get(`/users/${userRes.body.id}`);
    expect(res.status).toBe(401);
  });

  it('Não deve retornar outro usuário (403)', async () => {
    const user1 = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const login1 = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    const user2 = await request(app).post('/auth/register').send({
      name: 'Pedro',
      email: 'pedro@example.com',
      password: '123456',
    });

    const res = await request(app)
      .get(`/users/${user2.body.id}`)
      .set('Authorization', `Bearer ${login1.body.token}`);

    expect(res.status).toBe(403);
  });

  // 4) UPDATE USER
  it('Deve atualizar o próprio usuário (200)', async () => {
    const userRes = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const loginRes = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    const res = await request(app)
      .put(`/users/${userRes.body.id}`)
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .send({ name: 'John Updated' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('John Updated');
  });

  it('Não deve atualizar com dados inválidos (400)', async () => {
    const userRes = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const loginRes = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    const res = await request(app)
      .put(`/users/${userRes.body.id}`)
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .send({ bio: 'curto' });

    expect(res.status).toBe(400);
  });

  it('Não deve atualizar outro usuário (403)', async () => {
    const user1 = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const login1 = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    const user2 = await request(app).post('/auth/register').send({
      name: 'Maria',
      email: 'maria@example.com',
      password: '123456',
    });

    const res = await request(app)
      .put(`/users/${user2.body.id}`)
      .set('Authorization', `Bearer ${login1.body.token}`)
      .send({ name: 'hack attempt' });

    expect(res.status).toBe(403);
  });

  // 5) DELETE USER
  it('Não deve deletar outro usuário (403)', async () => {
    const user1 = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const login1 = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    const user2 = await request(app).post('/auth/register').send({
      name: 'Carlos',
      email: 'carlos@example.com',
      password: '123456',
    });

    const res = await request(app)
      .delete(`/users/${user2.body.id}`)
      .set('Authorization', `Bearer ${login1.body.token}`);

    expect(res.status).toBe(403);
  });

  it('Deve deletar o próprio usuário (202)', async () => {
    const userRes = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const loginRes = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    const res = await request(app)
      .delete(`/users/${userRes.body.id}`)
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(202);
  });

  it('Não deve encontrar user deletado (404)', async () => {
    const userRes = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const loginRes = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    await request(app)
      .delete(`/users/${userRes.body.id}`)
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .get(`/users/${userRes.body.id}`)
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(404);
  });
});
