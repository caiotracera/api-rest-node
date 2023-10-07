import fastify from 'fastify';
import cookie from '@fastify/cookie';

import { env } from '@/env';
import { transactionRoutes } from '@/routes/transations';

const app = fastify();

app.register(cookie);

app.register(transactionRoutes, {
  prefix: '/transactions',
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 Server is running on port ${env.PORT}`);
  });
