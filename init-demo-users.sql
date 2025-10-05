-- This SQL script creates demo users for the attendance system
-- Run this in the Supabase SQL Editor after the migration is complete

-- Note: These users need to be created through Supabase Auth first
-- You can use the signup page or run these manually:

-- Demo Admin User
-- Email: admin@example.com
-- Password: admin123
-- Will need to be added manually through signup with admin role

-- Demo Regular User
-- Email: user@example.com
-- Password: user123
-- Will need to be added manually through signup

-- After creating the users through the application, you can insert sample attendance data:

-- Sample attendance data (uncomment and adjust user_ids after creating users)
/*
INSERT INTO attendance (user_id, date, status, notes, marked_by) VALUES
  ('<user-id-here>', CURRENT_DATE, 'present', 'On time', '<user-id-here>'),
  ('<user-id-here>', CURRENT_DATE - INTERVAL '1 day', 'present', 'Regular check-in', '<user-id-here>'),
  ('<user-id-here>', CURRENT_DATE - INTERVAL '2 days', 'late', 'Traffic delay', '<user-id-here>'),
  ('<user-id-here>', CURRENT_DATE - INTERVAL '3 days', 'present', '', '<user-id-here>'),
  ('<user-id-here>', CURRENT_DATE - INTERVAL '4 days', 'leave', 'Sick leave', '<user-id-here>');
*/
