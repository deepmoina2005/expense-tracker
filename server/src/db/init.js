const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/env');

const initializeDatabase = async () => {
    // 1. Create connection without database to create the DB first
    const connection = await mysql.createConnection({
        host: config.DB_HOST,
        user: config.DB_USER,
        password: config.DB_PASS,
        multipleStatements: true // Essential for running full schema files
    });

    try {
        console.log('🛠️  Initializing Database...');
        
        // 2. Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.DB_NAME}\`;`);
        await connection.query(`USE \`${config.DB_NAME}\`;`);

        // 3. Check if tables exist (check users table as proxy)
        const [tables] = await connection.query(`SHOW TABLES LIKE 'users'`);
        
        if (tables.length === 0) {
            console.log('📜 Empty database detected. Running schema.sql...');
            const schemaPath = path.join(__dirname, 'schema.sql');
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await connection.query(schemaSql);
            console.log('✅ Schema imported successfully.');

            console.log('🌱 Seeding default data...');
            const seedPath = path.join(__dirname, 'seed.sql');
            const seedSql = fs.readFileSync(seedPath, 'utf8');
            await connection.query(seedSql);
            console.log('✅ Seed data imported successfully.');
        } else {
            console.log('ℹ️  Database already initialized. Skipping schema import.');
        }

    } catch (error) {
        console.error('❌ Database Initialization Failed:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
};

module.exports = { initializeDatabase };