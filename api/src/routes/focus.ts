import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../config/database';

const focusSchema = z.object({
  duration: z.number(),
  startTime: z.date(),
  endTime: z.date().optional(),
  type: z.enum(['focus', 'break']),
  completed: z.boolean().default(false),
});

export async function focusRoutes(fastify: FastifyInstance) {
  // Get all focus sessions
  fastify.get('/', async (request, reply) => {
    try {
      const focusSessions = await prisma.focusSession.findMany({
        orderBy: { startTime: 'desc' },
      });
      return focusSessions;
    } catch (error) {
      console.error('Error fetching focus sessions:', error);
      return reply.status(500).send({ error: 'Failed to fetch focus sessions' });
    }
  });

  // Create a new focus session
  fastify.post('/', async (request, reply) => {
    try {
      const data = focusSchema.parse(request.body);
      const focusSession = await prisma.focusSession.create({
        data,
      });
      return reply.status(201).send(focusSession);
    } catch (error) {
      console.error('Error creating focus session:', error);
      return reply.status(400).send({ error: 'Failed to create focus session' });
    }
  });

  // Update a focus session
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const data = focusSchema.partial().parse(request.body);
      const focusSession = await prisma.focusSession.update({
        where: { id },
        data,
      });
      return focusSession;
    } catch (error) {
      console.error('Error updating focus session:', error);
      return reply.status(400).send({ error: 'Failed to update focus session' });
    }
  });

  // Delete a focus session
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      await prisma.focusSession.delete({
        where: { id },
      });
      return reply.status(204).send();
    } catch (error) {
      console.error('Error deleting focus session:', error);
      return reply.status(400).send({ error: 'Failed to delete focus session' });
    }
  });
} 