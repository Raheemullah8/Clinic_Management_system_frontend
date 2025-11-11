import React, { useState, useEffect } from 'react';
import { useGetDoctorProfileQuery, useUpdateDoctorProfileMutation, useUpdateDoctorAvailabilityMutation } from '../../store/services/DoctorApi';
import toast from 'react-hot-toast';

const DoctorProfile = () => {
  const { data: profileData, isLoading, error } = useGetDoctorProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateDoctorProfileMutation();
  const [updateAvailability] = useUpdateDoctorAvailabilityMutation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    maxPatientsPerDay: 20,
    isAvailable: true
  });

  const [availabilitySlots, setAvailabilitySlots] = useState([]);

  // Load profile data
  useEffect(() => {
    if (profileData?.data) {
      const doctor = profileData.data;
      setFormData({
        roomNumber: doctor.roomNumber || '',
        maxPatientsPerDay: doctor.maxPatientsPerDay || 20,
        isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true
      });
      setAvailabilitySlots(doctor.availableSlots || []);
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        roomNumber: formData.roomNumber,
        maxPatientsPerDay: parseInt(formData.maxPatientsPerDay),
        isAvailable: formData.isAvailable
      };
      
      await updateProfile(updateData).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Availability Functions
  const handleAddTimeSlot = () => {
    const newSlot = {
      day: 'Monday',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      isAvailable: true
    };
    setAvailabilitySlots(prev => [...prev, newSlot]);
  };

  const handleRemoveTimeSlot = (index) => {
    setAvailabilitySlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...availabilitySlots];
    updatedSlots[index][field] = value;
    setAvailabilitySlots(updatedSlots);
  };

  const handleSaveAvailability = async () => {
    try {
      await updateAvailability({ availableSlots: availabilitySlots }).unwrap();
      toast.success('Availability updated successfully!');
      setShowAvailabilityModal(false);
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeOptions = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", 
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM", "06:00 PM"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2, 3].map(n => (
                  <div key={n} className="bg-white rounded-xl shadow-sm p-6 h-48"></div>
                ))}
              </div>
              <div className="space-y-6">
                {[1, 2].map(n => (
                  <div key={n} className="bg-white rounded-xl shadow-sm p-6 h-48"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const user = profileData?.data?.userId || {};
  const doctor = profileData?.data || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
              <p className="text-gray-600 mt-2">Manage your professional profile and availability</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAvailabilityModal(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium"
              >
                <span className="mr-2">⏰</span>
                Manage Availability
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                <span className="mr-2">✏️</span>
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="text-lg text-gray-900 font-semibold">{user.name || 'Not provided'}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="text-lg text-gray-900 font-semibold">{user.email || 'Not provided'}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <div className="text-lg text-gray-900 font-semibold">{user.phone || 'Not provided'}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <div className="text-lg text-gray-900 font-semibold">
                      {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <div className="text-lg text-gray-900 font-semibold">{user.gender || 'Not provided'}</div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="text-lg text-gray-900 font-semibold">{user.address || 'Not provided'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <div className="text-lg text-gray-900 font-semibold">{user.specialization || 'Not specified'}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">License Number</label>
                    <div className="text-lg text-gray-900 font-semibold">{user.licenseNumber || 'Not provided'}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <div className="text-lg text-gray-900 font-semibold">
                      {user.experience ? `${user.experience} years` : '0 years'}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                    <div className="text-lg text-green-600 font-semibold">
                      {user.consultationFee ? `$${user.consultationFee}` : '$0'}
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Room Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    ) : (
                      <div className="text-lg text-gray-900 font-semibold">{formData.roomNumber}</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Max Patients/Day</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="maxPatientsPerDay"
                        value={formData.maxPatientsPerDay}
                        onChange={handleInputChange}
                        min="1"
                        max="50"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    ) : (
                      <div className="text-lg text-gray-900 font-semibold">{formData.maxPatientsPerDay}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Availability Status</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {formData.isAvailable ? 'Available for Appointments' : 'Not Available'}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {formData.isAvailable 
                        ? 'Patients can book appointments with you' 
                        : 'Patients cannot book new appointments'
                      }
                    </p>
                  </div>
                  {isEditing && (
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isAvailable"
                          checked={formData.isAvailable}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`w-14 h-7 rounded-full transition-colors ${
                          formData.isAvailable ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${
                          formData.isAvailable ? 'transform translate-x-7' : ''
                        }`}></div>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Current Availability Slots */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">My Availability Slots</h2>
              </div>
              <div className="p-6">
                {availabilitySlots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availabilitySlots.map((slot, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-gray-900 text-lg">{slot.day}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            slot.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {slot.isAvailable ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">⏰</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">No Availability Slots</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      You haven't set any availability slots yet. Set your working hours to start receiving appointments.
                    </p>
                    <button
                      onClick={() => setShowAvailabilityModal(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                    >
                      Set Availability
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button for Editing */}
            {isEditing && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isUpdating}
                    className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                      isUpdating 
                        ? 'bg-blue-400 cursor-not-allowed text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Profile Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {formData.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Specialization</span>
                  <span className="font-medium text-gray-900">{user.specialization}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium text-gray-900">{user.experience} years</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-medium text-green-600">${user.consultationFee}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Room Number</span>
                  <span className="font-medium text-gray-900">{formData.roomNumber}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Max Patients/Day</span>
                  <span className="font-medium text-gray-900">{formData.maxPatientsPerDay}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Today's Patients</span>
                  <span className="font-medium text-gray-900">{doctor.todayPatientCount || 0}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Availability Slots</span>
                  <span className="font-medium text-gray-900">{availabilitySlots.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{availabilitySlots.length}</div>
                  <div className="text-sm text-blue-800">Available Slots</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">{doctor.todayPatientCount || 0}</div>
                  <div className="text-sm text-green-800">Today's Patients</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{formData.maxPatientsPerDay}</div>
                  <div className="text-sm text-purple-800">Daily Capacity</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{user.experience || 0}</div>
                  <div className="text-sm text-orange-800">Years Exp</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Management Modal */}
        {showAvailabilityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Manage Availability</h3>
                  <button
                    onClick={() => setShowAvailabilityModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl p-2"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <span className="text-blue-600 text-lg mr-3">💡</span>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Set Your Working Hours</h4>
                      <p className="text-blue-800 text-sm">
                        Add your available time slots for each day. Patients will only be able to book appointments during these hours.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {availabilitySlots.map((slot, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-900">Slot {index + 1}</h4>
                        <button
                          onClick={() => handleRemoveTimeSlot(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                          <select
                            value={slot.day}
                            onChange={(e) => handleSlotChange(index, 'day', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {days.map(day => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                          <select
                            value={slot.startTime}
                            onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select start</option>
                            {timeOptions.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                          <select
                            value={slot.endTime}
                            onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select end</option>
                            {timeOptions.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex items-end">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={slot.isAvailable}
                              onChange={(e) => handleSlotChange(index, 'isAvailable', e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Available</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {availabilitySlots.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                    <div className="text-gray-400 text-4xl mb-3">➕</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Slots Added</h3>
                    <p className="text-gray-600">Click the button below to add your first availability slot</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleAddTimeSlot}
                    className="inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium"
                  >
                    <span className="mr-2">➕</span>
                    Add New Slot
                  </button>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowAvailabilityModal(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAvailability}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                    >
                      Save Availability
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;