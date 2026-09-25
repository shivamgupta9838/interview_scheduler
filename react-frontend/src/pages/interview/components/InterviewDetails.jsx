import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import api from "../../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";

const InterviewDetails = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();

    const [interview, setInterview] = useState(null);
    const [interviewers, setInterviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const permissions = storedUser.permissions || [];

    const canView = permissions.includes("Interview.read");
    const canUpdate = permissions.includes("Interview.update");
    const canDelete = permissions.includes("Interview.delete");

    const [formData, setFormData] = useState({
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

    const fetchInterview = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `/interview/${interviewId}`
            );

            setInterview(response.data);
        } catch (error) {
            console.error(
                "Failed to fetch interview:",
                error
            );

            setInterview(null);
        } finally {
                setLoading(false);
            }
    };

    useEffect(() => {
        if (!interviewId) return;

        fetchInterview();
    }, [interviewId]);

    useEffect(() => {
        if (!interview) return;

        setFormData({
            interviewers:
                interview.interviewers?.map(
                    (interviewer) =>
                        String(interviewer._id)
                ) || [],

            round: interview.round || 1,

            interviewType:
                interview.interviewType || "",

            mode:
                interview.mode || "Online",

            startTime: formatDateTimeLocal(
                interview.startTime
            ),

            endTime: formatDateTimeLocal(
                interview.endTime
            ),

            meetingLink:
                interview.meetingLink || "",

            location:
                interview.location || "",

            status:
                interview.status || "Scheduled",
        });
    }, [interview]);
    
    /*
     * Fetch available interviewers
     */
    useEffect(() => {
        const fetchInterviewers = async () => {
            try {
                const response = await api.get(
                    "/users/api/all?role=interviewer"
                );

                setInterviewers(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to fetch interviewers:",
                    error
                );

                setInterviewers([]);
            }
        };

        fetchInterviewers();
    }, []);

    /*
     * Convert API date to datetime-local format
     */
    const formatDateTimeLocal = (date) => {
        if (!date) return "";

        const d = new Date(date);

        const year = d.getFullYear();
        const month = String(
            d.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
            d.getDate()
        ).padStart(2, "0");
        const hours = String(
            d.getHours()
        ).padStart(2, "0");
        const minutes = String(
            d.getMinutes()
        ).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    /*
     * Handle normal inputs
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "round"
                    ? Number(value)
                    : value,
        }));
    };

    /*
     * Interviewer options
     *
     * Include currently assigned interviewers even if
     * they are no longer returned by the role filter.
     */
    const interviewerOptions = (() => {
        const options = interviewers.map(
            (interviewer) => ({
                value: String(interviewer._id),
                label: `${interviewer.name} (${interviewer.email})`,
            })
        );

        const existingIds = new Set(
            options.map((option) => option.value)
        );

        interview?.interviewers?.forEach(
            (interviewer) => {
                const id = String(
                    interviewer._id
                );

                if (!existingIds.has(id)) {
                    options.push({
                        value: id,
                        label: `${interviewer.name} (${interviewer.email})`,
                    });
                }
            }
        );

        return options;
    })();

    /*
     * Save interview
     */
    const handleSave = async () => {
        try {
            setSaving(true);

            const payload = {
                interviewers: formData.interviewers,
                round: formData.round,
                interviewType: formData.interviewType,
                mode: formData.mode,

                startTime: formData.startTime
                    ? new Date(
                        formData.startTime
                    ).toISOString()
                    : null,

                endTime: formData.endTime
                    ? new Date(
                        formData.endTime
                    ).toISOString()
                    : null,

                meetingLink:
                    formData.mode === "Online"
                        ? formData.meetingLink
                        : "",

                location:
                    formData.mode === "Offline"
                        ? formData.location
                        : "",

                status: formData.status,
            };

            await api.post(
                `/interview/update/${interviewId}`,
                payload
            );

            // Fetch latest interview data
            await fetchInterview();

            alert(
                "Interview updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to update interview:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update interview."
            );
        } finally {
            setSaving(false);
        }
    };
    /*
     * Delete interview
     */
    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this interview?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await api.delete(
                `/interview/delete/${interviewId}`
            );

            alert(
                "Interview deleted successfully."
            );

            navigate("/account/interviews");
        } catch (error) {
            console.error(
                "Failed to delete interview:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete interview."
            );
        } finally {
            setDeleting(false);
        }
    };

    /*
     * Permission check
     */
    if (!canView) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 text-red-700 transition-colors">
                    You do not have permission to view
                    this interview.
                </div>
            </div>
        );
    }

    /*
     * Loading
     */
    if (loading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                    Loading interview...
                </div>
            </div>
        );
    }

    /*
     * Not found
     */
    if (!interview) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-colors">
                    <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 transition-colors">
                        Interview not found.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/account/interviews"
                            )
                        }
                        className="mt-4 rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Back to Interviews
                    </button>
                </div>
            </div>
        );
    }

    /*
     * Selected interviewers
     */
    const selectedInterviewers =
        interviewerOptions.filter((option) =>
            formData.interviewers.includes(
                option.value
            )
        );

    return (

        <DashboardLayout
            title="Interviews"
            description="Manage interview profiles and track application statuses"
        >

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
                            Interview Details
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                            View and manage interview details.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        ← Back
                    </button>
                </div>

                {/* Main Card */}
                <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm transition-colors">
                    {/* Candidate / Job Information */}
                    <div className="border-b px-6 py-5">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white transition-colors">
                            Application
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                                    Candidate
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white transition-colors">
                                    {interview.application
                                        ?.candidate?.name ||
                                        "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                                    Email
                                </p>

                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {interview.application
                                        ?.candidate?.email ||
                                        "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {interview.application
                                        ?.candidate?.phone ||
                                        "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                                    Job
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white transition-colors">
                                    {interview.application
                                        ?.job?.title ||
                                        "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                                    Department
                                </p>

                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {interview.application
                                        ?.job?.department ||
                                        "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                                    Location
                                </p>

                                <p className="mt-1 text-sm text-gray-900 dark:text-white transition-colors">
                                    {interview.application
                                        ?.job?.location ||
                                        "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Interview Details */}
                    <div className="px-6 py-5">
                        <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white transition-colors">
                            Interview
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Interviewers */}
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                    Interviewers
                                </label>

                                <Select
                                    isMulti
                                    options={
                                        interviewerOptions
                                    }
                                    value={
                                        selectedInterviewers
                                    }
                                    onChange={(selected) => {
                                        setFormData(
                                            (prev) => ({
                                                ...prev,
                                                interviewers:
                                                    ( selected || [] ).map(( option ) =>
                                                            option.value
                                                    ),
                                            })
                                        );
                                    }}
                                    placeholder="Select interviewers..."
                                    isSearchable
                                    isDisabled={!canUpdate}
                                />
                            </div>

                            {/* Round */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                    Round
                                </label>

                                <input
                                    type="number"
                                    name="round"
                                    min="1"
                                    value={
                                        formData.round
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={!canUpdate}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                                />
                            </div>

                            {/* Interview Type */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                    Interview Type
                                </label>

                                <select
                                    name="interviewType"
                                    value={
                                        formData.interviewType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={!canUpdate}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                                >
                                    <option value="">
                                        Select type
                                    </option>

                                    <option value="HR">
                                        HR
                                    </option>

                                    <option value="Technical">
                                        Technical
                                    </option>

                                    <option value="Managerial">
                                        Managerial
                                    </option>

                                    <option value="Final">
                                        Final
                                    </option>
                                </select>
                            </div>

                            {/* Mode */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                    Mode
                                </label>

                                <select
                                    name="mode"
                                    value={
                                        formData.mode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={!canUpdate}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                                >
                                    <option value="Online">
                                        Online
                                    </option>

                                    <option value="Offline">
                                        Offline
                                    </option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={!canUpdate}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                                >
                                    <option value="Scheduled">
                                        Scheduled
                                    </option>

                                    <option value="Completed">
                                        Completed
                                    </option>

                                    <option value="Cancelled">
                                        Cancelled
                                    </option>
                                </select>
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                    Start Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={
                                        formData.startTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={!canUpdate}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                                />
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                    End Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={
                                        formData.endTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={!canUpdate}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                                />
                            </div>

                            {/* Meeting Link */}
                            {formData.mode ===
                                "Online" && (
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                        Meeting Link
                                    </label>

                                    <input
                                        type="url"
                                        name="meetingLink"
                                        value={
                                            formData.meetingLink
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={!canUpdate}
                                        placeholder="https://..."
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                                    />
                                </div>
                            )}

                            {/* Location */}
                            {formData.mode ===
                                "Offline" && (
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={
                                            formData.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={!canUpdate}
                                        placeholder="Interview location"
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between border-t px-6 py-4">
                        <div>
                            {canDelete && (
                                <button
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={deleting}
                                    className="rounded-md bg-red-600 dark:bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                                >
                                    {deleting
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    navigate(-1)
                                }
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
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </DashboardLayout>
    );
};

export default InterviewDetails;