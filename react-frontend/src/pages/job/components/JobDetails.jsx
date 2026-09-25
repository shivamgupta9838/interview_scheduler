import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";

const JobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const permissions = storedUser.permissions || [];
    const canDelete = permissions.includes("Job.delete");

    const fetchJob = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/jobs/${jobId}`);
            setJob(response.data.data || response.data);
        } catch (error) {
            console.error("Failed to fetch job:", error);
            setJob(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!jobId) return;
        fetchJob();
    }, [jobId]);

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this job?");
        if (!confirmed) return;

        try {
            setDeleting(true);
            await api.delete(`/jobs/delete/${jobId}`);
            alert("Job deleted successfully.");
            navigate("/account/jobs");
        } catch (error) {
            console.error("Failed to delete job:", error);
            alert(error.response?.data?.message || "Failed to delete job.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Loading job details...</div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-colors">
                    <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 transition-colors">Job not found.</p>
                    <button
                        onClick={() => navigate("/account/jobs")}
                        className="mt-4 rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout
            title="Job Details"
            description="View and manage job information"
        >
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
                            Job Details
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
                            Job Information
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Title</p>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white transition-colors">
                                    {job.title || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Department</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {job.department || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Location</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {job.location || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Employee Type</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {job.employeeType || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Status</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize transition-colors">
                                    {job.status || "N/A"}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Skills</p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {job.skills && job.skills.length > 0 ? (
                                        job.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 border border-blue-100 font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">No skills listed</span>
                                    )}
                                </div>
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

export default JobDetails;
