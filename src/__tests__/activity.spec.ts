import request from 'supertest';
import { app } from '../app';
import { clearUsers } from '../services/userService';
import { clearActivities } from '../services/activityService';
import { createAndLoginTestUser } from './utils/auth';

describe('Activity Integration Tests', () => {
  let token: string;
  let userId: string;
  let activityId: string;

  beforeEach(async () => {
    await clearActivities();
    await clearUsers();
    ({ token, userId } = await createAndLoginTestUser());
  });

  afterEach(async () => {
    await clearActivities();
    await clearUsers();
  });

  // CREATE ACTIVITY
  describe('POST /activities', () => {
    it('Deve criar uma atividade (201)', async () => {
      const res = await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Minha Primeira Atividade',
          description: 'Esta é uma descrição detalhada da atividade.',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Minha Primeira Atividade');
      expect(res.body.authorId).toBe(userId);
    });

    it('Não deve criar atividade sem autenticação (401)', async () => {
      const res = await request(app).post('/activities').send({
        title: 'Atividade sem auth',
        description: 'Descrição da atividade sem autenticação.',
      });

      expect(res.status).toBe(401);
    });

    it('Não deve criar atividade com título muito curto (400)', async () => {
      const res = await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'AB',
          description: 'Descrição válida com mais de 10 caracteres.',
        });

      expect(res.status).toBe(400);
    });

    it('Não deve criar atividade com descrição muito curta (400)', async () => {
      const res = await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Título válido',
          description: 'Curta',
        });

      expect(res.status).toBe(400);
    });

    it('Não deve criar atividade sem título (400)', async () => {
      const res = await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Descrição válida com mais de 10 caracteres.',
        });

      expect(res.status).toBe(400);
    });
  });

  // GET ALL ACTIVITIES
  describe('GET /activities', () => {
    it('Deve retornar lista vazia se não houver atividades (200)', async () => {
      const res = await request(app)
        .get('/activities')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('Deve retornar todas as atividades (200)', async () => {
      // Cria primeira atividade
      await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Atividade 1',
          description: 'Descrição da primeira atividade.',
        });

      // Cria segunda atividade
      await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Atividade 2',
          description: 'Descrição da segunda atividade.',
        });

      const res = await request(app)
        .get('/activities')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('author');
    });

    it('Não deve retornar atividades sem autenticação (401)', async () => {
      const res = await request(app).get('/activities');

      expect(res.status).toBe(401);
    });
  });

  // GET ACTIVITY BY ID
  describe('GET /activities/:id', () => {
    beforeEach(async () => {
      const activity = await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Atividade de Teste',
          description: 'Descrição da atividade de teste.',
        });

      activityId = activity.body.id;
    });

    it('Deve retornar uma atividade específica (200)', async () => {
      const res = await request(app)
        .get(`/activities/${activityId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(activityId);
      expect(res.body.title).toBe('Atividade de Teste');
      expect(res.body).toHaveProperty('author');
    });

    it('Não deve retornar atividade inexistente (404)', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const res = await request(app)
        .get(`/activities/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('Não deve retornar atividade sem autenticação (401)', async () => {
      const res = await request(app).get(`/activities/${activityId}`);

      expect(res.status).toBe(401);
    });
  });

  // UPDATE ACTIVITY
  describe('PUT /activities/:id', () => {
    beforeEach(async () => {
      const activity = await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Atividade Original',
          description: 'Descrição original da atividade.',
        });

      activityId = activity.body.id;
    });

    it('Deve atualizar a própria atividade (200)', async () => {
      const res = await request(app)
        .put(`/activities/${activityId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Atividade Atualizada',
          description: 'Descrição atualizada da atividade.',
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Atividade Atualizada');
      expect(res.body.description).toBe('Descrição atualizada da atividade.');
    });

    it('Deve atualizar apenas o título (200)', async () => {
      const res = await request(app)
        .put(`/activities/${activityId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Apenas Título Novo',
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Apenas Título Novo');
      expect(res.body.description).toBe('Descrição original da atividade.');
    });

    it('Não deve atualizar atividade de outro usuário (403)', async () => {
      // Cria segundo usuário
      const user2 = await request(app).post('/auth/register').send({
        name: 'Outro User',
        email: 'outro@example.com',
        password: '123456',
      });

      const login2 = await request(app).post('/auth/login').send({
        email: 'outro@example.com',
        password: '123456',
      });

      // Tenta atualizar atividade do primeiro usuário com token do segundo
      const res = await request(app)
        .put(`/activities/${activityId}`)
        .set('Authorization', `Bearer ${login2.body.token}`)
        .send({
          title: 'Tentativa de Hack',
        });

      expect(res.status).toBe(403);
    });

    it('Não deve atualizar com dados inválidos (400)', async () => {
      const res = await request(app)
        .put(`/activities/${activityId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'AB', // Muito curto
        });

      expect(res.status).toBe(400);
    });

    it('Não deve atualizar atividade inexistente (404)', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const res = await request(app)
        .put(`/activities/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Novo Título',
        });

      expect(res.status).toBe(404);
    });
  });

  // DELETE ACTIVITY
  describe('DELETE /activities/:id', () => {
    beforeEach(async () => {
      const activity = await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Atividade para Deletar',
          description: 'Esta atividade será deletada.',
        });

      activityId = activity.body.id;
    });

    it('Deve deletar a própria atividade (202)', async () => {
      const res = await request(app)
        .delete(`/activities/${activityId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(202);
      expect(res.body.message).toBe('Atividade deletada');
    });

    it('Não deve encontrar atividade deletada (404)', async () => {
      // Deleta
      await request(app)
        .delete(`/activities/${activityId}`)
        .set('Authorization', `Bearer ${token}`);

      // Tenta buscar
      const res = await request(app)
        .get(`/activities/${activityId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('Não deve deletar atividade de outro usuário (403)', async () => {
      // Cria segundo usuário
      const user2 = await request(app).post('/auth/register').send({
        name: 'Outro User',
        email: 'outro@example.com',
        password: '123456',
      });

      const login2 = await request(app).post('/auth/login').send({
        email: 'outro@example.com',
        password: '123456',
      });

      // Tenta deletar atividade do primeiro usuário
      const res = await request(app)
        .delete(`/activities/${activityId}`)
        .set('Authorization', `Bearer ${login2.body.token}`);

      expect(res.status).toBe(403);
    });

    it('Não deve deletar atividade inexistente (404)', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const res = await request(app)
        .delete(`/activities/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
