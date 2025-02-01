import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import mapIllestration from "../assets/map-bg.svg"
import {
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllVehicles } from "../utils/vehicle/vehicleUtils";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { Search, Send } from "lucide-react";
import { getLatLon, getVehicleLocationData } from "../utils/vehicleLocation/vehicleLocationUtils";
import bcrypt from "bcryptjs";


const TrackVehicle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vehicles = useSelector((state) => state.vehicle.vehicleList);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [order, setOrder] = useState("asc"); // 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState("userId"); // Default sorting by userId
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  useEffect(() => {
    dispatch(getAllVehicles()).finally(() => setLoading(false));
  }, [dispatch]);

  const comparator = (a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === "asc" ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  };

  const sortData = (array, comparator) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }

    const stabilizedArray = array.map((el, index) => [el, index]);
    stabilizedArray.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedArray.map((el) => el[0]);
  };


  const vehiclesToTrack = vehicles?.length > 0 ? vehicles.filter((vehicle) => vehicle.location) : [];

  const sortedVehicles = sortData(vehiclesToTrack, comparator);

  const filteredVehicles = sortedVehicles?.filter((vehicle) => {
    return (
      vehicle._id?.toString().includes(searchQuery.toLowerCase()) ||
      vehicle.ownerName
        ?.toLowerCase()
        .toString()
        .includes(searchQuery.toLowerCase()) ||
      vehicle.vehicleRegistrationNumber
        ?.toString()
        .includes(searchQuery.toLowerCase()) ||
      vehicle.custMobileNumber
        ?.toString()
        .includes(searchQuery.toLowerCase()) ||
      vehicle.simNumber?.toString().includes(searchQuery.toLowerCase()) ||
      vehicle.vehicleModel?.toString().includes(searchQuery.toLowerCase()) ||
      vehicle.imei?.toString().includes(searchQuery.toLowerCase())
    );
  });
  const vehicleCount = (filteredVehicles && filteredVehicles.length) || 0;

  const [imei, setImei] = useState(null);

  // Map link on page
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  });

  const [location, setLocation] = useState(null);

  // useEffect(async () => {
  //   if (imei) {
  //     const location = await getLatLon(imei);
  //     console.log(location)
  //     // setLocation(...location);
  //   }
  // }, [imei]);
  // const location = useSelector((state) => state.vehicleLocation.location);

  // useEffect(() => {
  //   if (imei?.length > 0) {
  //     // dispatch(getVehicleLocationData(imei));
  //     const getLocation = getVehicleLocationData(imei);
  //     console.log(" the response" + getLocation)
  //     const latandlon = {
  //       lat: getLocation.lat,
  //       lng: getLocation.lng
  //     }
  //     console.log(latandlon)
  //     setLocation(latandlon);
  //     console.log(getLocation)
  //   }
  // }, [ imei]);


  const handleGetLocation = async (imei) => {
    try {
      const response = await dispatch(
        getVehicleLocationData(imei)
      );
      // Assuming the response contains a `data` array

      console.log(response)
      if (response) {
        const ll = {
          lat: response[0].lat,
          lng: response[0].lng
        }
        setLocation(ll);
        // navigation.navigate("DisplayXMLReport", { xmlData: response });
        //generateXML(response);
      } else {
        Alert.alert(
          "No Data",
          "No vehicle history found for the selected range."
        );
      }
    } catch
    (error) {
      console.error("Error fetching vehicle history:", error);
    }

  }

  const containerStyle = {
    width: '100%',
    height: '800px',
  };


  // Verify Login
  useEffect(() => {
    const emailHash = localStorage.getItem("emailHash");
    const passHash = localStorage.getItem("passHash");

    if (emailHash && passHash) {
      const isMatch = bcrypt.compareSync(import.meta.env.VITE_ADMIN_EMAIL, emailHash) && bcrypt.compareSync(import.meta.env.VITE_ADMIN_PASSWORD, passHash);
      if (!isMatch) {
        navigate("/");
      }
    } else {
      navigate("/")
    }
  }, [])


  return (
    <div className="flex flex-col p-8 bg-white border-2 rounded-md h-full">
      <Box className="flex flex-col md:flex-row gap-4 w-full py-4" >
        <Box className=" flex h-[80vh] pr-2 overflow-y-scroll flex-col w-full gap-2 max-w-lg" >
          <Box className=" border bg-white mb-2 rounded-md px-3 py-1 flex items-center gap-2" >
            <Search color="#666" size={18} />
            <input
              type="text"
              placeholder={`Search Vehicle (${vehicleCount})`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 w-full rounded-lg outline-none text-black"
              style={{
                // width: "300px",
                borderColor: "#B0BEC5",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            />
          </Box>
          {
            filteredVehicles.map((data, idx) => {
              return <Box className=" flex w-full flex-col md:flex-row md:items-center gap-2 justify-between py-2 px-4 border border-orange-100 bg-gray-50 rounded-md " >
                <Box key={idx} className=" flex gap-1 flex-col" >
                  <p className=" font-bold text-lg" >{data.vehicleRegistrationNumber}</p>
                  <p className=" text-sm text-gray-600" >{data.imei}</p>
                </Box>
                <button
                  onClick={() => {
                    // setImei(data.imei)
                    handleGetLocation(data.imei);
                  }}
                  className=" flex hover:bg-orange-100 hover:text-orange-700 gap-2 border px-2 py-1.5 rounded-md items-center md:ml-auto "
                >
                  <Send size={18} />
                  <p>Get on map</p>
                </button>
              </Box>
            })
          }
        </Box>
        {isLoaded && location ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={14}
          >
            <Marker position={location} />
          </GoogleMap>
        ) :
          <Box className=" w-full  h-[80vh] rounded-md flex items-center justify-center" >
            <img src={mapIllestration} className=" w-2/3 mx-auto h-auto =" alt="" />
          </Box>
        }
      </Box>
    </div>
  );
};

export default TrackVehicle;
