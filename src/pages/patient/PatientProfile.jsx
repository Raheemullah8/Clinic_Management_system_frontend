import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetUserQuery } from "../../store/services/AuthApi";
import PersonalInfo from "../../components/PatientModal/PersonalInfo";
import ProfileHeader from "../../components/PatientModal/ProfileHeader";
import MedicalInfo from "../../components/PatientModal/MedicalInfo";
import EmergencyContact from "../../components/PatientModal/EmergencyContact";

const PatientProfile = () => {
  const { data: userData, isLoading, isError } = useGetUserQuery();
  const [isEditing, setIsEditing] = useState(false);
  
;
  console.log("User Data Structure:", userData?.data.user);

  // ✅ Dummy Medical Data - kyunki user data mein medical fields nahi hain
  const dummyMedicalData = {
    bloodGroup: "A+",
    allergies: ["Penicillin", "Dust", "Pollen"],
    emergencyContact: {
      name: "Jane Doe",
      phone: "+1 (555) 987-6543",
      relation: "Spouse"
    }
  };

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm();

  // ✅ Load data into form
  useEffect(() => {
    if (userData?.data.user) {
      // Combine user data with medical data
      const combinedData = {
        ...userData.data.user,
        ...dummyMedicalData
      };
      
      reset({
        bloodGroup: combinedData.bloodGroup || "",
        allergies: combinedData.allergies || [],
        emergencyContact: combinedData.emergencyContact || {
          name: "",
          phone: "",
          relation: "",
        },
      });
    }
  }, [userData, reset]);

  // ✅ Form submit
  const onSubmit = async (data) => {
    try {
      console.log("Updated Patient Profile:", data);
      
      // Dummy success simulation
      setTimeout(() => {
        alert("Profile updated successfully!");
        setIsEditing(false);
        
        // Update medical data with new values
        dummyMedicalData.bloodGroup = data.bloodGroup;
        dummyMedicalData.allergies = data.allergies;
        dummyMedicalData.emergencyContact = data.emergencyContact;
      }, 1000);
      
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed. Please try again.");
    }
  };

  const handleCancel = () => {
    // Reset form with current data
    if (userData?.data.user) {
      const combinedData = {
        ...userData.data.user,
        ...dummyMedicalData
      };
      reset({
        bloodGroup: combinedData.bloodGroup || "",
        allergies: combinedData.allergies || [],
        emergencyContact: combinedData.emergencyContact || {
          name: "",
          phone: "",
          relation: "",
        },
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (isError) {
    console.log("Using dummy data due to API error");
    // Continue with dummy data instead of showing error
  }

  // ✅ Combine user data with medical data for display
  const patientData = userData?.data.user ? {
    ...userData.data.user,
    ...dummyMedicalData
  } : {
    // Fallback to complete dummy data if no API data
    userId: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, New York, NY 10001",
      dateOfBirth: "1985-06-15",
      gender: "Male",
      profileImage: ""
    },
    ...dummyMedicalData
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <ProfileHeader 
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          patientData={patientData}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information - READ ONLY */}
            <div className="lg:col-span-2">
              <PersonalInfo patientData={patientData} />
            </div>

            {/* Medical Information + Emergency Contact - EDITABLE */}
            <div className="lg:col-span-1 space-y-6">
              <MedicalInfo 
                isEditing={isEditing}
                register={register}
                control={control}
                errors={errors}
                patientData={patientData}
              />
              
              <EmergencyContact
                isEditing={isEditing}
                register={register}
                errors={errors}
                patientData={patientData}
              />
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PatientProfile;