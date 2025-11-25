import React, { useState, useEffect } from 'react';
import { useGetDoctorAppointmentsQuery, useUpdateAppointmentStatusMutation } from '../../store/services/AppointmentApi';
import { useCreateMedicalRecordMutation } from '../../store/services/MadcialRecod';

const DoctorAppointments = () => {
  const { data: doctorQuery, isLoading: queryLoading, isError, error } = useGetDoctorAppointmentsQuery();
  const [updateAppointmentStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();
  const [createMedicalRecord, { isLoading: isCreating }] = useCreateMedicalRecordMutation();

  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showMedicalRecord, setShowMedicalRecord] = useState(false);
  const [medicalRecordData, setMedicalRecordData] = useState({
    diagnosis: '',
    symptoms: [],
    prescription: [],
    testsRecommended: [],
    notes: ''
  });

  // API se data fetch kar ke set karna
  useEffect(() => {
    if (doctorQuery?.success && doctorQuery?.data?.appointments) {
      setAppointments(doctorQuery.data.appointments);
    }
  }, [doctorQuery]);

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'confirmed': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'completed': return 'bg-green-50 text-green-700 border border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
      case 'no-show': return 'bg-orange-50 text-orange-700 border border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return '📅';
      case 'confirmed': return '✅';
      case 'completed': return '🩺';
      case 'cancelled': return '❌';
      case 'no-show': return '👻';
      default: return '📋';
    }
  };

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

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const result = await updateAppointmentStatus({
        id: appointmentId,
        statusData: { status: newStatus }
      }).unwrap();

      if (result.success) {
        // Update local state immediately for better UX
        setAppointments(prev => prev.map(apt => 
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt
        ));
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert(error?.data?.message || 'Error updating appointment status');
    }
  };

  const handleCreateMedicalRecord = async (appointment) => {
    if (appointment.status !== 'completed') {
      const confirmComplete = window.confirm(
        'Appointment must be completed before creating medical record. Mark as completed?'
      );

      if (!confirmComplete) return;

      try {
        await handleStatusUpdate(appointment._id, 'completed');
        openMedicalRecordModal(appointment);
      } catch (error) {
        console.error('Error updating appointment status:', error);
        alert('Failed to complete appointment');
      }
    } else {
      openMedicalRecordModal(appointment);
    }
  };

  const openMedicalRecordModal = (appointment) => {
    setSelectedAppointment(appointment);
    setMedicalRecordData({
      diagnosis: '',
      symptoms: [''],
      prescription: [{ medicine: '', dosage: '', frequency: '', duration: '' }],
      testsRecommended: [''],
      notes: ''
    });
    setShowMedicalRecord(true);
  };

  const handleMedicalRecordSubmit = async () => {
    if (!medicalRecordData.diagnosis.trim()) {
      alert('Please enter diagnosis');
      return;
    }

    try {
      const medicalRecordPayload = {
        patientId: selectedAppointment.patientId._id,
        appointmentId: selectedAppointment._id,
        diagnosis: medicalRecordData.diagnosis,
        symptoms: medicalRecordData.symptoms.filter(s => s.trim() !== ''),
        prescription: medicalRecordData.prescription.filter(p =>
          p.medicine.trim() !== '' && p.dosage.trim() !== ''
        ),
        testsRecommended: medicalRecordData.testsRecommended.filter(t => t.trim() !== ''),
        notes: medicalRecordData.notes
      };

      const result = await createMedicalRecord(medicalRecordPayload).unwrap();

      if (result.success) {
        await handleStatusUpdate(selectedAppointment._id, 'completed');
        setShowMedicalRecord(false);
        alert('Medical record created successfully!');
      }
    } catch (error) {
      console.error('Error creating medical record:', error);
      alert(error?.data?.message || 'Error creating medical record');
    }
  };

  const handleMedicalRecordChange = (field, value) => {
    setMedicalRecordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSymptomChange = (index, value) => {
    const newSymptoms = [...medicalRecordData.symptoms];
    newSymptoms[index] = value;
    handleMedicalRecordChange('symptoms', newSymptoms);
  };

  const addSymptom = () => {
    handleMedicalRecordChange('symptoms', [...medicalRecordData.symptoms, '']);
  };

  const removeSymptom = (index) => {
    handleMedicalRecordChange('symptoms',
      medicalRecordData.symptoms.filter((_, i) => i !== index)
    );
  };

  const handlePrescriptionChange = (index, field, value) => {
    const newPrescription = [...medicalRecordData.prescription];
    newPrescription[index][field] = value;
    handleMedicalRecordChange('prescription', newPrescription);
  };

  const addPrescription = () => {
    handleMedicalRecordChange('prescription', [
      ...medicalRecordData.prescription,
      { medicine: '', dosage: '', frequency: '', duration: '' }
    ]);
  };

  const removePrescription = (index) => {
    handleMedicalRecordChange('prescription',
      medicalRecordData.prescription.filter((_, i) => i !== index)
    );
  };

  const handleTestChange = (index, value) => {
    const newTests = [...medicalRecordData.testsRecommended];
    newTests[index] = value;
    handleMedicalRecordChange('testsRecommended', newTests);
  };

  const addTest = () => {
    handleMedicalRecordChange('testsRecommended', [...medicalRecordData.testsRecommended, '']);
  };

  const removeTest = (index) => {
    handleMedicalRecordChange('testsRecommended',
      medicalRecordData.testsRecommended.filter((_, i) => i !== index)
    );
  };

  // Loading state
  if (queryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[1,2,3,4,5].map(n => (
                <div key={n} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="space-y-4">
                {[1,2,3].map(n => (
                  <div key={n} className="h-24 bg-gray-200 rounded-xl"></div>
                ))}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Appointments</h3>
            <p className="text-gray-600 mb-4">We're having trouble loading your appointments right now.</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Appointment Dashboard</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your patient consultations and provide quality healthcare services
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition duration-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {appointments.filter(a => a.status === 'scheduled').length}
            </div>
            <div className="text-gray-600 font-medium">Scheduled</div>
            <div className="text-blue-400 text-2xl mt-2">📅</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition duration-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-gray-600 font-medium">Confirmed</div>
            <div className="text-purple-400 text-2xl mt-2">✅</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition duration-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-gray-600 font-medium">Completed</div>
            <div className="text-green-400 text-2xl mt-2">🩺</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition duration-200">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {appointments.filter(a => a.status === 'scheduled' && new Date(a.appointmentDate) >= new Date()).length}
            </div>
            <div className="text-gray-600 font-medium">Upcoming</div>
            <div className="text-orange-400 text-2xl mt-2">⏰</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition duration-200">
            <div className="text-3xl font-bold text-gray-600 mb-2">
              {appointments.length}
            </div>
            <div className="text-gray-600 font-medium">Total</div>
            <div className="text-gray-400 text-2xl mt-2">📊</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Appointments</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all', label: 'All Appointments', emoji: '📋' },
              { key: 'scheduled', label: 'Scheduled', emoji: '📅' },
              { key: 'confirmed', label: 'Confirmed', emoji: '✅' },
              { key: 'completed', label: 'Completed', emoji: '🩺' },
              { key: 'cancelled', label: 'Cancelled', emoji: '❌' },
              { key: 'no-show', label: 'No Show', emoji: '👻' }
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

        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-8xl mb-6">📅</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Appointments Found</h3>
              <p className="text-gray-600 text-lg mb-6">
                {filter !== 'all' 
                  ? `You don't have any ${filter} appointments at the moment.`
                  : "You don't have any appointments scheduled yet."
                }
              </p>
              <div className="text-4xl opacity-50">😊</div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredAppointments.map(appointment => (
                <div key={appointment._id} className="p-6 hover:bg-gray-50 transition duration-200 group">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    
                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {appointment.patientId?.userId?.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {appointment.patientId?.userId?.name || 'Unknown Patient'}
                            </h3>
                            <p className="text-gray-600">
                              {appointment.patientId?.userId?.dateOfBirth
                                ? `${calculateAge(appointment.patientId.userId.dateOfBirth)} years`
                                : 'Age not specified'} • {appointment.patientId?.userId?.gender || 'Gender not specified'}
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          <span>{getStatusIcon(appointment.status)}</span>
                          <span className="capitalize">{appointment.status}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📅</span>
                          <span>{new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">⏰</span>
                          <span>{appointment.appointmentTime} • {appointment.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎯</span>
                          <span>{appointment.reason || 'General Consultation'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 lg:justify-end">
                      {appointment.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                            className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            disabled={isUpdating}
                          >
                            <span>✅</span>
                            {isUpdating ? 'Confirming...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                            className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            disabled={isUpdating}
                          >
                            <span>❌</span>
                            {isUpdating ? 'Cancelling...' : 'Cancel'}
                          </button>
                        </>
                      )}

                      {appointment.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleCreateMedicalRecord(appointment)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            disabled={isUpdating}
                          >
                            <span>🩺</span>
                            Start Consultation
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'no-show')}
                            className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            disabled={isUpdating}
                          >
                            <span>👻</span>
                            No Show
                          </button>
                        </>
                      )}

                      {appointment.status === 'completed' && (
                        <button
                          onClick={() => handleCreateMedicalRecord(appointment)}
                          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition duration-200 shadow-sm"
                        >
                          <span>📄</span>
                          Add-Transcript
                        </button>
                      )}

                      {(appointment.status === 'cancelled' || appointment.status === 'no-show') && (
                        <div className="text-gray-500 text-sm italic py-2 px-4 bg-gray-50 rounded-lg">
                          Consultation completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medical Record Modal */}
        {showMedicalRecord && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedAppointment.status === 'completed' ? 'Medical Record' : 'Create Medical Record'}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedAppointment.patientId?.userId?.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedAppointment.patientId?.userId?.name || 'Unknown Patient'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedAppointment.patientId?.userId?.dateOfBirth
                            ? `${calculateAge(selectedAppointment.patientId.userId.dateOfBirth)} years`
                            : 'Age not specified'} • {selectedAppointment.patientId?.userId?.gender || 'Gender not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMedicalRecord(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-xl transition duration-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Diagnosis */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Diagnosis <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={medicalRecordData.diagnosis}
                      onChange={(e) => handleMedicalRecordChange('diagnosis', e.target.value)}
                      placeholder="Enter primary diagnosis and findings..."
                      rows="3"
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 resize-none"
                      required
                    />
                  </div>

                  {/* Symptoms */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Symptoms
                    </label>
                    <div className="space-y-3">
                      {medicalRecordData.symptoms.map((symptom, index) => (
                        <div key={index} className="flex gap-3">
                          <input
                            type="text"
                            value={symptom}
                            onChange={(e) => handleSymptomChange(index, e.target.value)}
                            placeholder="Describe symptom..."
                            className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200"
                          />
                          {medicalRecordData.symptoms.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSymptom(index)}
                              className="bg-red-50 text-red-600 px-4 rounded-2xl hover:bg-red-100 transition duration-200 font-semibold"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSymptom}
                        className="bg-green-50 text-green-600 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-green-100 transition duration-200 flex items-center gap-2"
                      >
                        <span>+</span>
                        Add Symptom
                      </button>
                    </div>
                  </div>

                  {/* Prescription */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Prescription
                    </label>
                    <div className="space-y-4">
                      {medicalRecordData.prescription.map((med, index) => (
                        <div key={index} className="border-2 border-gray-200 rounded-2xl p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Name *</label>
                              <input
                                type="text"
                                value={med.medicine}
                                onChange={(e) => handlePrescriptionChange(index, 'medicine', e.target.value)}
                                placeholder="Enter medicine name"
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Dosage *</label>
                              <input
                                type="text"
                                value={med.dosage}
                                onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                                placeholder="e.g., 500mg"
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
                              <input
                                type="text"
                                value={med.frequency}
                                onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                                placeholder="e.g., Twice daily"
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                              <input
                                type="text"
                                value={med.duration}
                                onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                                placeholder="e.g., 5 days"
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200"
                              />
                            </div>
                          </div>
                          {medicalRecordData.prescription.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePrescription(index)}
                              className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition duration-200"
                            >
                              Remove Medicine
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addPrescription}
                        className="bg-green-50 text-green-600 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-green-100 transition duration-200 flex items-center gap-2"
                      >
                        <span>+</span>
                        Add Medicine
                      </button>
                    </div>
                  </div>

                  {/* Tests Recommended */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Recommended Tests
                    </label>
                    <div className="space-y-3">
                      {medicalRecordData.testsRecommended.map((test, index) => (
                        <div key={index} className="flex gap-3">
                          <input
                            type="text"
                            value={test}
                            onChange={(e) => handleTestChange(index, e.target.value)}
                            placeholder="Enter test name..."
                            className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200"
                          />
                          {medicalRecordData.testsRecommended.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTest(index)}
                              className="bg-red-50 text-red-600 px-4 rounded-2xl hover:bg-red-100 transition duration-200 font-semibold"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTest}
                        className="bg-green-50 text-green-600 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-green-100 transition duration-200 flex items-center gap-2"
                      >
                        <span>+</span>
                        Add Test
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Additional Notes
                    </label>
                    <textarea
                      value={medicalRecordData.notes}
                      onChange={(e) => handleMedicalRecordChange('notes', e.target.value)}
                      placeholder="Any additional recommendations, follow-up instructions, or special notes..."
                      rows="3"
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowMedicalRecord(false)}
                      className="bg-gray-100 text-gray-700 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleMedicalRecordSubmit}
                      className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </span>
                      ) : (
                        selectedAppointment.status === 'completed' ? 'Update Record' : 'Save Medical Record'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;