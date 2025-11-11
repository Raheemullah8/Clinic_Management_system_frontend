import React from 'react';

const AvailabilityPreview = ({ availableSlots }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability Preview</h2>
      
      <div className="space-y-3">
        {availableSlots.map(day => (
          <div key={day.day} className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-700">{day.day}</span>
            <span className={`text-sm px-2 py-1 rounded ${
              day.isAvailable && day.startTime && day.endTime 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {day.isAvailable && day.startTime && day.endTime 
                ? `${day.startTime} - ${day.endTime}` 
                : 'Not Available'
              }
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 Patients will only see available time slots based on these settings.
        </p>
      </div>
    </div>
  );
};

export default AvailabilityPreview;