import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";

const ApplicationDetails = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const permissions = storedUser.permissions || [];
    const canUpdate = permissions.includes("Application.changeStage") || permissions.includes("Application.update");
    const canDelete = permissions.includes("Application.delete");

    const [formData, setFormData] = useState({
        stage: "",
        remarks: "",
    });

    const fetchApplication = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/application/${applicationId}`);
            setApplication(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to fetch application:", error);
            setApplication(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!applicationId) return;
        fetchApplication();
    }, [applicationId]);

    useEffect(() => {
        if (!application) return;
        setFormData({
            stage: application.stage || "Applied",
            remarks: application.remarks || "",
        });
    }, [application]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.post(`/application/update/${applicationId}`, {
                stage: formData.stage,
                remarks: formData.remarks,
            });
            await fetchApplication();
            alert("Application updated successfully.");
        } catch (error) {
            console.error("Failed to update application:", error);
            alert(error.response?.data?.message || "Failed to update application.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this application?");
        if (!confirmed) return;

        try {
            setDeleting(true);
            await api.delete(`/application/delete/${applicationId}`);
            alert("Application deleted successfully.");
            navigate("/account/applications");
        } catch (error) {
            console.error("Failed to delete application:", error);
            alert(error.response?.data?.message || "Failed to delete application.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Loading application details...</div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-colors">
                    <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 transition-colors">Application not found.</p>
                    <button
                        onClick={() => navigate("/account/applications")}
                        className="mt-4 rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Back to Applications
                    </button>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout
            title="Application Details"
            description="View and manage application information"
        >
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
                            Application Details
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
                            Application Information
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Candidate Name</p>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white transition-colors">
                                    {application.candidate?.name || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Candidate Email</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {application.candidate?.email || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Candidate Phone</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {application.candidate?.phone || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Job Title</p>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white transition-colors">
                                    {application.job?.title || "N/A"}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Stage</label>
                                <select
                                    name="stage"
                                    value={formData.stage}
                                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                    disabled={!canUpdate}
                                    className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Hired">Hired</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Source</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize transition-colors">
                                    {application.source || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Applied At</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {application.appliedAt ? new Date(application.appliedAt).toLocaleString() : "N/A"}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">Remarks</label>
                                <textarea
                                    name="remarks"
                                    rows="4"
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                    disabled={!canUpdate}
                                    placeholder="Enter application remarks..."
                                    className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                                />
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

                        <div className="flex gap-2">
                            {application.stage === "Accepted" && (
                                <button
                                    onClick={() => navigate(`/account/interviews/schedule/${applicationId}`)}
                                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                >
                                    Schedule Interview
                                </button>
                            )}

                            <button
                                onClick={() => navigate(-1)}
                                className="rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>

                            {canUpdate && (
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ApplicationDetails;
