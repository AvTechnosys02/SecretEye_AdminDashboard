import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './User/userSlice';
import { vehicleReducer } from './vehicle/vehicleSlice';

// export const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.254.88:5000";
// //"http://localhost:5000";
// // "http://127.0.0.1:5000"
// // http://192.168.64.88:5000

export const REACT_APP_BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://127.0.0.1:5000";

// "http://127.0.0.1:5000"
// http://192.168.64.88:5000
// https://secret-eye-be-4d14.vercel.app/

export const store = configureStore({
    reducer: {
        user: userReducer,
        vehicle : vehicleReducer
    },
});

export default store;

