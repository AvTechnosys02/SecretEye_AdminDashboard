import {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
 
  IconButton,
  Paper,
 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from "react-router-dom";
import { getAllVehicles } from "../utils/vehicle/vehicleUtils";


const TrackVehicle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const vehicles = useSelector((state) => state.vehicle.vehicleList);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
 // const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  //const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [order, setOrder] = useState("asc"); // 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState("userId"); // Default sorting by userId
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  useEffect(() => {
    dispatch(getAllVehicles()).finally(() => setLoading(false));
  }, [dispatch]);

  const trackVehicle = (imei) => {
    navigate(`/trackvehicle/${imei}`);
  };

  // const handleConfirmDelete = () => {
  //   dispatch(deleteVehicle(selectedVehicleId));
  //   setOpenConfirmDialog(false);
  // };

  const headCells = [
    { id: "vehicleRegistrationNumber", label: "Vehicle Registration Number" },
    { id: "imei", label: "IMEI" },
    { id: "track", label: "Track Vehicle" }, // New column for action buttons
  ];

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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
    const stabilizedArray = array?.map((el, index) => [el, index]);
    stabilizedArray?.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedArray?.map((el) => el[0]);
  };

  const vehiclesToTrack = vehicles.filter((vehicle) => vehicle.location)

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

  return (
    <div className="flex flex-col p-8 bg-[#eaecf8] h-full">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        className="bg-[#FFB74D] p-2 text-white rounded-xl"
      >
        <h2 className="text-2xl font-semibold">Track Vehicle</h2>
        {/* Search Bar */}
        <input
          type="text"
          placeholder={`Search Vehicle (${vehicleCount})`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg outline-none text-black"
          style={{
            width: "300px",
            borderColor: "#B0BEC5",
            borderRadius: "4px",
            backgroundColor: "#fff",
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 600,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            backgroundColor: "#f9fafb",
          }}
          stickyHeader
          aria-label="Vehicle table"
        >
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#FFB74D",
                    color: orderBy === headCell.id ? "#f87171" : "#fff", // Change color to red-400 for selected column
                    fontWeight: "bold",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleRequestSort(headCell.id)}
                    sx={{ color: orderBy === headCell.id ? "#f87171" : "#fff" }} // Apply red-400 for active sort label
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles?.map((vehicle) => (
                <TableRow
                  key={vehicle._id}
                  hover
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#f3f4f6",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "#e5e7eb",
                    },
                    "&:hover": {
                      backgroundColor: "#d1d5db",
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell>{vehicle.vehicleRegistrationNumber}</TableCell>
                  <TableCell>{vehicle.imei}</TableCell>
                  <TableCell>
                    {/* Action Buttons */}
                    <Tooltip title="Track Vehicle" arrow>
                      <IconButton
                        onClick={() => {
                          trackVehicle(vehicle.imei);
                        }}
                        sx={{ color: "red" }}
                        aria-label="delete user"
                      >
                      <DirectionsCarIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Do you want to delete vehicle?</DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog> */}

      {/*  */}
    </div>
  );
};

export default TrackVehicle;
