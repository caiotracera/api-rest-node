import fastify from 'fastify';

const DEFAULT_PORT = 3333;

const app = fastify();

app
  .listen({
    port: DEFAULT_PORT,
  })
  .then(() => {
    console.log(`?? Server is running on port ${DEFAULT_PORT}`);
  });
