import React, { useState } from 'react';

import { useGetPatientMedicalRecordsQuery } from '../../store/services/MadcialRecod';

const PatientMedicalRecords = () => {
    // API Hook
    const { 
        data: patientRecordData, 
        isLoading, 
        isError,
        error 
    } = useGetPatientMedicalRecordsQuery();
   
    const medicalRecords = patientRecordData?.data?.medicalRecords || [];

    const [selectedRecord, setSelectedRecord] = useState(null);

    // Initial state set karne ke liye useEffect use kar sakte hain
    // Taki jab data aaye, toh pehla record automatically select ho jaaye.
    React.useEffect(() => {
        if (medicalRecords.length > 0 && !selectedRecord) {
            setSelectedRecord(medicalRecords[0]);
        }
    }, [medicalRecords, selectedRecord]);


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        // ISO date string ko format karna
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
                <p className="text-xl text-blue-600">Loading Medical Records... ⏳</p>
            </div>
        );
    }

    if (isError) {
        // Optional: Show specific error message if available
        const errorMessage = error?.data?.message || "Failed to fetch medical records.";
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
                <p className="text-xl text-red-600">Error: {errorMessage}</p>
            </div>
        );
    }

    // --- Data Processing for Stats ---

    const totalRecords = medicalRecords.length;
    // Check if testsRecommended array exists and has length > 0
    const recordsWithTests = medicalRecords.filter(record => record.testsRecommended && record.testsRecommended.length > 0).length;
    // Count unique doctors using doctorId._id field
    const uniqueDoctorIds = new Set(medicalRecords.map(record => record.doctorId?._id).filter(id => id));
    const doctorsVisited = uniqueDoctorIds.size;
    
    // --- Main Render ---

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">Your Medical Records 📋</h1>
                    <p className="text-gray-600">View your complete medical history and treatment details.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-5 text-center border-t-4 border-blue-500">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{totalRecords}</div>
                        <div className="text-gray-600 font-medium">Total Records</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-5 text-center border-t-4 border-green-500">
                        <div className="text-3xl font-bold text-green-600 mb-1">{recordsWithTests}</div>
                        <div className="text-gray-600 font-medium">Records with Tests</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-5 text-center border-t-4 border-purple-500">
                        <div className="text-3xl font-bold text-purple-600 mb-1">{doctorsVisited}</div>
                        <div className="text-gray-600 font-medium">Doctors Visited</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Records List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                                <h2 className="text-xl font-semibold text-gray-900">Medical History (List)</h2>
                            </div>
                            
                            <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                                {medicalRecords.length > 0 ? (
                                    medicalRecords.map(record => (
                                        <div 
                                            key={record._id} // Using API's _id
                                            className={`p-4 cursor-pointer transition duration-200 ${
                                                selectedRecord?._id === record._id ? 'bg-blue-100 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => setSelectedRecord(record)}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    {/* Extracting Doctor Name and Specialization */}
                                                    <h3 className="font-semibold text-gray-900">
                                                        {record.doctorId?.userId?.name || 'Unknown Doctor'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {record.doctorId?.userId?.specialization || 'N/A'}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {formatDate(record.createdAt)} {/* Use createdAt as list date */}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium text-red-500">Diagnosis:</span> {record.diagnosis || 'Pending'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="p-4 text-center text-gray-500">No medical records found.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Record Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg sticky top-6">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {selectedRecord ? 'Detailed Record View' : 'Select a Record'}
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                {selectedRecord ? (
                                    <div className="space-y-6">
                                        
                                        {/* Doctor Information & Date */}
                                        <div className="border-b pb-4">
                                            <h3 className="text-lg font-bold text-blue-700">
                                                Dr. {selectedRecord.doctorId?.userId?.name || 'Unknown Doctor'}
                                            </h3>
                                            <p className="text-sm text-gray-600">{selectedRecord.doctorId?.userId?.specialization || 'N/A'}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Record Date: {formatDate(selectedRecord.createdAt)}
                                            </p>
                                        </div>

                                        {/* Diagnosis */}
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                                                <span className="text-xl mr-2">🤒</span> Diagnosis
                                            </h3>
                                            <p className="text-md text-gray-700 bg-red-50 p-3 rounded-lg border border-red-200 font-medium">
                                                {selectedRecord.diagnosis || 'No official diagnosis provided yet.'}
                                            </p>
                                        </div>

                                        {/* Symptoms */}
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                                                <span className="text-xl mr-2">🤕</span> Symptoms
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRecord.symptoms && selectedRecord.symptoms.length > 0 ? (
                                                    selectedRecord.symptoms.map((symptom, index) => (
                                                        <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                            {symptom}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500">No symptoms recorded.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Prescription */}
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                                                <span className="text-xl mr-2">💊</span> Prescription
                                            </h3>
                                            <div className="space-y-3">
                                                {selectedRecord.prescription && selectedRecord.prescription.length > 0 ? (
                                                    selectedRecord.prescription.map((med, index) => (
                                                        <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                                            <div className="font-bold text-green-800">{med.medicine || 'N/A'}</div>
                                                            <div className="text-sm text-green-700">
                                                                <span className="font-medium">Dosage:</span> {med.dosage || 'N/A'} 
                                                                <span className="mx-2">•</span> 
                                                                <span className="font-medium">Frequency:</span> {med.frequency || 'N/A'} 
                                                                <span className="mx-2">•</span>
                                                                <span className="font-medium">Duration:</span> {med.duration || 'N/A'}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500">No medication prescribed.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Tests Recommended */}
                                        {selectedRecord.testsRecommended && selectedRecord.testsRecommended.length > 0 && (
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                                                    <span className="text-xl mr-2">🔬</span> Tests Recommended
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedRecord.testsRecommended.map((test, index) => (
                                                        <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                                            {test}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Doctor's Notes */}
                                        {selectedRecord.notes && (
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                                                    <span className="text-xl mr-2">📝</span> Doctor's Notes
                                                </h3>
                                                <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                                    {selectedRecord.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="text-gray-300 text-6xl mb-4">🩺</div>
                                        <p className="text-gray-500">Select a medical record from the list to view its details.</p>
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

export default PatientMedicalRecords;