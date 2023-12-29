import * as z from 'zod';

export const ConversationRouteSchema = z.object({
  prompt: z.string().min(1, {
    message: 'Prompt is required and must be at least 1 character long',
  }),
});
