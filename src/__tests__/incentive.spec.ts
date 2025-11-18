import request from 'supertest';
import { app } from '../app';
import { clearUsers } from '../services/userService';
import { clearActivities } from '../services/activityService';
import { clearIncentives } from '../services/incentiveService';
import { createAndLoginTestUser } from './utils/auth';
import { IncentiveType } from '../entities/Incentive';

describe('Incentive Integration Tests', () => {
  let token1: string;
  let userId1: string;
  let token2: string;
  let userId2: string;
  let activityId: string;

  beforeEach(async () => {
    await clearIncentives();
    await clearActivities();
    await clearUsers();

    // Cria primeiro usuário (criador da atividade)
    ({ token: token1, userId: userId1 } = await createAndLoginTestUser());

    // Cria segundo usuário (vai dar incentivos)
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

    // Cria uma atividade do user1
    const activityRes = await request(app)
      .post('/activities')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        title: 'Atividade de Teste',
        description: 'Descrição da atividade de teste para incentivos.',
      });

    activityId = activityRes.body.id;
  });

  afterEach(async () => {
    await clearIncentives();
    await clearActivities();
    await clearUsers();
  });

  // 1) CREATE INCENTIVE
  describe('POST /incentives', () => {
    it('Deve criar um incentivo tipo GEM (201)', async () => {
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.GEM,
          activityId: activityId,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.type).toBe(IncentiveType.GEM);
      expect(res.body.activityId).toBe(activityId);
      expect(res.body.authorId).toBe(userId2);
      expect(res.body).toHaveProperty('creationDate');
    });

    it('Deve criar um incentivo tipo SMILE (201)', async () => {
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.SMILE,
          activityId: activityId,
        });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe(IncentiveType.SMILE);
    });

    it('Deve criar um incentivo tipo HEART (201)', async () => {
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.HEART,
          activityId: activityId,
        });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe(IncentiveType.HEART);
    });

    it('Deve criar um incentivo tipo APPLAUSE (201)', async () => {
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.APPLAUSE,
          activityId: activityId,
        });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe(IncentiveType.APPLAUSE);
    });

    it('Deve criar um incentivo tipo STAR (201)', async () => {
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.STAR,
          activityId: activityId,
        });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe(IncentiveType.STAR);
    });

    it('Deve criar um incentivo tipo MEDAL (201)', async () => {
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.MEDAL,
          activityId: activityId,
        });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe(IncentiveType.MEDAL);
    });

    it('Deve permitir autor da atividade dar incentivo na própria atividade (201)', async () => {
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          type: IncentiveType.STAR,
          activityId: activityId,
        });

      expect(res.status).toBe(201);
      expect(res.body.authorId).toBe(userId1);
    });

    it('Não deve criar incentivo sem autenticação (401)', async () => {
      const res = await request(app).post('/incentives').send({
        type: IncentiveType.GEM,
        activityId: activityId,
      });

      expect(res.status).toBe(401);
    });

    it('Não deve criar incentivo com tipo inválido (400)', async () => {
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: 'TIPO_INVALIDO',
          activityId: activityId,
        });

      expect(res.status).toBe(400);
    });

    it('Não deve criar incentivo sem tipo (400)', async () => {
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          activityId: activityId,
        });

      expect(res.status).toBe(400);
    });

    it('Não deve criar incentivo sem activityId (400)', async () => {
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.GEM,
        });

      expect(res.status).toBe(400);
    });

    it('Não deve criar incentivo com activityId inválido (400)', async () => {
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.GEM,
          activityId: 'uuid-invalido',
        });

      expect(res.status).toBe(400);
    });

    it('Não deve criar incentivo para atividade inexistente (404)', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.GEM,
          activityId: fakeId,
        });

      expect(res.status).toBe(404);
    });

    it('Não deve criar incentivo duplicado (409)', async () => {
      // Cria primeiro incentivo
      await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.GEM,
          activityId: activityId,
        });

      // Tenta criar novamente o mesmo tipo
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.GEM,
          activityId: activityId,
        });

      expect(res.status).toBe(409);
    });

    it('Deve permitir criar tipos diferentes de incentivos na mesma atividade (201)', async () => {
      // Cria GEM
      await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.GEM,
          activityId: activityId,
        });

      // Cria HEART
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.HEART,
          activityId: activityId,
        });

      expect(res.status).toBe(201);
    });

    it('Deve permitir usuários diferentes darem o mesmo tipo de incentivo (201)', async () => {
      // User2 dá GEM
      await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.GEM,
          activityId: activityId,
        });

      // User1 também dá GEM
      const res = await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          type: IncentiveType.GEM,
          activityId: activityId,
        });

      expect(res.status).toBe(201);
    });
  });

  // 2) GET INCENTIVES BY ACTIVITY
  describe('GET /incentives/activity/:activityId', () => {
    it('Deve retornar lista vazia se não houver incentivos (200)', async () => {
      const res = await request(app)
        .get(`/incentives/activity/${activityId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('Deve retornar todos os incentivos de uma atividade (200)', async () => {
      // User2 cria GEM
      await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.GEM,
          activityId: activityId,
        });

      // User2 cria HEART
      await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.HEART,
          activityId: activityId,
        });

      // User1 cria STAR
      await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          type: IncentiveType.STAR,
          activityId: activityId,
        });

      const res = await request(app)
        .get(`/incentives/activity/${activityId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0]).toHaveProperty('author');
      expect(res.body[0]).toHaveProperty('type');
      expect(res.body[0]).toHaveProperty('creationDate');
    });

    it('Deve retornar incentivos com informações do autor (200)', async () => {
      await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.GEM,
          activityId: activityId,
        });

      const res = await request(app)
        .get(`/incentives/activity/${activityId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body[0].author).toHaveProperty('id');
      expect(res.body[0].author).toHaveProperty('name');
      expect(res.body[0].author).toHaveProperty('email');
    });

    it('Não deve retornar incentivos sem autenticação (401)', async () => {
      const res = await request(app).get(`/incentives/activity/${activityId}`);

      expect(res.status).toBe(401);
    });

    it('Deve retornar lista vazia para atividade sem incentivos (200)', async () => {
      // Cria segunda atividade sem incentivos
      const activity2Res = await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Segunda Atividade',
          description: 'Descrição da segunda atividade.',
        });

      const res = await request(app)
        .get(`/incentives/activity/${activity2Res.body.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('Deve retornar apenas incentivos da atividade específica (200)', async () => {
      // Cria incentivo na primeira atividade
      await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.GEM,
          activityId: activityId,
        });

      // Cria segunda atividade
      const activity2Res = await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Segunda Atividade',
          description: 'Descrição da segunda atividade.',
        });

      // Cria incentivo na segunda atividade
      await request(app)
        .post('/incentives')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          type: IncentiveType.HEART,
          activityId: activity2Res.body.id,
        });

      // Busca incentivos da primeira atividade
      const res = await request(app)
        .get(`/incentives/activity/${activityId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].type).toBe(IncentiveType.GEM);
    });
  });
});
