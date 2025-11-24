import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useGetAllDoctorsQuery } from '../../store/services/DoctorApi';
import { useGetAvailableSlotsQuery, useCreateAppointmentMutation } from '../../store/services/AppointmentApi';

const BookAppointment = () => {
  const { data: doctorsData, isLoading, isError } = useGetAllDoctorsQuery();
  const doctors = doctorsData?.data?.doctors || [];
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      doctorId: '',
      appointmentDate: '',
      timeSlot: '',
      reason: '',
    },
  });

  const selectedDate = watch('appointmentDate');
  const selectedTime = watch('timeSlot');

  const currentDoctor = doctors.find((doc) => doc._id === selectedDoctorId);

  const { data: slotsData, isLoading: slotsLoading } = useGetAvailableSlotsQuery(
    { doctorId: selectedDoctorId, date: selectedDate },
    { skip: !selectedDoctorId || !selectedDate }
  );

  const availableTimeSlots = slotsData?.data?.availableSlots || [];
  const [createAppointment, { isLoading: isBooking }] = useCreateAppointmentMutation();

  const availableDays = useMemo(() => {
    if (!currentDoctor) return [];
    return (
      currentDoctor.availableSlots
        ?.filter((slot) => slot.isAvailable)
        .map((slot) => slot.day) || []
    );
  }, [currentDoctor]);

  const isDateAvailable = (dateString) => {
    if (!dateString || !currentDoctor) return false;
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
    return availableDays.includes(dayName);
  };

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setValue('doctorId', doctorId);
    setValue('appointmentDate', '');
    setValue('timeSlot', '');
  };

  const onSubmit = async (data) => {
    if (!isDateAvailable(data.appointmentDate)) {
      alert('Doctor is not available on this selected day!');
      return;
    }

    try {
      const result = await createAppointment(data).unwrap();
      console.log('Appointment booked:', result);
      alert('Appointment booked successfully! ✅');
      reset();
      setSelectedDoctorId('');
    } catch (error) {
      console.error('Booking error:', error);
      alert(error?.data?.message || 'Failed to book appointment. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-xl text-blue-600 font-medium">Loading doctors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center shadow-lg">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-xl text-red-600 font-bold">Error loading doctors. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Book Appointment 📅</h1>
          <p className="text-blue-50 text-lg">Browse all doctors and their availability schedules</p>
        </div>

        {/* All Doctors List with Availability */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">👨‍⚕️</span>
              Available Doctors ({doctors.length})
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className={`border-2 rounded-xl p-6 transition duration-300 cursor-pointer transform hover:scale-105 ${
                    selectedDoctorId === doctor._id
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                  }`}
                  onClick={() => handleDoctorSelect(doctor._id)}
                >
                  {/* Doctor Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mr-4 shadow-lg">
                        <span className="text-white text-2xl font-bold">
                          {doctor.userId?.name?.charAt(0) || 'D'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          Dr. {doctor.userId?.name || 'Unknown'}
                        </h3>
                        <p className="text-blue-600 font-semibold mb-1">
                          {doctor.userId?.specialization || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          📧 {doctor.userId?.email || 'N/A'}
                        </p>
                        {doctor.userId?.phone && (
                          <p className="text-sm text-gray-600">
                            📞 {doctor.userId.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    {selectedDoctorId === doctor._id && (
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Selected ✓
                      </div>
                    )}
                  </div>

                  {/* Consultation Fee */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-semibold">Consultation Fee:</span>
                      <span className="text-green-700 font-bold text-lg">
                        Rs. {doctor.userId?.consultationFee || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Room Number */}
                  {doctor.roomNumber && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center">
                        <span className="text-purple-600 mr-2">📍</span>
                        <span className="text-gray-700 font-semibold mr-2">Room:</span>
                        <span className="text-purple-700 font-bold">{doctor.roomNumber}</span>
                      </div>
                    </div>
                  )}

                  {/* Availability Schedule */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center">
                      <span className="mr-2">📅</span>
                      Availability Schedule
                    </h4>
                    <div className="space-y-2">
                      {doctor.availableSlots?.filter((slot) => slot.isAvailable).length > 0 ? (
                        doctor.availableSlots
                          .filter((slot) => slot.isAvailable)
                          .map((slot, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-300 shadow-sm"
                            >
                              <span className="font-bold text-green-900 flex items-center">
                                <span className="bg-green-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 text-sm">
                                  {idx + 1}
                                </span>
                                {slot.day}
                              </span>
                              <span className="text-green-700 font-semibold bg-green-100 px-3 py-1 rounded-lg">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          ))
                      ) : (
                        <p className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded-lg">
                          No available slots
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    type="button"
                    onClick={() => handleDoctorSelect(doctor._id)}
                    className={`w-full mt-4 py-3 rounded-lg font-bold transition duration-300 transform hover:scale-105 ${
                      selectedDoctorId === doctor._id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {selectedDoctorId === doctor._id ? '✓ Selected - Continue Below' : 'Select This Doctor'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointment Booking Form - Only show when doctor is selected */}
        {selectedDoctorId && (
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">📝</span>
              Complete Your Appointment
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              
              {/* Selected Doctor Summary */}
              <div className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-5 shadow-md">
                <h3 className="font-bold text-blue-900 mb-2 text-lg">Selected Doctor:</h3>
                <div className="flex items-center">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xl font-bold">
                      {currentDoctor?.userId?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      Dr. {currentDoctor?.userId?.name}
                    </p>
                    <p className="text-blue-600 font-semibold">
                      {currentDoctor?.userId?.specialization}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="bg-purple-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-white">📆</span>
                  Select Appointment Date *
                </label>
                <input
                  type="date"
                  {...register('appointmentDate', { required: 'Appointment date is required' })}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setValue('appointmentDate', e.target.value);
                    setValue('timeSlot', '');
                  }}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg transition duration-200"
                />
                {errors.appointmentDate && (
                  <p className="text-sm text-red-600 mt-2 font-medium flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.appointmentDate.message}
                  </p>
                )}
                {selectedDate && !isDateAvailable(selectedDate) && (
                  <div className="mt-3 bg-red-50 border-2 border-red-300 rounded-xl p-4">
                    <p className="text-red-700 font-semibold flex items-center">
                      <span className="text-2xl mr-2">⚠️</span>
                      Doctor is not available on this day. Please select from the available days shown above.
                    </p>
                  </div>
                )}
              </div>

              {/* Time Slot Selection */}
              {selectedDate && isDateAvailable(selectedDate) && (
                <div className="mb-6">
                  <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <span className="bg-orange-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-white">🕐</span>
                    Select Time Slot *
                  </label>
                  {slotsLoading ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-600 font-medium">Loading available slots...</p>
                    </div>
                  ) : availableTimeSlots.length > 0 ? (
                    <>
                      <p className="text-gray-600 mb-4 font-semibold bg-blue-50 p-3 rounded-lg border border-blue-200">
                        ✓ {availableTimeSlots.length} slots available
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {availableTimeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setValue('timeSlot', slot)}
                            className={`p-4 border-2 rounded-xl text-center transition duration-300 font-bold text-lg transform hover:scale-105 ${
                              selectedTime === slot
                                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-600 shadow-xl scale-105'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400 shadow-md'
                            }`}
                          >
                            🕐 {slot}
                          </button>
                        ))}
                      </div>
                      {errors.timeSlot && (
                        <p className="text-sm text-red-600 mt-2 font-medium flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.timeSlot.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 text-center">
                      <div className="text-5xl mb-3">😔</div>
                      <p className="text-yellow-800 font-bold text-lg">
                        No time slots available for this date. Please try another date.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Reason for Appointment */}
              <div className="mb-6">
                <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="bg-teal-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-white">📝</span>
                  Reason for Appointment *
                </label>
                <textarea
                  {...register('reason', { required: 'Reason is required' })}
                  placeholder="Describe your symptoms or reason for visit..."
                  rows="5"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg resize-none transition duration-200"
                />
                {errors.reason && (
                  <p className="text-sm text-red-600 mt-2 font-medium flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.reason.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isBooking || !selectedTime}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isBooking ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Booking...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">✓</span>
                      Confirm Appointment
                    </span>
                  )}
                </button>
                <Link
                  to="/patient/appointments"
                  className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-200 transition duration-300 text-center shadow-lg transform hover:scale-105"
                >
                  View My Appointments
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* Quick Info */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-blue-900 mb-4 text-xl flex items-center">
            <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3">📋</span>
            Before Your Visit
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="mr-3 text-xl">✓</span>
              <span className="font-medium">Arrive 15 minutes before your scheduled time</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-xl">✓</span>
              <span className="font-medium">Bring your ID and insurance card</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-xl">✓</span>
              <span className="font-medium">Note down any medications you're currently taking</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-xl">✓</span>
              <span className="font-medium">Prepare questions for your doctor</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;