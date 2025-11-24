// src/pages/patient/PatientProfile.jsx

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PersonalInfo from "../../components/PatientModal/PersonalInfo";
import ProfileHeader from "../../components/PatientModal/ProfileHeader";
import MedicalInfo from "../../components/PatientModal/MedicalInfo";
import EmergencyContact from "../../components/PatientModal/EmergencyContact";
import toast from "react-hot-toast";
import { useGetPatientProfileQuery, useUpdatePatientProfileMutation } from "../../store/services/Patient";

const PatientProfile = () => {
  const { data: patientData, isLoading, isError, refetch } = useGetPatientProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdatePatientProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm();

  // Load data into form when fetched
  useEffect(() => {
    if (patientData?.data) {
      const patient = patientData.data;
      reset({
        bloodGroup: patient.bloodGroup || "",
        allergies: patient.allergies || [],
        emergencyContact: {
          name: patient.emergencyContact?.name || "",
          phone: patient.emergencyContact?.phone || "",
          relation: patient.emergencyContact?.relation || "",
        },
      });
    }
  }, [patientData, reset]);

  // Form submit handler
  const onSubmit = async (data) => {
    try {
      const response = await updateProfile(data).unwrap();
      
      if (response.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        refetch(); // Refresh data
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (patientData?.data) {
      const patient = patientData.data;
      reset({
        bloodGroup: patient.bloodGroup || "",
        allergies: patient.allergies || [],
        emergencyContact: {
          name: patient.emergencyContact?.name || "",
          phone: patient.emergencyContact?.phone || "",
          relation: patient.emergencyContact?.relation || "",
        },
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex justify-center items-center">
        <div className="text-center bg-white rounded-xl shadow-2xl p-12">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-700 text-xl font-semibold">Loading your profile...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex justify-center items-center">
        <div className="text-center bg-white rounded-xl shadow-2xl p-12 max-w-md">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-red-600 mb-3">Failed to Load Profile</h3>
          <p className="text-gray-600 mb-6">We couldn't fetch your profile data. Please try again.</p>
          <button 
            onClick={() => refetch()}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg transform hover:scale-105"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  const patient = patientData?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">My Profile 👤</h1>
          <p className="text-blue-50 text-lg">Manage your personal and medical information</p>
        </div>

        {/* Profile Header Component */}
        <ProfileHeader 
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          patientData={patient}
          onCancel={handleCancel}
        />

        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Personal Information - READ ONLY */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform transition duration-300 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3">📋</span>
                    Personal Information
                  </h2>
                </div>
                <div className="p-6">
                  <PersonalInfo patientData={patient} />
                </div>
              </div>
            </div>

            {/* Medical Information + Emergency Contact - EDITABLE */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Medical Information */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform transition duration-300 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-5">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="mr-3">🩺</span>
                    Medical Information
                  </h2>
                </div>
                <div className="p-6">
                  <MedicalInfo 
                    isEditing={isEditing}
                    register={register}
                    control={control}
                    errors={errors}
                    patientData={patient}
                  />
                </div>
              </div>
              
              {/* Emergency Contact */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform transition duration-300 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-red-600 to-pink-500 p-5">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="mr-3">🚨</span>
                    Emergency Contact
                  </h2>
                </div>
                <div className="p-6">
                  <EmergencyContact
                    isEditing={isEditing}
                    register={register}
                    errors={errors}
                    patientData={patient}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save/Cancel Buttons - Fixed at Bottom when Editing */}
          {isEditing && (
            <div className="mt-8 bg-white rounded-xl shadow-2xl p-6 border-2 border-blue-200 sticky bottom-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">
                    {isDirty ? "You have unsaved changes" : "No changes made yet"}
                  </span>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isUpdating || !isDirty}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl transform hover:scale-105"
                  >
                    {isUpdating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Info Cards */}
          {!isEditing && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="text-lg font-bold text-blue-900">Profile Status</h3>
                </div>
                <p className="text-blue-800 font-medium">Your profile is complete and up to date</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xl">🔒</span>
                  </div>
                  <h3 className="text-lg font-bold text-green-900">Privacy</h3>
                </div>
                <p className="text-green-800 font-medium">Your data is secure and encrypted</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xl">✏️</span>
                  </div>
                  <h3 className="text-lg font-bold text-purple-900">Edit Profile</h3>
                </div>
                <p className="text-purple-800 font-medium">Click edit to update your information</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;