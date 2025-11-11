import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Defines the Medical Record API service using RTK Query.
 * This service handles endpoints related to medical records, accessible by both 
 * Doctors and Patients based on role and context.
 */
export const MedicalRecordApi = createApi({
    reducerPath: "MedicalRecordApi",
    
    baseQuery: fetchBaseQuery({
        // Assumes the medical record router is mounted at a base path like /api/medical-records
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/medical-records`,
        credentials: "include",
    }),
    
    // Tag type for caching and invalidation of medical records
    tagTypes: ["MedicalRecord", "PatientRecords", "DoctorRecords"],
    
    endpoints: (builder) => ({

        // --- DOCTOR ENDPOINTS ---
        
        /**
         * Doctor creates a new medical record for a patient.
         * Corresponds to: POST /medical-records/
         */
        createMedicalRecord: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
            // Invalidates both doctor's and patient's lists/tags
            invalidatesTags: ["DoctorRecords", "PatientRecords"],
        }),

        /**
         * Doctor fetches the medical records relevant to their patients.
         * Corresponds to: GET /medical-records/doctor/my-records
         */
        getDoctorMedicalRecords: builder.query({
            query: () => "/doctor/my-records",
            providesTags: ["DoctorRecords"],
        }),

        /**
         * Doctor updates a specific medical record.
         * Corresponds to: PUT /medical-records/:id
         */
        updateMedicalRecord: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            // Invalidate the specific record and the list it belongs to
            invalidatesTags: (result, error, { id }) => [
                { type: "MedicalRecord", id }, 
                "DoctorRecords",
                "PatientRecords"
            ],
        }),

        // --- PATIENT ENDPOINT ---

        /**
         * Patient fetches their own medical records.
         * Corresponds to: GET /medical-records/patient/my-records
         */
        getPatientMedicalRecords: builder.query({
            query: () => "/patient/my-records",
            providesTags: ["PatientRecords"],
        }),
        
        // --- SHARED ENDPOINT ---

        /**
         * Fetch a specific medical record by ID (accessible by doctor or patient).
         * Corresponds to: GET /medical-records/:id
         */
        getMedicalRecordById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "MedicalRecord", id }],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useCreateMedicalRecordMutation,
    useGetDoctorMedicalRecordsQuery,
    useUpdateMedicalRecordMutation,
    useGetPatientMedicalRecordsQuery,
    useGetMedicalRecordByIdQuery,
} = MedicalRecordApi;