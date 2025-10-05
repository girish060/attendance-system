-- SIMPLE Database Setup - Run this in Supabase SQL Editor
-- This will create the basic tables needed for the app to work

-- Step 1: Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Step 2: Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  department text,
  employee_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 3: Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL,
  check_in_time timestamptz DEFAULT now(),
  notes text DEFAULT '',
  marked_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 4: Insert default departments
INSERT INTO departments (name) VALUES
  ('Engineering'),
  ('Human Resources'),
  ('Sales'),
  ('Marketing'),
  ('Finance'),
  ('Operations')
ON CONFLICT (name) DO NOTHING;

-- Step 5: Enable Row Level Security (simplified)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Step 6: Create basic policies
CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_policy" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update_policy" ON profiles FOR UPDATE USING (true);

CREATE POLICY "attendance_select_policy" ON attendance FOR SELECT USING (true);
CREATE POLICY "attendance_insert_policy" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "attendance_update_policy" ON attendance FOR UPDATE USING (true);

CREATE POLICY "departments_select_policy" ON departments FOR SELECT USING (true);

-- Step 7: Verify everything was created
SELECT 'Setup complete!' as status;
