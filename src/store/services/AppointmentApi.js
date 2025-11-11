import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Defines the Appointment API service using RTK Query.
 * This service handles endpoints for scheduling, viewing, and managing 
 * appointments across all user roles.
 */
export const AppointmentApi = createApi({
    reducerPath: "AppointmentApi",
    
    baseQuery: fetchBaseQuery({
        // Assumes the appointment router is mounted at a base path like /api/appointments
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/appointments`,
        credentials: "include",
    }),
    
    // Tag type for caching and invalidation of appointments
    tagTypes: ["Appointment", "PatientAppointments", "DoctorAppointments", "AllAppointments"],
    
    endpoints: (builder) => ({

        // --- PUBLIC ENDPOINT ---
        
        /**
         * Get available time slots for a specific doctor.
         * Corresponds to: GET /appointments/available-slots/:doctorId
         */
        getAvailableSlots: builder.query({
            query: (doctorId) => `/available-slots/${doctorId}`,
        }),

        // --- PATIENT ENDPOINTS ---

        /**
         * Patient creates a new appointment.
         * Corresponds to: POST /appointments/
         */
        createAppointment: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PatientAppointments", "DoctorAppointments"],
        }),

        /**
         * Patient fetches their own appointments history.
         * Corresponds to: GET /appointments/my-appointments
         */
        getPatientAppointments: builder.query({
            query: () => "/my-appointments",
            providesTags: ["PatientAppointments"],
        }),

        /**
         * Patient cancels a specific appointment.
         * Corresponds to: PUT /appointments/:id/cancel
         */
        cancelAppointment: builder.mutation({
            query: (id) => ({
                url: `/${id}/cancel`,
                method: "PUT",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Appointment", id }, 
                "PatientAppointments", 
                "DoctorAppointments"
            ],
        }),

        // --- DOCTOR ENDPOINTS ---
        
        /**
         * Doctor fetches the appointments scheduled with them.
         * Corresponds to: GET /appointments/doctor/my-appointments
         */
        getDoctorAppointments: builder.query({
            query: () => "/doctor/my-appointments",
            providesTags: ["DoctorAppointments"],
        }),

        /**
         * Doctor updates the status (e.g., confirmed, completed, missed) of an appointment.
         * Corresponds to: PUT /appointments/:id/status
         */
        updateAppointmentStatus: builder.mutation({
            query: ({ id, statusData }) => ({
                url: `/${id}/status`,
                method: "PUT",
                body: statusData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Appointment", id }, 
                "PatientAppointments", 
                "DoctorAppointments",
                "AllAppointments"
            ],
        }),
        
        // --- ADMIN ENDPOINT ---

        /**
         * Admin fetches all appointments across the system.
         * Corresponds to: GET /appointments/
         */
        getAllAppointments: builder.query({
            query: () => "/",
            providesTags: ["AllAppointments"],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetAvailableSlotsQuery,
    useCreateAppointmentMutation,
    useGetPatientAppointmentsQuery,
    useCancelAppointmentMutation,
    useGetDoctorAppointmentsQuery,
    useUpdateAppointmentStatusMutation,
    useGetAllAppointmentsQuery,
} = AppointmentApi;