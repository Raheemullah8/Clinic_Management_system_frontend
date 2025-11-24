import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  // Get admin user from Redux store
  const user = useSelector((state) => state.auth.user);
  
  // Sample data - Replace with actual API calls
  const dashboardData = useMemo(() => {
    // Replace this with your actual API data
    return {
      totalDoctors: 45,
      totalPatients: 1247,
      totalAppointments: 328,
      pendingApprovals: 8,
      recentDoctors: [
        { id: 1, name: 'Dr. Sarah Ahmed', specialization: 'Cardiology', status: 'active', joinedDate: '2024-11-20' },
        { id: 2, name: 'Dr. Hassan Ali', specialization: 'Pediatrics', status: 'pending', joinedDate: '2024-11-22' },
        { id: 3, name: 'Dr. Ayesha Khan', specialization: 'Dermatology', status: 'active', joinedDate: '2024-11-18' }
      ],
      recentPatients: [
        { id: 1, name: 'Ahmed Malik', lastVisit: '2024-11-23', status: 'active' },
        { id: 2, name: 'Fatima Noor', lastVisit: '2024-11-22', status: 'active' },
        { id: 3, name: 'Bilal Sheikh', lastVisit: '2024-11-21', status: 'active' }
      ],
      systemActivities: [
        { id: 1, action: 'New doctor registration', details: 'Dr. Hassan Ali - Pediatrics', time: '10 minutes ago' },
        { id: 2, action: 'Appointment completed', details: 'Patient: Ahmed Malik', time: '1 hour ago' },
        { id: 3, action: 'Doctor profile updated', details: 'Dr. Sarah Ahmed', time: '2 hours ago' },
        { id: 4, action: 'New patient registered', details: 'Fatima Noor', time: '3 hours ago' }
      ]
    };
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return statusStyles[status] || statusStyles.inactive;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.data?.name || 'Admin'}! 👨‍💼</h1>
          <p className="text-indigo-100">Manage your healthcare system from this central dashboard.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Doctors */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-xl border-t-4 border-blue-500">
            <div className="text-3xl mb-2">👨‍⚕️</div>
            <div className="text-3xl font-bold text-blue-700 mb-1">{dashboardData.totalDoctors}</div>
            <div className="text-gray-600 font-medium">Total Doctors</div>
            <Link to="/admin/doctors" className="text-blue-600 text-xs mt-2 inline-block hover:underline">
              View All →
            </Link>
          </div>

          {/* Total Patients */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-xl border-t-4 border-green-500">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-3xl font-bold text-green-700 mb-1">{dashboardData.totalPatients}</div>
            <div className="text-gray-600 font-medium">Total Patients</div>
            <Link to="/admin/patients" className="text-green-600 text-xs mt-2 inline-block hover:underline">
              View All →
            </Link>
          </div>

          {/* Total Appointments */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-xl border-t-4 border-purple-500">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-3xl font-bold text-purple-700 mb-1">{dashboardData.totalAppointments}</div>
            <div className="text-gray-600 font-medium">Total Appointments</div>
            <Link to="/admin/appointments" className="text-purple-600 text-xs mt-2 inline-block hover:underline">
              View All →
            </Link>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-xl border-t-4 border-orange-500">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-3xl font-bold text-orange-700 mb-1">{dashboardData.pendingApprovals}</div>
            <div className="text-gray-600 font-medium">Pending Approvals</div>
            <Link to="/admin/approvals" className="text-orange-600 text-xs mt-2 inline-block hover:underline">
              Review Now →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Actions
              </h2>
              <div className="space-y-3">
                
                <Link
                  to="/admin/doctors/add"
                  className="flex items-center w-full bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition duration-200"
                >
                  <div className="text-blue-600 text-2xl mr-3">➕</div>
                  <div>
                    <div className="font-medium text-blue-900">Add New Doctor</div>
                    <div className="text-xs text-blue-700">Register a new doctor</div>
                  </div>
                </Link>

                <Link
                  to="/admin/approvals"
                  className="flex items-center w-full bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 transition duration-200"
                >
                  <div className="text-orange-600 text-2xl mr-3">✅</div>
                  <div>
                    <div className="font-medium text-orange-900">Approve Registrations</div>
                    <div className="text-xs text-orange-700">{dashboardData.pendingApprovals} pending</div>
                  </div>
                </Link>

                <Link
                  to="/admin/reports"
                  className="flex items-center w-full bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition duration-200"
                >
                  <div className="text-purple-600 text-2xl mr-3">📊</div>
                  <div>
                    <div className="font-medium text-purple-900">View Reports</div>
                    <div className="text-xs text-purple-700">System analytics</div>
                  </div>
                </Link>
                
                <Link
                  to="/admin/settings"
                  className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition duration-200"
                >
                  <div className="text-gray-600 text-2xl mr-3">⚙️</div>
                  <div>
                    <div className="font-medium text-gray-900">System Settings</div>
                    <div className="text-xs text-gray-700">Configure system</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Doctors & Patients */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recent Doctors */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">👨‍⚕️</span>
                  Recent Doctor Registrations
                </h2>
                <Link to="/admin/doctors" className="text-blue-600 text-sm font-medium hover:underline">
                  View All
                </Link>
              </div>
              <div className="p-4 divide-y divide-gray-100">
                {dashboardData.recentDoctors.map(doctor => (
                  <div key={doctor.id} className="py-3 flex justify-between items-center hover:bg-gray-50 transition duration-150 px-2 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold">
                            {doctor.name.split(' ')[1]?.charAt(0) || doctor.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doctor.name}</p>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(doctor.status)}`}>
                        {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(doctor.joinedDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">👥</span>
                  Recent Patient Activity
                </h2>
                <Link to="/admin/patients" className="text-green-600 text-sm font-medium hover:underline">
                  View All
                </Link>
              </div>
              <div className="p-4 divide-y divide-gray-100">
                {dashboardData.recentPatients.map(patient => (
                  <div key={patient.id} className="py-3 flex justify-between items-center hover:bg-gray-50 transition duration-150 px-2 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-semibold">
                          {patient.name.split(' ')[0]?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">Last visit: {formatDate(patient.lastVisit)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(patient.status)}`}>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Activities */}
        <div className="mt-6 bg-white rounded-xl shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📋</span>
              Recent System Activities
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {dashboardData.systemActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition duration-150">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;