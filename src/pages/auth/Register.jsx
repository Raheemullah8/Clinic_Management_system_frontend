import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRegisterUserMutation } from "../../store/services/AuthApi";
import { useDispatch } from "react-redux";
import { registerSuccess } from "../../store/authSlice/Auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null); // Image preview
  const [file, setFile] = useState(null);       // File for FormData

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [role, setRole] = useState("patient");

  // Trigger file input click
  const handleImageClick = () => fileInputRef.current.click();

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Form submit
  const onSubmit = async (data) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name);
      formDataToSend.append("email", data.email);
      formDataToSend.append("password", data.password);
      formDataToSend.append("phone", data.phone);
      formDataToSend.append("address", data.address);
      formDataToSend.append("dateOfBirth", data.dateOfBirth);
      formDataToSend.append("gender", data.gender);
      formDataToSend.append("role", role);

      if (file) {
        formDataToSend.append("profileImage", file);
      }

      if (role === "doctor") {
        formDataToSend.append("specialization", data.specialization || "");
        formDataToSend.append("licenseNumber", data.licenseNumber || "");
        formDataToSend.append("experience", data.experience || "");
        formDataToSend.append("consultationFee", data.consultationFee || "");
        formDataToSend.append("department", data.department || "");
        formDataToSend.append("position", data.position || "");
      }

      const response = await registerUser(formDataToSend).unwrap();

      dispatch(registerSuccess({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
      }));

      toast.success("Registration Successful!");

      // Role-based redirect
      switch(response.user.role) {
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/patient/dashboard");
      }

    } catch (err) {
      toast.error(err?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mt-4">
          <div
            className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 shadow-md cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={preview || "https://via.placeholder.com/150x150.png?text=Profile"}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 chars" } })}
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              {...register("phone", { required: "Phone is required", pattern: { value: /^[0-9]{10}$/, message: "Invalid phone" } })}
              type="tel"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              {...register("address", { required: "Address is required" })}
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Address"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              {...register("dateOfBirth", { required: "DOB is required" })}
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              {...register("gender", { required: "Gender is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Register as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* Doctor fields */}
          {role === "doctor" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <input {...register("specialization", { required: role === 'doctor' && "Specialization required" })} type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <input {...register("licenseNumber", { required: role === 'doctor' && "License number required" })} type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                <input {...register("experience", { required: role === 'doctor' && "Experience required" })} type="number" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                <input {...register("consultationFee", { required: role === 'doctor' && "Fee required" })} type="number" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input {...register("department", { required: role === 'doctor' && "Department required" })} type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input {...register("position")} type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
            </>
          )}

          <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
