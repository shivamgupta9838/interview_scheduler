import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const permissions = storedUser.permissions || [];
    const canDelete = permissions.includes("User.delete");

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/users/${userId}`);
            setUser(response.data.data || response.data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;
        fetchUser();
    }, [userId]);

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        try {
            setDeleting(true);
            await api.delete(`/users/${userId}`);
            alert("User deleted successfully.");
            navigate("/account/users");
        } catch (error) {
            console.error("Failed to delete user:", error);
            alert(error.response?.data?.message || "Failed to delete user.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Loading user details...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-colors">
                    <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 transition-colors">User not found.</p>
                    <button
                        onClick={() => navigate("/account/users")}
                        className="mt-4 rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout
            title="User Details"
            description="View and manage user information"
        >
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
                            User Details
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        ← Back
                    </button>
                </div>

                <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="border-b px-6 py-5">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white transition-colors">
                            User Information
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Name</p>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white transition-colors">
                                    {user.name || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Email</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {user.email || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Role</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize transition-colors">
                                    {user.role || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Age</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {user.age !== undefined && user.age !== null ? `${user.age} yrs` : "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Status</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize transition-colors">
                                    {user.status || "active"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Registered On</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between border-t px-6 py-4">
                        <div>
                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="rounded-md bg-red-600 dark:bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDetails;
