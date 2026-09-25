import { useState } from "react";
import api from "../api/axios";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        role: "interviewer",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        setSuccess("");
        setLoading(true);

        try {
            const response = await api.post("/users/register", {
                ...formData,
                age: formData.age ? Number(formData.age) : undefined,   
            });

            console.log("Register response:", response.data);

            setSuccess("Account created successfully!");

            setFormData({
                name: "",
                email: "",
                password: "",
                age: "",
                role: "interviewer",
            });
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-700 px-4 py-10 transition-colors">
            <div className="mx-auto w-full max-w-lg">

                <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-colors">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                            Create Account
                        </h1>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                            Create your Interview Scheduler account
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-500 transition-colors">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="mb-5 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-600 transition-colors">
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
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
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
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
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>

                        {/* Age */}
                        <div>
                            <label
                                htmlFor="age"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                Age
                            </label>

                            <input
                                id="age"
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter your age"
                                min="1"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label
                                htmlFor="role"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                Role
                            </label>

                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            >
                                <option value="interviewer">
                                    Interviewer
                                </option>

                                <option value="recruiter">
                                    Recruiter
                                </option>

                                <option value="admin">
                                    Admin
                                </option>
                            </select>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-indigo-600 dark:bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;