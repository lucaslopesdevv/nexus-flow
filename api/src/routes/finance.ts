import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { FinanceService } from '@/services/finance.service';
import { TransactionType, TransactionCategory } from '@prisma/client';

const financeService = new FinanceService();

const TransactionSchema = Type.Object({
  type: Type.Union([Type.Literal('income'), Type.Literal('expense')]),
  amount: Type.Number(),
  category: Type.Union([
    Type.Literal('salary'),
    Type.Literal('investment'),
    Type.Literal('other_income'),
    Type.Literal('food'),
    Type.Literal('transportation'),
    Type.Literal('utilities'),
    Type.Literal('entertainment'),
    Type.Literal('shopping'),
    Type.Literal('healthcare'),
    Type.Literal('other_expense')
  ]),
  description: Type.Optional(Type.String()),
  date: Type.String({ format: 'date-time' })
});

const DateRangeSchema = Type.Object({
  startDate: Type.String({ format: 'date-time' }),
  endDate: Type.String({ format: 'date-time' })
});

export const financeRoutes = async function(app: FastifyInstance) {
  // Get all transactions
  app.get('/', async () => {
    return await financeService.findAll();
  });

  // Get transaction by id
  app.get('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      })
    }
  }, async (request) => {
    const { id } = request.params as { id: string };
    return await financeService.findById(id);
  });

  // Create transaction
  app.post('/', {
    schema: {
      body: TransactionSchema
    }
  }, async (request) => {
    const data = request.body as {
      type: TransactionType;
      amount: number;
      category: TransactionCategory;
      description?: string;
      date: string;
    };

    return await financeService.create(data);
  });

  // Update transaction
  app.put('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      body: Type.Partial(TransactionSchema)
    }
  }, async (request) => {
    const { id } = request.params as { id: string };
    const data = request.body as Partial<{
      type: TransactionType;
      amount: number;
      category: TransactionCategory;
      description?: string;
      date: string;
    }>;

    return await financeService.update(id, data);
  });

  // Delete transaction
  app.delete('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      })
    }
  }, async (request) => {
    const { id } = request.params as { id: string };
    await financeService.delete(id);
    return { success: true };
  });

  // Get finance stats
  app.post('/stats', {
    schema: {
      body: DateRangeSchema
    }
  }, async (request) => {
    const { startDate, endDate } = request.body as {
      startDate: string;
      endDate: string;
    };

    return await financeService.getStats(
      new Date(startDate),
      new Date(endDate)
    );
  });
} 