import React, { useState } from 'react';
import { 
  useGetAllAppointmentsQuery,
  useUpdateAppointmentStatusMutation 
} from "../../store/services/AppointmentApi.js";

const ManageAppointments = () => {
  const { data: appointmentsData, isLoading, isError, refetch } = useGetAllAppointmentsQuery();
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();
  
  const appointments = appointmentsData?.data?.appointments || [];
  const totalAppointments = appointmentsData?.data?.total || 0;
  
  console.log("All Appointments Data:", appointmentsData);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const patientName = appointment.patientId?.userId?.name?.toLowerCase() || '';
    const doctorName = appointment.doctorId?.userId?.name?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = patientName.includes(search) || doctorName.includes(search);
    const matchesStatus = filter === 'all' || appointment.status === filter;
    
    let matchesDate = true;
    if (dateFilter) {
      const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
      matchesDate = appointmentDate === dateFilter;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus({
        id: appointmentId,
        statusData: { status: newStatus }
      }).unwrap();
      
      alert(`Appointment status updated to ${newStatus} ✅`);
      refetch();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert(error?.data?.message || 'Error updating appointment status');
    }
  };

  const handleDeleteAppointment = async (appointmentId, patientName) => {
    if (window.confirm(`Are you sure you want to delete appointment for ${patientName}?`)) {
      try {
        // Note: You'll need to add delete endpoint in AppointmentApi
        console.log('Delete functionality not implemented yet. Appointment ID:', appointmentId);
        alert('Delete functionality coming soon!');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error deleting appointment');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-3">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800">Error loading appointments. Please try again.</p>
          <button 
            onClick={refetch}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>
          <p className="text-gray-600">View and manage all system appointments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{totalAppointments}</div>
            <div className="text-gray-600 text-sm">Total Appointments</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length}
            </div>
            <div className="text-gray-600 text-sm">Active</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {appointments.filter(a => a.status === 'cancelled').length}
            </div>
            <div className="text-gray-600 text-sm">Cancelled</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by patient or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Date Filter */}
            <div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('scheduled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'scheduled' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'completed' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'cancelled' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">No appointments match your search criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map(appointment => (
                <div key={appointment._id} className="p-6 hover:bg-gray-50 transition duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    {/* Appointment Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.patientId?.userId?.name || 'Unknown Patient'}
                          </h3>
                          <p className="text-gray-600">
                            with {appointment.doctorId?.userId?.name || 'Unknown Doctor'} 
                            {appointment.doctorId?.userId?.specialization && 
                              ` (${appointment.doctorId.userId.specialization})`
                            }
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Date & Time:</span>{' '}
                          {formatDate(appointment.appointmentDate)} at {appointment.appointmentTime}
                        </div>
                        {appointment.doctorId?.roomNumber && (
                          <div>
                            <span className="font-medium">Room:</span> {appointment.doctorId.roomNumber}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Time Slot:</span> {appointment.timeSlot}
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <span className="font-medium">Reason:</span> {appointment.reason || 'Not specified'}
                        </div>
                        <div>
                          <span className="font-medium">Booked on:</span> {formatDate(appointment.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-wrap gap-2">
                      {appointment.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition duration-200"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition duration-200"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition duration-200"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition duration-200"
                        >
                          Mark Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAppointment(appointment._id, appointment.patientId?.userId?.name)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition duration-200"
                      >
                        Delete
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

export default ManageAppointments;