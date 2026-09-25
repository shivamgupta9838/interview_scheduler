import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const navigate= useNavigate();


    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/users/login", formData);

            localStorage.setItem("accessToken", response.data.accessToken);

            login(response.data.user);

            navigate("/account/dashboard");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-700 flex items-center justify-center px-4 transition-colors">

            <div className="w-full max-w-md">

                {/* Login Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                            Sign in to your Interview Scheduler account
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 px-4 py-3 text-sm text-red-600 dark:text-red-500 transition-colors">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:text-indigo-300 transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-indigo-600 dark:bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                    Interview Scheduler
                </p>

            </div>
        </div>
    );
}

export default Login;