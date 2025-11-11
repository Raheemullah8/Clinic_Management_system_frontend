import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/Auth";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { AuthApi } from "./services/AuthApi";
import { DoctorApi } from "./services/DoctorApi";
import { PatientApi } from "./services/Patient";
import { AppointmentApi } from "./services/AppointmentApi";
import { MedicalRecordApi } from "./services/MadcialRecod";
import { AdminApi } from "./services/Admin";



const persistConfig = {
    key: "auth",
    storage,
    whitelist: ["user", "token", "isAuthenticated"],
};


const persistedAuthReducer = persistReducer(persistConfig, authReducer);


export const store = configureStore({
    reducer: {
       
        auth: persistedAuthReducer,
   
        [AuthApi.reducerPath]: AuthApi.reducer,
        [DoctorApi.reducerPath]: DoctorApi.reducer, 
        [AdminApi.reducerPath]: AdminApi.reducer, 
        [PatientApi.reducerPath]: PatientApi.reducer, 
        [MedicalRecordApi.reducerPath]: MedicalRecordApi.reducer, 
        [AppointmentApi.reducerPath]: AppointmentApi.reducer, 
    },
    
    // Middleware Setup
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Exclude Redux Persist actions from serializable check
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
        // Add RTK Query API middleware
        .concat(AuthApi.middleware)
        .concat(DoctorApi.middleware) // <-- ADDED DOCTOR API MIDDLEWARE
        .concat(AdminApi.middleware) // <-- ADDED admin API MIDDLEWARE
        .concat(PatientApi.middleware) // <-- ADDED patient API MIDDLEWARE
        .concat(MedicalRecordApi.middleware) // <-- ADDED madical API MIDDLEWARE
        .concat(AppointmentApi.middleware), // <-- ADDED appoiment API MIDDLEWARE
});

export const persistor = persistStore(store);