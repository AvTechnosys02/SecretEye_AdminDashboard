import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Polyline, Marker } from "@react-google-maps/api";
import axios from "axios";

const TrackDetails = () => {
  const { imei } = useParams();
  // const [path, setpath] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  });

  const [location, setLocation] = useState(null);

  useEffect(()=>{
    async function getLatLon(){
      const response = await axios.post(`http://localhost:5000/getVehicleLocation`,{
        imeiIds: imei
      });

      console.log(response.data[0]);
      const location = {
        lat: response.data[0].lat,
        lng: response.data[0].lng
      }
      setLocation(location);
    }
    getLatLon();
  },[imei]);

  const containerStyle = {
    width: '100%',
    height: '800px',
  };

  return (
    <div>
      <h1>Tracking Vehicle with IMEI: {imei}</h1>
      {/* Add vehicle tracking details here */}
      {isLoaded && location && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={13}
        >
          {/* Add a Marker to display the vehicle location */}
          <Marker position={location} />
          {/* Optionally, you can also draw a polyline if you have a path */}
          {/* <Polyline path={path} options={{strokeColor:"#FF0000"}} /> */}
        </GoogleMap>
      )}
    </div>
  );
};

export default TrackDetails;
