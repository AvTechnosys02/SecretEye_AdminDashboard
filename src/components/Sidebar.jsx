import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowLogoutModal(true);  // Show the modal when logout button is clicked
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);  // Close modal
        navigate('/');  // Redirect to login page
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);  // Close modal without logging out
    };

    return (
        <div className="bg-[#25233b] text-gray-200 w-64 flex flex-col justify-between h-screen">
            <div>
                <h2 className="text-xl font-bold text-center py-4 border-b border-gray-600">
                    Admin Panel
                </h2>
                <nav className="flex flex-col mt-4">
                    <Link
                        to="/dashboard"
                        className={`px-6 py-3 hover:bg-[#eaecf8] hover:text-black ${location.pathname === '/dashboard' ? 'bg-[#eaecf8] text-black' : ''}`}
                    >
                        Dashboard
                    </Link>
                    {/* <Link
                        to="/add-users"
                        className={`px-6 py-3 hover:bg-[#eaecf8] hover:text-black ${location.pathname === '/add-users' ? 'bg-[#eaecf8] text-black' : ''}`}
                    >
                        Add Users
                    </Link> */}
                    <Link
                        to="/add-vehicles"
                        className={`px-6 py-3 hover:bg-[#eaecf8] hover:text-black ${location.pathname === '/add-vehicles' ? 'bg-[#eaecf8] text-black' : ''}`}
                    >
                        Vehicle List
                    </Link>
                    <Link
                        to="/add-users"
                        className={`px-6 py-3 hover:bg-[#eaecf8] hover:text-black ${location.pathname === '/add-users' ? 'bg-[#eaecf8] text-black' : ''}`}
                    >
                        Add Users
                    </Link>
                    
                </nav>
            </div>

            <div className="my-2 bg-red-500">
                <button
                    onClick={handleLogout}
                    className="w-full px-6 py-3 text-left hover:bg-gray-700"
                >
                    Logout
                </button>
            </div>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
                    <div className="bg-white p-6 rounded shadow-lg text-black">
                        <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                        <p className="mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelLogout}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
