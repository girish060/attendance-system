import { useState, useEffect, useCallback } from 'react';
import { supabase, Attendance, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Download, Filter, Search } from 'lucide-react';

type AttendanceWithUser = Attendance & {
  user: Profile;
};

type ViewType = 'daily' | 'weekly' | 'monthly';

export default function Reports() {
  const { profile, isAdmin } = useAuth();
  const [attendances, setAttendances] = useState<AttendanceWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<ViewType>('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    updateDateRange(viewType);
    loadDepartments();
  }, [viewType]);

  const loadDepartments = async () => {
    const { data } = await supabase.from('departments').select('name').order('name');
    if (data) {
      setDepartments(data.map((d) => d.name));
    }
  };

  const updateDateRange = (type: ViewType) => {
    const today = new Date();
    let start = new Date();

    switch (type) {
      case 'daily':
        start = today;
        break;
      case 'weekly':
        start = new Date(today.setDate(today.getDate() - 7));
        break;
      case 'monthly':
        start = new Date(today.setMonth(today.getMonth() - 1));
        break;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
  };

  const loadAttendance = useCallback(async () => {
    if (!profile) return;

    setLoading(true);

    let query = supabase
      .from('attendance')
      .select(`
        *,
        user:profiles!attendance_user_id_fkey(*)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })
      .order('check_in_time', { ascending: false });

    if (!isAdmin) {
      query = query.eq('user_id', profile.id);
    }

    const { data, error } = await query;

    if (!error && data) {
      setAttendances(data as AttendanceWithUser[]);
    }
    setLoading(false);
  }, [profile, isAdmin, startDate, endDate]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const exportToCSV = () => {
    const filtered = getFilteredAttendances();
    const headers = ['Date', 'Employee ID', 'Name', 'Department', 'Status', 'Check-in Time', 'Notes'];
    const rows = filtered.map((att) => [
      att.date,
      att.user.employee_id,
      att.user.full_name,
      att.user.department,
      att.status,
      new Date(att.check_in_time).toLocaleString(),
      att.notes,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  const getFilteredAttendances = () => {
    return attendances.filter((att) => {
      const matchesSearch =
        att.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.user.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || att.status === statusFilter;
      const matchesDepartment =
        departmentFilter === 'all' || att.user.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  };

  const getAttendanceSummary = () => {
    const filtered = getFilteredAttendances();
    return {
      total: filtered.length,
      present: filtered.filter((a) => a.status === 'present').length,
      late: filtered.filter((a) => a.status === 'late').length,
      absent: filtered.filter((a) => a.status === 'absent').length,
      leave: filtered.filter((a) => a.status === 'leave').length,
    };
  };

  const summary = getAttendanceSummary();
  const filteredAttendances = getFilteredAttendances();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Attendance Reports</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm font-medium">Present</p>
            <p className="text-3xl font-bold text-green-700">{summary.present}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-600 text-sm font-medium">Late</p>
            <p className="text-3xl font-bold text-yellow-700">{summary.late}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm font-medium">On Leave</p>
            <p className="text-3xl font-bold text-blue-700">{summary.leave}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600 text-sm font-medium">Absent</p>
            <p className="text-3xl font-bold text-red-700">{summary.absent}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as ViewType)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="w-4 h-4 inline mr-1" />
              Search
            </label>
            <input
              type="text"
              placeholder="Name or Employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter className="w-4 h-4 inline mr-1" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="leave">On Leave</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                {isAdmin && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                  </>
                )}
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
              {filteredAttendances.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(attendance.date).toLocaleDateString()}
                  </td>
                  {isAdmin && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {attendance.user.employee_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attendance.user.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendance.user.department}
                      </td>
                    </>
                  )}
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

        {filteredAttendances.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No attendance records found for the selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
