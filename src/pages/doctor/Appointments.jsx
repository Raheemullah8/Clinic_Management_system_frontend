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
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
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
        alert(`Appointment status updated to ${newStatus} successfully!`);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert(error?.data?.message || 'Error updating appointment status');
    }
  };

  const handleCreateMedicalRecord = async (appointment) => {
    // Agar appointment completed nahi hai, pehle complete karo
    if (appointment.status !== 'completed') {
      const confirmComplete = window.confirm(
        'Appointment must be completed before creating medical record. Mark as completed?'
      );

      if (!confirmComplete) return;

      try {
        await handleStatusUpdate(appointment._id, 'completed');
        // Wait for status update to complete, then open modal
        setTimeout(() => {
          openMedicalRecordModal(appointment);
        }, 1000);
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
    // Validation
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

      // Create medical record
      const result = await createMedicalRecord(medicalRecordPayload).unwrap();

      if (result.success) {
        // Update appointment status to completed
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

  // Error state
  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">Error loading appointments</h3>
            <p className="text-red-600">{error?.data?.message || 'Something went wrong'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600">Manage your patient appointments and consultations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {appointments.filter(a => a.status === 'scheduled').length}
            </div>
            <div className="text-gray-600 text-sm">Scheduled</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-gray-600 text-sm">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {appointments.filter(a => a.status === 'scheduled' && new Date(a.appointmentDate) >= new Date()).length}
            </div>
            <div className="text-gray-600 text-sm">Upcoming</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-600 mb-1">
              {appointments.length}
            </div>
            <div className="text-gray-600 text-sm">Total</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All Appointments
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'scheduled'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'confirmed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'cancelled'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Cancelled
            </button>
            <button
              onClick={() => setFilter('no-show')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'no-show'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              No Show
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">You don't have any {filter !== 'all' ? filter : ''} appointments.</p>
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
                            {appointment.patientId?.userId?.name || 'N/A'}
                          </h3>
                          <p className="text-gray-600">
                            {appointment.patientId?.userId?.dateOfBirth
                              ? `${calculateAge(appointment.patientId.userId.dateOfBirth)} years`
                              : 'Age N/A'} • {appointment.patientId?.userId?.gender || 'Gender N/A'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Date & Time:</span>{' '}
                          {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                        </div>
                        <div>
                          <span className="font-medium">Slot:</span> {appointment.timeSlot}
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">Reason:</span> {appointment.reason || 'No reason provided'}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-wrap gap-2">
                      {appointment.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUpdating}
                          >
                            {isUpdating ? 'Updating...' : '✓ Confirm'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUpdating}
                          >
                            {isUpdating ? 'Updating...' : '✕ Cancel'}
                          </button>
                        </>
                      )}

                      {appointment.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleCreateMedicalRecord(appointment)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUpdating}
                          >
                            🩺 Start Consultation
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'no-show')}
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUpdating}
                          >
                            {isUpdating ? 'Updating...' : '👻 No Show'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUpdating}
                          >
                            {isUpdating ? 'Updating...' : '✕ Cancel'}
                          </button>
                        </>
                      )}

                      {appointment.status === 'completed' && (
                        <button
                          onClick={() => handleCreateMedicalRecord(appointment)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-200"
                        >
                          📄 View Medical Record
                        </button>
                      )}

                      {(appointment.status === 'cancelled' || appointment.status === 'no-show') && (
                        <div className="text-gray-500 text-sm italic py-2">
                          No actions available
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedAppointment.status === 'completed' ? 'Medical Record' : 'Create Medical Record'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Patient: {selectedAppointment.patientId?.userId?.name || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMedicalRecord(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Diagnosis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis *</label>
                    <textarea
                      value={medicalRecordData.diagnosis}
                      onChange={(e) => handleMedicalRecordChange('diagnosis', e.target.value)}
                      placeholder="Enter diagnosis..."
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Symptoms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                    <div className="space-y-2">
                      {medicalRecordData.symptoms.map((symptom, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={symptom}
                            onChange={(e) => handleSymptomChange(index, e.target.value)}
                            placeholder="Symptom description"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {medicalRecordData.symptoms.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSymptom(index)}
                              className="bg-red-100 text-red-600 px-3 rounded-lg hover:bg-red-200 transition duration-200"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSymptom}
                        className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition duration-200"
                      >
                        + Add Symptom
                      </button>
                    </div>
                  </div>

                  {/* Prescription */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prescription</label>
                    <div className="space-y-3">
                      {medicalRecordData.prescription.map((med, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Medicine Name *</label>
                              <input
                                type="text"
                                value={med.medicine}
                                onChange={(e) => handlePrescriptionChange(index, 'medicine', e.target.value)}
                                placeholder="Medicine name"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Dosage *</label>
                              <input
                                type="text"
                                value={med.dosage}
                                onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                                placeholder="e.g., 500mg"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                              <input
                                type="text"
                                value={med.frequency}
                                onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                                placeholder="e.g., Twice daily"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                              <input
                                type="text"
                                value={med.duration}
                                onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                                placeholder="e.g., 5 days"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          {medicalRecordData.prescription.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePrescription(index)}
                              className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 transition duration-200"
                            >
                              Remove Medicine
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addPrescription}
                        className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition duration-200"
                      >
                        + Add Medicine
                      </button>
                    </div>
                  </div>

                  {/* Tests Recommended */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tests Recommended</label>
                    <div className="space-y-2">
                      {medicalRecordData.testsRecommended.map((test, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={test}
                            onChange={(e) => handleTestChange(index, e.target.value)}
                            placeholder="Test name"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {medicalRecordData.testsRecommended.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTest(index)}
                              className="bg-red-100 text-red-600 px-3 rounded-lg hover:bg-red-200 transition duration-200"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTest}
                        className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition duration-200"
                      >
                        + Add Test
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      value={medicalRecordData.notes}
                      onChange={(e) => handleMedicalRecordChange('notes', e.target.value)}
                      placeholder="Any additional notes or recommendations..."
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowMedicalRecord(false)}
                      className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleMedicalRecordSubmit}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isCreating}
                    >
                      {isCreating ? 'Saving...' : (selectedAppointment.status === 'completed' ? 'Update Medical Record' : 'Save Medical Record')}
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