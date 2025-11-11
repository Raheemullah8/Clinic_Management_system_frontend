import React from 'react';

const timeOptions = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", 
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM"
];

const weekDays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const AvailabilitySettings = ({ 
  availability, 
  onDayToggle, 
  onTimeChange, 
  onDayChange,
  onRemoveDay,
  onAvailabilityToggle 
}) => {
  return (
    <>
      {/* Overall Availability Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
        <div>
          <h3 className="font-medium text-gray-900">Accepting Appointments</h3>
          <p className="text-sm text-gray-600">
            {availability.isAvailable ? 'You are available for appointments' : 'You are not accepting appointments'}
          </p>
        </div>
        <button
          onClick={onAvailabilityToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            availability.isAvailable ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              availability.isAvailable ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Available Days List */}
      <div className="space-y-4">
        {availability.availableSlots.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-3">No availability slots added yet</p>
            <p className="text-sm text-gray-400">Click "Add Day" to start setting your availability</p>
          </div>
        ) : (
          availability.availableSlots.map((day, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  {/* Day Selection */}
                  <select
                    value={day.day}
                    onChange={(e) => onDayChange(index, e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Day</option>
                    {weekDays.map(weekDay => (
                      <option key={weekDay} value={weekDay}>{weekDay}</option>
                    ))}
                  </select>

                  {/* Availability Toggle */}
                  <button
                    onClick={() => onDayToggle(index)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      day.isAvailable ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        day.isAvailable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-500">
                    {day.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveDay(index)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition duration-200"
                >
                  Remove
                </button>
              </div>

              {day.isAvailable && day.day && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <select
                      value={day.startTime}
                      onChange={(e) => onTimeChange(index, 'startTime', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select start time</option>
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <select
                      value={day.endTime}
                      onChange={(e) => onTimeChange(index, 'endTime', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select end time</option>
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AvailabilitySettings;