import React, { useState } from 'react';
import AddDoctorModal from '../../components/doctorModal/AddDoctorModal';
import { useGetAllDoctorsQuery } from '../../store/services/Admin';

const ManageDoctors = () => {
  const { data: getAllDoctors, isLoading, error } = useGetAllDoctorsQuery();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // ✅ Console log for debugging
  console.log("Get All Doctors API Response:", getAllDoctors);
  console.log("Doctors Data:", getAllDoctors?.data?.doctors);

  // ✅ Directly use API data
  const doctors = getAllDoctors?.data?.doctors || [];

  // ✅ Filter doctors based on search and filter
  const filteredDoctors = doctors.filter(doctor => {
    if (!doctor.userId) return false;
    
    const matchesSearch = 
      doctor.userId.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.userId.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.userId.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && doctor.userId.isActive;
    if (filter === 'inactive') return matchesSearch && !doctor.userId.isActive;
    if (filter === 'available') return matchesSearch && doctor.isAvailable;
    
    return matchesSearch;
  });

  // ✅ Add new doctor function
  const handleAddDoctor = (newDoctorData) => {
    // Yahan actual API call hoga
    console.log("Adding new doctor:", newDoctorData);
    alert('Doctor added successfully!');
    setShowAddForm(false);
  };

  // ✅ Toggle doctor status
  const handleToggleStatus = async (doctorId, currentStatus) => {
    try {
      // API: PUT /admin/doctors/:id (for deactivation)
      console.log(`Toggling doctor ${doctorId} status to ${!currentStatus}`);
      
      // Yahan actual API call hoga
      // await updateDoctorStatus(doctorId, !currentStatus).unwrap();
      
      alert(`Doctor ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating doctor status:', error);
      alert('Error updating doctor status');
    }
  };

  // ✅ Delete doctor
  const handleDeleteDoctor = async (doctorId, doctorName) => {
    if (window.confirm(`Are you sure you want to delete ${doctorName}? This action cannot be undone.`)) {
      try {
        // API: DELETE /admin/doctors/:id
        console.log('Deleting doctor:', doctorId);
        
        // Yahan actual API call hoga
        // await deleteDoctor(doctorId).unwrap();
        
        alert('Doctor deleted successfully!');
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Error deleting doctor');
      }
    }
  };

  // ✅ Loading state
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

  // ✅ Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading Doctors</h3>
                <p className="text-red-600 mt-1">Failed to load doctors data. Please try again later.</p>
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
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
            <p className="text-gray-600">Add, edit, and manage hospital doctors</p>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            + Add New Doctor
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{doctors.length}</div>
            <div className="text-gray-600 text-sm">Total Doctors</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {doctors.filter(d => d.userId?.isActive).length}
            </div>
            <div className="text-gray-600 text-sm">Active Doctors</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {doctors.filter(d => d.isAvailable).length}
            </div>
            <div className="text-gray-600 text-sm">Available Today</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {new Set(doctors.map(d => d.userId?.specialization).filter(Boolean)).size}
            </div>
            <div className="text-gray-600 text-sm">Specializations</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, specialization, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Doctors
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'active' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'inactive' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inactive
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'available' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Available
              </button>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredDoctors.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600">
                {doctors.length === 0 
                  ? "No doctors are currently registered in the system." 
                  : "No doctors match your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredDoctors.map(doctor => (
                <DoctorCard 
                  key={doctor._id} 
                  doctor={doctor}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteDoctor}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Doctor Modal */}
        {showAddForm && (
          <AddDoctorModal 
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            onAddDoctor={handleAddDoctor}
          />
        )}
      </div>
    </div>
  );
};

// ✅ Separate Doctor Card Component for better organization
const DoctorCard = ({ doctor, onToggleStatus, onDelete }) => {
  const user = doctor.userId || {};
  
  return (
    <div className="p-6 hover:bg-gray-50 transition duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Doctor Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.name || 'N/A'}
              </h3>
              <p className="text-gray-600">{user.specialization || 'N/A'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                doctor.isAvailable 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {doctor.isAvailable ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Email:</span> {user.email || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {user.phone || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Experience:</span> {user.experience || '0'} years
            </div>
            <div>
              <span className="font-medium">Fee:</span> Rs. {user.consultationFee || '0'}
            </div>
            <div>
              <span className="font-medium">Room:</span> {doctor.roomNumber || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Patients Today:</span> {doctor.todayPatientCount || 0}/{doctor.maxPatientsPerDay || 0}
            </div>
            {user.licenseNumber && (
              <div>
                <span className="font-medium">License:</span> {user.licenseNumber}
              </div>
            )}
            {user.qualifications && (
              <div className="md:col-span-2">
                <span className="font-medium">Qualifications:</span> {Array.isArray(user.qualifications) ? user.qualifications.join(', ') : user.qualifications}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-wrap gap-2">
          <button
            onClick={() => onToggleStatus(doctor._id, user.isActive)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
              user.isActive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-200">
            Edit
          </button>
          <button
            onClick={() => onDelete(doctor._id, user.name)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;