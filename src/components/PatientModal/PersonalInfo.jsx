import React from "react";

const PersonalInfo = ({ patientData }) => {
  // ✅ Directly use patientData since it's not nested under userId
  const user = patientData;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Personal Information
      </h2>

      {/* Profile Image */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500">
            Profile image can be updated by admin
          </p>
        </div>
      </div>

      {/* Personal info fields - READ ONLY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReadOnlyField label="Full Name" value={user.name} />
        <ReadOnlyField label="Email" value={user.email} />
        <ReadOnlyField label="Phone" value={user.phone} />
        <ReadOnlyField label="Date of Birth" value={user.dateOfBirth} />
        <ReadOnlyField label="Gender" value={user.gender} />
        <ReadOnlyField label="Address" value={user.address} spanFull />
      </div>
    </div>
  );
};

const ReadOnlyField = ({ label, value, spanFull = false }) => (
  <div className={spanFull ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-700">
      {value || "Not provided"}
    </div>
  </div>
);

export default PersonalInfo;