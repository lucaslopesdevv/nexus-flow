import { z } from 'zod'
import { config } from 'dotenv'

// Load environment variables from .env file
config()

// Define environment schema
const envSchema = z.object({
  PORT: z.string().transform(Number).optional().default('3000'),
  HOST: z.string().optional().default('0.0.0.0'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  CORS_ORIGINS: z.string().transform(origins => origins.split(','))
})

// Parse and validate environment variables
const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data 