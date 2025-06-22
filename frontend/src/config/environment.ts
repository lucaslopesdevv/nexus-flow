import { z } from 'zod';

// Environment type
const Environment = z.enum(['development', 'staging', 'production']);
type Environment = z.infer<typeof Environment>;

// Configuration schema
const ConfigSchema = z.object({
  environment: Environment,
  api: z.object({
    url: z.string().url(),
  }),
  auth: z.object({
    publishableKey: z.string(),
  }),
});

type Config = z.infer<typeof ConfigSchema>;

// Default configurations for different environments
const configurations: Record<Environment, Config> = {
  development: {
    environment: 'development',
    api: {
      url: 'http://localhost:3001',
    },
    auth: {
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    },
  },
  staging: {
    environment: 'staging',
    api: {
      url: import.meta.env.VITE_API_URL || 'https://staging-api.nexusflow.app',
    },
    auth: {
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    },
  },
  production: {
    environment: 'production',
    api: {
      url: import.meta.env.VITE_API_URL || 'https://api.nexusflow.app',
    },
    auth: {
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    },
  },
};

// Get current environment from VITE_APP_ENV or default to 'development'
const currentEnvironment = (import.meta.env.VITE_APP_ENV as Environment) || 'development';

// Export the configuration for the current environment
export const config = ConfigSchema.parse(configurations[currentEnvironment]);

// Helper function to check current environment
export const isProduction = () => config.environment === 'production';
export const isDevelopment = () => config.environment === 'development';
export const isStaging = () => config.environment === 'staging'; 