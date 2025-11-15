import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetDoctorProfileQuery } from '../../store/services/DoctorApi';
import { useGetDoctorAppointmentsQuery } from '../../store/services/AppointmentApi';

const DoctorDashboard = () => {
  // --- API Hooks ---
  const { data: appointmentsData, isLoading: appointmentsLoading } = useGetDoctorAppointmentsQuery();
  const { data: profileData, isLoading: profileLoading } = useGetDoctorProfileQuery();

  const formatAppointmentTime = (timeString) => {
    return timeString;
  };
  
  const isToday = (appointmentDateString) => {
   
    const today = new Date();
    const appointmentDate = new Date(appointmentDateString.split('T')[0]); 

    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());

    return todayDateOnly.getTime() === appointmentDateOnly.getTime();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled':
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartConsultation = (appointmentId, patientId) => {
    console.log('Starting consultation for:', appointmentId, patientId);
  };


  const { todaySchedule, stats } = useMemo(() => {
    if (appointmentsLoading || !appointmentsData?.data?.appointments) {
      return { todaySchedule: [], stats: {} };
    }

    const allAppointments = appointmentsData.data.appointments;
    const todayAppointmentsList = [];
    let completedTodayCount = 0;

    allAppointments.forEach(app => {
      // Logic uses the (currently modified) isToday function
      if (isToday(app.appointmentDate)) { 
        todayAppointmentsList.push({
          id: app._id,
          // Extracting Patient Name: patientId -> userId -> name
          patientName: app.patientId?.userId?.name || 'Unknown Patient', 
          time: formatAppointmentTime(app.appointmentTime),
          status: app.status.toLowerCase(),
          reason: app.reason || 'N/A', 
          patientId: app.patientId?._id,
        });

        if (app.status.toLowerCase() === 'completed') {
          completedTodayCount++;
        }
      }
    });
    
    // Calculate total unique patients and overall pending appointments
    const uniquePatientIds = new Set(allAppointments.map(app => app.patientId?._id).filter(id => id));
    
    const pendingAppointmentsCount = allAppointments.filter(app => 
      app.status.toLowerCase() !== 'completed' && app.status.toLowerCase() !== 'cancelled'
    ).length;

    const dashboardStats = {
      todayAppointments: todayAppointmentsList.length,
      completedToday: completedTodayCount,
      pendingAppointments: pendingAppointmentsCount,
      totalPatients: uniquePatientIds.size,
    };

    return { todaySchedule: todayAppointmentsList, stats: dashboardStats };

  }, [appointmentsData, appointmentsLoading]);

  // --- Dummy Recent Activities ---
  const recentActivities = [
    { id: 1, action: 'Medical record updated', patient: 'Fatima Khan', time: '5 minutes ago' },
    { id: 2, action: 'New appointment scheduled', patient: 'Ali Raza', time: '1 hour ago' },
    { id: 3, action: 'Profile updated', patient: 'Self', time: '1 day ago' }
  ];

  // --- Loading State ---
  if (appointmentsLoading || profileLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for doctor's name
  const doctorName = profileData?.data?.userId?.name || 'Doctor';

  // --- Main Render ---
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {doctorName}! 👨‍⚕️</h1>
          <p className="text-gray-600">Here's your schedule and practice overview for today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.todayAppointments || 0}</div>
            <div className="text-gray-600 font-medium">Today's Appointments</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.completedToday || 0}</div>
            <div className="text-gray-600 font-medium">Completed Today</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-orange-600 mb-1">{stats.pendingAppointments || 0}</div>
            <div className="text-gray-600 font-medium">Pending Appointments (Overall)</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-2xl font-bold text-purple-600 mb-1">{stats.totalPatients || 0}</div>
            <div className="text-gray-600 font-medium">Total Unique Patients</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {todaySchedule.length > 0 ? (
                  todaySchedule.map(appointment => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-4">🕒 {appointment.time}</span>
                          <span>📋 {appointment.reason}</span> 
                        </div>
                      </div>
                      {/* Show 'Start' button only for scheduled appointments today */}
                      {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStartConsultation(appointment.id, appointment.patientId)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition duration-200 ml-4"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No appointments scheduled for today.</p>
                )}
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/doctor/appointments"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All Appointments →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activities */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/doctor/appointments"
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center hover:bg-blue-100 transition duration-200"
                >
                  <div className="text-blue-600 text-lg mb-2">📅</div>
                  <div className="font-medium text-blue-900 text-sm">Manage Appointments</div>
                </Link>
                
                <Link 
                  to="/doctor/availability"
                  className="bg-green-50 border border-green-200 rounded-lg p-4 text-center hover:bg-green-100 transition duration-200"
                >
                  <div className="text-green-600 text-lg mb-2">⏰</div>
                  <div className="font-medium text-green-900 text-sm"> Availability</div>
                </Link>
                
                <Link 
                  to="/doctor/medical-records"
                  className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center hover:bg-purple-100 transition duration-200"
                >
                  <div className="text-purple-600 text-lg mb-2">📋</div>
                  <div className="font-medium text-purple-900 text-sm">Medical Records</div>
                </Link>
                
                <Link 
                  to="/doctor/profile"
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-100 transition duration-200"
                >
                  <div className="text-gray-600 text-lg mb-2">👤</div>
                  <div className="font-medium text-gray-900 text-sm">Profile</div>
                </Link>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {activity.patient} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;