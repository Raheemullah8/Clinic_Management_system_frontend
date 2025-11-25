import React, { useState, useEffect } from 'react';
import { useGetDoctorMedicalRecordsQuery } from '../../store/services/MadcialRecod';

const DoctorMedicalRecords = () => {
  const { data: medicalQuery, isLoading: queryLoading, isError, error } = useGetDoctorMedicalRecordsQuery();
  
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // API se data fetch kar ke set karna
  useEffect(() => {
    if (medicalQuery?.success && medicalQuery?.data?.medicalRecords) {
      setMedicalRecords(medicalQuery.data.medicalRecords);
    }
  }, [medicalQuery]);

  // Filter and search records
  const filteredRecords = medicalRecords.filter(record => {
    const patientName = record.patientId?.userId?.name || '';
    const diagnosis = record.diagnosis || '';
    
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    
    // Date filters
    const recordDate = new Date(record.createdAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (filter) {
      case 'today':
        const recordDay = new Date(recordDate);
        recordDay.setHours(0, 0, 0, 0);
        return matchesSearch && recordDay.getTime() === today.getTime();
      case 'week':
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        return matchesSearch && recordDate >= lastWeek;
      case 'month':
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return matchesSearch && recordDate >= lastMonth;
      default:
        return matchesSearch;
    }
  });

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (queryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1,2,3,4].map(n => (
                <div key={n} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                <div className="space-y-4">
                  {[1,2,3].map(n => (
                    <div key={n} className="h-24 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Medical Records</h3>
            <p className="text-gray-600 mb-4">We're having trouble loading your medical records right now.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Medical Records</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Review and manage patient medical records and consultation history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition duration-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">{medicalRecords.length}</div>
            <div className="text-gray-600 font-medium">Total Records</div>
            <div className="text-blue-400 text-2xl mt-2">📋</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition duration-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {new Set(medicalRecords.map(record => record.patientId?._id).filter(Boolean)).size}
            </div>
            <div className="text-gray-600 font-medium">Unique Patients</div>
            <div className="text-green-400 text-2xl mt-2">👥</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition duration-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {medicalRecords.filter(record => record.testsRecommended && record.testsRecommended.length > 0).length}
            </div>
            <div className="text-gray-600 font-medium">With Tests</div>
            <div className="text-purple-400 text-2xl mt-2">🔬</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition duration-200">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {medicalRecords.filter(record => {
                const recordDate = new Date(record.createdAt);
                const today = new Date();
                recordDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                return recordDate.getTime() === today.getTime();
              }).length}
            </div>
            <div className="text-gray-600 font-medium">Today's Records</div>
            <div className="text-orange-400 text-2xl mt-2">📅</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search by patient name or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Records', emoji: '📋' },
                { key: 'today', label: 'Today', emoji: '📅' },
                { key: 'week', label: 'This Week', emoji: '🗓️' },
                { key: 'month', label: 'This Month', emoji: '📆' }
              ].map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition duration-200 ${
                    filter === key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Records List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Medical Records
                  </h2>
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    {filteredRecords.length} records
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredRecords.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-8xl mb-6">📋</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Records Found</h3>
                    <p className="text-gray-600 text-lg">
                      {searchTerm || filter !== 'all' 
                        ? "No medical records match your search criteria."
                        : "You don't have any medical records yet."
                      }
                    </p>
                    <div className="text-4xl opacity-50 mt-4">😊</div>
                  </div>
                ) : (
                  filteredRecords.map(record => (
                    <div 
                      key={record._id}
                      className={`p-6 cursor-pointer transition duration-200 group ${
                        selectedRecord?._id === record._id 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {record.patientId?.userId?.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {record.patientId?.userId?.name || 'Unknown Patient'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {calculateAge(record.patientId?.userId?.dateOfBirth)} years • {record.patientId?.userId?.gender || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {formatDate(record.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3 line-clamp-2">
                        <span className="font-medium text-blue-600">Diagnosis:</span> {record.diagnosis || 'Not specified'}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {record.symptoms && record.symptoms.length > 0 ? (
                          <>
                            {record.symptoms.slice(0, 3).map((symptom, index) => (
                              <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                {symptom}
                              </span>
                            ))}
                            {record.symptoms.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                +{record.symptoms.length - 3} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">No symptoms recorded</span>
                        )}
                      </div>

                      {/* Quick stats */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        {record.prescription && record.prescription.length > 0 && (
                          <span className="flex items-center gap-1">
                            <span>💊</span>
                            {record.prescription.length} meds
                          </span>
                        )}
                        {record.testsRecommended && record.testsRecommended.length > 0 && (
                          <span className="flex items-center gap-1">
                            <span>🔬</span>
                            {record.testsRecommended.length} tests
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span>🕒</span>
                          {formatTime(record.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Record Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm sticky top-6 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span>📄</span>
                  {selectedRecord ? 'Record Details' : 'Select a Record'}
                </h2>
              </div>
              
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {selectedRecord ? (
                  <div className="space-y-6">
                    {/* Patient Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>👤</span>
                        Patient Information
                      </h3>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {selectedRecord.patientId?.userId?.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">
                              {selectedRecord.patientId?.userId?.name || 'Unknown Patient'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {calculateAge(selectedRecord.patientId?.userId?.dateOfBirth)} years • {selectedRecord.patientId?.userId?.gender || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 bg-white p-2 rounded-lg">
                          <span className="font-medium">Created:</span> {formatDate(selectedRecord.createdAt)} at {formatTime(selectedRecord.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Diagnosis */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>🎯</span>
                        Diagnosis
                      </h3>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl">
                        <p className="text-gray-700 font-medium">
                          {selectedRecord.diagnosis || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>🤒</span>
                        Symptoms
                      </h3>
                      {selectedRecord.symptoms && selectedRecord.symptoms.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedRecord.symptoms.map((symptom, index) => (
                            <span key={index} className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 px-3 py-2 rounded-xl text-sm font-medium">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-2xl text-center">
                          <p className="text-gray-500 text-sm">No symptoms recorded</p>
                        </div>
                      )}
                    </div>

                    {/* Prescription */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>💊</span>
                        Prescription
                      </h3>
                      {selectedRecord.prescription && selectedRecord.prescription.length > 0 ? (
                        <div className="space-y-3">
                          {selectedRecord.prescription.map((med, index) => (
                            <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-2xl border border-green-200">
                              <div className="font-semibold text-green-900 text-lg mb-2">{med.medicine}</div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="font-medium text-gray-600">Dosage:</span>
                                  <div className="text-green-700">{med.dosage}</div>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Frequency:</span>
                                  <div className="text-green-700">{med.frequency || 'Not specified'}</div>
                                </div>
                                <div className="col-span-2">
                                  <span className="font-medium text-gray-600">Duration:</span>
                                  <div className="text-green-700">{med.duration || 'Not specified'}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-2xl text-center">
                          <p className="text-gray-500 text-sm">No prescription given</p>
                        </div>
                      )}
                    </div>

                    {/* Tests Recommended */}
                    {selectedRecord.testsRecommended && selectedRecord.testsRecommended.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span>🔬</span>
                          Tests Recommended
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecord.testsRecommended.map((test, index) => (
                            <span key={index} className="bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 px-3 py-2 rounded-xl text-sm font-medium">
                              {test}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedRecord.notes && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span>📝</span>
                          Doctor's Notes
                        </h3>
                        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-4 rounded-2xl border border-yellow-200">
                          <p className="text-gray-700">
                            {selectedRecord.notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Appointment Details */}
                    {selectedRecord.appointmentId && (
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span>📅</span>
                          Appointment Details
                        </h3>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl">
                          <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Date:</span>
                              <span>{formatDate(selectedRecord.appointmentId.appointmentDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Time:</span>
                              <span>{selectedRecord.appointmentId.appointmentTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-8xl mb-6 opacity-50">📋</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Record</h3>
                    <p className="text-gray-600">Choose a medical record from the list to view detailed information</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorMedicalRecords;