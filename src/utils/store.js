import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './User/userSlice';
import { vehicleReducer } from './vehicle/vehicleSlice';

// export const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.254.88:5000";
// //"http://localhost:5000";
// // "http://127.0.0.1:5000"
// // http://192.168.64.88:5000

export const store = configureStore({
    reducer: {
        user: userReducer,
        vehicle : vehicleReducer
    },
});

export default store;

