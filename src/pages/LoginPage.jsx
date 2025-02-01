import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Hook to handle navigation

    const handleLogin = (e) => {
        e.preventDefault();

        if (email === import.meta.env.VITE_ADMIN_EMAIL && password === import.meta.env.VITE_ADMIN_PASSWORD) {
            const emailHash = bcrypt.hashSync(email,10);
            const passHash = bcrypt.hashSync(password,10);

            localStorage.setItem("emailHash", emailHash);
            localStorage.setItem("passHash", passHash);
            const hash = bcrypt.hashSync(email, 10);
            console.log(bcrypt.compareSync(email, hash))


            // Simulate a successful login
            alert("Login successful!");
            navigate("/dashboard"); // Redirect to the dashboard
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold text-center">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
