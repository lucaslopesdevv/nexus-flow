import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error)

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        message: error.message,
        code: error.code
      }
    })
  }

  // Handle validation errors
  if (error.validation) {
    return reply.status(400).send({
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.validation
      }
    })
  }

  // Handle unknown errors
  return reply.status(500).send({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  })
} 