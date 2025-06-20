import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../config/database';

const financeSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.enum([
    'salary',
    'investment',
    'other_income',
    'food',
    'transportation',
    'utilities',
    'entertainment',
    'shopping',
    'healthcare',
    'other_expense',
  ]),
  amount: z.number(),
  description: z.string(),
  date: z.date(),
});

export async function financeRoutes(fastify: FastifyInstance) {
  // Get all transactions
  fastify.get('/', async (request, reply) => {
    try {
      const transactions = await prisma.transaction.findMany({
        orderBy: { date: 'desc' },
      });
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return reply.status(500).send({ error: 'Failed to fetch transactions' });
    }
  });

  // Create a new transaction
  fastify.post('/', async (request, reply) => {
    try {
      const data = financeSchema.parse(request.body);
      const transaction = await prisma.transaction.create({
        data,
      });
      return reply.status(201).send(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      return reply.status(400).send({ error: 'Failed to create transaction' });
    }
  });

  // Update a transaction
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const data = financeSchema.partial().parse(request.body);
      const transaction = await prisma.transaction.update({
        where: { id },
        data,
      });
      return transaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      return reply.status(400).send({ error: 'Failed to update transaction' });
    }
  });

  // Delete a transaction
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      await prisma.transaction.delete({
        where: { id },
      });
      return reply.status(204).send();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return reply.status(400).send({ error: 'Failed to delete transaction' });
    }
  });
} 