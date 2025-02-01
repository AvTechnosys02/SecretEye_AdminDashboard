import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { AlignLeft, LayoutDashboard, LogOut, MapPinCheck } from 'lucide-react';
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
        localStorage.removeItem('emailHash');
        localStorage.removeItem('passHash');
        navigate('/');  // Redirect to login page
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);  // Close modal without logging out
    };

    return (
        <div className="bg-primary h-full sticky top-0 left-0 text-gray-200 w-16 md:w-64 flex flex-col justify-between min-h-screen">
            <div>
                <h2 className="text-xl hidden md:block text-black font-bold text-left p-4 border-b border-gray-300">
                    Admin Panel
                </h2>
                <nav className="flex pl-2 gap-2 flex-col mt-4">
                    {
                        sideBarList.map((data) => {
                            return <Link
                                to={data.path}
                                className={`px-4 py-3 flex items-center gap-2 rounded-md font-semibold duration-200 ${location.pathname === data.path ? 'bg-orange-200  hover:text-orange-900 text-orange-800' : ' hover:bg-gray-300 hover:text-black text-gray-600'}`}
                            >
                                <data.Icon size={18} />
                                <p className=' hidden md:block' >{data.name}</p>
                            </Link>
                        })
                    }
                </nav>
            </div>

            <div className="my-2 px-2 ">
                <button
                    onClick={handleLogout}
                    className="w-full md:px-6 px-2 flex items-center gap-2 py-3 bg-red-500 rounded-md font-bold duration-200 text-white text-left hover:bg-red-700"
                >
                    <LogOut size={18} />
                    <p className=' hidden md:block' >Logout</p>
                </button>
            </div>

            <Dialog open={showLogoutModal} >
                {/* <DialogTitle>
                    <p className=' text-2xl font-semibold' >Confirm Logout</p>
                </DialogTitle> */}
                <div className=" p-6 rounded-md w-96 py-8 max-w-sm mx-auto shadow-lg text-black">
                    <h3 className="text-xl font-semibold mb-1">Confirm Logout</h3>
                    <p className="mb-10 text-gray-600">Are you sure you want to logout?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={cancelLogout}
                            className="px-6  font-semibold duration-200 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            No
                        </button>
                        <button
                            onClick={confirmLogout}
                            className="px-6  font-semibold duration-200 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </Dialog>

            {/* Logout Modal */}
            {/* {showLogoutModal && (
                <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center ">
                    <div className="bg-white p-6 rounded-md w-full max-w-sm mx-auto shadow-lg text-black">
                        <h3 className="text-xl font-semibold mb-1">Confirm Logout</h3>
                        <p className="mb-10 text-gray-600">Are you sure you want to logout?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelLogout}
                                className="px-6  font-semibold duration-200 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-6  font-semibold duration-200 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default Sidebar;


const sideBarList = [
    { name: 'Dashboard', path: '/dashboard', Icon: LayoutDashboard },
    { name: 'Vehicle List', path: '/view-vehicles', Icon: AlignLeft },
    { name: 'Map', path: '/vehicle-track', Icon: MapPinCheck }
];