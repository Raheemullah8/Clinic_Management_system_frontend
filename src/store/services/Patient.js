import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Defines the Patient API service using RTK Query.
 * This handles endpoints related to the authenticated patient's own profile management.
 */
export const PatientApi = createApi({
    reducerPath: "PatientApi",
    
    baseQuery: fetchBaseQuery({
        // Assumes the patient router is mounted at a base path like /api/patients
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/patients`,
        credentials: "include",
    }),
    
    // Tag type for caching the patient's own profile data
    tagTypes: ["PatientProfile"],
    
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

        // NOTE on Admin Routes:
        // The Admin patient routes (GET /, GET /:id, PUT /:id) should ideally 
        // be handled by the AdminApi service to keep concerns separated.
        
    }),
});

// Export hooks for usage in components
export const {
    useGetPatientProfileQuery,
    useUpdatePatientProfileMutation,
} = PatientApi;