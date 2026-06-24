const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

class AuthService {
    async createUser({ full_name, email, password, currency }) {
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insert user
            const [result] = await connection.execute(
                'INSERT INTO users (full_name, email, password_hash, currency) VALUES (?, ?, ?, ?)',
                [full_name, email, hashed_password, currency || 'USD']
            );

            const userId = result.insertId;

            // 2. Initialize preferences
            await connection.execute(
                'INSERT INTO user_preferences (user_id) VALUES (?)',
                [userId]
            );

            await connection.commit();

            return { id: userId, full_name, email, currency };
        } catch (error) {
            await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                const err = new Error('User already exists with this email');
                err.statusCode = 400;
                throw err;
            }
            throw error;
        } finally {
            connection.release();
        }
    }

    async loginUser(email, password) {
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        const user = users[0];
        if (!user) {
            const err = new Error('Invalid credentials');
            err.statusCode = 401;
            throw err;
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            const err = new Error('Invalid credentials');
            err.statusCode = 401;
            throw err;
        }

        const token = this.generateToken(user.id);
        
        return {
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                currency: user.currency,
                theme: user.theme
            }
        };
    }

    async getUserProfile(userId) {
        const [users] = await pool.execute(
            'SELECT id, full_name, email, currency, theme, created_at FROM users WHERE id = ?',
            [userId]
        );

        const user = users[0];
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }

        const [preferences] = await pool.execute(
            'SELECT dashboard_layout_json, email_notifications, budget_alerts, reminder_enabled FROM user_preferences WHERE user_id = ?',
            [userId]
        );

        return {
            ...user,
            preferences: preferences[0] || {}
        };
    }

    async updateProfile(userId, updates) {
        const fields = [];
        const values = [];

        if (updates.full_name) {
            fields.push('full_name = ?');
            values.push(updates.full_name);
        }
        if (updates.currency) {
            fields.push('currency = ?');
            values.push(updates.currency);
        }
        if (updates.theme) {
            fields.push('theme = ?');
            values.push(updates.theme);
        }

        if (fields.length === 0) return this.getUserProfile(userId);

        values.push(userId);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

        await pool.execute(query, values);
        return this.getUserProfile(userId);
    }

    generateToken(id) {
        return jwt.sign({ id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRE
        });
    }
}

module.exports = new AuthService();
