import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Defines the Patient API service using RTK Query.
 * This handles endpoints related to the authenticated patient's own profile management.
 */
export const PatientApi = createApi({
    reducerPath: "PatientApi",
    
    baseQuery: fetchBaseQuery({
        // Assumes the patient router is mounted at a base path like /api/patients
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/patient`,
        credentials: "include",
    }),
    
    // Tag types for caching
    tagTypes: ["PatientProfile", "AllPatients"],
    
    endpoints: (builder) => ({

        // --- PATIENT SELF-MANAGEMENT ENDPOINTS ---
        
        /**
         * Get the authenticated patient's profile data.
         * Corresponds to: GET /patients/profile
         */
        getPatientProfile: builder.query({
            query: () => "/profile",
            providesTags: ["PatientProfile"],
        }),

        /**
         * Update the authenticated patient's profile data.
         * Corresponds to: PUT /patients/profile
         */
        updatePatientProfile: builder.mutation({
            query: (data) => ({
                url: "/profile",
                method: "PUT",
                body: data,
            }),
            // Invalidate the profile cache after a successful update
            invalidatesTags: ["PatientProfile"],
        }),

        // --- ADMIN ENDPOINTS ---
        
        /**
         * Get all patients (Admin only)
         * Corresponds to: GET /patients
         * ✅ Backend route: router.get("/", ...)
         */
        getAllPatientsAdmin: builder.query({
            query: () => "/",
            providesTags: ["AllPatients"],
        }),

        /**
         * Get patient by ID (Admin only)
         * Corresponds to: GET /patients/:id
         * ✅ Backend route: router.get("/:id", ...)
         */
        getPatientByIdAdmin: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "AllPatients", id }],
        }),

        /**
         * Update patient by ID (Admin only)
         * Corresponds to: PUT /patients/:id
         * ✅ Backend route: router.put("/:id", ...)
         */
        updatePatientByIdAdmin: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "AllPatients", id },
                "AllPatients"
            ],
        }),
        
    }),
});

// Export hooks for usage in components
export const {
    useGetPatientProfileQuery,
    useUpdatePatientProfileMutation,
    useGetAllPatientsAdminQuery,
    useGetPatientByIdAdminQuery,
    useUpdatePatientByIdAdminMutation,
} = PatientApi;