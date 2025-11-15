import React, { useState } from 'react';
import { useGetAllPatientsAdminQuery, useUpdatePatientByIdAdminMutation } from '../../store/services/Patient';

const ManagePatients = () => {
  const { data: patientsData, isLoading, isError, refetch } = useGetAllPatientsAdminQuery();
  const [updatePatient] = useUpdatePatientByIdAdminMutation();
  
  const patients = patientsData?.data?.patients || [];
  const totalPatients = patientsData?.data?.total || 0;
  
  console.log("Patient Data from Admin ManagePatients:", patientsData);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    bloodGroup: '',
    allergies: '',
    emergencyContact: ''
  });

  // Search filter
  const filteredPatients = patients.filter(patient => {
    const name = patient.userId?.name?.toLowerCase() || '';
    const email = patient.userId?.email?.toLowerCase() || '';
    const phone = patient.userId?.phone || '';
    const search = searchTerm.toLowerCase();
    
    return name.includes(search) || email.includes(search) || phone.includes(search);
  });

  // Open edit modal
  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setEditData({
      bloodGroup: patient.bloodGroup || '',
      allergies: patient.allergies || '',
      emergencyContact: patient.emergencyContact || ''
    });
    setIsModalOpen(true);
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePatient({
        id: selectedPatient._id,
        data: editData
      }).unwrap();
      
      alert('Patient updated successfully! ✅');
      setIsModalOpen(false);
      setSelectedPatient(null);
      refetch();
    } catch (error) {
      console.error('Update error:', error);
      alert(error?.data?.message || 'Failed to update patient');
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
    setEditData({
      bloodGroup: '',
      allergies: '',
      emergencyContact: ''
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800">Error loading patients. Please try again.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Patients</h1>
          <p className="text-gray-600">View and manage all registered patients</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-blue-600">{totalPatients}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="ml-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of Birth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {patient.userId?.name?.charAt(0) || 'P'}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{patient.userId?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{patient.userId?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{patient.userId?.phone || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{patient.userId?.address || 'No address'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          {patient.bloodGroup || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {patient.userId?.gender || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {patient.userId?.dateOfBirth 
                          ? new Date(patient.userId.dateOfBirth).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          patient.userId?.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.userId?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(patient)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Edit Patient Details
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Patient: {selectedPatient?.userId?.name}
              </p>
              
              <form onSubmit={handleUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={editData.bloodGroup}
                      onChange={(e) => setEditData({...editData, bloodGroup: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies
                    </label>
                    <textarea
                      value={editData.allergies}
                      onChange={(e) => setEditData({...editData, allergies: e.target.value})}
                      placeholder="Enter any allergies..."
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      value={editData.emergencyContact}
                      onChange={(e) => setEditData({...editData, emergencyContact: e.target.value})}
                      placeholder="Emergency contact number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePatients;