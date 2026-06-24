const { z } = require('zod');

const budgetSchema = z.object({
    category_id: z.number().int().nullable().optional(),
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2000),
    amount: z.number().positive()
});

module.exports = {
    budgetSchema
};
