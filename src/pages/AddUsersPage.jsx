import { useState } from "react";
import { useDispatch } from 'react-redux';
import  {addUser}  from "../utils/User/userUtils";
import { CircularProgress } from "@mui/material";

const AddUsersPage = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        custName: "",
        userName: "",
        email: "",
        mobileNumber: "",
        password: "",
        confirmPassword: ""
    });
    const [loader, setLoader] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        const { custName, userName, email, mobileNumber, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setLoader(true)

        dispatch(addUser({ custName, userName, email, mobileNumber, password }))
        .then(() => {
            alert("User added successfully!");
            setFormData({
                custName: "",
                userName: "",
                email: "",
                mobileNumber: "",
                password: "",
                confirmPassword: ""
            });
        })
        .catch((error) => alert("Error adding user: " + error.message))
            .finally(() => setLoader(false));
    };

    return (
        <div className="flex flex-col p-8 bg-[#eaecf8] h-full">
            <h2 className="text-3xl font-bold mb-6">Add New User</h2>
            <form onSubmit={handleAddUser} className="bg-white p-8 rounded shadow-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                             { label: "Customer Name", name: "custName", type: "text", placeholder: "Customer Name" },
                             { label: "Username", name: "userName", type: "text", placeholder: "Username" },
                             { label: "Email", name: "email", type: "email", placeholder: "Email" },
                             { label: "Mobile Number", name: "mobileNumber", type: "tel", placeholder: "Mobile Number" },
                             { label: "Password", name: "password", type: "password", placeholder: "Password" },
                             { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "Confirm Password" }  
                    ].map(({ label, name, type, placeholder }) => (
                        <div key={name}>
                            <label className="block mb-2 text-sm font-semibold">{label}</label>
                            <input
                                type={type}
                                name={name}
                                placeholder={placeholder}
                                value={formData[name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                    ))}
                </div>
            

            <div className="flex justify-center">
                    {loader ? (
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
        </div>
    );
};

export default AddUsersPage;
