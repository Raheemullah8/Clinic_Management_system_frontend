import React from 'react';

const SaveButton = ({ onSave, isLoading }) => {
  return (
    <button
      onClick={onSave}
      disabled={isLoading}
      className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
        isLoading 
          ? 'bg-blue-400 cursor-not-allowed text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {isLoading ? 'Saving...' : 'Save Availability Settings'}
    </button>
  );
};

export default SaveButton;