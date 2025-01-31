import axios from "axios";
import { REACT_APP_BASE_URL } from "../store";

export async function getLatLon(imei) {
    const response = await axios.post(`${REACT_APP_BASE_URL}/getVehicleLocation`, {
        imeiIds: imei || "869689043821933"
    });

    // console.log(response)
    // console.log(response.data[0]);
    const location = {
        lat: response.data[0].lat,
        lng: response.data[0].lng
    }
    console.log(location)
    return (location);
}

export const getVehicleLocationData = (imeiIds) => async (dispatch) => {
    // dispatch(getRequest());
    try {
        const response = await axios.post(
            `${REACT_APP_BASE_URL}/getVehicleLocation`,
            { imeiIds }
        );

        console.log(response.data);
        const resultData = response.data;
        if (resultData) {
            // Dispatch data once the response is successful
            // dispatch(addVehicleLocationData(resultData));
            return resultData;
            
        } else {
            // Dispatch failure if no vehicles found
            // dispatch(getFailed("No vehicles found"));
            return "No vehicles found";
        }
    } catch (error) {
        // Dispatch error if an error occurs
        // dispatch(getError(error));
    }
};