-- Quick script to populate departments table
-- Run this in your Supabase SQL Editor if departments are missing

-- Insert default departments (will skip if they already exist)
INSERT INTO departments (name) VALUES
  ('Engineering'),
  ('Human Resources'),
  ('Sales'),
  ('Marketing'),
  ('Finance'),
  ('Operations')
ON CONFLICT (name) DO NOTHING;

-- Verify departments were inserted
SELECT * FROM departments ORDER BY name;





