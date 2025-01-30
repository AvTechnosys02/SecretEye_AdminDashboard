import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { deleteVehicle, getAllVehicles } from "../utils/vehicle/vehicleUtils";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { Delete } from "@mui/icons-material";
import { Download } from "lucide-react";

const AddVehiclesPage = () => {
  const dispatch = useDispatch();

  const vehicles = useSelector((state) => state.vehicle.vehicleList);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [order, setOrder] = useState("asc"); // 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState("userId"); // Default sorting by userId
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  useEffect(() => {
    dispatch(getAllVehicles()).finally(() => setLoading(false));
  }, [dispatch]);
  //const [vehicles] = useState([]); // State to store added vehicles

  const handleDeleteUser = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    console.log(selectedVehicleId);
    dispatch(deleteVehicle(selectedVehicleId));
    setOpenConfirmDialog(false);
  };

  const headCells = [
    { id: "ownerName", label: "Owner Name" },
    { id: "vehicleRegistrationNumber", label: "Vehicle Registration Number" },
    { id: "custMobileNumber", label: "Customer Mobile Number" },
    { id: "imei", label: "IMEI" },
    { id: "simNumber", label: "SIM Number" },
    { id: "vehicleModel", label: "Vehicle Model" },
    { id: "actions", label: "Actions" }, // New column for action buttons
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

  const sortedVehicles = sortData(vehicles, comparator);

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

  const handleExportToExcel = () => {
    // Map the vehicles data to include only the required columns with desired names
    const filteredVehicles = vehicles.filter(vehicle => !vehicle.location);
    const selectedColumns = filteredVehicles.map((vehicle) => ({
      "Vehicle Registration Number": vehicle.vehicleRegistrationNumber,
      "Vehicle IMEI": vehicle.imei,
      "Owner Name": vehicle.ownerName, // `ownerName` maps to "Owner Name"
      "Customer Number": vehicle.custMobileNumber, // `insuranceStatus` maps to "Insurance Status"
      "SIM Number": vehicle.simNumber,
      "Vehicle Model": vehicle.model,
    }));

    const worksheet = XLSX.utils.json_to_sheet(selectedColumns);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");

    // Export as an Excel file
    XLSX.writeFile(workbook, "vehicles_data.xlsx");
  };

  const vehicleCount = (filteredVehicles && filteredVehicles.length) || 0;

  return (
    <div className="flex px-4 font-raleway  rounded-md flex-col pt-4 bg-gray-50 border-2 h-full">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className=" pb-2 mb-4 text-black border-b px-4 "
      >
        <h2 className="text-3xl font-semibold">Vehicle List</h2>
        {/* Search Bar */}
        <div className=" flex items-center gap-4">
          <input
            type="text"
            placeholder={`Search Vehicle (${vehicleCount})`}
            // placeholder={`Search by IMEI`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4  py-2 bg-gray-50 rounded-md border outline-none text-black"
          />
          <button onClick={handleExportToExcel} className=" py-2 px-4 flex items-center gap-2 cursor-pointer hover:bg-green-700 duration-200 font-semibold text-center text-white bg-green-600 rounded-md" >
            <p>Export to Excel</p>
            <Download size={18} />
          </button>
        </div>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          // maxHeight: "76vh",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          // borderRadius: "10px",
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            backgroundColor: "#f9fafb",
            height: "100%",
          }}
          stickyHeader
          aria-label="Vehicle table"
        >
          <TableHead>
            <TableRow >
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
                    // "&:hover": {
                    //   backgroundColor: "#e5e7eb",
                    //   cursor: "pointer",
                    // },
                  }}
                >
                  <TableCell sx={{ py: 1 }}>
                    <p className=" text-base font-medium" >{vehicle.ownerName}</p>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>{vehicle.vehicleRegistrationNumber}</TableCell>
                  <TableCell sx={{ py: 1 }}>{vehicle.custMobileNumber}</TableCell>
                  <TableCell sx={{ py: 1 }}>{vehicle.imei}</TableCell>
                  <TableCell sx={{ py: 1 }}>{vehicle.simNumber}</TableCell>
                  <TableCell sx={{ py: 1 }}>{vehicle.vehicleModel}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {/* Action Buttons */}
                    <Tooltip title="Delete Vehicle" arrow>
                      <IconButton
                        onClick={() => {
                          handleDeleteUser(vehicle._id);
                        }}
                        sx={{ color: "red" }}
                        aria-label="delete user"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
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
      </Dialog>

      {/*  */}
    </div>
  );
};

export default AddVehiclesPage;

// const [ownerName, setOwnerName] = useState("");
// const [userName, setUserName] = useState("");
// const [custMobileNumber, setCustomerMobileNumber] = useState("");
// const [imei, setImei] = useState("");
// const [simNumber, setSimNumber] = useState("");
// const [vehicleModel, setVehicleModel] = useState("");
// const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState("");

{
  /* <h2 className="text-3xl font-bold mb-6">Add New Vehicle</h2>
            <form onSubmit={handleAddVehicle} className="bg-white p-8 rounded shadow-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 text-sm font-semibold">Owner Name</label>
                        <input
                            type="text"
                            placeholder="Owner Name"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold">User Name</label>
                        <input
                            type="text"
                            placeholder="User Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold">Customer Mobile Number</label>
                        <input
                            type="tel"
                            placeholder="Customer Mobile Number"
                            value={custMobileNumber}
                            onChange={(e) => setCustomerMobileNumber(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold">IMEI Number</label>
                        <input
                            type="text"
                            placeholder="IMEI Number"
                            value={imei}
                            onChange={(e) => setImei(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 text-sm font-semibold">SIM Number</label>
                        <input
                            type="text"
                            placeholder="SIM Number"
                            value={simNumber}
                            onChange={(e) => setSimNumber(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold">Vehicle Model</label>
                        <input
                            type="text"
                            placeholder="Vehicle Model"
                            value={vehicleModel}
                            onChange={(e) => setVehicleModel(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold">Vehicle Model</label>
                        <input
                            type="text"
                            placeholder="Vehicle Registeration Number"
                            value={vehicleRegistrationNumber}
                            onChange={(e) => setVehicleRegistrationNumber(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-[20%] py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Add Vehicle
                    </button>
                </div>
            </form> */
}

// Display added vehicles
// <div className="mt-10">
//     <h3 className="text-2xl font-semibold mb-4">Added Vehicles</h3>
//     {vehicles?.length > 0 ? (
//         <div>
//             <table className="min-w-full bg-white border">
//                 <thead>
//                     <tr>
//                     <th className="py-2 px-4 border">Vehicle Registration Number</th>
//                         <th className="py-2 px-4 border">Owner Name</th>
//                         <th className="py-2 px-4 border">User Name</th>
//                         <th className="py-2 px-4 border">Customer Mobile Number</th>
//                         <th className="py-2 px-4 border">IMEI</th>
//                         <th className="py-2 px-4 border">SIM Number</th>
//                         <th className="py-2 px-4 border">Vehicle Model</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {vehicles?.map((vehicle, index) => (
//                         <tr key={index}>
//                             <td className="py-2 px-4 border">{vehicle.vehicleRegistrationNumber}</td>
//                             <td className="py-2 px-4 border">{vehicle.ownerName}</td>
//                             <td className="py-2 px-4 border">{vehicle.userName}</td>
//                             <td className="py-2 px-4 border">{vehicle.custMobileNumber}</td>
//                             <td className="py-2 px-4 border">{vehicle.imei}</td>
//                             <td className="py-2 px-4 border">{vehicle.simNumber}</td>
//                             <td className="py-2 px-4 border">{vehicle.vehicleModel}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//         </div>
//     ) : (
//         <p>No vehicles added yet.</p>
//     )}
// </div>
