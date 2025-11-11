import React from "react";
import { useFieldArray } from "react-hook-form";

const MedicalInfo = ({ isEditing, register, control, errors, patientData }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "allergies",
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Medical Information
      </h2>

      {/* Blood Group */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Blood Group
        </label>
        {isEditing ? (
          <>
            <select
              {...register("bloodGroup")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              defaultValue={patientData?.bloodGroup || ""}
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                )
              )}
            </select>
            {errors.bloodGroup && (
              <p className="text-red-500 text-sm">{errors.bloodGroup.message}</p>
            )}
          </>
        ) : (
          <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-700">
            {patientData?.bloodGroup || "Not provided"}
          </div>
        )}
      </div>

      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Allergies
        </label>
        <div className="space-y-2">
          {isEditing ? (
            <>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`allergies.${index}`)}
                    placeholder="Allergy name"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    defaultValue={field.value || ""}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-100 text-red-600 px-3 rounded-lg hover:bg-red-200 transition duration-200"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append("")}
                className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition duration-200"
              >
                + Add Allergy
              </button>
            </>
          ) : (
            <div className="space-y-1">
              {patientData?.allergies?.length > 0 ? (
                patientData.allergies.map((allergy, index) => (
                  <div
                    key={index}
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-700"
                  >
                    {allergy}
                  </div>
                ))
              ) : (
                <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-500">
                  No allergies recorded
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalInfo;