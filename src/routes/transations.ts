import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';

import { knex } from '@/database';

export async function transactionRoutes(app: FastifyInstance) {
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
