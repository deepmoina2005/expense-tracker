const { z } = require('zod');

const registerSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    currency: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

const updateProfileSchema = z.object({
    full_name: z.string().min(2).optional(),
    currency: z.string().optional(),
    theme: z.enum(['light', 'dark']).optional()
});

const changePasswordSchema = z.object({
    current_password: z.string().min(1),
    new_password: z.string().min(6)
});

module.exports = {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema
};
