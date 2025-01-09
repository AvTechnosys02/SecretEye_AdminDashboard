import axios from "axios";
import {
  authRequest,
  getUserList,
  authFailed,
  authError,
  userAdded,
} from "./userSlice";
// import {REACT_APP_BASE_URL} from "../store"

const REACT_APP_BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://secret-eye-be-4d14.vercel.app";
// //"http://localhost:5000";
// // "http://127.0.0.1:5000"
// // http://192.168.64.88:5000

export const addUser = (newUser) => async (dispatch) => {
  dispatch(authRequest()); // Dispatching request action

  try {
    // Make API call to add vehicle
    const result = await axios.post(`${REACT_APP_BASE_URL}/Register`, newUser, {
      headers: { "Content-Type": "application/json" },
    }); // Adjust the URL as needed
    if (result.data) {
      dispatch(userAdded(result.data));
    }  else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};


export const getAllUsers = () => async(dispatch) => {
  dispatch(authRequest()); // Dispatching request action
  try {
    // Make API call to fetch users
    const result = await axios.get(`${REACT_APP_BASE_URL}/getUsers`, {
      headers: { "Content-Type": "application/json" },
    });

    if (result.data && Array.isArray(result.data)) {
      dispatch(getUserList(result.data)); // Dispatch success with user data
    } else {
      dispatch(authFailed("No users found."));
    }
  } catch (error) {
    dispatch(authError(error.message));
  }
}

export const deleteUser = (userId) => async (dispatch) => {
  dispatch(authRequest()); // Dispatching request action
  try {
    // Make API call to delete the user
    await axios.delete(`${REACT_APP_BASE_URL}/deleteUser/${userId}`, {
      headers: { "Content-Type": "application/json" },
    });

    // After successful deletion, fetch the updated user list
    dispatch(getAllUsers());
  } catch (error) {
    dispatch(authError(error.message));
  }
};