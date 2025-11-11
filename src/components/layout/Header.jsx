import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '../../store/services/AuthApi';
import { logout } from '../../store/authSlice/Auth';
import toast from 'react-hot-toast';

const Header = () => {
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate("/");
      toast.success("Logged out successfully");
      setIsDropdownOpen(false);
    } catch (error) {
      const message = error.data?.message || "An error occurred during logout";
      toast.error(message);
    }
  };

  // Get dashboard path based on user role
  const getDashboardPath = () => {
    switch(auth?.user?.data?.role) {
      case 'patient':
        return '/patient/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  // Get user display name
  const getUserName = () => {
    return auth.user?.data?.name || 'User';
  };

  // Get profile image
  const getProfileImage = () => {
    return auth.user?.data?.profileImage || '/default-profile.png';
  };

  const handleDashboardClick = () => {
    navigate(getDashboardPath());
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    // Profile page par navigate karo based on role
    const profilePath = `/${auth.user?.data?.role}/profile`;
    navigate(profilePath);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition duration-150">
                HealthCare
              </Link>
            </div>
          </div>

          {/* Conditional Buttons / Profile */}
          {auth.isAuthenticated ? (
            // Logged In - Show Profile Dropdown
            <div className="flex items-center space-x-4" ref={dropdownRef}>
              
              {/* User Name */}
              <span className="text-gray-700 text-sm font-medium hidden md:inline">
                Hi, {getUserName()}
              </span>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {/* Profile Image */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-600 flex-shrink-0">
                    <img
                      src={getProfileImage()}
                      alt={`${getUserName()} Profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Dropdown Arrow */}
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                      <p className="text-xs text-gray-500 capitalize">{auth?.user?.data?.role}</p>
                    </div>
                    
                    {/* Dashboard Link */}
                    <button
                      onClick={handleDashboardClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    
                    {/* Profile Link */}
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </button>
                    
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Not Logged In - Show Login/Register
            <div className="flex space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Header;