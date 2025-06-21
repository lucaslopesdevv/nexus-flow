import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { FocusService } from '@/services/focus.service';
import { FocusType } from '@/generated/prisma';
import { z } from 'zod';

const focusService = new FocusService();

// Focus Session Schemas for validation
const focusSessionSchema = z.object({
  id: z.string().uuid(),
  duration: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  type: z.enum(['focus', 'break']),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

const createFocusSessionSchema = z.object({
  duration: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  type: z.enum(['focus', 'break'])
});

const updateFocusSessionSchema = createFocusSessionSchema.partial();

// Focus Preset Schemas for validation
const focusPresetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  duration: z.number().int().positive(),
  type: z.enum(['focus', 'break']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

const createFocusPresetSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  duration: z.number().int().positive(),
  type: z.enum(['focus', 'break'])
});

const updateFocusPresetSchema = createFocusPresetSchema.partial();

// Fastify schema objects
const CreateFocusSessionSchema = {
  body: Type.Object({
    duration: Type.Number({ minimum: 1 }),
    startTime: Type.String({ format: 'date-time' }),
    endTime: Type.Optional(Type.String({ format: 'date-time' })),
    type: Type.Union([Type.Literal('focus'), Type.Literal('break')])
  })
};

const UpdateFocusSessionSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  body: Type.Partial(Type.Object({
    duration: Type.Number({ minimum: 1 }),
    startTime: Type.String({ format: 'date-time' }),
    endTime: Type.Optional(Type.String({ format: 'date-time' })),
    type: Type.Union([Type.Literal('focus'), Type.Literal('break')]),
    completed: Type.Boolean()
  }))
};

const CreateFocusPresetSchema = {
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100 }),
    description: Type.Optional(Type.String({ maxLength: 500 })),
    duration: Type.Number({ minimum: 1 }),
    type: Type.Union([Type.Literal('focus'), Type.Literal('break')])
  })
};

const UpdateFocusPresetSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  body: Type.Partial(Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100 }),
    description: Type.Optional(Type.String({ maxLength: 500 })),
    duration: Type.Number({ minimum: 1 }),
    type: Type.Union([Type.Literal('focus'), Type.Literal('break')])
  }))
};

const DateRangeSchema = {
  body: Type.Object({
    startDate: Type.String({ format: 'date-time' }),
    endDate: Type.String({ format: 'date-time' })
  })
};

export const focusRoutes = async function(app: FastifyInstance) {
  // Get all focus sessions
  app.get('/', async () => {
    return await focusService.findAll();
  });

  // Get focus session by id
  app.get('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      })
    }
  }, async (request) => {
    const { id } = request.params as { id: string };
    return await focusService.findById(id);
  });

  // Create focus session
  app.post('/', {
    schema: CreateFocusSessionSchema
  }, async (request) => {
    const data = request.body as {
      duration: number;
      startTime: string;
      endTime?: string;
      type: FocusType;
    };

    return await focusService.create(data);
  });

  // Update focus session
  app.put('/:id', {
    schema: UpdateFocusSessionSchema
  }, async (request) => {
    const { id } = request.params as { id: string };
    const data = request.body as Partial<{
      duration: number;
      startTime: string;
      endTime?: string;
      type: FocusType;
      completed: boolean;
    }>;

    return await focusService.update(id, data);
  });

  // Delete focus session
  app.delete('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      })
    }
  }, async (request) => {
    const { id } = request.params as { id: string };
    await focusService.delete(id);
    return { success: true };
  });

  // Complete focus session
  app.post('/:id/complete', {
    schema: {
      params: Type.Object({
        id: Type.String()
      })
    }
  }, async (request) => {
    const { id } = request.params as { id: string };
    return await focusService.completeSession(id);
  });

  // Get focus stats
  app.post('/stats', {
    schema: DateRangeSchema
  }, async (request) => {
    const { startDate, endDate } = request.body as {
      startDate: string;
      endDate: string;
    };

    return await focusService.getStats(
      new Date(startDate),
      new Date(endDate)
    );
  });

  // Focus Preset Routes
  app.get('/presets', async () => {
    return await focusService.getAllPresets();
  });

  app.get('/presets/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      })
    }
  }, async (request) => {
    const { id } = request.params as { id: string };
    return await focusService.getPresetById(id);
  });

  app.post('/presets', {
    schema: CreateFocusPresetSchema
  }, async (request) => {
    const data = request.body as {
      name: string;
      description?: string;
      duration: number;
      type: FocusType;
    };
    return await focusService.createPreset(data);
  });

  app.put('/presets/:id', {
    schema: UpdateFocusPresetSchema
  }, async (request) => {
    const { id } = request.params as { id: string };
    const data = request.body as Partial<{
      name: string;
      description?: string;
      duration: number;
      type: FocusType;
    }>;
    return await focusService.updatePreset(id, data);
  });

  app.delete('/presets/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      })
    }
  }, async (request) => {
    const { id } = request.params as { id: string };
    await focusService.deletePreset(id);
    return { success: true };
  });
} 