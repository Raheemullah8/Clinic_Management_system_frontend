import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <Header/>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Health, Our 
            <span className="text-blue-600"> Priority</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience seamless healthcare management with our advanced hospital management system. 
            Book appointments, access medical records, and connect with healthcare professionals - all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition duration-200"
            >
              Existing User? Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed for patients, doctors, and administrators with cutting-edge features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">For Patients</h3>
              <p className="text-gray-600">
                Easy appointment booking, digital medical records, and seamless communication with your healthcare providers.
              </p>
              <ul className="mt-4 text-sm text-gray-600 space-y-1">
                <li>✓ Book appointments online</li>
                <li>✓ Access medical history</li>
                <li>✓ Receive digital prescriptions</li>
                <li>✓ 24/7 health portal access</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">For Doctors</h3>
              <p className="text-gray-600">
                Efficient patient management, digital prescriptions, and streamlined appointment scheduling.
              </p>
              <ul className="mt-4 text-sm text-gray-600 space-y-1">
                <li>✓ Manage appointments</li>
                <li>✓ Digital patient records</li>
                <li>✓ Prescription management</li>
                <li>✓ Availability scheduling</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">For Administrators</h3>
              <p className="text-gray-600">
                Comprehensive system management, analytics, and complete oversight of hospital operations.
              </p>
              <ul className="mt-4 text-sm text-gray-600 space-y-1">
                <li>✓ User management</li>
                <li>✓ System analytics</li>
                <li>✓ Report generation</li>
                <li>✓ Operational oversight</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Register</h3>
              <p className="text-sm text-gray-600">Create your account in minutes</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Book</h3>
              <p className="text-sm text-gray-600">Schedule appointments easily</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Consult</h3>
              <p className="text-sm text-gray-600">Connect with healthcare experts</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">4</div>
              <h3 className="font-semibold text-gray-900 mb-2">Manage</h3>
              <p className="text-sm text-gray-600">Track your health journey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Patients Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Expert Doctors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Hospitals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of patients and healthcare professionals already using our platform
          </p>
          <Link 
            to="/register" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition duration-200 inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                  <span className="text-blue-600 font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-bold">HealthCare</span>
              </div>
              <p className="text-gray-400">
                Transforming healthcare through technology and innovation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Services</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Appointment Booking</a></li>
                <li><a href="#" className="hover:text-white">Medical Records</a></li>
                <li><a href="#" className="hover:text-white">Online Consultations</a></li>
                <li><a href="#" className="hover:text-white">Health Tracking</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +1 (555) 123-4567</li>
                <li>✉️ support@healthcare.com</li>
                <li>📍 123 Health St, Medical City</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HealthCare Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;