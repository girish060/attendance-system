-- QUICK SETUP SCRIPT
-- Run this step by step in Supabase SQL Editor

-- Step 1: Find your user ID (replace with your email)
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Step 2: Make yourself admin (replace USER_ID with the ID from step 1)
UPDATE profiles SET role = 'admin' WHERE id = 'USER_ID_FROM_STEP_1';

-- Step 3: Add sample attendance data (replace USER_ID with the same ID)
INSERT INTO attendance (user_id, date, status, notes, marked_by) VALUES
  ('USER_ID_FROM_STEP_1', CURRENT_DATE, 'present', 'On time today', 'USER_ID_FROM_STEP_1'),
  ('USER_ID_FROM_STEP_1', CURRENT_DATE - INTERVAL '1 day', 'present', 'Regular check-in', 'USER_ID_FROM_STEP_1'),
  ('USER_ID_FROM_STEP_1', CURRENT_DATE - INTERVAL '2 days', 'late', 'Traffic delay', 'USER_ID_FROM_STEP_1'),
  ('USER_ID_FROM_STEP_1', CURRENT_DATE - INTERVAL '3 days', 'present', '', 'USER_ID_FROM_STEP_1'),
  ('USER_ID_FROM_STEP_1', CURRENT_DATE - INTERVAL '4 days', 'leave', 'Sick leave', 'USER_ID_FROM_STEP_1');

-- Step 4: Verify everything worked
SELECT 'Setup complete!' as status;
SELECT email, role FROM profiles WHERE role = 'admin';
SELECT COUNT(*) as attendance_records FROM attendance;
