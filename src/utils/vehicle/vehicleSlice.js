import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    response: null,
    statestatus: "idle",
    allVehicleData: [],
    vehicleDetails: []

};

const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        stuffDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
            state.statestatus = "added";
        },
        getSuccess: (state, action) => {
            state.vehicleDetails = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getAllvehicles: (state,action) => {
            state.vehicleList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    stuffDone,
    getAllvehicles
} = vehicleSlice.actions;

export const vehicleReducer = vehicleSlice.reducer;