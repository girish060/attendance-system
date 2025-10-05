import { useState, useEffect, useCallback } from 'react';
import { supabase, Attendance } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, TrendingUp, Calendar as CalendarIcon, Award } from 'lucide-react';

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    lateDays: 0,
    leaveDays: 0,
    absentDays: 0,
    attendanceRate: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!profile) return;

    setLoading(true);

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];

      let query = supabase
        .from('attendance')
        .select('*')
        .gte('date', startDate)
        .order('date', { ascending: false });

      if (!isAdmin) {
        query = query.eq('user_id', profile.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setRecentAttendance(data.slice(0, 10));

        const present = data.filter((a) => a.status === 'present').length;
        const late = data.filter((a) => a.status === 'late').length;
        const leave = data.filter((a) => a.status === 'leave').length;
        const absent = data.filter((a) => a.status === 'absent').length;
        const total = data.length;
        const rate = total > 0 ? ((present + late) / total) * 100 : 0;

        setStats({
          totalDays: total,
          presentDays: present,
          lateDays: late,
          leaveDays: leave,
          absentDays: absent,
          attendanceRate: Math.round(rate),
        });
      }
    } catch (error) {
      console.error('Unexpected error loading dashboard:', error);
    }

    setLoading(false);
  }, [profile, isAdmin]);

  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
  }, [profile, loadDashboardData]);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name}!</h1>
        <p className="text-blue-100">Here's your attendance overview for the last 30 days</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{stats.attendanceRate}%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Attendance Rate</h3>
          <p className="text-gray-500 text-xs mt-1">Last 30 days</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">{stats.presentDays}</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Days Present</h3>
          <p className="text-gray-500 text-xs mt-1">Out of {stats.totalDays} days</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-yellow-600">{stats.lateDays}</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Late Arrivals</h3>
          <p className="text-gray-500 text-xs mt-1">Last 30 days</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-red-600">{stats.absentDays}</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Days Absent</h3>
          <p className="text-gray-500 text-xs mt-1">Last 30 days</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Attendance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAttendance.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(attendance.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        attendance.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : attendance.status === 'late'
                          ? 'bg-yellow-100 text-yellow-800'
                          : attendance.status === 'leave'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {attendance.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(attendance.check_in_time).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {attendance.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentAttendance.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No attendance records yet. Start marking your attendance!</p>
          </div>
        )}
      </div>
    </div>
  );
}
