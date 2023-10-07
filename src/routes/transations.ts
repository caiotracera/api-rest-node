import { FastifyInstance } from 'fastify';

import { knex } from '@/database';

export async function transactionRoutes(app: FastifyInstance) {
  app.get('/transactions', async () => {
    return knex('transactions').where('amount', 1000).select('*');
  });
}
