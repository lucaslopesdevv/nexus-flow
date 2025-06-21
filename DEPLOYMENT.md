# Deployment Guide for Nexus Flow

## Prerequisites
- A Supabase account (for database)
- A Clerk account (for authentication)
- A Vercel account (for frontend deployment)
- A Railway account (for backend deployment)

## Database Setup (Supabase)

1. Create a new project in Supabase
2. Get your database connection string from: Settings -> Database -> Connection string
3. Add the following to your `.env` file:
```bash
DATABASE_URL=your-supabase-connection-string
```

4. Run migrations:
```bash
cd api
npx prisma migrate deploy
```

## Authentication Setup (Clerk)

1. Create a new application in Clerk
2. Enable Google authentication:
   - Go to JWT Templates and create a new template
   - Add necessary custom claims
   - Configure Google OAuth in Social Connections

3. Add these to your frontend `.env`:
```bash
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
VITE_CLERK_SECRET_KEY=your-clerk-secret-key
```

## Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   VITE_API_URL=your-backend-url
   ```
4. Deploy using these build settings:
   - Framework Preset: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

## Backend Deployment (Railway)

1. Create a new project in Railway
2. Connect your GitHub repository
3. Add environment variables:
   ```
   DATABASE_URL=your-supabase-connection-string
   CLERK_SECRET_KEY=your-clerk-secret-key
   CORS_ORIGINS=your-frontend-url
   PORT=3001
   ```
4. Deploy using these settings:
   - Root Directory: `api`
   - Build Command: `npm run build`
   - Start Command: `npm start`

## Security Checklist

1. Database Security:
   - [ ] Enable SSL for database connections
   - [ ] Set up database backups in Supabase
   - [ ] Configure connection pooling
   - [ ] Set up row-level security if needed

2. Authentication Security:
   - [ ] Configure Clerk webhook endpoints
   - [ ] Set up proper JWT verification
   - [ ] Enable MFA for admin accounts
   - [ ] Configure session management

3. API Security:
   - [ ] Enable rate limiting
   - [ ] Set up proper CORS configuration
   - [ ] Implement request validation
   - [ ] Set up API monitoring

4. Frontend Security:
   - [ ] Enable CSP headers
   - [ ] Implement proper error boundaries
   - [ ] Set up performance monitoring
   - [ ] Configure proper caching strategies

## Monitoring and Maintenance

1. Set up monitoring:
   ```bash
   # Install monitoring tools
   npm install @sentry/react @sentry/tracing
   ```

2. Add error tracking:
   ```typescript
   // In your frontend main.tsx
   import * as Sentry from "@sentry/react";

   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: import.meta.env.MODE,
   });
   ```

3. Set up logging:
   ```typescript
   // In your backend
   import pino from 'pino';

   const logger = pino({
     level: process.env.LOG_LEVEL || 'info',
   });
   ```

## Scaling Considerations

1. Database Scaling:
   - Use connection pooling with Prisma
   - Set up read replicas if needed
   - Implement caching strategy

2. API Scaling:
   - Implement proper caching headers
   - Use load balancing
   - Set up CDN for static assets

3. Frontend Scaling:
   - Implement code splitting
   - Use proper caching strategies
   - Optimize bundle size

## Backup and Recovery

1. Database Backups:
   - Enable automated backups in Supabase
   - Set up point-in-time recovery
   - Test restore procedures

2. Application Backups:
   - Set up GitHub Actions for automated backups
   - Document recovery procedures
   - Regular backup testing

## Cost Optimization

1. Free Tier Limits:
   - Supabase: 500MB database, 50MB file storage
   - Clerk: 5,000 monthly active users
   - Vercel: Personal Pro (Hobby) plan limits
   - Railway: Starter plan limits

2. Scaling Costs:
   - Document expected costs at different user levels
   - Set up cost alerts
   - Implement usage monitoring

## Going Live Checklist

1. Pre-launch:
   - [ ] Run security audit
   - [ ] Test all authentication flows
   - [ ] Verify database backups
   - [ ] Check all environment variables
   - [ ] Test monitoring setup
   - [ ] Verify SSL certificates
   - [ ] Run load tests

2. Launch:
   - [ ] Deploy database migrations
   - [ ] Deploy backend
   - [ ] Deploy frontend
   - [ ] Verify all systems
   - [ ] Monitor error rates
   - [ ] Check authentication flows

3. Post-launch:
   - [ ] Monitor performance
   - [ ] Watch error logs
   - [ ] Check user feedback
   - [ ] Monitor costs
   - [ ] Verify backups 