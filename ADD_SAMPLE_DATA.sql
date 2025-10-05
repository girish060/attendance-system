-- Add sample attendance data
-- Run this after making yourself admin

-- First, get your user ID (replace with your actual email)
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Then add some sample attendance records
-- Replace 'YOUR_USER_ID' with your actual user ID

INSERT INTO attendance (user_id, date, status, notes, marked_by) VALUES
  ('YOUR_USER_ID', CURRENT_DATE, 'present', 'On time today', 'YOUR_USER_ID'),
  ('YOUR_USER_ID', CURRENT_DATE - INTERVAL '1 day', 'present', 'Regular check-in', 'YOUR_USER_ID'),
  ('YOUR_USER_ID', CURRENT_DATE - INTERVAL '2 days', 'late', 'Traffic delay', 'YOUR_USER_ID'),
  ('YOUR_USER_ID', CURRENT_DATE - INTERVAL '3 days', 'present', '', 'YOUR_USER_ID'),
  ('YOUR_USER_ID', CURRENT_DATE - INTERVAL '4 days', 'leave', 'Sick leave', 'YOUR_USER_ID'),
  ('YOUR_USER_ID', CURRENT_DATE - INTERVAL '5 days', 'present', 'Back from leave', 'YOUR_USER_ID');

-- Verify the data was added
SELECT date, status, notes FROM attendance ORDER BY date DESC;
