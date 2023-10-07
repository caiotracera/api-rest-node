import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';

import { knex } from '@/database';

export async function transactionRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*');

    return {
      transactions,
    };
  });

  app.get('/:id', async (request, reply) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(request.params);

    const transaction = await knex('transactions')
      .select('*')
      .where({ id })
      .first();

    if (!transaction) {
      return reply.code(404).send();
    }

    return {
      transaction,
    };
  });

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['income', 'outcome']),
    });

    const { type, title, amount } = createTransactionBodySchema.parse(
      request.body,
    );

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'income' ? amount : amount * -1,
    });

    return reply.code(201).send();
  });
}
