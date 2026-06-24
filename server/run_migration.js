require('dotenv').config();
const fs = require('fs');
const pool = require('./src/db/pool');

async function migrate() {
  try {
    const [cols] = await pool.execute("SHOW COLUMNS FROM user_preferences LIKE 'theme'");
    if (cols.length === 0) {
       console.log('Adding theme column...');
       await pool.execute("ALTER TABLE user_preferences ADD COLUMN theme VARCHAR(10) DEFAULT 'light'");
    } else {
       console.log('Theme column already exists.');
    }

    console.log('Populating missing preferences...');
    await pool.execute(`
      INSERT INTO user_preferences (user_id, email_notifications, budget_alerts, reminder_enabled, theme)
      SELECT id, 1, 1, 1, 'light'
      FROM users
      WHERE id NOT IN (SELECT user_id FROM user_preferences)
    `);

    console.log('Migrating theme values from users table...');
    await pool.execute(`
      UPDATE user_preferences up
      JOIN users u ON up.user_id = u.id
      SET up.theme = IFNULL(u.theme, 'light')
    `);
    
    console.log('Migration successful.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}
migrate();
