import { it, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import { app } from '@/app';

describe('Transactions', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Random Transaction',
        amount: 200,
        type: 'income',
      })
      .expect(201);
  });
});
