import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllDoctorsQuery } from '../../store/services/Admin';
import { useGetAllPatientsAdminQuery } from '../../store/services/Patient';
import { useGetAllAppointmentsQuery } from '../../store/services/AppointmentApi';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  // Fetch data from APIs
  const { data: doctorsData, isLoading: doctorsLoading } = useGetAllDoctorsQuery();
  const { data: patientsData, isLoading: patientsLoading } = useGetAllPatientsAdminQuery();
  const { data: appointmentsData, isLoading: appointmentsLoading } = useGetAllAppointmentsQuery();
 const user = useSelector((state) =>state?.auth?.user?.data)
  // Extract data
  const doctors = doctorsData?.data?.doctors || [];
  const patients = patientsData?.data?.patients || [];
  const appointments = appointmentsData?.data?.appointments || [];

  // Helper function to get time ago (must be before useMemo)
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  // Calculate stats using useMemo for performance
  const stats = useMemo(() => {
    const totalDoctors = doctors.length;
    const totalPatients = patients.length;
    const totalAppointments = appointments.length;
    
    // Active doctors
    const activeDoctors = doctors.filter(doc => doc.userId?.isActive).length;
    
    // Today's appointments
    const today = new Date().toDateString();
    const todayAppointments = appointments.filter(apt => 
      new Date(apt.appointmentDate).toDateString() === today
    ).length;

    // This week's patients (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newPatientsThisWeek = patients.filter(p => 
      new Date(p.createdAt) > weekAgo
    ).length;

    // Appointment completion rate
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const appointmentCompletionRate = totalAppointments > 0 
      ? Math.round((completedAppointments / totalAppointments) * 100)
      : 0;

    // Recent activities (last 10 appointments)
    // Create a copy of array before sorting to avoid mutating Redux state
    const recentActivities = [...appointments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(apt => ({
        id: apt._id,
        action: `Appointment ${apt.status}`,
        patient: apt.patientId?.userId?.name || 'Unknown',
        doctor: apt.doctorId?.userId?.name || 'Unknown',
        time: getTimeAgo(new Date(apt.createdAt)),
        status: apt.status
      }));

    // Status breakdown
    const scheduledCount = appointments.filter(a => a.status === 'scheduled').length;
    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
    const completedCount = appointments.filter(a => a.status === 'completed').length;
    const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;

    return {
      totalDoctors,
      totalPatients,
      totalAppointments,
      activeDoctors,
      todayAppointments,
      newPatientsThisWeek,
      appointmentCompletionRate,
      recentActivities,
      scheduledCount,
      confirmedCount,
      completedCount,
      cancelledCount
    };
  }, [doctors, patients, appointments]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return '📅';
      case 'confirmed': return '✅';
      case 'completed': return '🎉';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  // Loading state
  const isLoading = doctorsLoading || patientsLoading || appointmentsLoading;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👑</h1>
          <p className="text-blue-100">Here's your system overview and management dashboard.</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Doctors */}
          <Link to="/admin/doctors" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Doctors</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalDoctors}</p>
                <p className="text-sm text-green-600 mt-2">
                  ✓ {stats.activeDoctors} active
                </p>
              </div>
              <div className="text-5xl">👨‍⚕️</div>
            </div>
          </Link>
          
          {/* Total Patients */}
          <Link to="/admin/patients" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.totalPatients}</p>
                <p className="text-sm text-blue-600 mt-2">
                  +{stats.newPatientsThisWeek} this week
                </p>
              </div>
              <div className="text-5xl">👥</div>
            </div>
          </Link>
          
          {/* Total Appointments */}
          <Link to="/admin/appointments" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Appointments</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalAppointments}</p>
                <p className="text-sm text-orange-600 mt-2">
                  📍 {stats.todayAppointments} today
                </p>
              </div>
              <div className="text-5xl">📅</div>
            </div>
          </Link>
          
          {/* Completion Rate */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Completion Rate</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.appointmentCompletionRate}%</p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats.completedCount} completed
                </p>
              </div>
              <div className="text-5xl">✅</div>
            </div>
          </div>
        </div>

        {/* Appointment Status Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Status Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-2xl font-bold text-blue-600">{stats.scheduledCount}</div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-2xl font-bold text-purple-600">{stats.confirmedCount}</div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">🎉</div>
              <div className="text-2xl font-bold text-green-600">{stats.completedCount}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl mb-2">❌</div>
              <div className="text-2xl font-bold text-red-600">{stats.cancelledCount}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Management</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link 
                to="/admin/doctors"
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4 text-center hover:from-blue-100 hover:to-blue-200 transition duration-200 transform hover:scale-105"
              >
                <div className="text-blue-600 text-3xl mb-2">👨‍⚕️</div>
                <div className="font-semibold text-blue-900 text-sm">Manage Doctors</div>
                <div className="text-xs text-blue-700 mt-1">{stats.totalDoctors} doctors</div>
              </Link>
              
              <Link 
                to="/admin/patients"
                className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4 text-center hover:from-green-100 hover:to-green-200 transition duration-200 transform hover:scale-105"
              >
                <div className="text-green-600 text-3xl mb-2">👥</div>
                <div className="font-semibold text-green-900 text-sm">Manage Patients</div>
                <div className="text-xs text-green-700 mt-1">{stats.totalPatients} patients</div>
              </Link>
              
              <Link 
                to="/admin/appointments"
                className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4 text-center hover:from-purple-100 hover:to-purple-200 transition duration-200 transform hover:scale-105"
              >
                <div className="text-purple-600 text-3xl mb-2">📅</div>
                <div className="font-semibold text-purple-900 text-sm">All Appointments</div>
                <div className="text-xs text-purple-700 mt-1">{stats.totalAppointments} total</div>
              </Link>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {stats.recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition">
                      <div className="text-2xl flex-shrink-0">{getStatusIcon(activity.status)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {activity.patient} with Dr. {activity.doctor}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No recent activities</p>
              )}
              <div className="mt-4 text-center pt-4 border-t">
                <Link to="/admin/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Activities →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border-2 border-green-200 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-green-600 text-3xl mb-2">🟢</div>
              <div className="font-semibold text-green-900">System Online</div>
              <div className="text-sm text-green-700 mt-1">All services operational</div>
            </div>
            <div className="text-center p-4 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-blue-600 text-3xl mb-2">💾</div>
              <div className="font-semibold text-blue-900">Database</div>
              <div className="text-sm text-blue-700 mt-1">Healthy & Active</div>
            </div>
            <div className="text-center p-4 border-2 border-green-200 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-green-600 text-3xl mb-2">🔐</div>
              <div className="font-semibold text-green-900">Security</div>
              <div className="text-sm text-green-700 mt-1">Protected</div>
            </div>
            <div className="text-center p-4 border-2 border-green-200 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-green-600 text-3xl mb-2">⚡</div>
              <div className="font-semibold text-green-900">Performance</div>
              <div className="text-sm text-green-700 mt-1">Optimal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;