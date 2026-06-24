const mysql = require('mysql2/promise');
require('dotenv').config();

const migrate = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'finance_tracker'
  });

  try {
    console.log('Adding missing columns to user_preferences...');
    
    // MySQL 8.0.19+ supports IF NOT EXISTS for ADD COLUMN, but for compatibility 
    // we can try-catch or check columns first. Let's check first.
    const [cols] = await connection.query('SHOW COLUMNS FROM user_preferences');
    const existingCols = cols.map(c => c.Field);
    
    if (!existingCols.includes('currency')) {
      await connection.query("ALTER TABLE user_preferences ADD COLUMN currency VARCHAR(10) DEFAULT '$'");
      console.log('Added currency column');
    }
    
    if (!existingCols.includes('language')) {
      await connection.query("ALTER TABLE user_preferences ADD COLUMN language VARCHAR(10) DEFAULT 'en'");
      console.log('Added language column');
    }

    console.log('✅ Migration complete');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await connection.end();
  }
};

migrate();
