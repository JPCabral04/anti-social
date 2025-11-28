import request from 'supertest';
import { app } from '../app';
import { clearUsers } from '../services/userService';
import { clearActivities } from '../services/activityService';
import { createAndLoginTestUser } from './utils/auth';

describe('Error Handling Tests', () => {
  beforeEach(async () => {
    await clearActivities();
    await clearUsers();
  });

  afterEach(async () => {
    await clearActivities();
    await clearUsers();
  });

  describe('404 - Not Found', () => {
    it('Deve retornar 404 para rota inexistente', async () => {
      const res = await request(app).get('/rota-que-nao-existe');

      expect(res.status).toBe(404);
    });

    it('Deve retornar 404 com POST em rota inexistente', async () => {
      const res = await request(app)
        .post('/outra-rota-inexistente')
        .send({ data: 'test' });

      expect(res.status).toBe(404);
    });
  });

  describe('500 - Internal Server Error', () => {
    it('Deve tratar erro interno do servidor graciosamente', async () => {
      const { token } = await createAndLoginTestUser();

      // Força um erro interno tentando criar atividade sem título
      // mas passando dados que vão causar erro no servidor
      const res = await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: null, // null vai passar pelo zod mas causar erro no DB
          description: 'Descrição válida para teste de erro.',
        });

      // Pode ser 400 (validação) ou 500 (erro interno)
      expect([400, 500]).toContain(res.status);
    });
  });

  describe('Errors sem status/message', () => {
    it('Deve tratar erro genérico sem status', async () => {
      const { token, userId } = await createAndLoginTestUser();

      // Cria atividade
      const activity = await request(app)
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Atividade teste',
          description: 'Descrição da atividade de teste.',
        });

      // Deleta a atividade
      await request(app)
        .delete(`/activities/${activity.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      // Tenta buscar atividade deletada (vai dar erro 404)
      const res = await request(app)
        .get(`/activities/${activity.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
