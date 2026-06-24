const { z } = require('zod');

const transactionSchema = z.object({
    category_id: z.number().int(),
    type: z.enum(['income', 'expense']),
    amount: z.number().positive(),
    title: z.string().min(2),
    note: z.string().optional(),
    payment_method: z.string().optional(),
    transaction_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    is_recurring: z.boolean().optional(),
    recurring_type: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional().nullable(),
    recurring_interval: z.number().int().min(1).optional()
}).refine(data => {
    if (data.is_recurring && !data.recurring_type) {
        return false;
    }
    return true;
}, {
    message: "recurring_type is required if is_recurring is true",
    path: ["recurring_type"]
});

module.exports = {
    transactionSchema
};