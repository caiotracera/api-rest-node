import { config } from 'dotenv';
import { z } from 'zod';
import * as process from 'process';

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test.local',
  });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) throw new Error(_env.error.message);

export const env = _env.data;
