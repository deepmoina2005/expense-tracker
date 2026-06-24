const { z } = require('zod');

const goalSchema = z.object({
    title: z.string().min(2),
    target_amount: z.number().positive(),
    current_amount: z.number().nonnegative().optional(),
    deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional()
});

module.exports = { goalSchema };
