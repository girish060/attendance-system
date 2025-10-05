import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './components/Dashboard';
import AttendanceMarking from './components/AttendanceMarking';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

type Tab = 'dashboard' | 'attendance' | 'reports' | 'users';

function MainApp() {
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showAuthPage, setShowAuthPage] = useState<'login' | 'signup'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (showAuthPage === 'login') {
      return <LoginPage onSwitchToSignup={() => setShowAuthPage('signup')} />;
    } else {
      return <SignupPage onSwitchToLogin={() => setShowAuthPage('login')} />;
    }
  }

  const tabs = [
    { id: 'dashboard' as Tab, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance' as Tab, name: 'Mark Attendance', icon: ClipboardCheck },
    { id: 'reports' as Tab, name: 'Reports', icon: BarChart3 },
    ...(isAdmin ? [{ id: 'users' as Tab, name: 'Manage Users', icon: Users }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ClipboardCheck className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Attendance Management</h1>
                <p className="text-xs text-gray-500">{profile?.department}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right mr-4">
                <p className="text-sm font-semibold text-gray-900">{profile?.full_name}</p>
                <p className="text-xs text-gray-500">
                  {profile?.employee_id} • {isAdmin ? 'Admin' : 'User'}
                </p>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold text-gray-900">{profile?.full_name}</p>
              <p className="text-xs text-gray-500">
                {profile?.employee_id} • {isAdmin ? 'Admin' : 'User'}
              </p>
            </div>
            <div className="flex flex-col">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 text-left transition ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                );
              })}
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="flex max-w-7xl mx-auto">
        <aside className="hidden md:block w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'attendance' && <AttendanceMarking />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'users' && isAdmin && <UserManagement />}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
