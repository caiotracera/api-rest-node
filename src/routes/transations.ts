import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';

import { knex } from '@/database';
import { checkSessionIdExists } from '@/middlewares/check-session-id-exists';

export async function transactionRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select('*');

      return {
        transactions,
      };
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(request.params);

      const transaction = await knex('transactions')
        .select('*')
        .where({
          id,
          session_id: sessionId,
        })
        .first();

      if (!transaction) {
        return reply.code(404).send();
      }

      return {
        transaction,
      };
    },
  );

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      const summary = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .where({ session_id: sessionId })
        .first();

      return {
        summary,
      };
    },
  );

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['income', 'outcome']),
    });

    const { type, title, amount } = createTransactionBodySchema.parse(
      request.body,
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'income' ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.code(201).send();
  });
}
