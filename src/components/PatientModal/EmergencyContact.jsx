import React from "react";

const EmergencyContact = ({ isEditing, register, errors, patientData }) => {
  const emergencyContact = patientData?.emergencyContact || {};

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Emergency Contact
      </h2>

      <div className="space-y-4">
        <ContactField
          label="Contact Name"
          name="emergencyContact.name"
          isEditing={isEditing}
          register={register}
          error={errors.emergencyContact?.name}
          value={emergencyContact.name}
        />

        <ContactField
          label="Phone"
          name="emergencyContact.phone"
          isEditing={isEditing}
          register={register}
          error={errors.emergencyContact?.phone}
          value={emergencyContact.phone}
        />

        <ContactField
          label="Relation"
          name="emergencyContact.relation"
          isEditing={isEditing}
          register={register}
          error={errors.emergencyContact?.relation}
          value={emergencyContact.relation}
        />
      </div>
    </div>
  );
};

const ContactField = ({ label, name, isEditing, register, error, value }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {isEditing ? (
        <>
          <input
            {...register(name)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            defaultValue={value || ""}
          />
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </>
      ) : (
        <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-700">
          {value || "Not provided"}
        </div>
      )}
    </div>
  );
};

export default EmergencyContact;