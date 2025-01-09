import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  stuffDone,
  getAllvehicles,
} from "./vehicleSlice";
//import {REACT_APP_BASE_URL} from "../store"

// const VEHICLE_BASE_DATA_URL =
//   "https://vahantrack.com/api/api.php?api=user&ver=1.0&key=E161C96F1AD1FD8AC0617271B2F74924&cmd=";

const REACT_APP_BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://secret-eye-be-4d14.vercel.app";
  // "https://secret-eye-be-4d14.vercel.app";
// //"http://localhost:5000";
// // "http://127.0.0.1:5000"
// // http://192.168.64.88:5000

// export const fetchVehiclesIdofSUser = async (userId) => {
//   try {
//     const response = await axios.get(`${REACT_APP_BASE_URL}/users/${userId}`);
//     return response.data; // Assuming the user document includes the 'vehicles' field
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     throw error;
//   }
// };

export const addVehicle = (newVehicle) => async (dispatch) => {
  dispatch(getRequest()); // Dispatching request action

  try {
    // Make API call to add vehicle
    const response = await axios.post(
      `${REACT_APP_BASE_URL}/SaveVehicleData`,
      newVehicle,
      {
        headers: { "Content-Type": "application/json" },
      }
    ); // Adjust the URL as needed
    console.log("addVehicle-------", response);
    // If the request is successful, dispatch success action with vehicle data
    dispatch(stuffDone(response.data));
  } catch (error) {
    // If an error occurs, dispatch failure action with error message
    dispatch(
      getError(error.response ? error.response.data.message : error.message)
    );
  }
};
// `${REACT_APP_BASE_URL}OBJECT_GET_LOCATIONS,${id}`
export const getAllVehicles = () => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${REACT_APP_BASE_URL}/getVehicles`, {
      headers: { "Content-Type": "application/json" },
    });
    if (result.data && Array.isArray(result.data)) {
      dispatch(getAllvehicles(result.data)); // Dispatch success with user data
    } else {
      dispatch(getFailed("No users found."));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getSVehicles = (vehicleId) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const response = await axios.get(
      `${REACT_APP_BASE_URL}/vehicles/${vehicleId}`
    );
    const resultData = response.data;

    if (resultData.message) {
      dispatch(getFailed(resultData.message));
    } else {
      dispatch(getSuccess(resultData.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const deleteVehicle = (vehicleId) => async (dispatch) => {
  dispatch(getRequest()); // Dispatching request action
  try {
    // Make API call to delete the user
    await axios.delete(`${REACT_APP_BASE_URL}/deleteVehicle/${vehicleId}`, {
      headers: { "Content-Type": "application/json" },
    });

    // After successful deletion, fetch the updated user list
    dispatch(getAllVehicles());
  } catch (error) {
    dispatch(getError(error.message));
  }
};
