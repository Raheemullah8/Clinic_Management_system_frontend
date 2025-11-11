import React from "react";

const ProfileHeader = ({ isEditing, setIsEditing, patientData }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">
          Manage your personal and medical information
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Note: Personal information can only be updated by admin
        </p>
      </div>
      <button
        onClick={() => setIsEditing(!isEditing)}
        type="button"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        {isEditing ? "Cancel Editing" : "Edit Profile"}
      </button>
    </div>
  );
};

export default ProfileHeader;