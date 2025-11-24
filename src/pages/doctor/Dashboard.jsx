import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetDoctorProfileQuery } from '../../store/services/DoctorApi';
import { useGetDoctorAppointmentsQuery } from '../../store/services/AppointmentApi';

const DoctorDashboard = () => {
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
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'scheduled':
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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
      if (isToday(app.appointmentDate)) { 
        todayAppointmentsList.push({
          id: app._id,
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

  const recentActivities = [
    { id: 1, action: 'Medical record updated', patient: 'Fatima Khan', time: '5 minutes ago', icon: '📝' },
    { id: 2, action: 'New appointment scheduled', patient: 'Ali Raza', time: '1 hour ago', icon: '📅' },
    { id: 3, action: 'Consultation completed', patient: 'Ahmed Malik', time: '2 hours ago', icon: '✅' },
    { id: 4, action: 'Prescription issued', patient: 'Sarah Ahmed', time: '3 hours ago', icon: '💊' }
  ];

  if (appointmentsLoading || profileLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mb-4"></div>
            <p className="text-xl text-teal-600 font-medium">Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const doctorName = profileData?.data?.userId?.name || 'Doctor';

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        
        {/* Welcome Section - Enhanced */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Welcome back, Dr. {doctorName}! 👨‍⚕️</h1>
            <p className="text-teal-50 text-lg">Here's your schedule and practice overview for today.</p>
          </div>
        </div>

        {/* Stats Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-2xl hover:scale-105 border border-blue-200">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">📅</span>
            </div>
            <div className="text-4xl font-bold text-blue-800 mb-2">{stats.todayAppointments || 0}</div>
            <div className="text-gray-700 font-semibold">Today's Appointments</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-2xl hover:scale-105 border border-green-200">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">✅</span>
            </div>
            <div className="text-4xl font-bold text-green-800 mb-2">{stats.completedToday || 0}</div>
            <div className="text-gray-700 font-semibold">Completed Today</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-2xl hover:scale-105 border border-orange-200">
            <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">⏳</span>
            </div>
            <div className="text-4xl font-bold text-orange-800 mb-2">{stats.pendingAppointments || 0}</div>
            <div className="text-gray-700 font-semibold text-sm">Pending Appointments</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-2xl hover:scale-105 border border-purple-200">
            <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">👥</span>
            </div>
            <div className="text-4xl font-bold text-purple-800 mb-2">{stats.totalPatients || 0}</div>
            <div className="text-gray-700 font-semibold">Total Patients</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Today's Schedule - Enhanced */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100">
              <div className="bg-gradient-to-r from-teal-600 to-emerald-500 p-5 rounded-t-xl">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2">📋</span>
                  Today's Schedule ({todaySchedule.length})
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {todaySchedule.length > 0 ? (
                    todaySchedule.map(appointment => (
                      <div key={appointment.id} className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 border-2 border-gray-200 rounded-xl hover:shadow-lg transition duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center flex-1">
                            <div className="bg-teal-600 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                              <span className="text-white font-bold text-lg">
                                {appointment.patientName.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-lg">{appointment.patientName}</h3>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <span className="mr-4 flex items-center">
                                  <span className="mr-1">🕒</span>
                                  {appointment.time}
                                </span>
                                <span className="flex items-center">
                                  <span className="mr-1">📋</span>
                                  {appointment.reason}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                            {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStartConsultation(appointment.id, appointment.patientId)}
                                className="bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition shadow-lg transform hover:scale-105"
                              >
                                Start →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <div className="text-5xl mb-4">📅</div>
                      <p className="text-gray-600 text-lg font-medium">No appointments scheduled for today</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 text-center">
                  <Link to="/doctor/appointments">
                    <button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition shadow-lg">
                      View All Appointments →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activities */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Actions - Enhanced */}
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-lg">⚡</span>
                Quick Actions
              </h2>
              <div className="space-y-3">
                
                <Link 
                  to="/doctor/appointments"
                  className="flex items-center w-full bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 hover:from-blue-100 hover:to-blue-200 hover:shadow-lg transition duration-300 transform hover:scale-105"
                >
                  <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">📅</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-blue-900">Appointments</div>
                    <div className="text-xs text-blue-700">Manage schedule</div>
                  </div>
                </Link>
                
                <Link 
                  to="/doctor/availability"
                  className="flex items-center w-full bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 hover:from-green-100 hover:to-green-200 hover:shadow-lg transition duration-300 transform hover:scale-105"
                >
                  <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">⏰</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-green-900">Availability</div>
                    <div className="text-xs text-green-700">Set your hours</div>
                  </div>
                </Link>
                
                <Link 
                  to="/doctor/medical-records"
                  className="flex items-center w-full bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-4 hover:from-purple-100 hover:to-purple-200 hover:shadow-lg transition duration-300 transform hover:scale-105"
                >
                  <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">📋</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-purple-900">Records</div>
                    <div className="text-xs text-purple-700">Patient records</div>
                  </div>
                </Link>
                
                <Link 
                  to="/doctor/profile"
                  className="flex items-center w-full bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-4 hover:from-gray-100 hover:to-gray-200 hover:shadow-lg transition duration-300 transform hover:scale-105"
                >
                  <div className="bg-gray-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">👤</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Profile</div>
                    <div className="text-xs text-gray-700">Update info</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activities - Enhanced */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-5 rounded-t-xl">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2">📊</span>
                  Recent Activities
                </h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-lg transition duration-200">
                      <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm">{activity.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">
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