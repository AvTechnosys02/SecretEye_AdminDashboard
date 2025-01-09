import { useState } from "react";
// import * as XLSX from "xlsx";
import { useDispatch } from 'react-redux';
import  {addUser}  from "../utils/User/userUtils";
import { CircularProgress } from "@mui/material";

const AddUsersPage = () => {
    const dispatch = useDispatch()
    const [loader, setLoader] = useState(false)
    const [custName, setCustomerName] = useState("");
    const [userName, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const { users} = useSelector((state) => state.user);

   

    const handleAddUser = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const newUser = { custName, userName, email, mobileNumber , password };
        setLoader(true)
        dispatch(addUser(newUser))
        alert("User added successfully!");
        setLoader(false)
        // // Clear input fields
        // setCustomerName("");
        // setUsername("");
        // setEmail("");
        // setMobileNumber("");
        // setPassword("");
        // setConfirmPassword("");
    };

    // const handleExportToExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(users);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    //     XLSX.writeFile(workbook, "Users.xlsx");
    // };

    return (
        <div className="flex flex-col p-8 bg-[#eaecf8] h-full">
            <h2 className="text-3xl font-bold mb-6">Add New User</h2>
            <form onSubmit={handleAddUser} className="bg-white p-8 rounded shadow-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 text-sm font-semibold">Customer Name</label>
                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={custName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold">Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold">Mobile Number</label>
                        <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 text-sm font-semibold">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                </div>

        {loader ? <CircularProgress size={24} color="inherit"/> : <div className="flex justify-center">
            <button
                type="submit"
                className="px-[20%] py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
                Add User
            </button>
        </div>}
            </form>

            {/* Display added users */}
            {/* <div className="mt-10">
                <h3 className="text-2xl font-semibold mb-4">Added Users</h3>
                {users?.length > 0 ? (
                    <div>
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">Customer Name</th>
                                    <th className="py-2 px-4 border">UserName</th>
                                    <th className="py-2 px-4 border">Email</th>
                                    <th className="py-2 px-4 border">Mobile Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border">{user.custName}</td>
                                        <td className="py-2 px-4 border">{user.userName}</td>
                                        <td className="py-2 px-4 border">{user.email}</td>
                                        <td className="py-2 px-4 border">{user.mobileNumber}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Export to Excel
                        </button>
                    </div>
                ) : (
                    <p>No users added yet.</p>
                )}
            </div> */}
        </div>
    );
};

export default AddUsersPage;
