import { useState, useEffect, useCallback } from 'react';
import { supabase, Attendance } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Clock, Briefcase, Calendar } from 'lucide-react';

export default function AttendanceMarking() {
  const { profile } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [notes, setNotes] = useState('');

  const loadTodayAttendance = useCallback(async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', profile.id)
        .eq('date', today)
        .maybeSingle();

      if (error) {
        console.error('Error loading today\'s attendance:', error);
        return;
      }

      if (data) {
        setTodayAttendance(data);
        setNotes(data.notes);
      }
    } catch (error) {
      console.error('Unexpected error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadTodayAttendance();
  }, [profile, loadTodayAttendance]);

  const markAttendance = async (status: 'present' | 'absent' | 'late' | 'leave') => {
    if (!profile) return;

    setMarking(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      if (todayAttendance) {
        const { error } = await supabase
          .from('attendance')
          .update({
            status,
            notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', todayAttendance.id);

        if (error) {
          console.error('Error updating attendance:', error);
          return;
        }

        loadTodayAttendance();
      } else {
        const { error } = await supabase.from('attendance').insert({
          user_id: profile.id,
          date: today,
          status,
          notes,
          marked_by: profile.id,
          check_in_time: new Date().toISOString(),
        });

        if (error) {
          console.error('Error inserting attendance:', error);
          return;
        }

        loadTodayAttendance();
      }
    } catch (error) {
      console.error('Unexpected error marking attendance:', error);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const statusConfig = {
    present: {
      icon: CheckCircle,
      color: 'bg-green-500',
      text: 'Present',
      hoverColor: 'hover:bg-green-600',
    },
    late: {
      icon: Clock,
      color: 'bg-yellow-500',
      text: 'Late',
      hoverColor: 'hover:bg-yellow-600',
    },
    leave: {
      icon: Briefcase,
      color: 'bg-blue-500',
      text: 'On Leave',
      hoverColor: 'hover:bg-blue-600',
    },
    absent: {
      icon: XCircle,
      color: 'bg-red-500',
      text: 'Absent',
      hoverColor: 'hover:bg-red-600',
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mark Today's Attendance</h2>
            <p className="text-gray-600">{new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>

        {todayAttendance && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Current Status:</strong> {statusConfig[todayAttendance.status].text}
              <span className="ml-4">
                <strong>Marked at:</strong>{' '}
                {new Date(todayAttendance.check_in_time).toLocaleTimeString()}
              </span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
            const config = statusConfig[status];
            const Icon = config.icon;
            const isSelected = todayAttendance?.status === status;

            return (
              <button
                key={status}
                onClick={() => markAttendance(status)}
                disabled={marking}
                className={`${config.color} ${config.hoverColor} text-white p-6 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected ? 'ring-4 ring-offset-2 ring-blue-400' : ''
                }`}
              >
                <Icon className="w-12 h-12 mx-auto mb-2" />
                <p className="font-semibold text-lg">{config.text}</p>
              </button>
            );
          })}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add any additional notes about your attendance..."
          />
        </div>

        {todayAttendance && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Today's Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium">{statusConfig[todayAttendance.status].text}</span>
              </div>
              <div>
                <span className="text-gray-600">Check-in Time:</span>
                <span className="ml-2 font-medium">
                  {new Date(todayAttendance.check_in_time).toLocaleTimeString()}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Notes:</span>
                <span className="ml-2 font-medium">{todayAttendance.notes || 'None'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
