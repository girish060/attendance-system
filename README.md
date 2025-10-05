# Attendance Management System

A modern, responsive web application for managing employee attendance with role-based access control, built with React, TypeScript, and Supabase.

## 🚀 Features

- **User Authentication**: Secure login/signup with email and password
- **Role-based Access**: Admin and user roles with different permissions
- **Attendance Tracking**: Mark daily attendance (present, absent, late, leave)
- **Interactive Dashboard**: View attendance statistics and recent records
- **Advanced Reports**: Filter and export attendance data with search and date filters
- **User Management**: Admins can manage all users (add, edit, delete)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live data synchronization with Supabase

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Row Level Security)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify ready

## 📦 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendance-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Copy your project URL and anon key from Settings > API
   - Create a `.env.local` file in the project root:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run database migrations**
   - Go to your Supabase dashboard > SQL Editor
   - Copy and run the SQL from `supabase/migrations/20251004152535_create_attendance_system_schema.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Demo Setup

### Create Demo Users

You can create demo users through the signup page:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`
- Employee ID: `ADM001`
- Department: `Engineering`
- Role: `Admin`

**Regular User:**
- Email: `user@example.com`  
- Password: `user123`
- Employee ID: `USR001`
- Department: `Engineering`
- Role: `User`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AttendanceMarking.tsx
│   ├── Dashboard.tsx
│   ├── Reports.tsx
│   └── UserManagement.tsx
├── contexts/            # React Context providers
│   └── AuthContext.tsx
├── lib/                 # Utility libraries
│   └── supabase.ts
├── pages/               # Page components
│   ├── LoginPage.tsx
│   └── SignupPage.tsx
└── App.tsx             # Main application component
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automatically

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy automatically

### Manual Deployment

```bash
npm run build
# Upload the dist/ folder to your hosting provider
```

## 📊 Database Schema

### Tables

- **profiles**: User profile information (extends Supabase auth.users)
- **attendance**: Daily attendance records with status tracking
- **departments**: Department master data

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only view/modify their own data (except admins)
- Admins have full access to all data

## 🎨 Customization

### Styling
The app uses Tailwind CSS. Modify `src/index.css` and component classes to customize the appearance.

### Departments
Add more departments by inserting records in the `departments` table or modify the migration file.

### Attendance Status
Current statuses: `present`, `absent`, `late`, `leave`. Modify the database schema and components to add new statuses.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your Supabase configuration
3. Ensure all environment variables are set correctly
4. Check if the database schema has been applied correctly

For more help, please open an issue on GitHub.

## 🎉 Acknowledgments

- Built with React and Supabase
- Icons by Lucide React
- UI components styled with Tailwind CSS