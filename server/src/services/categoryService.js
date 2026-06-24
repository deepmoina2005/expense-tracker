const pool = require('../db/pool');
const activityLogService = require('./activityLogService');

class CategoryService {
    async getAllCategories(userId) {
        // Get system defaults and user-specific categories
        const [categories] = await pool.execute(
            'SELECT * FROM categories WHERE user_id IS NULL OR user_id = ? ORDER BY name ASC',
            [userId]
        );
        return categories;
    }

    async createCategory(userId, { name, type, color, icon }) {
        const [result] = await pool.execute(
            'INSERT INTO categories (user_id, name, type, color, icon, is_default) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, name, type, color || '#000000', icon || 'Tag', false]
        );
        
        await activityLogService.logAction(userId, 'CREATE', 'category', result.insertId, `Created category: ${name}`);
        
        return { id: result.insertId, user_id: userId, name, type, color, icon, is_default: false };
    }

    async deleteCategory(userId, categoryId) {
        // Check if category exists and belongs to user (cannot delete default categories)
        const [categories] = await pool.execute(
            'SELECT * FROM categories WHERE id = ? AND user_id = ?',
            [categoryId, userId]
        );

        if (categories.length === 0) {
            const err = new Error('Category not found or cannot be deleted');
            err.statusCode = 404;
            throw err;
        }

        await pool.execute('DELETE FROM categories WHERE id = ?', [categoryId]);
        await activityLogService.logAction(userId, 'DELETE', 'category', categoryId, `Deleted category id: ${categoryId}`);
        return { success: true };
    }
}

module.exports = new CategoryService();
