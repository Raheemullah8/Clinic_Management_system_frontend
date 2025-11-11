import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const AuthApi = createApi({
   reducerPath: "AuthApi",
   baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
   }),
   tagTypes: ["Auth"],
   endpoints: (builder) =>({

    LoginUser: builder.mutation({
        query:(data) =>({
         url:"/auth/login",
         method:"POST",
         body:data,
         credentials:"include",

        }),
        invalidatesTags:["Auth"],
    }),

    registerUser: builder.mutation({
    query:(formData)=>({
        url:"/auth/register",
        method:"POST",
        body: formData,
        credentials:"include",
    }),
    invalidatesTags:["Auth"],
    }),

    logoutUser: builder.mutation({
        query:() =>({
            url:"/auth/logout",
            method:"POST",
            credentials:"include",
        })
    }),
    getUser: builder.query({
        query:()=>({
            url:"/auth/getUser",
            method:"GET",
            credentials:"include",
        }),
        providesTags:["Auth"],
    })

    
   }),
   
         
})

export const  {useLoginUserMutation,useRegisterUserMutation,useLogoutUserMutation,useGetUserQuery} = AuthApi;