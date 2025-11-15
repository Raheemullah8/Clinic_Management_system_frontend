import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetPatientMedicalRecordsQuery } from '../../store/services/MadcialRecod';
import { useGetPatientAppointmentsQuery } from '../../store/services/AppointmentApi';
import { useSelector } from 'react-redux';


const PatientDashboard = () => {
    // Hooks to fetch data
    const user = useSelector((state) => state.auth.user);
    console.log("Logged-in Patient:", user);
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
    
    // --- Data Processing and Stats Calculation (Memoized for Performance) ---
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

        // Utility to check if a date is today or in the future
        const isUpcoming = (appointmentDateString) => {
            if (!appointmentDateString) return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const appointmentDate = new Date(appointmentDateString);
            appointmentDate.setHours(0, 0, 0, 0);
            return appointmentDate.getTime() >= today.getTime();
        };
        
        // 1. Appointments Data Processing
        allApps.forEach(app => {
            const status = app.status ? app.status.toLowerCase() : '';
            // Count if status is scheduled/pending AND date is today or future
            if (isUpcoming(app.appointmentDate) && (status === 'scheduled' || status === 'pending')) {
                upcomingApps++;
            }
        });

        // 2. Medical Records Data Processing
        const totalRecs = allRecords.length;

        // 3. Active Prescriptions (Counting total prescriptions across all records)
        allRecords.forEach(record => {
            // Logic to handle prescriptions (can be array, object, or string)
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


    // --- Loading State Handling ---
    if (appointmentsLoading || recordsLoading) {
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
                <p className="text-xl text-blue-600">Loading Dashboard Data... ⏳</p>
            </div>
        );
    }

    // --- Error State Handling ---
    if (appointmentsError || recordsError) {
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
                <p className="text-xl text-red-600">Error loading dashboard data. Please try again.</p>
            </div>
        );
    }
    
    // Hardcoded Patient Name (Replace "Patient" with a state variable if you have a profile hook)
    const patientName = "John";


    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                
                {/* Welcome Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.data?.name}! 👋</h1>
                    <p className="text-gray-600">Here's your healthcare overview and recent activities.</p>
                </div>

                {/* Stats Grid - Dynamic Data */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-xl">
                        <div className="text-2xl mb-2 text-blue-600">📅</div>
                        <div className="text-3xl font-bold text-blue-700 mb-1">{upcomingAppointmentsCount}</div>
                        <div className="text-gray-600 font-medium">Upcoming Appointments</div>
                    </div>

                    {/* Medical Records */}
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-xl">
                        <div className="text-2xl mb-2 text-green-600">📋</div>
                        <div className="text-3xl font-bold text-green-700 mb-1">{totalRecordsCount}</div>
                        <div className="text-gray-600 font-medium">Medical Records</div>
                    </div>

                    {/* Active Prescriptions */}
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:shadow-xl">
                        <div className="text-2xl mb-2 text-purple-600">💊</div>
                        <div className="text-3xl font-bold text-purple-700 mb-1">{activePrescriptionsCount}</div>
                        <div className="text-gray-600 font-medium">Total Prescriptions on Record</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-4">
                                
                                <Link
                                    to="/patient/book-appointment"
                                    className="flex flex-col items-center justify-center h-28 bg-blue-50 border border-blue-200 rounded-lg p-2 text-center hover:bg-blue-100 transition duration-200"
                                >
                                    <div className="text-blue-600 text-2xl mb-1">✍️</div>
                                    <div className="font-medium text-blue-900 text-sm">Book Appointment</div>
                                </Link>

                                <Link
                                    to="/patient/appointments"
                                    className="flex flex-col items-center justify-center h-28 bg-green-50 border border-green-200 rounded-lg p-2 text-center hover:bg-green-100 transition duration-200"
                                >
                                    <div className="text-green-600 text-2xl mb-1">🗓️</div>
                                    <div className="font-medium text-green-900 text-sm">View Appointments</div>
                                </Link>

                                <Link
                                    to="/patient/medical-records"
                                    className="flex flex-col items-center justify-center h-28 bg-purple-50 border border-purple-200 rounded-lg p-2 text-center hover:bg-purple-100 transition duration-200"
                                >
                                    <div className="text-purple-600 text-2xl mb-1">📚</div>
                                    <div className="font-medium text-purple-900 text-sm">Medical Records</div>
                                </Link>
                                
                                <Link 
                                    to={"/patient/profile"}
                                    className="flex flex-col items-center justify-center h-28 bg-gray-50 border border-gray-200 rounded-lg p-2 text-center hover:bg-gray-100 transition duration-200"
                                >
                                    <div className="text-gray-600 text-2xl mb-1">👤</div>
                                    <div className="font-medium text-gray-900 text-sm">Profile</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Next Appointment and Recent Records */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Next Appointment */}
                        <NextAppointment upcomingAppointmentsCount={upcomingAppointmentsCount} allAppointments={allAppointments} />

                        {/* Recent Medical Records */}
                        <RecentMedicalRecords medicalRecords={medicalRecordData?.data?.medicalRecords || []} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PatientDashboard;


// --- Helper Components ---

// 1. Next Appointment Component
const NextAppointment = ({ upcomingAppointmentsCount, allAppointments }) => {
    
    // Find the next closest upcoming appointment
    const nextAppointment = useMemo(() => {
        // Utility to check if a date is today or in the future
        const isUpcoming = (appointmentDateString) => {
            if (!appointmentDateString) return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const appointmentDate = new Date(appointmentDateString);
            appointmentDate.setHours(0, 0, 0, 0);
            return appointmentDate.getTime() >= today.getTime();
        };

        // Filter and sort appointments
        const upcoming = (allAppointments || []).filter(app => {
            const status = app.status ? app.status.toLowerCase() : '';
            // Upcoming = Scheduled/Pending AND date is today or future
            return (status === 'scheduled' || status === 'pending') && isUpcoming(app.appointmentDate);
        }).sort((a, b) => {
            // Sort by Date, then TimeSlot
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
        <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Your Next Appointment ({upcomingAppointmentsCount})</h2>
            </div>
            <div className="p-6">
                {nextAppointment ? (
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className='mb-3 sm:mb-0 sm:pr-4'>
                            <p className="text-lg font-bold text-blue-800 mb-1">
                                {formatDate(nextAppointment.appointmentDate)} at {nextAppointment.appointmentTime || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-700 font-medium">
                                **{nextAppointment.reason || 'General Consultation'}**
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                With Dr. {nextAppointment.doctorId?.userId?.name || 'N/A'} ({nextAppointment.doctorId?.userId?.specialization || 'N/A'})
                            </p>
                        </div>
                        <Link to="/patient/appointments">
                            <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                                View Details
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-500">You currently have no upcoming appointments.</p>
                        <Link to="/patient/book-appointment" className="text-blue-600 text-sm font-medium mt-2 block hover:underline">
                            Book a new appointment →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};


// 2. Recent Medical Records Component
const RecentMedicalRecords = ({ medicalRecords }) => {
    // Get the top 3 most recent records
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
        <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Medical Records</h2>
            </div>
            <div className="p-4 divide-y divide-gray-100">
                {recentRecords.length > 0 ? (
                    recentRecords.map(record => (
                        <div key={record._id} className="py-3 flex justify-between items-start hover:bg-gray-50 transition duration-150 px-2 rounded-lg">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 flex items-center">
                                    <span className="text-lg mr-2 text-purple-600">📑</span>
                                    {record.diagnosis || 'Diagnosis Pending'}
                                </p>
                                <p className="text-sm text-gray-600 ml-5">
                                    Dr. {record.doctorId?.userId?.name || 'N/A'} ({record.doctorId?.userId?.specialization || 'N/A'})
                                </p>
                            </div>
                            <span className="text-xs text-gray-500 font-medium flex-shrink-0 mt-1">
                                {formatDate(record.createdAt)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-500">No medical records found yet.</p>
                        <Link to="/patient/medical-records" className="text-purple-600 text-sm font-medium mt-2 block hover:underline">
                            View Records Page →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};