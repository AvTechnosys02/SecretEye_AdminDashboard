import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  IconButton,
  Tooltip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  AddCircle,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material"; // Icons for buttons
import { addUser, deleteUser, getAllUsers } from "../utils/User/userUtils";
import { useDispatch, useSelector } from "react-redux";
import { addVehicle } from "../utils/vehicle/vehicleUtils";

const Dashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.allUsers);

  const [order, setOrder] = useState("asc"); // 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState("userId"); // Default sorting by userId
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [expandedRows, setExpandedRows] = useState([]);

  // const [ownerName, setOwnerName] = useState("");
  // const [custMobileNumber, setCustomerMobileNumber] = useState("");
  // const [imei, setImei] = useState("");
  // const [simNumber, setSimNumber] = useState("");
  // const [vehicleModel, setVehicleModel] = useState("");
  // const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState("");
  const [vehicleData, setVehicleData] = useState({
    ownerName: "",
    custMobileNumber: "",
    imei: "",
    simNumber: "",
    vehicleModel: "",
    vehicleRegistrationNumber: "",
  });
  const [formData, setFormData] = useState({
    custName: "",
    userName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [openUserPopup, setOpenUserPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [userDetails, setUserDetails] = useState(0);

  useEffect(() => {
    dispatch(getAllUsers()).finally(() => setLoading(false));
  }, [dispatch]);

  const handleAddVehicle = (userId) => {
    setSelectedUserId(userId);
    setOpenPopup(true);
  };

  const handleAddUser = () => {
    setOpenUserPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setVehicleData({
      ownerName: "",
      custMobileNumber: "",
      imei: "",
      simNumber: "",
      vehicleModel: "",
      vehicleRegistrationNumber: "",
    });
  };

  const handleCloseUserPopup = () => {
    setOpenUserPopup(false);
    setVehicleData({
      ownerName: "",
      custMobileNumber: "",
      imei: "",
      simNumber: "",
      vehicleModel: "",
      vehicleRegistrationNumber: "",
    });
  };
  const handleSubmitVehicle = () => {
    const newVehicle = {
      ...vehicleData,
      userId: selectedUserId,
    };
    console.log("Vehicle Data Submitted:", newVehicle);
    try {
      dispatch(addVehicle(newVehicle));
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
    handleClosePopup();
  };

  const handleAddUserData = (e) => {
    e.preventDefault();
    const {
      custName,
      userName,
      email,
      mobileNumber,
      password,
      confirmPassword,
    } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);

    dispatch(addUser({ custName, userName, email, mobileNumber, password }))
      .then(() => {
        alert("User added successfully!");
        setFormData({
          custName: "",
          userName: "",
          email: "",
          mobileNumber: "",
          password: "",
          confirmPassword: "",
        });
      })
      .catch((error) => alert("Error adding user: " + error.message))
      .finally(() => setLoading(false), setOpenUserPopup(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  //   const handleRowClick = (userId) => {
  //     setExpandedRows((prevExpandedRows) =>
  //       prevExpandedRows.includes(userId)
  //         ? prevExpandedRows.filter((id) => id !== userId)
  //         : [...prevExpandedRows, userId]
  //     );
  //   };

  const headCells = [
    { id: "userId" },
    { id: "name", label: "Name" },
    { id: "mobile", label: "Mobile Number" },
    { id: "email", label: "Email Id" },
    { id: "actions", label: "Actions" },
  ];

  // Sorting function
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

  const sortedUsers = sortData(users, comparator);

  // Filter users based on search query
  const filteredUsers = sortedUsers?.filter((user) => {
    return (
      user._id.toString().includes(searchQuery.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobileNumber.toString().includes(searchQuery.toLowerCase()) ||
      user.email.toString().includes(searchQuery.toLowerCase())
    );
  });

  const handleDeleteUser = (user) => {
    setUserDetails(user);
    setSelectedUserId(user._id);
    setOpenConfirmDialog(true);
    setVehicleCount(user.vehicles?.length || 0);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteUser(userDetails));
    setOpenConfirmDialog(false);
  };

  const handleToggleExpand = (userId) => {
    setExpandedRows((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="p-8 bg-[#eaecf8] h-full">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard</h1>

      {/* Title and Search Bar Row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        className="bg-[#FFB74D] p-2 text-white rounded-xl"
      >
        <h2 className="text-2xl font-semibold">Users List</h2>
        <view display="flex-row">
          <button
            onClick={handleAddUser}
            className="px-[20%] py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add User
          </button>
          <input
            type="text"
            placeholder={`Search Users (${filteredUsers?.length || 0})`}
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
        </view>
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
          aria-label="users table"
        >
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "#FFB74D",
                    fontWeight: "bold",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleRequestSort(headCell.id)}
                    sx={{ color: orderBy === headCell.id ? "#f87171" : "#fff" }}
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
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((user) => (
                <>
                  <TableRow
                    key={user._id}
                    hover
                    sx={{
                      backgroundColor: expandedRows.includes(user._id)
                        ? "#e5e7eb"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: "#d1d5db",
                      },
                    }}
                  >
                    <Tooltip title="Expand Row" arrow>
                      <IconButton
                        onClick={() => handleToggleExpand(user._id)}
                        sx={{ color: "#64B5F6" }}
                      >
                        {expandedRows.includes(user._id) ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </Tooltip>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.mobileNumber}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Tooltip title="Add Vehicle" arrow>
                        <IconButton
                          onClick={() => handleAddVehicle(user._id)}
                          sx={{ color: "#64B5F6" }}
                        >
                          <AddCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User" arrow>
                        <IconButton
                          onClick={() => handleDeleteUser(user)}
                          sx={{ color: "red" }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>

                  {expandedRows.includes(user._id) && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="p-4 bg-gray-100">
                          <h4 className="font-bold">Assocoated Vehicles:</h4>
                          <p>
                            <strong>IMEI Ids: </strong>
                            {user.vehicles.length > 0 ? (
                              <ul>
                                {user.vehicles.map((vehicle, index) => (
                                  <li key={index}>
                                    {index + 1}. {vehicle}
                                  </li> // Assuming each vehicle has an 'imei' property
                                ))}
                              </ul>
                            ) : (
                              <span>No vehicles found</span>
                            )}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Add Vehicle</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitVehicle();
          }}
          className="bg-white p-8 rounded shadow-lg space-y-6 "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold">
                Owner Name
              </label>
              <input
                type="text"
                name="ownerName"
                placeholder="Owner Name"
                value={vehicleData.ownerName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold">
                Customer Mobile Number
              </label>
              <input
                type="tel"
                name="custMobileNumber"
                placeholder="Customer Mobile Number"
                value={vehicleData.custMobileNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold">
                IMEI Number
              </label>
              <input
                type="text"
                name="imei"
                placeholder="IMEI Number"
                value={vehicleData.imei}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold">
                SIM Number
              </label>
              <input
                type="text"
                name="simNumber"
                placeholder="SIM Number"
                value={vehicleData.simNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold">
                Vehicle Model
              </label>
              <input
                type="text"
                name="vehicleModel"
                placeholder="Vehicle Model"
                value={vehicleData.vehicleModel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold">
                Vehicle Registration Number
              </label>
              <input
                type="text"
                name="vehicleRegistrationNumber"
                placeholder="Vehicle Registeration Number"
                value={vehicleData.vehicleRegistrationNumber}
                onChange={handleInputChange}
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
      <Dialog open={openUserPopup} onClose={handleCloseUserPopup}>
        <DialogTitle>Add User</DialogTitle>
        <form
          onSubmit={handleAddUserData}
          className="bg-white p-8 rounded shadow-lg space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Customer Name",
                name: "custName",
                type: "text",
                placeholder: "Customer Name",
              },
              {
                label: "Username",
                name: "userName",
                type: "text",
                placeholder: "Username",
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                placeholder: "Email",
              },
              {
                label: "Mobile Number",
                name: "mobileNumber",
                type: "tel",
                placeholder: "Mobile Number",
              },
              {
                label: "Password",
                name: "password",
                type: "password",
                placeholder: "Password",
              },
              {
                label: "Confirm Password",
                name: "confirmPassword",
                type: "password",
                placeholder: "Confirm Password",
              },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block mb-2 text-sm font-semibold">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleUserInputChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <button
                type="submit"
                className="px-[20%] py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Add User
              </button>
            )}
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
              This user has <strong>{vehicleCount}</strong> vehicles. Deleting
              this user will also delete all associated vehicles.
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
