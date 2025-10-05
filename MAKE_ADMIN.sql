-- Make a user an admin
-- Replace 'your-email@example.com' with the email you signed up with

-- First, find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then update the profile to make them admin
-- Replace 'USER_ID_HERE' with the ID from above query
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'USER_ID_HERE';

-- Verify the change
SELECT email, role FROM profiles WHERE email = 'your-email@example.com';





