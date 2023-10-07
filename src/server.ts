import fastify from 'fastify';
import { knex } from '@/database';

const DEFAULT_PORT = 3333;

const app = fastify();

app.get('/', async () => {
  const transaction = await knex.select('*').from('transactions');

  return transaction;
});

app
  .listen({
    port: DEFAULT_PORT,
  })
  .then(() => {
    console.log(`🚀 Server is running on port ${DEFAULT_PORT}`);
  });
