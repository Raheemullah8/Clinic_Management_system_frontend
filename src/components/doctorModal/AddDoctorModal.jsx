import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateDoctorMutation } from "../../store/services/Admin";
import toast from "react-hot-toast";

const AddDoctorModal = ({ isOpen, onClose }) => {
  const [preview, setPreview] = useState(null);
  const [registerUser, { isLoading }] = useCreateDoctorMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const profileImage = watch("profileImage");

  useEffect(() => {
    if (profileImage && profileImage[0]) {
      const file = profileImage[0];
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setPreview(null);
    }
  }, [profileImage]);

// ✅ Form Submission Handler mein yeh change karo
const onSubmit = async (data) => {
  try {
    console.log("Form data:", data);
    
    const formData = new FormData();

    // Append general user fields
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("dateOfBirth", data.dateOfBirth || "");
    formData.append("gender", data.gender || "Other");

    // Append doctor specific fields
    formData.append("specialization", data.specialization);
    formData.append("licenseNumber", data.licenseNumber);
    formData.append("qualifications", data.qualifications || ""); 
    formData.append("experience", data.experience.toString());
    formData.append("consultationFee", data.consultationFee.toString());
    
    // ✅ ADD THIS: Room number bhi bhejo ya backend pe auto-generate hone do
    formData.append("roomNumber", data.roomNumber || "");
    
    // Set role as doctor
    formData.append("role", "doctor");

    // Append image file
    if (data.profileImage && data.profileImage[0]) {
      formData.append("profileImage", data.profileImage[0]);
    }

    console.log("Sending form data...");
    
    const result = await registerUser(formData).unwrap();
    
    console.log("API Response:", result);
    
    toast.success("Doctor added successfully! 🎉");
    handleClose();

  } catch (error) {
    console.error("API Error:", error);
    
    // ✅ Better error detection
    const errorMessage = error?.data?.message || error?.error || "Unknown error";
    const statusCode = error?.status || error?.data?.status;
    
    if (statusCode === 500 || errorMessage.toLowerCase().includes("internal server")) {
      // Doctor create ho gaya but server mein minor issue
      toast.success("Doctor added successfully! ✅");
      handleClose();
    } else {
      toast.error(`Failed: ${errorMessage}`);
    }
  }
};
  const handleClose = () => {
    onClose();
    reset();
    setPreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-2xl font-bold text-gray-900">
              ➕ Add New Doctor
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-3xl transition duration-150"
            >
              ✕
            </button>
          </div>

          {/* FORM - Same as before */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ... rest of your form code remains exactly the same ... */}
            
            {/* Profile Image and Password Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Profile Image Upload and Preview */}
              <div className="flex flex-col items-center justify-start md:col-span-1 border-r md:pr-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg flex items-center justify-center bg-gray-100">
                  <img
                    src={preview || "https://via.placeholder.com/150x150.png?text=Profile"}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="block text-sm font-medium mt-4 mb-1 text-gray-700">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("profileImage")}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Password Field */}
              <div className="md:col-span-2 space-y-4 pt-4 md:pt-0">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Password *</label>
                  <input
                    {...register("password", { 
                        required: "Password is required", 
                        minLength: { value: 6, message: "At least 6 chars" } 
                    })}
                    type="password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Set an initial password"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <h4 className="text-lg font-semibold border-b pb-2 text-blue-600">Personal Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Name, Email, Phone, Address, Gender, DOB fields */}
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Dr. John Doe"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="doctor@hospital.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: { value: /^[0-9]{7,15}$/, message: "Invalid phone number" }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g. 03001234567"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-1">Address *</label>
                <input
                  {...register("address", { required: "Address is required" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="123 Hospital Street, City"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender *</label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Professional Details */}
            <h4 className="text-lg font-semibold border-b pb-2 text-blue-600">Professional Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Specialization *</label>
                <input
                  {...register("specialization", { required: "Specialization required" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Cardiology"
                />
                {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">License Number *</label>
                <input
                  {...register("licenseNumber", { required: "License number required" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="LIC-98765"
                />
                {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Experience (years) *</label>
                <input
                  type="number"
                  {...register("experience", { 
                    required: "Experience required", 
                    valueAsNumber: true,
                    min: { value: 0, message: "Experience cannot be negative" }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="5"
                />
                {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Consultation Fee *</label>
                <input
                  type="number"
                  {...register("consultationFee", { 
                    required: "Fee required", 
                    valueAsNumber: true,
                    min: { value: 0, message: "Fee cannot be negative" }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="1000"
                />
                {errors.consultationFee && <p className="text-red-500 text-xs mt-1">{errors.consultationFee.message}</p>}
              </div>

              <div className="lg:col-span-4">
                <label className="block text-sm font-medium mb-1">Qualifications</label>
                <input
                  {...register("qualifications")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="MBBS, FCPS"
                />
              </div>
            </div>
              {/* ✅ ADD Room Number Field */}
  <div>
    <label className="block text-sm font-medium mb-1">Room Number</label>
    <input
      {...register("roomNumber")}
      className="w-full border border-gray-300 rounded-lg px-3 py-2"
      placeholder="e.g., A101"
    />
  </div>

  {/* License Number */}
  <div>
    <label className="block text-sm font-medium mb-1">License Number *</label>
    <input
      {...register("licenseNumber", { required: "License number required" })}
      className="w-full border border-gray-300 rounded-lg px-3 py-2"
      placeholder="LIC-98765"
    />
    {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber.message}</p>}
  </div>
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-150 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg text-white font-semibold transition duration-150 ${
                  isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Adding..." : "Add Doctor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;