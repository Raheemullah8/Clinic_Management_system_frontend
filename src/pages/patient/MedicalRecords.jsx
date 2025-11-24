import React, { useState } from 'react';
import { useGetPatientMedicalRecordsQuery } from '../../store/services/MadcialRecod';

const PatientMedicalRecords = () => {
    const { 
        data: patientRecordData, 
        isLoading, 
        isError,
        error 
    } = useGetPatientMedicalRecordsQuery();
   
    const medicalRecords = patientRecordData?.data?.medicalRecords || [];
    const [selectedRecord, setSelectedRecord] = useState(null);

    React.useEffect(() => {
        if (medicalRecords.length > 0 && !selectedRecord) {
            setSelectedRecord(medicalRecords[0]);
        }
    }, [medicalRecords, selectedRecord]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
                        <p className="text-xl text-purple-600 font-medium">Loading Medical Records...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        const errorMessage = error?.data?.message || "Failed to fetch medical records.";
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center shadow-lg">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h3 className="text-2xl font-bold text-red-600 mb-2">Error Loading Records</h3>
                    <p className="text-gray-700">{errorMessage}</p>
                </div>
            </div>
        );
    }

    const totalRecords = medicalRecords.length;
    const recordsWithTests = medicalRecords.filter(record => record.testsRecommended && record.testsRecommended.length > 0).length;
    const uniqueDoctorIds = new Set(medicalRecords.map(record => record.doctorId?._id).filter(id => id));
    const doctorsVisited = uniqueDoctorIds.size;

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-xl p-8 mb-8 text-white">
                    <h1 className="text-4xl font-bold mb-2">Your Medical Records 📋</h1>
                    <p className="text-purple-50 text-lg">View your complete medical history and treatment details</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 text-center border border-blue-200 transition duration-300 hover:shadow-2xl hover:scale-105">
                        <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-3xl">📋</span>
                        </div>
                        <div className="text-4xl font-bold text-blue-800 mb-1">{totalRecords}</div>
                        <div className="text-gray-700 font-semibold">Total Records</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 text-center border border-green-200 transition duration-300 hover:shadow-2xl hover:scale-105">
                        <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-3xl">🔬</span>
                        </div>
                        <div className="text-4xl font-bold text-green-800 mb-1">{recordsWithTests}</div>
                        <div className="text-gray-700 font-semibold">Records with Tests</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 text-center border border-purple-200 transition duration-300 hover:shadow-2xl hover:scale-105">
                        <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-3xl">👨‍⚕️</span>
                        </div>
                        <div className="text-4xl font-bold text-purple-800 mb-1">{doctorsVisited}</div>
                        <div className="text-gray-700 font-semibold">Doctors Visited</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Records List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 sticky top-6">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-5 rounded-t-xl">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <span className="mr-2">📚</span>
                                    Medical History ({totalRecords})
                                </h2>
                            </div>
                            
                            <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                                {medicalRecords.length > 0 ? (
                                    medicalRecords.map(record => (
                                        <div 
                                            key={record._id}
                                            className={`p-5 cursor-pointer transition duration-300 ${
                                                selectedRecord?._id === record._id 
                                                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-600 shadow-md' 
                                                    : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                                            }`}
                                            onClick={() => setSelectedRecord(record)}
                                        >
                                            <div className="flex items-start mb-3">
                                                <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-lg">
                                                    <span className="text-white font-bold text-lg">
                                                        {record.doctorId?.userId?.name?.charAt(0) || 'D'}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900 text-lg">
                                                        Dr. {record.doctorId?.userId?.name || 'Unknown Doctor'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 font-medium">
                                                        {record.doctorId?.userId?.specialization || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="ml-15">
                                                <p className="text-sm text-gray-700 mb-2">
                                                    <span className="font-semibold text-red-600">Diagnosis:</span>{' '}
                                                    <span className="font-medium">{record.diagnosis || 'Pending'}</span>
                                                </p>
                                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {formatDate(record.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="text-5xl mb-4">📋</div>
                                        <p className="text-gray-500 font-medium">No medical records found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Record Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-100">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5 rounded-t-xl">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <span className="mr-2">🔍</span>
                                    {selectedRecord ? 'Detailed Record View' : 'Select a Record'}
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                {selectedRecord ? (
                                    <div className="space-y-6">
                                        
                                        {/* Doctor Information & Date */}
                                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 shadow-md">
                                            <div className="flex items-center mb-3">
                                                <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                                    <span className="text-white text-2xl">👨‍⚕️</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-blue-900">
                                                        Dr. {selectedRecord.doctorId?.userId?.name || 'Unknown Doctor'}
                                                    </h3>
                                                    <p className="text-blue-700 font-semibold">
                                                        {selectedRecord.doctorId?.userId?.specialization || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 font-medium bg-white px-4 py-2 rounded-lg">
                                                📅 Record Date: <span className="font-bold">{formatDate(selectedRecord.createdAt)}</span>
                                            </p>
                                        </div>

                                        {/* Diagnosis */}
                                        <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-5 shadow-md">
                                            <h3 className="font-bold text-gray-900 text-xl mb-3 flex items-center">
                                                <span className="bg-red-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">🤒</span>
                                                Diagnosis
                                            </h3>
                                            <p className="text-lg text-gray-900 bg-white p-4 rounded-lg font-semibold border-l-4 border-red-600">
                                                {selectedRecord.diagnosis || 'No official diagnosis provided yet.'}
                                            </p>
                                        </div>

                                        {/* Symptoms */}
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 shadow-md">
                                            <h3 className="font-bold text-gray-900 text-xl mb-3 flex items-center">
                                                <span className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">🤕</span>
                                                Symptoms
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                {selectedRecord.symptoms && selectedRecord.symptoms.length > 0 ? (
                                                    selectedRecord.symptoms.map((symptom, index) => (
                                                        <span key={index} className="bg-white border-2 border-blue-300 text-blue-800 px-4 py-2 rounded-lg font-semibold shadow-md">
                                                            {symptom}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 bg-white px-4 py-2 rounded-lg">No symptoms recorded.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Prescription */}
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 shadow-md">
                                            <h3 className="font-bold text-gray-900 text-xl mb-4 flex items-center">
                                                <span className="bg-green-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">💊</span>
                                                Prescription
                                            </h3>
                                            <div className="space-y-3">
                                                {selectedRecord.prescription && selectedRecord.prescription.length > 0 ? (
                                                    selectedRecord.prescription.map((med, index) => (
                                                        <div key={index} className="bg-white p-4 rounded-xl border-2 border-green-300 shadow-md hover:shadow-lg transition duration-300">
                                                            <div className="font-bold text-green-900 text-lg mb-2 flex items-center">
                                                                <span className="bg-green-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 text-sm">
                                                                    {index + 1}
                                                                </span>
                                                                {med.medicine || 'N/A'}
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                                                                <div className="bg-green-50 p-2 rounded-lg">
                                                                    <span className="font-semibold">Dosage:</span>
                                                                    <br />
                                                                    <span className="font-bold text-green-800">{med.dosage || 'N/A'}</span>
                                                                </div>
                                                                <div className="bg-green-50 p-2 rounded-lg">
                                                                    <span className="font-semibold">Frequency:</span>
                                                                    <br />
                                                                    <span className="font-bold text-green-800">{med.frequency || 'N/A'}</span>
                                                                </div>
                                                                <div className="bg-green-50 p-2 rounded-lg">
                                                                    <span className="font-semibold">Duration:</span>
                                                                    <br />
                                                                    <span className="font-bold text-green-800">{med.duration || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 bg-white px-4 py-3 rounded-lg">No medication prescribed.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Tests Recommended */}
                                        {selectedRecord.testsRecommended && selectedRecord.testsRecommended.length > 0 && (
                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5 shadow-md">
                                                <h3 className="font-bold text-gray-900 text-xl mb-3 flex items-center">
                                                    <span className="bg-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">🔬</span>
                                                    Tests Recommended
                                                </h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {selectedRecord.testsRecommended.map((test, index) => (
                                                        <span key={index} className="bg-white border-2 border-purple-300 text-purple-800 px-4 py-2 rounded-lg font-semibold shadow-md">
                                                            {test}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Doctor's Notes */}
                                        {selectedRecord.notes && (
                                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-5 shadow-md">
                                                <h3 className="font-bold text-gray-900 text-xl mb-3 flex items-center">
                                                    <span className="bg-yellow-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">📝</span>
                                                    Doctor's Notes
                                                </h3>
                                                <p className="text-gray-900 bg-white p-4 rounded-lg font-medium border-l-4 border-yellow-600">
                                                    {selectedRecord.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="text-gray-300 text-8xl mb-6">🩺</div>
                                        <p className="text-gray-500 text-xl font-medium">Select a medical record from the list to view its details</p>
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