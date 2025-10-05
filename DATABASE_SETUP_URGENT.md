# 🚨 URGENT: Database Setup Required

## ❌ **Current Error:**
- 500 error from Supabase
- "Cannot access 'loadDashboardData' before initialization"
- Database schema not set up

## ✅ **Quick Fix Steps:**

### **1. Set Up Database Schema (CRITICAL)**
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste this entire SQL script:

```sql
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

-- Basic RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own attendance" ON attendance FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own attendance" ON attendance FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "All users can view departments" ON departments FOR SELECT USING (true);
```

5. Click **Run** to execute the SQL

### **2. Test the App Again**
After running the SQL:
1. Refresh your browser at `http://localhost:5175/`
2. Try signing up with a new account
3. The errors should be resolved!

## 🔧 **What This Fixes:**
- ✅ Creates all required database tables
- ✅ Sets up proper relationships
- ✅ Adds default departments
- ✅ Enables Row Level Security
- ✅ Fixes the React Hook errors

**Run the SQL script in Supabase and your app will work perfectly!** 🎉





