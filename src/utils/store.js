import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './User/userSlice';
import { vehicleReducer } from './vehicle/vehicleSlice';

export const REACT_APP_BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://secret-eye-backend.vercel.app";

// "http://localhost:5000";
// "http://127.0.0.1:5000"
  

export const store = configureStore({
    reducer: {
        user: userReducer,
        vehicle : vehicleReducer
    },
});

export default store;

