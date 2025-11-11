import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetDoctorProfileQuery } from '../../store/services/DoctorApi';

const DoctorDashboard = () => {
  const { data: profileData, isLoading: profileLoading } = useGetDoctorProfileQuery();
  const [dashboardData, setDashboardData] = useState({
    todayAppointments: 0,
    completedToday: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    todaySchedule: [],
    recentActivities: []
  });

  const [loading, setLoading] = useState(true);

  // APIs simulation - baad mein real APIs se replace hoga
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Yahan actual API calls honge
        // GET /api/doctors/appointments - for appointments
        // GET /api/doctors/stats - for statistics
        
        // Temporary dummy data
        setDashboardData({
          todayAppointments: 8,
          completedToday: 5,
          pendingAppointments: 12,
          totalPatients: 45,
          todaySchedule: [
            { 
              id: 1, 
              patientName: 'John Smith', 
              time: '09:00 AM', 
              status: 'completed', 
              type: 'Follow-up',
              patientId: 'patient123'
            },
            { 
              id: 2, 
              patientName: 'Sarah Johnson', 
              time: '10:00 AM', 
              status: 'completed', 
              type: 'Consultation',
              patientId: 'patient124'
            },
            { 
              id: 3, 
              patientName: 'Mike Brown', 
              time: '11:00 AM', 
              status: 'scheduled', 
              type: 'Checkup',
              patientId: 'patient125'
            }
          ],
          recentActivities: [
            { id: 1, action: 'Medical record updated', patient: 'John Smith', time: '2 hours ago' },
            { id: 2, action: 'Appointment completed', patient: 'Sarah Johnson', time: '3 hours ago' },
            { id: 3, action: 'Prescription created', patient: 'Mike Brown', time: '1 day ago' }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartConsultation = (appointmentId, patientId) => {
    console.log('Starting consultation for:', appointmentId, patientId);
  };

  if (loading || profileLoading) {
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

  const doctorName = profileData?.data?.userId?.name || 'Doctor';

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
            <div className="text-2xl font-bold text-blue-600 mb-1">{dashboardData.todayAppointments}</div>
            <div className="text-gray-600 font-medium">Today's Appointments</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600 mb-1">{dashboardData.completedToday}</div>
            <div className="text-gray-600 font-medium">Completed Today</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-orange-600 mb-1">{dashboardData.pendingAppointments}</div>
            <div className="text-gray-600 font-medium">Pending Appointments</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-2xl font-bold text-purple-600 mb-1">{dashboardData.totalPatients}</div>
            <div className="text-gray-600 font-medium">Total Patients</div>
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
                {dashboardData.todaySchedule.map(appointment => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-4">🕒 {appointment.time}</span>
                        <span>📋 {appointment.type}</span>
                      </div>
                    </div>
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => handleStartConsultation(appointment.id, appointment.patientId)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition duration-200"
                      >
                        Start
                      </button>
                    )}
                  </div>
                ))}
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
                  {dashboardData.recentActivities.map(activity => (
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