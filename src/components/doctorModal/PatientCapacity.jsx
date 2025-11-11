import React from 'react';

const PatientCapacity = ({ maxPatientsPerDay, onMaxPatientsChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Capacity</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Patients Per Day
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="50"
              value={maxPatientsPerDay}
              onChange={(e) => onMaxPatientsChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-lg font-bold text-blue-600 min-w-12">
              {maxPatientsPerDay}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This limits the number of appointments you can accept per day
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientCapacity;