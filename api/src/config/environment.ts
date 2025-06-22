import { z } from 'zod'
import * as dotenv from 'dotenv'

// Load the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production'
  : process.env.NODE_ENV === 'staging'
    ? '.env.staging'
    : '.env'

dotenv.config({ path: envFile })

// Environment type
const Environment = z.enum(['development', 'staging', 'production'])
type Environment = z.infer<typeof Environment>

// Define environment schema
const envSchema = z.object({
  NODE_ENV: Environment.default('development'),
  PORT: z.string().transform(Number).default('3001'),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CORS_ORIGINS: z.string().transform(origins => origins.split(',')).default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  ENABLE_SWAGGER: z.string().transform(val => val === 'true').default('true'),
  RATE_LIMIT: z.string().transform(Number).default('100'), // requests per minute
})

// Parse and validate environment variables
const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data 

// Environment-specific configurations
const configurations: Record<Environment, any> = {
  development: {
    cors: {
      origin: env.CORS_ORIGINS,
      credentials: true,
    },
    swagger: {
      enabled: true,
    },
    logging: {
      level: 'debug',
      prettyPrint: true,
    },
    rateLimit: {
      max: 0, // Disable rate limiting in development
    },
  },
  staging: {
    cors: {
      origin: env.CORS_ORIGINS,
      credentials: true,
    },
    swagger: {
      enabled: env.ENABLE_SWAGGER,
    },
    logging: {
      level: env.LOG_LEVEL,
      prettyPrint: false,
    },
    rateLimit: {
      max: env.RATE_LIMIT,
      timeWindow: '1 minute',
    },
  },
  production: {
    cors: {
      origin: env.CORS_ORIGINS,
      credentials: true,
    },
    swagger: {
      enabled: false,
    },
    logging: {
      level: 'info',
      prettyPrint: false,
    },
    rateLimit: {
      max: env.RATE_LIMIT,
      timeWindow: '1 minute',
    },
  },
}

export const config = configurations[env.NODE_ENV]

// Helper functions
export const isProduction = () => env.NODE_ENV === 'production'
export const isDevelopment = () => env.NODE_ENV === 'development'
export const isStaging = () => env.NODE_ENV === 'staging' 