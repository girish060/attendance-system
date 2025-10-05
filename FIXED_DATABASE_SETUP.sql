-- Fixed Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  department text,
  employee_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'leave')),
  check_in_time timestamptz DEFAULT now(),
  notes text DEFAULT '',
  marked_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Insert default departments
INSERT INTO departments (name) VALUES
  ('Engineering'),
  ('Human Resources'),
  ('Sales'),
  ('Marketing'),
  ('Finance'),
  ('Operations')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for attendance
CREATE POLICY "Users can view own attendance" 
  ON attendance FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own attendance" 
  ON attendance FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own attendance" 
  ON attendance FOR UPDATE 
  USING (user_id = auth.uid());

-- Create RLS policies for departments
CREATE POLICY "All users can view departments" 
  ON departments FOR SELECT 
  USING (true);

-- Verify tables were created
SELECT 'departments' as table_name, count(*) as row_count FROM departments
UNION ALL
SELECT 'profiles' as table_name, count(*) as row_count FROM profiles
UNION ALL
SELECT 'attendance' as table_name, count(*) as row_count FROM attendance;
