import React, { useState, useEffect } from 'react';
import { useGetDoctorAvailabilityQuery } from '../../store/services/DoctorApi';

const DoctorAvailability = () => {
  const { data: availabilityData, isLoading } = useGetDoctorAvailabilityQuery();
  const [availableSlots, setAvailableSlots] = useState([]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Load data from API
  useEffect(() => {
    if (availabilityData?.data?.availableSlots) {
      setAvailableSlots(availabilityData.data.availableSlots);
    }
  }, [availabilityData]);

  // Group slots by day for better display
  const getSlotsByDay = (day) => {
    return availableSlots.filter(slot => slot.day === day && slot.isAvailable);
  };

  // const formatTimeDisplay = (slot) => {
  //   if (!slot.isAvailable) return "Not Available";
  //   if (!slot.startTime || !slot.endTime) return "Time not set";
  //   return `${slot.startTime} - ${slot.endTime}`;
  // };

  const getStatusColor = (slot) => {
    if (!slot.isAvailable) return 'bg-red-100 text-red-800';
    if (!slot.startTime || !slot.endTime) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (slot) => {
    if (!slot.isAvailable) return 'Not Available';
    if (!slot.startTime || !slot.endTime) return 'Incomplete';
    return 'Available';
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <div key={n} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Availability Schedule</h1>
          <p className="text-gray-600 mt-2">View your current working hours and availability status</p>
        </div>

        {/* Stats Summary */}
        {availableSlots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {availableSlots.filter(slot => slot.isAvailable && slot.startTime && slot.endTime).length}
              </div>
              <div className="text-sm text-blue-800">Available Days</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {availableSlots.filter(slot => !slot.isAvailable).length}
              </div>
              <div className="text-sm text-green-800">Unavailable Days</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {availableSlots.length}
              </div>
              <div className="text-sm text-purple-800">Total Slots</div>
            </div>
          </div>
        )}

        {/* Weekly Schedule */}
        <div className="space-y-4">
          {days.map(day => {
            const daySlots = getSlotsByDay(day);
            const allDaySlots = availableSlots.filter(slot => slot.day === day);
            const isDayAvailable = allDaySlots.some(slot => slot.isAvailable);

            return (
              <div key={day} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      isDayAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-semibold text-gray-900 text-lg min-w-28">{day}</span>
                  </div>
                  
                  <div className="flex-1">
                    {daySlots.length > 0 ? (
                      <div className="space-y-2">
                        {daySlots.map((slot, index) => (
                          <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-gray-700 font-medium">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(slot)}`}>
                              {getStatusText(slot)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-gray-500 italic">No available slots</span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          Not Available
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {availableSlots.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⏰</div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">No Availability Set</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't set any availability slots yet. Visit your profile page to set your working hours.
            </p>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
              <p className="text-blue-800 text-sm">
                💡 <strong>Note:</strong> Go to Profile → Manage Availability to set your schedule
              </p>
            </div>
          </div>
        )}

        {/* Current Slots Summary */}
        {availableSlots.length > 0 && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Current Availability Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {days.map(day => {
                const daySlots = availableSlots.filter(slot => slot.day === day && slot.isAvailable && slot.startTime && slot.endTime);
                return daySlots.length > 0 ? (
                  <div key={day} className="flex justify-between items-center py-1">
                    <span className="text-gray-600">{day}:</span>
                    <span className="text-gray-900 font-medium">
                      {daySlots.map(slot => `${slot.startTime}-${slot.endTime}`).join(', ')}
                    </span>
                  </div>
                ) : null;
              }).filter(Boolean)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAvailability;