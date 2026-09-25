import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import api from "../../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";

const ScheduleInterview = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [interviewers, setInterviewers] = useState([]);
    
    const [formData, setFormData] = useState({
        application: applicationId,
        interviewers: [],
        round: 1,
        interviewType: "",
        mode: "Online",
        startTime: "",
        endTime: "",
        meetingLink: "",
        location: "",
        status: "Scheduled",
    });

    useEffect(() => {
        const fetchInterviewers = async () => {
            try {
                const response = await api.get("/users/api/all");
                setInterviewers(response.data || []);
            } catch (error) {
                console.error("Failed to fetch interviewers:", error);
            }
        };

        fetchInterviewers();
    }, []);

    const interviewerOptions = interviewers.map((interviewer) => ({
        value: String(interviewer._id),
        label: `${interviewer.name} (${interviewer.email})`,
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post("/interview/create", formData);
            alert("Interview scheduled successfully.");
            navigate(`/account/applications/${applicationId}`);
        } catch (error) {
            console.error("Failed to schedule interview:", error);
            alert(error.response?.data?.message || "Failed to schedule interview.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout
            title="Schedule Interview"
            description="Schedule a new interview for the selected application"
        >
            <div className="p-6 max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
                            Schedule Interview
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        ← Back
                    </button>
                </div>

                <form onSubmit={handleSchedule} className="rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                Interviewers
                            </label>
                            <Select
                                isMulti
                                options={interviewerOptions}
                                value={interviewerOptions.filter((option) =>
                                    formData.interviewers.includes(option.value)
                                )}
                                onChange={(selected) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        interviewers: selected.map((option) => option.value),
                                    }));
                                }}
                                placeholder="Select interviewers..."
                                isSearchable
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                Round
                            </label>
                            <input
                                type="number"
                                name="round"
                                min="1"
                                value={formData.round}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                Interview Type
                            </label>
                            <select
                                name="interviewType"
                                value={formData.interviewType}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 transition-colors"
                            >
                                <option value="">Select type</option>
                                <option value="HR">HR</option>
                                <option value="Technical">Technical</option>
                                <option value="Managerial">Managerial</option>
                                <option value="Final">Final</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                Mode
                            </label>
                            <select
                                name="mode"
                                value={formData.mode}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 transition-colors"
                            >
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 transition-colors"
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                Start Time
                            </label>
                            <input
                                type="datetime-local"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                End Time
                            </label>
                            <input
                                type="datetime-local"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 transition-colors"
                            />
                        </div>

                        {formData.mode === "Online" && (
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                    Meeting Link
                                </label>
                                <input
                                    type="url"
                                    name="meetingLink"
                                    value={formData.meetingLink}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 transition-colors"
                                />
                            </div>
                        )}

                        {formData.mode === "Offline" && (
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Interview location"
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 transition-colors"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t pt-5">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Scheduling..." : "Schedule Interview"}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default ScheduleInterview;
