import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetPatientMedicalRecordsQuery } from '../../store/services/MadcialRecod';
import { useGetPatientAppointmentsQuery } from '../../store/services/AppointmentApi';
import { useSelector } from 'react-redux';


const PatientDashboard = () => {
    const user = useSelector((state) => state.auth.user);
    
    const { 
        data: appointmentData, 
        isLoading: appointmentsLoading,
        isError: appointmentsError
    } = useGetPatientAppointmentsQuery();

    const { 
        data: medicalRecordData, 
        isLoading: recordsLoading,
        isError: recordsError
    } = useGetPatientMedicalRecordsQuery();
    
    const { 
        upcomingAppointmentsCount, 
        totalRecordsCount, 
        activePrescriptionsCount, 
        allAppointments 
    } = useMemo(() => {
        
        const allApps = appointmentData?.data?.appointments || [];
        const allRecords = medicalRecordData?.data?.medicalRecords || [];

        let upcomingApps = 0;
        let totalPrescriptions = 0;

        const isUpcoming = (appointmentDateString) => {
            if (!appointmentDateString) return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const appointmentDate = new Date(appointmentDateString);
            appointmentDate.setHours(0, 0, 0, 0);
            return appointmentDate.getTime() >= today.getTime();
        };
        
        allApps.forEach(app => {
            const status = app.status ? app.status.toLowerCase() : '';
            if (isUpcoming(app.appointmentDate) && (status === 'scheduled' || status === 'pending')) {
                upcomingApps++;
            }
        });

        const totalRecs = allRecords.length;

        allRecords.forEach(record => {
            if (Array.isArray(record.prescription) && record.prescription.length > 0) {
                totalPrescriptions += record.prescription.length; 
            } else if (record.prescription && typeof record.prescription === 'object' && record.prescription.medicine) {
                totalPrescriptions += 1;
            } else if (record.prescription && typeof record.prescription === 'string' && record.prescription.trim().length > 0) {
                 totalPrescriptions += 1;
            }
        });

        return {
            upcomingAppointmentsCount: upcomingApps,
            totalRecordsCount: totalRecs,
            activePrescriptionsCount: totalPrescriptions,
            allAppointments: allApps
        };

    }, [appointmentData, medicalRecordData]);

    if (appointmentsLoading || recordsLoading) {
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-xl text-blue-600 font-medium">Loading Dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (appointmentsError || recordsError) {
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-xl text-red-600 font-semibold mb-2">Error Loading Dashboard</p>
                    <p className="text-gray-600">Please try refreshing the page or contact support if the issue persists.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                
                {/* Welcome Section - Enhanced */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.data?.name}! 👋</h1>
                        <p className="text-blue-50 text-lg">Here's your healthcare overview and recent activities.</p>
                    </div>
                </div>

                {/* Stats Grid - Enhanced with Gradients */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* Upcoming Appointments */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-2xl hover:scale-105 border border-blue-200">
                        <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-3xl">📅</span>
                        </div>
                        <div className="text-4xl font-bold text-blue-800 mb-2">{upcomingAppointmentsCount}</div>
                        <div className="text-gray-700 font-semibold text-lg">Upcoming Appointments</div>
                        <Link to="/patient/appointments" className="text-blue-600 text-sm mt-3 inline-block hover:underline font-medium">
                            View All →
                        </Link>
                    </div>

                    {/* Medical Records */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-2xl hover:scale-105 border border-green-200">
                        <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-3xl">📋</span>
                        </div>
                        <div className="text-4xl font-bold text-green-800 mb-2">{totalRecordsCount}</div>
                        <div className="text-gray-700 font-semibold text-lg">Medical Records</div>
                        <Link to="/patient/medical-records" className="text-green-600 text-sm mt-3 inline-block hover:underline font-medium">
                            View All →
                        </Link>
                    </div>

                    {/* Active Prescriptions */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-2xl hover:scale-105 border border-purple-200">
                        <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-3xl">💊</span>
                        </div>
                        <div className="text-4xl font-bold text-purple-800 mb-2">{activePrescriptionsCount}</div>
                        <div className="text-gray-700 font-semibold text-lg">Total Prescriptions</div>
                        <Link to="/patient/medical-records" className="text-purple-600 text-sm mt-3 inline-block hover:underline font-medium">
                            View Details →
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions - Enhanced */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-xl p-6 h-full border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-lg">⚡</span>
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                
                                <Link
                                    to="/patient/book-appointment"
                                    className="flex flex-col items-center justify-center h-32 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-3 text-center hover:from-blue-100 hover:to-blue-200 hover:shadow-lg transition duration-300 transform hover:scale-105"
                                >
                                    <div className="text-blue-600 text-3xl mb-2">✍️</div>
                                    <div className="font-semibold text-blue-900 text-sm">Book Appointment</div>
                                </Link>

                                <Link
                                    to="/patient/appointments"
                                    className="flex flex-col items-center justify-center h-32 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-3 text-center hover:from-green-100 hover:to-green-200 hover:shadow-lg transition duration-300 transform hover:scale-105"
                                >
                                    <div className="text-green-600 text-3xl mb-2">🗓️</div>
                                    <div className="font-semibold text-green-900 text-sm">View Appointments</div>
                                </Link>

                                <Link
                                    to="/patient/medical-records"
                                    className="flex flex-col items-center justify-center h-32 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-3 text-center hover:from-purple-100 hover:to-purple-200 hover:shadow-lg transition duration-300 transform hover:scale-105"
                                >
                                    <div className="text-purple-600 text-3xl mb-2">📚</div>
                                    <div className="font-semibold text-purple-900 text-sm">Medical Records</div>
                                </Link>
                                
                                <Link 
                                    to={"/patient/profile"}
                                    className="flex flex-col items-center justify-center h-32 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-3 text-center hover:from-gray-100 hover:to-gray-200 hover:shadow-lg transition duration-300 transform hover:scale-105"
                                >
                                    <div className="text-gray-600 text-3xl mb-2">👤</div>
                                    <div className="font-semibold text-gray-900 text-sm">My Profile</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Next Appointment and Recent Records */}
                    <div className="lg:col-span-2 space-y-6">
                        <NextAppointment upcomingAppointmentsCount={upcomingAppointmentsCount} allAppointments={allAppointments} />
                        <RecentMedicalRecords medicalRecords={medicalRecordData?.data?.medicalRecords || []} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PatientDashboard;


// Next Appointment Component - Enhanced
const NextAppointment = ({ upcomingAppointmentsCount, allAppointments }) => {
    
    const nextAppointment = useMemo(() => {
        const isUpcoming = (appointmentDateString) => {
            if (!appointmentDateString) return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const appointmentDate = new Date(appointmentDateString);
            appointmentDate.setHours(0, 0, 0, 0);
            return appointmentDate.getTime() >= today.getTime();
        };

        const upcoming = (allAppointments || []).filter(app => {
            const status = app.status ? app.status.toLowerCase() : '';
            return (status === 'scheduled' || status === 'pending') && isUpcoming(app.appointmentDate);
        }).sort((a, b) => {
            const dateA = new Date(a.appointmentDate + ' ' + a.appointmentTime);
            const dateB = new Date(b.appointmentDate + ' ' + b.appointmentTime);
            return dateA - dateB;
        });

        return upcoming.length > 0 ? upcoming[0] : null;

    }, [allAppointments]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5 rounded-t-xl">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="mr-2">📅</span>
                    Your Next Appointment ({upcomingAppointmentsCount})
                </h2>
            </div>
            <div className="p-6">
                {nextAppointment ? (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200 shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className='mb-4 sm:mb-0 sm:pr-6 flex-1'>
                                <div className="flex items-center mb-3">
                                    <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white text-xl">👨‍⚕️</span>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-blue-900">
                                            Dr. {nextAppointment.doctorId?.userId?.name || 'N/A'}
                                        </p>
                                        <p className="text-sm text-blue-700">
                                            {nextAppointment.doctorId?.userId?.specialization || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2 ml-15">
                                    <p className="text-md font-semibold text-gray-800 flex items-center">
                                        <span className="mr-2">📆</span>
                                        {formatDate(nextAppointment.appointmentDate)} at {nextAppointment.appointmentTime || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-700 flex items-center">
                                        <span className="mr-2">📋</span>
                                        <span className="font-medium">{nextAppointment.reason || 'General Consultation'}</span>
                                    </p>
                                </div>
                            </div>
                            <Link to="/patient/appointments">
                                <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:scale-105">
                                    View Details →
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <div className="text-5xl mb-4">📅</div>
                        <p className="text-gray-600 text-lg font-medium mb-4">No upcoming appointments scheduled</p>
                        <Link to="/patient/book-appointment">
                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                                Book Your First Appointment →
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};


// Recent Medical Records Component - Enhanced
const RecentMedicalRecords = ({ medicalRecords }) => {
    const recentRecords = medicalRecords.slice(0, 3); 

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-5 rounded-t-xl">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="mr-2">📚</span>
                    Recent Medical Records
                </h2>
            </div>
            <div className="p-4 divide-y divide-gray-200">
                {recentRecords.length > 0 ? (
                    recentRecords.map(record => (
                        <div key={record._id} className="py-4 flex justify-between items-start hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition duration-200 px-4 rounded-lg">
                            <div className="flex-1 flex items-start">
                                <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                    <span className="text-purple-600 text-lg">📑</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 text-lg mb-1">
                                        {record.diagnosis || 'Diagnosis Pending'}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center">
                                        <span className="mr-1">👨‍⚕️</span>
                                        Dr. {record.doctorId?.userId?.name || 'N/A'} 
                                        <span className="mx-2">•</span>
                                        {record.doctorId?.userId?.specialization || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 mt-1">
                                {formatDate(record.createdAt)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <div className="text-5xl mb-4">📋</div>
                        <p className="text-gray-600 text-lg font-medium mb-4">No medical records found yet</p>
                        <Link to="/patient/medical-records">
                            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow-lg">
                                View Records Page →
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};