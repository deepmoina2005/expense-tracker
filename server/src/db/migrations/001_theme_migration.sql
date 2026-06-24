-- v:/Expense Tracking System/server/src/db/migrations/001_theme_migration.sql

-- Step 1: Add row to user_preferences
-- Ignoring IF NOT EXISTS because older MySQL versions crash on it. We'll handle it inside JS gracefully if it exists.
ALTER TABLE user_preferences ADD COLUMN theme VARCHAR(10) DEFAULT 'light';

-- Step 2: Create preference row for any user missing one
INSERT INTO user_preferences (user_id, email_notifications, budget_alerts, reminder_enabled, theme)
SELECT id, 1, 1, 1, 'light'
FROM users
WHERE id NOT IN (SELECT user_id FROM user_preferences);

-- Step 3: Copy existing theme configuration from users safely
UPDATE user_preferences up
JOIN users u ON up.user_id = u.id
SET up.theme = IFNULL(u.theme, 'light')
WHERE u.theme IS NOT NULL;
