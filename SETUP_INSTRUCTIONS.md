# Attendance Management System Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Copy your project URL and anon key from Settings > API
   - Create a `.env.local` file in the project root with:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Run Database Migration**
   - Go to your Supabase dashboard > SQL Editor
   - Copy and run the SQL from `supabase/migrations/20251004152535_create_attendance_system_schema.sql`

4. **Create Demo Users** (Optional)
   - Go to Authentication > Users in Supabase dashboard
   - Create admin user: admin@example.com / admin123
   - Create regular user: user@example.com / user123
   - Or run the SQL from `init-demo-users.sql`

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Features

- **User Authentication**: Login/signup with email and password
- **Role-based Access**: Admin and user roles with different permissions
- **Attendance Tracking**: Mark daily attendance (present, absent, late, leave)
- **Dashboard**: View attendance statistics and recent records
- **Reports**: Filter and export attendance data
- **User Management**: Admins can manage all users (add, edit, delete)

## Demo Credentials

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Deploy to Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy automatically

## Environment Variables

Create a `.env.local` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The system uses the following main tables:
- `profiles`: User profile information
- `attendance`: Daily attendance records
- `departments`: Department master data

Row Level Security (RLS) is enabled for data protection.
