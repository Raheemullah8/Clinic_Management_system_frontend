import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AppointmentApi = createApi({
    reducerPath: "AppointmentApi",

    baseQuery: fetchBaseQuery({

        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/appointments`,
        credentials: "include",
    }),

    tagTypes: ["Appointment", "PatientAppointments", "DoctorAppointments", "AllAppointments"],

    endpoints: (builder) => ({


        getAvailableSlots: builder.query({
            query: ({ doctorId, date }) => `/available-slots/${doctorId}?date=${date}`,
        }),

        createAppointment: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PatientAppointments", "DoctorAppointments"],
        }),


        getPatientAppointments: builder.query({
            query: () => "/my-appointments",
            providesTags: ["PatientAppointments"],
        }),


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

        // --- DOCTOR ENDPOINTS (Remaining endpoints) ---

        getDoctorAppointments: builder.query({
            query: () => "/doctor/my-appointments",
            providesTags: ["DoctorAppointments"],
        }),

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
        getAdminAppointments: builder.query({
            query: () => "/appointments",
            providesTags: ["AllAppointments"],
        }),


        getAllAppointments: builder.query({
            query: () => "/appointments",
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
    

    // Add useGetDoctorsQuery here if you defined it above
} = AppointmentApi;