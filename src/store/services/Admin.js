import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Admin API service using RTK Query
 */
export const AdminApi = createApi({
  reducerPath: "AdminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/admin`,
    credentials: "include",
  }),
  tagTypes: ["Doctors"], // should match the tags below

  endpoints: (builder) => ({
    // Create a new doctor
    createDoctor: builder.mutation({
      query: (formData) => ({
        url: "/doctors",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Doctors"],
    }),

    // Get all doctors
    getAllDoctors: builder.query({
      query: () => "/doctors",
      providesTags: ["Doctors"],
    }),

    // Update doctor
    updateDoctor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/doctors/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Doctors"],
    }),

    // Delete doctor
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: "DELETE", // Change to DELETE if backend supports it
      }),
      invalidatesTags: ["Doctors"],
    }),
  }),
});

export const {
  useCreateDoctorMutation,
  useGetAllDoctorsQuery,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = AdminApi;
