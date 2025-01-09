const SignupPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800">Admin Sign Up</h2>
                <p className="text-center text-gray-500">Create your admin account to access the panel</p>
                <form className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-gray-700">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            placeholder="Enter a username"
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Enter a strong password"
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                    {/* Submit Button */}
                    <button className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                        Create Admin Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
