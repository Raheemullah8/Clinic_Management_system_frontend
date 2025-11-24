import React, { useState, useMemo } from 'react';
import { 
  useGetPatientAppointmentsQuery,
  useCancelAppointmentMutation
} from '../../store/services/AppointmentApi';

const PatientAppointments = () => {
  const { data: patientAppoinments, isLoading, isError, refetch } = useGetPatientAppointmentsQuery();
  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();
  
  const appointmentsData = patientAppoinments?.data?.appointments || [];
  const [filter, setFilter] = useState('all');

  const stats = useMemo(() => {
    const scheduled = appointmentsData.filter(a => a.status === 'scheduled').length;
    const completed = appointmentsData.filter(a => a.status === 'completed').length;
    const cancelled = appointmentsData.filter(a => a.status === 'cancelled').length;
    const total = appointmentsData.length;
    return { scheduled, completed, cancelled, total };
  }, [appointmentsData]);

  const filteredAppointments = useMemo(() => {
    if (filter === 'all') return appointmentsData;
    return appointmentsData.filter(apt => apt.status === filter);
  }, [appointmentsData, filter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
      try {
        await cancelAppointment(appointmentId).unwrap();
        alert('Appointment cancelled successfully!');
      } catch (error) {
        console.error("Cancellation failed:", error);
        alert(`Failed to cancel appointment. ${error.data?.message || 'Please try again.'}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-xl text-blue-600 font-medium">Loading Appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center shadow-lg">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">Error Fetching Appointments</h3>
          <p className="text-gray-700">Something went wrong while retrieving your appointments. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">My Appointments 📅</h1>
          <p className="text-blue-50 text-lg">Manage and track your medical appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 text-center border border-blue-200 transition duration-300 hover:shadow-2xl hover:scale-105">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">📅</span>
            </div>
            <div className="text-4xl font-bold text-blue-800 mb-1">{stats.scheduled}</div>
            <div className="text-gray-700 font-semibold">Upcoming</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 text-center border border-green-200 transition duration-300 hover:shadow-2xl hover:scale-105">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">✅</span>
            </div>
            <div className="text-4xl font-bold text-green-800 mb-1">{stats.completed}</div>
            <div className="text-gray-700 font-semibold">Completed</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-6 text-center border border-red-200 transition duration-300 hover:shadow-2xl hover:scale-105">
            <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">❌</span>
            </div>
            <div className="text-4xl font-bold text-red-800 mb-1">{stats.cancelled}</div>
            <div className="text-gray-700 font-semibold">Cancelled</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 text-center border border-gray-200 transition duration-300 hover:shadow-2xl hover:scale-105">
            <div className="bg-gray-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">📊</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{stats.total}</div>
            <div className="text-gray-700 font-semibold">Total</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center mb-4">
            <span className="text-lg font-bold text-gray-900 mr-4">🔍 Filter By:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition duration-300 transform hover:scale-105 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Appointments ({stats.total})
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition duration-300 transform hover:scale-105 ${
                filter === 'scheduled' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming ({stats.scheduled})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition duration-300 transform hover:scale-105 ${
                filter === 'completed' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({stats.completed})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition duration-300 transform hover:scale-105 ${
                filter === 'cancelled' 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled ({stats.cancelled})
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-300 text-8xl mb-6">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Appointments Found</h3>
              <p className="text-gray-600 text-lg">You don't have any {filter !== 'all' ? filter : ''} appointments.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map(appointment => (
                <div key={appointment._id} className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    
                    {/* Appointment Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start">
                          <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
                            <span className="text-white text-2xl">👨‍⚕️</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {appointment.doctorId?.userId?.name || 'Doctor Name Not Found'} 
                            </h3>
                            <p className="text-gray-600 font-medium">
                              {appointment.doctorId?.userId?.specialization || 'Specialization Not Found'}
                            </p>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold border-2 shadow-md ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 ml-0 lg:ml-18">
                        <div className="flex items-center text-gray-700">
                          <span className="text-xl mr-3">📅</span>
                          <span className="font-semibold mr-2">Date & Time:</span>
                          <span className="font-bold text-blue-600">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-700">
                          <span className="text-xl mr-3">💰</span>
                          <span className="font-semibold mr-2">Fee:</span>
                          <span className="font-bold text-green-600">
                            Rs. {appointment.doctorId?.userId?.consultationFee || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex items-start text-gray-700">
                          <span className="text-xl mr-3 mt-1">📋</span>
                          <div>
                            <span className="font-semibold mr-2">Reason:</span>
                            <span>{appointment.reason}</span>
                          </div>
                        </div>
                        
                        {/* Show diagnosis and prescription for completed appointments */}
                        {appointment.status === 'completed' && (
                          <>
                            <div className="flex items-start text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                              <span className="text-xl mr-3 mt-1">🩺</span>
                              <div>
                                <span className="font-semibold mr-2">Diagnosis:</span>
                                <span className="font-medium">{appointment.diagnosis || 'N/A'}</span>
                              </div>
                            </div>
                            <div className="flex items-start text-gray-700 bg-purple-50 p-3 rounded-lg border border-purple-200">
                              <span className="text-xl mr-3 mt-1">💊</span>
                              <div>
                                <span className="font-semibold mr-2">Prescription:</span>
                                <span className="font-medium">{appointment.prescription || 'N/A'}</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 lg:mt-0 lg:ml-8 flex flex-col gap-3 lg:min-w-[180px]">
                      {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isCancelling}
                        >
                          {isCancelling ? 'Cancelling...' : '❌ Cancel'}
                        </button>
                      )}
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg transform hover:scale-105">
                        📄 View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;