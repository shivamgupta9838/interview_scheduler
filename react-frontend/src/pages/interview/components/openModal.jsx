import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import api from "../../../api/axios";

const InterviewModal = ({
    isOpen,
    interview,
    onClose,
    onUpdate,
    onDelete,
}) => {
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

    const [interviewers, setInterviewers] = useState([]);
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const permissions = storedUser.permissions || [];

    const canView = permissions.includes("Interview.read");
    const canUpdate = permissions.includes("Interview.update");
    const canDelete = permissions.includes("Interview.delete");

    const formatDateTimeLocal = (date) => {
        if (!date) return "";

        const d = new Date(date);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Fetch interviewers when modal opens
    useEffect(() => {
        if (!isOpen) return;

        const fetchInterviewers = async () => {
            try {
                const response = await api.get(
                    "/users/api/all"
                );

                setInterviewers(response.data || []);
            } catch (error) {
                console.error(
                    "Failed to fetch interviewers:",
                    error
                );

                setInterviewers([]);
            }
        };

        fetchInterviewers();
    }, [isOpen]);

    // Load interview data into form
    useEffect(() => {
        if (!interview) return;

        setFormData({
            interviewers: interview.interviewers?.map(
                (interviewer) => String(interviewer._id)
            ) || [],
            round: interview.round || 1,
            interviewType: interview.interviewType || "",
            mode: interview.mode || "Online",
            startTime: formatDateTimeLocal(interview.startTime),
            endTime: formatDateTimeLocal(interview.endTime),
            meetingLink: interview.meetingLink || "",
            location: interview.location || "",
            status: interview.status || "Scheduled",
        });
    }, [interview]);

    if (!interview || !canView) {
        return null;
    }

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

    const handleSave = () => {
        onUpdate({
            ...interview,
            ...formData,
        });
    };

    const handleDelete = () => {
        onDelete(interview);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

            <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Interview Details
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-xl text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto px-6 py-5">

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Application */}
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Application
                            </label>

                            <input
                                type="text"
                                value={
                                    interview.application?._id ||
                                    interview.application ||
                                    ""
                                }
                                disabled
                                className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
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
                                        interviewers: selected.map(
                                            (option) => option.value
                                        ),
                                    }));
                                }}
                                placeholder="Select interviewers..."
                                isSearchable
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Hold Ctrl/Cmd to select multiple interviewers.
                            </p>
                        </div>

                        {/* Round */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Round
                            </label>

                            <input
                                type="number"
                                name="round"
                                min="1"
                                value={formData.round}
                                onChange={handleChange}
                                disabled={!canUpdate}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                            />
                        </div>

                        {/* Interview Type */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Interview Type
                            </label>

                            <select
                                name="interviewType"
                                value={formData.interviewType}
                                onChange={handleChange}
                                disabled={!canUpdate}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
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
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Mode
                            </label>

                            <select
                                name="mode"
                                value={formData.mode}
                                onChange={handleChange}
                                disabled={!canUpdate}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
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
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={!canUpdate}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
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
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Start Time
                            </label>

                            <input
                                type="datetime-local"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                disabled={!canUpdate}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                End Time
                            </label>

                            <input
                                type="datetime-local"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                disabled={!canUpdate}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                            />
                        </div>

                        {/* Meeting Link */}
                        {formData.mode === "Online" && (
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Meeting Link
                                </label>

                                <input
                                    type="url"
                                    name="meetingLink"
                                    value={formData.meetingLink}
                                    onChange={handleChange}
                                    disabled={!canUpdate}
                                    placeholder="https://..."
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                                />
                            </div>
                        )}

                        {/* Location */}
                        {formData.mode === "Offline" && (
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    disabled={!canUpdate}
                                    placeholder="Interview location"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                                />
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t px-6 py-4">

                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Delete
                        </button>
                    )}

                    {canUpdate && (
                        <button
                            onClick={handleSave}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Save
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    );
};

export default InterviewModal;