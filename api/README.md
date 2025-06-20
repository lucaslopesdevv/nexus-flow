# Nexus Flow API

This is the backend API for the Nexus Flow application, built with Fastify and TypeScript.

## Features

- Task Management
- Inventory Management
- Financial Management
- Focus Time Management
- JWT Authentication
- Request/Response Validation with Zod
- Swagger Documentation
- Error Handling
- TypeScript Support

## Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

## Setup

1. Clone the repository
2. Navigate to the api directory:
   ```bash
   cd api
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a `.env` file in the root directory with the following content:
   ```
   NODE_ENV=development
   PORT=3000
   HOST=localhost
   JWT_SECRET=your-super-secret-key-min-32-chars-long
   CORS_ORIGINS=http://localhost:5173
   ```

## Development

To start the development server:

```bash
pnpm dev
```

The server will start on http://localhost:3000

## API Documentation

Once the server is running, you can access the Swagger documentation at:

http://localhost:3000/documentation

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── routes/         # Route definitions
├── schemas/        # Zod schemas
├── services/       # Business logic
└── utils/          # Utility functions
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Inventory
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/:id` - Get inventory item by ID
- `POST /api/inventory` - Create new inventory item
- `PATCH /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

### Bulk Inventory Operations
- `POST /api/inventory/bulk` - Create multiple inventory items
- `PATCH /api/inventory/bulk` - Update multiple inventory items
- `DELETE /api/inventory/bulk` - Delete multiple inventory items

### Finance
- `GET /api/finance` - Get all financial records
- `GET /api/finance/:id` - Get financial record by ID
- `POST /api/finance` - Create new financial record
- `PATCH /api/finance/:id` - Update financial record
- `DELETE /api/finance/:id` - Delete financial record

### Focus Time
- `GET /api/focus` - Get all focus sessions
- `GET /api/focus/:id` - Get focus session by ID
- `POST /api/focus` - Create new focus session
- `PATCH /api/focus/:id` - Update focus session
- `DELETE /api/focus/:id` - Delete focus session 