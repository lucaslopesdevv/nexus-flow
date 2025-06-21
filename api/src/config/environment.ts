import { z } from 'zod'
import { config } from 'dotenv'

// Load environment variables from .env file
config()

// Define environment schema
const envSchema = z.object({
  PORT: z.string().transform(Number).optional().default('3001'),
  HOST: z.string().optional().default('0.0.0.0'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().optional().default('your-secret-key'),
  CORS_ORIGINS: z.string().transform(origins => origins.split(',')).optional().default('http://localhost:5173')
})

// Parse and validate environment variables
const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data 