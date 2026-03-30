# 🏥 Clinic Management System — Frontend

A modern, full-featured **Clinic Management System** frontend built with **React 19**, **Vite**, **Redux Toolkit (RTK Query)**, and **Tailwind CSS**. The application supports three user roles — **Patient**, **Doctor**, and **Admin** — each with their own dedicated dashboard and feature set.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Routing Overview](#routing-overview)
- [State Management](#state-management)
- [API Services](#api-services)
- [User Roles](#user-roles)
- [Deployment](#deployment)

---

## ✨ Features
a
### 👤 Patient
- Register & login to a personal portal
- Book appointments with available doctors
- View and cancel existing appointments
- Access digital medical records
- Manage personal profile

### 🩺 Doctor
- View and manage patient appointments
- Update appointment statuses (complete / cancel)
- Set and update weekly availability schedule
- Access patient medical records
- Manage professional profile

### 🛠️ Admin
- Dashboard with live statistics (doctors, patients, appointments)
- Create, update, and delete doctor accounts (with profile image upload)
- Manage patient records and status
- View and moderate all appointments across the system

### 🔐 Authentication & Security
- JWT-based authentication with HTTP-only cookies
- Role-based route protection (`ProtectedRoute`)
- Redirect unauthenticated users to `/login`
- Persisted auth state across page refreshes (via `redux-persist`)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI library |
| [Vite (rolldown-vite)](https://vite.dev) | Build tool & dev server |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [Redux Toolkit](https://redux-toolkit.js.org) | Global state management |
| [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) | API data fetching & caching |
| [redux-persist](https://github.com/rt2zz/redux-persist) | Persisting auth state to localStorage |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [React Hook Form](https://react-hook-form.com) | Form handling & validation |
| [react-hot-toast](https://react-hot-toast.com) | Toast notifications |

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Root component — defines all routes
├── main.jsx                   # App entry point (Redux Provider, PersistGate)
├── assets/                    # Static assets (SVGs, images)
├── components/
│   ├── layout/
│   │   ├── Header.jsx         # Top navigation bar (role-aware)
│   │   ├── Footer.jsx         # Page footer
│   │   └── Layout.jsx         # Shared layout wrapper for authenticated pages
│   ├── doctorModal/
│   │   ├── AddDoctorModal.jsx      # Create doctor form with image upload
│   │   ├── AvailabilitySettings.jsx
│   │   ├── AvailabilityPreview.jsx
│   │   ├── PatientCapacity.jsx
│   │   └── SaveButton.jsx
│   ├── PatientModal/
│   │   ├── PersonalInfo.jsx
│   │   ├── MedicalInfo.jsx
│   │   ├── EmergencyContact.jsx
│   │   └── ProfileHeader.jsx
│   ├── ProtectedRoute.jsx     # Blocks unauthenticated / wrong-role access
│   └── PublicRoute.jsx        # Redirects logged-in users away from auth pages
├── pages/
│   ├── Home.jsx               # Public landing page
│   ├── Unauthorized.jsx       # 403 Unauthorized page
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── patient/
│   │   ├── Dashboard.jsx
│   │   ├── Appointments.jsx
│   │   ├── BookAppointment.jsx
│   │   ├── MedicalRecords.jsx
│   │   └── PatientProfile.jsx
│   ├── doctor/
│   │   ├── Dashboard.jsx
│   │   ├── Appointments.jsx
│   │   ├── Availability.jsx
│   │   ├── DoctorProfile.jsx
│   │   └── MedicalRecords.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       ├── ManageDoctors.jsx
│       ├── ManagePatients.jsx
│       └── Appointments.jsx
└── store/
    ├── Store.js               # Redux store configuration
    ├── authSlice/
    │   └── Auth.js            # Auth slice (login, logout, updateUser)
    └── services/
        ├── AuthApi.js         # Login, register, logout, getUser
        ├── DoctorApi.js       # Doctor profile, availability, doctor list
        ├── Patient.js         # Patient profile & management
        ├── AppointmentApi.js  # Appointments (patient, doctor, admin)
        ├── MadcialRecod.js    # Medical records
        └── Admin.js           # Admin — doctor CRUD
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A running **backend API** (default: `http://localhost:8000/api/v1`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Raheemullah8/Clinic_Management_system_frontend.git
cd Clinic_Management_system_frontend

# 2. Install dependencies
npm install

# 3. Create the environment file
cp .env.example .env   # or create .env manually (see below)

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** by default.

---

## 🔧 Environment Variables

Create a `.env` file in the project root with the following variable:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend REST API | `http://localhost:8000/api/v1` |

> All environment variables must be prefixed with `VITE_` to be accessible in the browser.

---

## 📜 Available Scripts

```bash
npm run dev      # Start the Vite development server with HMR
npm run build    # Build the project for production
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint to check for code issues
```

---

## 🗺️ Routing Overview

| Path | Component | Access |
|---|---|---|
| `/` | `Home` | Public |
| `/login` | `Login` | Public (redirects if logged in) |
| `/register` | `Register` | Public (redirects if logged in) |
| `/unauthorized` | `Unauthorized` | Public |
| `/patient/dashboard` | `PatientDashboard` | Patient only |
| `/patient/appointments` | `PatientAppointments` | Patient only |
| `/patient/book-appointment` | `BookAppointment` | Patient only |
| `/patient/medical-records` | `PatientMedicalRecords` | Patient only |
| `/patient/profile` | `PatientProfile` | Patient only |
| `/doctor/dashboard` | `DoctorDashboard` | Doctor only |
| `/doctor/appointments` | `DoctorAppointments` | Doctor only |
| `/doctor/availability` | `DoctorAvailability` | Doctor only |
| `/doctor/medical-records` | `DoctorMedicalRecords` | Doctor only |
| `/doctor/profile` | `DoctorProfile` | Doctor only |
| `/admin/dashboard` | `AdminDashboard` | Admin only |
| `/admin/doctors` | `ManageDoctors` | Admin only |
| `/admin/patients` | `ManagePatients` | Admin only |
| `/admin/appointments` | `ManageAppointments` | Admin only |

---

## 🗄️ State Management

The app uses **Redux Toolkit** with **redux-persist**:

- **`authSlice`** — stores `user`, `token`, and `isAuthenticated`; persisted to `localStorage` so sessions survive page refreshes
- **RTK Query APIs** — handle all server-side data fetching, caching, and cache invalidation automatically

### Auth Slice Actions

| Action | Description |
|---|---|
| `loginSuccess` | Sets user, token, and marks authenticated |
| `registerSuccess` | Same as loginSuccess, used on registration |
| `logout` | Clears all auth state |
| `updateUser` | Updates stored user object |

---

## 📡 API Services

All API communication uses **RTK Query** (`createApi`). Every service is registered in the Redux store.

### `AuthApi` — `/api/v1/auth`
| Endpoint | Method | Description |
|---|---|---|
| `/auth/login` | `POST` | Login user |
| `/auth/register` | `POST` | Register new user |
| `/auth/logout` | `POST` | Logout user |
| `/auth/getUser` | `GET` | Get authenticated user info |

### `DoctorApi` — `/api/v1/doctors`
| Endpoint | Method | Description |
|---|---|---|
| `/profile` | `GET` | Get doctor profile |
| `/profile` | `PUT` | Update doctor profile |
| `/availability` | `GET` | Get doctor availability |
| `/availability` | `PUT` | Update doctor availability |
| `/alldoctors` | `GET` | Get list of all doctors |
| `/:id` | `GET` | Get doctor by ID |

### `AppointmentApi` — `/api/v1/appointments`
| Endpoint | Method | Description |
|---|---|---|
| `/available-slots/:doctorId?date=` | `GET` | Get available time slots |
| `/` | `POST` | Book a new appointment |
| `/my-appointments` | `GET` | Get patient's own appointments |
| `/:id/cancel` | `PUT` | Cancel an appointment |
| `/doctor/my-appointments` | `GET` | Get doctor's appointments |
| `/:id/status` | `PUT` | Update appointment status |
| `/appointments` | `GET` | Get all appointments (admin) |

### `AdminApi` — `/api/v1/admin`
| Endpoint | Method | Description |
|---|---|---|
| `/doctors` | `GET` | List all doctors |
| `/doctors` | `POST` | Create a doctor (with image) |
| `/doctors/:id` | `PUT` | Update a doctor |
| `/doctors/:id` | `DELETE` | Delete a doctor |

---

## 👥 User Roles

The system enforces three distinct roles. After login, the user is redirected to their role-specific dashboard.

| Role | Dashboard Path | Permissions |
|---|---|---|
| `patient` | `/patient/dashboard` | Book & manage own appointments, view medical records |
| `doctor` | `/doctor/dashboard` | Manage appointments, set availability, view patient records |
| `admin` | `/admin/dashboard` | Full CRUD on doctors & patients, view all appointments |

Unauthorized access (wrong role or unauthenticated) redirects to `/unauthorized` or `/login` respectively.

---

## 🚢 Deployment

The project is configured for deployment on **Vercel**. The `vercel.json` file rewrites all routes to `index.html` to support client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Deploy to Vercel

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel
```

Set `VITE_API_BASE_URL` as an **Environment Variable** in your Vercel project settings to point to your production backend.

---

## 📄 Additional Documentation

| File | Description |
|---|---|
| `API_INTEGRATION_GUIDE.md` | Quick-start guide for the admin module |
| `API_INTEGRATION_PATTERNS.md` | RTK Query code patterns and examples |
| `ADMIN_SETUP_SUMMARY.md` | Complete admin module setup overview |
| `TESTING_CHECKLIST.md` | Comprehensive testing guide (100+ items) |
| `QUICK_REFERENCE.md` | Quick reference for common tasks |

---

## 📞 Contact

For support or inquiries, contact **support@healthcare.com** or open an issue in this repository.

---

&copy; 2024 HealthCare Management System. All rights reserved.
