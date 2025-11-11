# Admin Module - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB running
- Backend server running on `http://localhost:5000` (or configured in `.env`)
- Admin user account created in database

### Environment Setup

Create `.env` file in project root:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📚 Admin Module Files

### API Integration
- **`src/store/services/Admin.js`** - RTK Query service for all admin APIs

### Components & Pages
- **`src/pages/admin/Dashboard.jsx`** - Admin home page with statistics
- **`src/pages/admin/ManageDoctors.jsx`** - Doctor CRUD management
- **`src/pages/admin/ManagePatients.jsx`** - Patient management
- **`src/pages/admin/Appointments.jsx`** - Appointment management
- **`src/components/doctorModal/AddDoctorModal.jsx`** - Create doctor form with image upload

### Documentation
- **`ADMIN_SETUP_SUMMARY.md`** - Complete setup documentation
- **`API_INTEGRATION_PATTERNS.md`** - Code patterns and examples
- **`TESTING_CHECKLIST.md`** - Comprehensive testing guide

---

## 🔧 Core Features

### ✅ Doctor Management
```
Dashboard > Manage Doctors
├── List all doctors with search/filter
├── Create new doctor (with image upload)
├── Update doctor status (active/inactive)
└── Delete doctor
```

**Key Fields:**
- Name, Email, Password
- Specialization, License Number
- Experience, Consultation Fee
- Room Number, Profile Image

### ✅ Patient Management
```
Dashboard > Manage Patients
├── List all patients with search/filter
├── View patient details (modal)
├── Update patient status
└── View medical information
```

**Key Fields:**
- Name, Email, Phone, DOB
- Blood Group, Allergies
- Emergency Contact, Status

### ✅ Appointment Management
```
Dashboard > View Appointments
├── List all appointments
├── Filter by status (Scheduled/Completed/Cancelled)
├── Search by patient/doctor name
├── Mark appointment as completed
└── Cancel appointment
```

**Status Colors:**
- 🔵 Blue = Scheduled
- 🟢 Green = Completed
- 🔴 Red = Cancelled

### ✅ Dashboard Statistics
- Total Doctors (with active count)
- Total Patients
- Today's Appointments
- Quick action links to management pages

---

## 📡 API Endpoints Used

### Doctors
```
GET    /admin/doctors              - List all doctors
POST   /admin/doctors              - Create doctor (FormData with image)
PUT    /admin/doctors/:id          - Update doctor
DELETE /admin/doctors/:id          - Delete doctor
```

### Patients
```
GET    /admin/patients             - List all patients
PUT    /admin/patients/:id         - Update patient status
```

### Appointments
```
GET    /admin/appointments         - List all appointments
PUT    /admin/appointments/:id     - Update appointment status
DELETE /admin/appointments/:id     - Cancel appointment
```

### Dashboard
```
GET    /admin/dashboard-stats      - Get dashboard statistics
GET    /admin/doctors              - Doctor count (cached)
GET    /admin/patients             - Patient count (cached)
GET    /admin/appointments         - Appointment count (cached)
```

---

## 🎨 UI Components Used

### From Tailwind CSS & DaisyUI
- Alert boxes
- Buttons (primary, secondary, danger)
- Input fields
- Select dropdowns
- Modal dialogs
- Loading spinners
- Badge components
- Responsive grid layout

### Custom Components
- AddDoctorModal - Form with image upload
- Patient details modal
- Appointment details modal

### Notifications
- Toast success/error messages via `react-hot-toast`

---

## 🔄 Data Flow

### Creating a Doctor (with image)
```
1. User fills form in AddDoctorModal
2. Form validation with react-hook-form
3. Image selected and previewed
4. Form submitted → FormData created
5. useCreateDoctorMutation() sends FormData to backend
6. Backend processes multipart/form-data (multer)
7. Image uploaded to server/cloud storage
8. Doctor record saved in MongoDB
9. RTK Query invalidates "Doctors" tag
10. ManageDoctors list automatically refetches
11. Toast notification shows success
```

### Updating Doctor Status
```
1. Admin clicks status toggle
2. useUpdateDoctorMutation() called with doctor ID and new status
3. Backend updates MongoDB
4. RTK Query invalidates "Doctors" tag
5. UI automatically updates
6. Toast confirmation shown
```

### Loading Appointments
```
1. Component mounts
2. useGetAllAppointmentsQuery() hook fetches data
3. Loading state displays skeleton
4. API returns appointments with populated relations:
   - patientId → patient details (including userId)
   - doctorId → doctor details (including roomNumber)
5. Data rendered with optional chaining (?.)
6. Filter/search applied locally
7. Mutation hooks ready for status updates
```

---

## 🛡️ Error Handling

All components implement:

```javascript
// Try-catch for mutations
try {
  await mutation(data).unwrap();
  toast.success('Success message');
} catch (error) {
  toast.error(error?.data?.message || 'Error occurred');
}

// Loading states during queries
if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorMessage />;

// Optional chaining for nested data
doctor.userId?.name
appointment.patientId?.userId?.email
```

---

## 🔍 Testing Quick Workflow

### 1. Test Dashboard Load
```bash
# Go to admin page
Navigate to /admin
# Verify stats cards load with correct numbers
```

### 2. Test Doctor Creation
```bash
# Click "Add Doctor" button
# Fill form with test data:
  Name: Dr. John Smith
  Email: john@test.com
  Password: password123
  Specialization: Cardiology
  License: LIC123456
  Experience: 5
  Fee: 500
  Room: 101
  Image: Select a JPG file
# Click Submit
# Verify success toast and doctor appears in list
```

### 3. Test Search/Filter
```bash
# Type doctor name in search box
# Verify list filters in real-time
# Click filter buttons (All/Active/Inactive)
# Verify filtering works
```

### 4. Test Appointment Status
```bash
# Go to Appointments tab
# Click "Mark as Completed" on a scheduled appointment
# Verify status changes to green
# Verify toast notification
# Refresh page - status persists
```

---

## 🐛 Troubleshooting

### "Images not uploading"
- Check FormData field name is "profileImage"
- Check backend multer config accepts "profileImage" field
- Check backend route is POST /admin/doctors

### "Data not loading"
- Verify backend server is running
- Check VITE_API_BASE_URL in .env
- Check network tab in DevTools for API calls
- Verify admin user is logged in

### "Optional chaining errors"
- All components use `?.` operator for nested properties
- If error occurs, add optional chaining to that property
- Example: `doctor.userId.name` → `doctor.userId?.name`

### "Toast notifications not showing"
- Verify react-hot-toast is installed
- Verify Toaster component is in App.jsx
- Check DevTools console for errors

### "Components not rendering"
- Check console for JavaScript errors
- Verify all imports are correct
- Check component file paths match
- Verify RTK Query hooks are exported

---

## 📋 Checklist for Going Live

- [ ] Backend API endpoints all working and tested
- [ ] Environment variables set correctly
- [ ] All required npm packages installed
- [ ] No console errors or warnings
- [ ] All CRUD operations tested manually
- [ ] Search and filter functionality verified
- [ ] Image upload working with correct file sizes
- [ ] Error handling tested with network disconnection
- [ ] Responsive design tested on mobile
- [ ] Authentication/authorization working
- [ ] Data persists after page refresh
- [ ] Loading states display properly
- [ ] Toast notifications appear correctly
- [ ] Stats cards showing accurate data

---

## 📞 Support

### If Something Breaks

1. **Check the console** for error messages
2. **Check the network tab** for API responses
3. **Check the backend logs** for server errors
4. **Review error structure** from API response
5. **Look at the component code** for the issue
6. **Search similar issues** in documentation

### Common Issues Reference

See `TESTING_CHECKLIST.md` for comprehensive testing guide including common issues and their solutions.

---

## 🎯 Next Steps (Optional Enhancements)

1. **Edit functionality** for doctors and patients
2. **Bulk operations** - select multiple and perform actions
3. **Export to CSV** - download doctor/patient lists
4. **Advanced filtering** - date ranges, multiple criteria
5. **Doctor availability** - manage appointment slots
6. **Patient records** - view medical history
7. **Audit logs** - track all admin actions
8. **Analytics dashboard** - revenue, trends, reports

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `ADMIN_SETUP_SUMMARY.md` | Complete setup overview with all components listed |
| `API_INTEGRATION_PATTERNS.md` | Code patterns and examples for RTK Query |
| `TESTING_CHECKLIST.md` | Comprehensive 100+ item testing guide |
| `API_INTEGRATION_GUIDE.md` | This file - Quick reference |

---

**Version**: 1.0  
**Last Updated**: November 10, 2025  
**Status**: Ready for Testing ✅
