import { useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Polyline } from "@react-google-maps/api";

const TrackDetails = () => {
  const { imei } = useParams();
  const [path, setpath] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  });

  const addPointToPath = (e) => {
    try {
      const latlng = { lat: e.latlng.lat(), lng: e.latlng.lng() };
      setpath(...path,latlng)
    } catch (error) {
      console.error("addpoint", error);
    }
  };
  return (
    <div>
      <h1>Tracking Vehicle with IMEI: {imei}</h1>
      {/* Add vehicle tracking details here */}
      {isLoaded && 
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "800px" }}
        center={{ lat: 40.4093, lng: 49.8671 }}
        zoom={10}
      >
        <Polyline path={path} options={{strokeColor:"#FF0000"}}></Polyline>
      </GoogleMap>}
    </div>
  );
};

export default TrackDetails;
