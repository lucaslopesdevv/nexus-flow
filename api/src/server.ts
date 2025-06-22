import fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { errorHandler } from './middleware/errorHandler'
import { taskRoutes } from './routes/tasks'
import { inventoryRoutes } from './routes/inventory'
import { focusRoutes } from './routes/focus'
import { financeRoutes } from './routes/finance'
import { env } from './config/environment'

const server = fastify({
  logger: true
})

// Register plugins
server.register(cors, {
  origin: env.CORS_ORIGINS,
  credentials: true
})

// Register Swagger
server.register(swagger, {
  swagger: {
    info: {
      title: 'Nexus Flow API',
      description: 'API documentation for Nexus Flow',
      version: '1.0.0'
    },
    tags: [
      { name: 'tasks', description: 'Task management endpoints' },
      { name: 'inventory', description: 'Inventory management endpoints' },
      { name: 'focus', description: 'Focus time management endpoints' },
      { name: 'finance', description: 'Financial management endpoints' }
    ]
  }
})

server.register(swaggerUi, {
  routePrefix: '/documentation'
})

// Health check endpoint
server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Register routes
server.register(taskRoutes, { prefix: '/api/tasks' })
server.register(inventoryRoutes, { prefix: '/api/inventory' })
server.register(focusRoutes, { prefix: '/api/focus' })
server.register(financeRoutes, { prefix: '/api/finance' })

// Register error handler
server.setErrorHandler(errorHandler)

// Start server
const start = async () => {
  try {
    await server.listen({ 
      port: env.PORT, 
      host: '0.0.0.0' 
    })
    console.log(`Server is running on http://localhost:${env.PORT}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start() 