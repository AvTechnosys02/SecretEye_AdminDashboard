import { useEffect, useState } from "react";
// import { users } from "../constants/users"; // Import the users data
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    IconButton, // For button actions
    Tooltip, // For tooltips
    Box, // For flexbox layout
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    // DialogContent,
    // DialogActions,
    // TextField,
    // Button,
} from "@mui/material";
import { AddCircle, Delete } from '@mui/icons-material'; // Icons for buttons
import { deleteUser, getAllUsers } from "../utils/User/userUtils";
import { useDispatch, useSelector } from "react-redux";
import { addVehicle } from "../utils/vehicle/vehicleUtils";

const Dashboard = () => {
    const dispatch = useDispatch()
    const users  = useSelector((state) => state.user.allUsers);
    //const userId = useSelector((state) => state.user.currentUser._id); 

    const [order, setOrder] = useState('asc'); // 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('userId'); // Default sorting by userId
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [loading, setLoading] = useState(true); // Loading state for data fetching

     // const [userName, setUserName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [custMobileNumber, setCustomerMobileNumber] = useState("");
    const [imei, setImei] = useState("");
    const [simNumber, setSimNumber] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState("");

    const [vehicleCount, setVehicleCount] = useState(0);

    const [openPopup, setOpenPopup] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    // const [vehicleData, setVehicleData] = useState({
    //     ownerName,
    //     vehicleModel,
    //     vehicleRegistrationNumber,
    //     custMobileNumber,
    //     imei,
    //     simNumber
    // });

    useEffect(() => {
        dispatch(getAllUsers()).finally(() => setLoading(false));
      }, [dispatch]);

    
    const handleAddVehicle = (userId) => {
        setSelectedUserId(userId);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        // setVehicleData({
        //     ownerName: "",
        //     vehicleModel: "",
        //     registrationNumber: "",
        // });
    };

    const handleSubmitVehicle = () => {
        const vehicleData = {
            ownerName,
        vehicleModel,
        vehicleRegistrationNumber,
        custMobileNumber,
        imei,
        simNumber
        }
        const newVehicle = {
            ...vehicleData,
            userId: selectedUserId,
        };
        console.log("Vehicle Data Submitted:", newVehicle);
        try{
            dispatch(addVehicle(newVehicle));
            }
            catch(error){
              console.error("Error adding vehicle:", error);
            }
        //handleClosePopup();
    };

   


    const headCells = [
        { id: "userId", label: "UserId" },
        // { id: "gpsId", label: "GPS ID" },
        { id: "name", label: "Name" },
        { id: "mobile", label: "Mobile Number" },
         { id: "email", label: "Email Id" },
        // { id: "status", label: "Status" },
        { id: "actions", label: "Actions" }, // New column for action buttons
    ];

    // Sorting function
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Sort function to compare data
    const sortData = (array, comparator) => {
        const stabilizedArray = array?.map((el, index) => [el, index]);
        stabilizedArray?.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedArray?.map((el) => el[0]);
    };

    const comparator = (a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    };

    const sortedUsers = sortData(users, comparator);

    // Filter users based on search query
    const filteredUsers = sortedUsers?.filter((user) => {
        return (
            user._id.toString().includes(searchQuery.toLowerCase()) ||
            //user.gpsId.toString().includes(searchQuery.toLowerCase()) ||
            user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.mobileNumber.toString().includes(searchQuery.toLowerCase()) ||
            user.email.toString().includes(searchQuery.toLowerCase()) 

            // user.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
            // user.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Handlers for actions
    // const handleAddVehicle = (userId) => {
    //     console.log(`Adding vehicle for user ${userId}`);
    //     // Add logic to handle adding a vehicle
    // };

    const handleDeleteUser = (userId,vehicleCount) => {
        setSelectedUserId(userId);
        setOpenConfirmDialog(true);
        setVehicleCount(vehicleCount);
        
    };

    const handleConfirmDelete = () => {
        dispatch(deleteUser(selectedUserId));
        setOpenConfirmDialog(false);
    };

    const UserCount = filteredUsers && filteredUsers.length || 0;
    return (
        <div className="p-8 bg-[#eaecf8] h-full">
            <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard</h1>

            {/* Title and Search Bar Row */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} className='bg-[#FFB74D] p-2 text-white rounded-xl'>
                <h2 className="text-2xl font-semibold">Users List</h2>
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder={`Search Users (${UserCount})`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded-lg outline-none text-black"
                    style={{
                        width: '300px',
                        borderColor: '#B0BEC5',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                    }}
                />
            </Box>

            {/* Table displaying user information */}
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 500,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                }}
            >
                <Table
                    sx={{
                        minWidth: 650,
                        backgroundColor: '#f9fafb',
                    }}
                    stickyHeader
                    aria-label="users table"
                >
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    style={{
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: '#FFB74D',
                                        color: orderBy === headCell.id ? '#f87171' : '#fff', // Change color to red-400 for selected column
                                        fontWeight: 'bold',
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={() => handleRequestSort(headCell.id)}
                                        sx={{ color: orderBy === headCell.id ? '#f87171' : '#fff' }} // Apply red-400 for active sort label
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
                                <TableCell colSpan={7} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : (
                        filteredUsers?.map((user) => (
                            <TableRow
                                key={user._id}
                                hover
                                sx={{
                                    '&:nth-of-type(odd)': {
                                        backgroundColor: '#f3f4f6',
                                    },
                                    '&:nth-of-type(even)': {
                                        backgroundColor: '#e5e7eb',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#d1d5db',
                                        cursor: 'pointer',
                                    },
                                }}
                            >
                                <TableCell>{user.custName}</TableCell>
                                <TableCell>{user.userName}</TableCell>
                                <TableCell>{user.mobileNumber}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {/* Action Buttons */}
                                    <Tooltip title="Add Vehicle" arrow>
                                        <IconButton
                                            onClick={() => {
                                                handleAddVehicle(user._id);
                                            }}
                                            sx={{ color: '#64B5F6' }}
                                            aria-label="add vehicle"
                                        >
                                            <AddCircle />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete User" arrow>
                                        <IconButton
                                            onClick={() => {
                                                handleDeleteUser(user._id, user.vehicles?.length || 0);
                                            }}
                                            sx={{ color: 'red' }}
                                            aria-label="delete user"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openPopup} onClose={handleClosePopup}>
                <DialogTitle>Add Vehicle</DialogTitle>
                <form onSubmit={handleSubmitVehicle} className="bg-white p-8 rounded shadow-lg space-y-6 ">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </form>
                {/* <DialogContent>
                    <TextField
                        label="Owner Name"
                        fullWidth
                        margin="normal"
                        value={vehicleData.ownerName}
                        onChange={(e) =>
                            setVehicleData({ ...vehicleData, ownerName: e.target.value })
                        }
                    />
                    <TextField
                        label="Vehicle Model"
                        fullWidth
                        margin="normal"
                        value={vehicleData.vehicleModel}
                        onChange={(e) =>
                            setVehicleData({ ...vehicleData, vehicleModel: e.target.value })
                        }
                    />
                    <TextField
                        label="Registration Number"
                        fullWidth
                        margin="normal"
                        value={vehicleData.registrationNumber}
                        onChange={(e) =>
                            setVehicleData({ ...vehicleData, registrationNumber: e.target.value })
                        }
                    />
                </DialogContent> */}
                {/* <DialogActions>
                    <Button onClick={handleClosePopup} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitVehicle} color="primary">
                        Add Vehicle
                    </Button>
                </DialogActions> */}
            </Dialog>
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                {vehicleCount > 0 ? (
            <p>
                This user has <strong>{vehicleCount}</strong> vehicles. Deleting this user will also delete all associated vehicles.
            </p>
        ) : (
            <p>This user has no associated vehicles.</p>
        )}
                </DialogContent>
                
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Dashboard;
 