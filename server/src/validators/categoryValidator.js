const { z } = require('zod');

const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    type: z.enum(['income', 'expense']),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
    icon: z.string().optional()
});

module.exports = {
    categorySchema
};
