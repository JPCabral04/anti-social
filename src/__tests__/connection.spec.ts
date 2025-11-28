import request from 'supertest';
import { app } from '../app';
import { clearUsers } from '../services/userService';
import { clearConnections } from '../services/connectionService';
import { createAndLoginTestUser } from './utils/auth';

describe('Connection Integration Tests', () => {
  let token1: string;
  let userId1: string;
  let token2: string;
  let userId2: string;
  let connectionId: string;

  beforeEach(async () => {
    await clearConnections();
    await clearUsers();

    // Cria primeiro usuário
    ({ token: token1, userId: userId1 } = await createAndLoginTestUser());

    // Cria segundo usuário
    const user2Res = await request(app).post('/auth/register').send({
      name: 'User 2',
      email: 'user2@example.com',
      password: '123456',
    });

    const login2Res = await request(app).post('/auth/login').send({
      email: 'user2@example.com',
      password: '123456',
    });

    token2 = login2Res.body.token;
    userId2 = user2Res.body.id;
  });

  afterEach(async () => {
    await clearConnections();
    await clearUsers();
  });

  // CREATE CONNECTION
  describe('POST /connections', () => {
    it('Deve criar uma conexão entre dois usuários (201)', async () => {
      const res = await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          user1: userId1,
          user2: userId2,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.user1.id).toBe(userId1);
      expect(res.body.user2.id).toBe(userId2);
      expect(res.body).toHaveProperty('creationDate');
    });

    it('Não deve criar conexão sem autenticação (401)', async () => {
      const res = await request(app).post('/connections').send({
        user1: userId1,
        user2: userId2,
      });

      expect(res.status).toBe(401);
    });

    it('Não deve criar conexão se user1 não for o usuário autenticado (403)', async () => {
      const res = await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          user1: userId2, // Tentando criar conexão como outro usuário
          user2: userId1,
        });

      expect(res.status).toBe(403);
    });

    it('Não deve criar conexão consigo mesmo (400)', async () => {
      const res = await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          user1: userId1,
          user2: userId1,
        });

      expect(res.status).toBe(400);
    });

    it('Não deve criar conexão duplicada (409)', async () => {
      // Cria primeira conexão
      await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          user1: userId1,
          user2: userId2,
        });

      // Tenta criar novamente
      const res = await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          user1: userId1,
          user2: userId2,
        });

      expect(res.status).toBe(409);
    });

    it('Não deve criar conexão duplicada invertida (409)', async () => {
      // Cria conexão user1 -> user2
      await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          user1: userId1,
          user2: userId2,
        });

      // Tenta criar user2 -> user1
      const res = await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          user1: userId2,
          user2: userId1,
        });

      expect(res.status).toBe(409);
    });

    it('Não deve criar conexão com UUID inválido (400)', async () => {
      const res = await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          user1: userId1,
          user2: 'uuid-invalido',
        });

      expect(res.status).toBe(400);
    });

    it('Não deve criar conexão sem user2 (400)', async () => {
      const res = await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          user1: userId1,
        });

      expect(res.status).toBe(400);
    });
  });

  // GET CONNECTIONS BY USER
  describe('GET /connections/user/:userId', () => {
    beforeEach(async () => {
      // Cria uma conexão entre user1 e user2
      const connection = await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          user1: userId1,
          user2: userId2,
        });

      connectionId = connection.body.id;
    });

    it('Deve retornar conexões do próprio usuário (200)', async () => {
      const res = await request(app)
        .get(`/connections/user/${userId1}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].user1.id).toBe(userId1);
      expect(res.body[0].user2.id).toBe(userId2);
    });

    it('Deve retornar conexões para user2 também (200)', async () => {
      const res = await request(app)
        .get(`/connections/user/${userId2}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('Deve retornar lista vazia se usuário não tem conexões (200)', async () => {
      // Cria terceiro usuário sem conexões
      const user3Res = await request(app).post('/auth/register').send({
        name: 'User 3',
        email: 'user3@example.com',
        password: '123456',
      });

      const login3Res = await request(app).post('/auth/login').send({
        email: 'user3@example.com',
        password: '123456',
      });

      const res = await request(app)
        .get(`/connections/user/${user3Res.body.id}`)
        .set('Authorization', `Bearer ${login3Res.body.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('Não deve retornar conexões de outro usuário (403)', async () => {
      const res = await request(app)
        .get(`/connections/user/${userId2}`)
        .set('Authorization', `Bearer ${token1}`); // Token do user1

      expect(res.status).toBe(403);
    });

    it('Não deve retornar conexões sem autenticação (401)', async () => {
      const res = await request(app).get(`/connections/user/${userId1}`);

      expect(res.status).toBe(401);
    });

    it('Deve retornar múltiplas conexões (200)', async () => {
      // Cria terceiro usuário
      const user3Res = await request(app).post('/auth/register').send({
        name: 'User 3',
        email: 'user3@example.com',
        password: '123456',
      });

      // Cria segunda conexão (user1 com user3)
      await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          user1: userId1,
          user2: user3Res.body.id,
        });

      const res = await request(app)
        .get(`/connections/user/${userId1}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  // DELETE CONNECTION
  describe('DELETE /connections/:id', () => {
    beforeEach(async () => {
      const connection = await request(app)
        .post('/connections')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          user1: userId1,
          user2: userId2,
        });

      connectionId = connection.body.id;
    });

    it('Deve deletar conexão se for user1 (202)', async () => {
      const res = await request(app)
        .delete(`/connections/${connectionId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(202);
      expect(res.body.message).toBe('Conexão deletada');
    });

    it('Deve deletar conexão se for user2 (202)', async () => {
      const res = await request(app)
        .delete(`/connections/${connectionId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(res.status).toBe(202);
      expect(res.body.message).toBe('Conexão deletada');
    });

    it('Não deve encontrar conexão deletada (404)', async () => {
      // Deleta
      await request(app)
        .delete(`/connections/${connectionId}`)
        .set('Authorization', `Bearer ${token1}`);

      // Verifica se foi deletada
      const res = await request(app)
        .get(`/connections/user/${userId1}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('Não deve deletar conexão de outros usuários (403)', async () => {
      // Cria terceiro usuário
      const user3Res = await request(app).post('/auth/register').send({
        name: 'User 3',
        email: 'user3@example.com',
        password: '123456',
      });

      const login3Res = await request(app).post('/auth/login').send({
        email: 'user3@example.com',
        password: '123456',
      });

      // Tenta deletar conexão entre user1 e user2 usando user3
      const res = await request(app)
        .delete(`/connections/${connectionId}`)
        .set('Authorization', `Bearer ${login3Res.body.token}`);

      expect(res.status).toBe(403);
    });

    it('Não deve deletar conexão inexistente (404)', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const res = await request(app)
        .delete(`/connections/${fakeId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(404);
    });

    it('Não deve deletar conexão sem autenticação (401)', async () => {
      const res = await request(app).delete(`/connections/${connectionId}`);

      expect(res.status).toBe(401);
    });

    it('Deve retornar 404 ao deletar conexão já deletada', async () => {
      // Deleta uma vez
      await request(app)
        .delete(`/connections/${connectionId}`)
        .set('Authorization', `Bearer ${token1}`);

      // Tenta deletar novamente
      const res = await request(app)
        .delete(`/connections/${connectionId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(404);
    });
  });
});
