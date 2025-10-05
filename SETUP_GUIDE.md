# Quick Setup Guide

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Database is Ready
The database schema has already been applied with:
- User profiles table
- Attendance records table
- Departments table
- Row Level Security policies
- Default departments

### 3. Create Your First Admin User

**Option A: Through the Application (Recommended)**

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 in your browser

3. Click "Sign up" and create an account with:
   - Full Name: Admin User
   - Email: admin@example.com
   - Employee ID: EMP001
   - Department: Human Resources
   - Password: admin123

4. After signing up, update the user's role to admin:
   - Go to Supabase Dashboard
   - Navigate to: Table Editor > profiles
   - Find your user and change role from 'user' to 'admin'
   - Logout and login again

**Option B: Using Supabase SQL Editor**

1. Go to Supabase Dashboard > SQL Editor

2. Run this SQL to create an admin user:
   ```sql
   -- First, create the auth user (this needs to be done via Supabase Auth UI or signup page)
   -- Then update their role:
   UPDATE profiles
   SET role = 'admin'
   WHERE email = 'your-email@example.com';
   ```

### 4. Create Additional Users

As an admin, you can now:
1. Login with your admin account
2. Navigate to "Manage Users"
3. Click "Add User"
4. Fill in the details and create users

### 5. Start Using the System

**For Users:**
- Login with your credentials
- Mark attendance from the "Mark Attendance" tab
- View your stats on the Dashboard
- Check your history in Reports

**For Admins:**
- All user features plus:
- Manage users (add, edit, delete)
- View all employees' attendance
- Generate comprehensive reports
- Export data to CSV

## Features Overview

### Authentication
- Email/password login
- Secure session management
- Role-based access (Admin/User)

### Attendance Marking
- 4 status types: Present, Late, Leave, Absent
- Auto timestamp on marking
- Optional notes field
- Update same-day attendance

### Dashboard
- 30-day attendance overview
- Attendance rate calculation
- Recent attendance history
- Visual statistics

### Reports
- Daily/Weekly/Monthly views
- Search by name or employee ID
- Filter by status and department
- Date range selection
- Export to CSV

### User Management (Admin Only)
- Add/Edit/Delete users
- Assign roles
- Search and filter users
- Manage departments

## Troubleshooting

### "Cannot view attendance records"
- Ensure you're logged in
- Check that your profile exists in the profiles table
- Verify RLS policies are enabled

### "Admin features not showing"
- Logout and login again
- Check your role in the profiles table
- Should be 'admin', not 'user'

### "Cannot create users"
- Only admins can create users
- Verify you're logged in as admin
- Check console for error messages

## Next Steps

1. Create test users
2. Mark some attendance records
3. Explore the reports
4. Try exporting data to CSV
5. Customize as needed

## Default Departments

The system comes with these pre-loaded departments:
- Engineering
- Human Resources
- Sales
- Marketing
- Finance
- Operations

You can add more through the Supabase dashboard.

## Security Notes

- All passwords are encrypted
- Row Level Security is enabled
- Users can only see their own data
- Admins can see all data
- Session tokens are secure

## Need Help?

Check the main README.md for:
- Full documentation
- Database schema details
- API information
- Advanced features
- Troubleshooting guide
