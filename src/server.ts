import fastify from 'fastify';
import { knex } from '@/database';
import { env } from '@/env';

const app = fastify();

app.get('/', async () => {
  const transaction = await knex.select('*').from('transactions');

  return transaction;
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 Server is running on port ${env.PORT}`);
  });
