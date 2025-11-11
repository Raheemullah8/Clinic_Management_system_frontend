import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const DoctorApi = createApi({   
    reducerPath: "DoctorApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/doctors`,
        credentials: "include",
    }),
    
    tagTypes: ["Doctors"],
    
    endpoints: (builder) => ({

       
        getDoctorProfile: builder.query({
            query: () => "/profile",
            providesTags: ["Doctors"],
        }),

       
        updateDoctorProfile: builder.mutation({
            query: (data) => ({
                url: "/profile",
                method: "PUT",
                body: data,
            }),
            // Invalidate the profile cache upon successful update
            invalidatesTags: ["Doctors"],
        }),

       
        getDoctorAvailability: builder.query({
            query: () => "/availability",
            providesTags: ["Doctors"], 
                }),

        updateDoctorAvailability: builder.mutation({
            query: (data) => ({
                url: "/availability",
                method: "PUT",
                body: data,
            }),
            // Invalidate the profile cache upon successful update
            invalidatesTags: ["Doctors"],
        }),

       
        getAllDoctors: builder.query({
            query: () => "/alldoctors",
            providesTags: (result) => 
                result 
                    ? [
                        // Tag for the entire list
                        { type: 'DoctorList', id: 'LIST' },
                        // Tag individual doctors by ID
                        ...result.data.map(({ _id }) => ({ type: 'DoctorList', id: _id })),
                      ]
                    : [{ type: 'DoctorList', id: 'LIST' }],
        }),
       

        getDoctorById: builder.query({
            query: (id) => `/${id}`,
            // Provide tag for this specific doctor ID
            providesTags: (result, error, id) => [{ type: 'DoctorList', id }],
        }),
    }),
});


export const {
    useGetDoctorProfileQuery,
    useUpdateDoctorProfileMutation,
    useGetDoctorAvailabilityQuery,
    useUpdateDoctorAvailabilityMutation,
    useGetAllDoctorsQuery,
    useGetDoctorByIdQuery,
} = DoctorApi;