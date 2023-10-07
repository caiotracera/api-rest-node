import { it, describe, beforeAll, afterAll, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { execSync } from 'node:child_process';

import { app } from '@/app';

describe('Transactions', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
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

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Random Transaction',
        amount: 200,
        type: 'income',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200);

    expect(listTransactionsResponse.body).toEqual(
      expect.objectContaining({
        transactions: expect.arrayContaining([
          expect.objectContaining({
            title: 'Random Transaction',
            amount: 200,
          }),
        ]),
      }),
    );
  });

  it('should be able to get a specific transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Random Transaction',
        amount: 200,
        type: 'income',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200);

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(getTransactionResponse.body).toEqual(
      expect.objectContaining({
        transaction: expect.objectContaining({
          title: 'Random Transaction',
          amount: 200,
        }),
      }),
    );
  });

  it('should be able to get the summary of the transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Random Transaction',
        amount: 200,
        type: 'income',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Random Transaction #2',
        amount: 100,
        type: 'outcome',
      });

    const summaryTransactionsResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies);

    expect(summaryTransactionsResponse.body).toEqual(
      expect.objectContaining({
        summary: expect.objectContaining({
          amount: 100,
        }),
      }),
    );
  });
});
