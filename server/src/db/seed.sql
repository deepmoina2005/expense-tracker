-- Default Categories for all users
USE finance_tracker;

-- Income Categories
INSERT INTO categories (name, type, color, icon, is_default) VALUES
('Salary', 'income', '#10B981', 'Briefcase', TRUE),
('Freelance', 'income', '#3B82F6', 'Laptop', TRUE),
('Investment', 'income', '#8B5CF6', 'TrendingUp', TRUE),
('Gift', 'income', '#F59E0B', 'Gift', TRUE),
('Other Income', 'income', '#6B7280', 'PlusCircle', TRUE);

-- Expense Categories
INSERT INTO categories (name, type, color, icon, is_default) VALUES
('Food & Dining', 'expense', '#EF4444', 'Utensils', TRUE),
('Transportation', 'expense', '#F59E0B', 'Car', TRUE),
('Shopping', 'expense', '#EC4899', 'ShoppingBag', TRUE),
('Utilities', 'expense', '#06B6D4', 'Zap', TRUE),
('Rent/Mortgage', 'expense', '#6366F1', 'Home', TRUE),
('Entertainment', 'expense', '#F97316', 'Film', TRUE),
('Health & Wellness', 'expense', '#10B981', 'Heart', TRUE),
('Education', 'expense', '#3B82F6', 'BookOpen', TRUE),
('Travel', 'expense', '#8B5CF6', 'Plane', TRUE),
('Insurance', 'expense', '#6B7280', 'ShieldCheck', TRUE),
('Other Expense', 'expense', '#4B5563', 'HelpCircle', TRUE);
