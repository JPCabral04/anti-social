import request from 'supertest';
import { app } from '../app';
import { clearUsers } from '../services/userService';
import { createAndLoginTestUser } from './utils/auth';

describe('User Integration Tests', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await clearUsers();
    ({ token, userId } = await createAndLoginTestUser());
  });

  afterEach(async () => {
    await clearUsers();
  });

  // GET USER
  it('Deve retornar o próprio usuário (200)', async () => {
    const res = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it('Não deve retornar user sem token (401)', async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.status).toBe(401);
  });

  it('Não deve retornar outro usuário (403)', async () => {
    // cria segundo user manualmente
    const user2 = await request(app).post('/auth/register').send({
      name: 'Outro',
      email: 'outro@example.com',
      password: '123456',
    });

    const res = await request(app)
      .get(`/users/${user2.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  // UPDATE USER
  it('Deve atualizar o próprio usuário (200)', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'John Updated' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('John Updated');
  });

  it('Não deve atualizar com dados inválidos (400)', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: 'curto' });

    expect(res.status).toBe(400);
  });

  it('Não deve atualizar outro usuário (403)', async () => {
    const user2 = await request(app).post('/auth/register').send({
      name: 'Outro',
      email: 'outro@example.com',
      password: '123456',
    });

    const res = await request(app)
      .put(`/users/${user2.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'hack attempt' });

    expect(res.status).toBe(403);
  });

  // DELETE USER
  it('Não deve deletar outro usuário (403)', async () => {
    const user2 = await request(app).post('/auth/register').send({
      name: 'Carlos',
      email: 'carlos@example.com',
      password: '123456',
    });

    const res = await request(app)
      .delete(`/users/${user2.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('Deve deletar o próprio usuário (202)', async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(202);
  });

  it('Não deve encontrar user deletado (404)', async () => {
    // deleta primeiro
    await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    // tenta pegar depois
    const res = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
