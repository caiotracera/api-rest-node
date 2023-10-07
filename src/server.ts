import { env } from '@/env';
import { app } from '@/app';

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 Server is running on port ${env.PORT}`);
  });
