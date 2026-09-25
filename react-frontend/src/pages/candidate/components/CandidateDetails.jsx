import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import api from "../../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";

const CandidateDetails = () => {
    const { candidateId } = useParams();
    const navigate = useNavigate();

    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const permissions = storedUser.permissions || [];

    const canView = permissions.includes("Candidate.read");
    const canUpdate = permissions.includes("Candidate.update");
    const canDelete = permissions.includes("Candidate.delete");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        currentCompany: "",
        currentDesination: "",
        experience: "",
        expectedCTC: "",
        currentCTC: "",
        noticePeriod: "",
        skills: [],
        resume: null,
        status: "active",
    });

    const fetchCandidate = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `/candidate/${candidateId}`
            );

            setCandidate(response.data);
        } catch (error) {
            console.error(
                "Failed to fetch candidate:",
                error
            );

            setCandidate(null);
        } finally {
                setLoading(false);
            }
    };

    useEffect(() => {
        if (!candidateId) return;

        fetchCandidate();
    }, [candidateId]);

    useEffect(() => {
        if (!candidate) return;

        setFormData({
            name: candidate.name || "",
            email: candidate.email || "",
            phone: candidate.phone || "",
            currentCompany: candidate.currentCompany || "",
            currentDesination: candidate.currentDesination || "",
            experience: candidate.experience ?? "",
            expectedCTC: candidate.expectedCTC ?? "",
            currentCTC: candidate.currentCTC ?? "",
            noticePeriod: candidate.noticePeriod ?? "",
            skills: candidate.skills || [],
            resume: candidate.resume || null,
            status: candidate.status || "active",
        });
    }, [candidate]);
    
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
     * Save candidate
     */
    const handleSave = async () => {
        try {
            setSaving(true);

            const payload = {
                name: formData.name || "",
                email: formData.email || "",
                phone: formData.phone || "",
                currentCompany: formData.currentCompany || "",
                currentDesination: formData.currentDesination || "",
                experience: formData.experience ?? "",
                expectedCTC: formData.expectedCTC ?? "",
                currentCTC: formData.currentCTC ?? "",
                noticePeriod: formData.noticePeriod ?? "",
                skills: formData.skills || [],
                resume: formData.resume || null,
                status: formData.status || "active",
            };

            await api.post(
                `/candidate/update/${candidateId}`,
                payload
            );

            // Fetch latest candidate data
            await fetchCandidate();

            alert(
                "Candidate updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to update candidate:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update candidate."
            );
        } finally {
            setSaving(false);
        }
    };
    /*
     * Delete candidate
     */
    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this candidate?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await api.delete(
                `/candidate/delete/${candidateId}`
            );

            alert(
                "Candidate deleted successfully."
            );

            navigate("/account/candidates");
        } catch (error) {
            console.error(
                "Failed to delete candidate:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete candidate."
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
                    this candidate.
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
                    Loading candidate...
                </div>
            </div>
        );
    }

    /*
     * Not found
     */
    if (!candidate) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-colors">
                    <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 transition-colors">
                        Candidate not found.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/account/interviews"
                            )
                        }
                        className="mt-4 rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Back to Candidates
                    </button>
                </div>
            </div>
        );
    }

    return (

        <DashboardLayout
            title="Interviews"
            description="Manage candidate profiles and track application statuses"
        >

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
                            Candidate Details
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                            View and manage candidate details.
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
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                            disabled={!canUpdate}
                            placeholder="Candidate name"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            disabled={!canUpdate}
                            placeholder="Candidate email"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Phone
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={
                                formData.phone
                            }
                            onChange={
                                handleChange
                            }
                            disabled={!canUpdate}
                            placeholder="Phone No."
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Company
                        </label>

                        <input
                            type="text"
                            name="currentCompany"
                            value={
                                formData.currentCompany
                            }
                            onChange={
                                handleChange
                            }
                            disabled={!canUpdate}
                            placeholder="Company name"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Current Desination
                        </label>

                        <input
                            type="text"
                            name="currentDesination"
                            value={
                                formData.currentDesination
                            }
                            onChange={
                                handleChange
                            }
                            disabled={!canUpdate}
                            placeholder="Current Desination"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Experience
                        </label>

                        <input
                            type="number"
                            name="experience"
                            value={
                                formData.experience
                            }
                            onChange={
                                handleChange
                            }
                            disabled={!canUpdate}
                            placeholder="Experience"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Expected CTC
                        </label>

                        <input
                            type="number"
                            name="expectedCTC"
                            value={
                                formData.expectedCTC
                            }
                            onChange={
                                handleChange
                            }
                            disabled={!canUpdate}
                            placeholder="Expected CTC"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Current CTC
                        </label>

                        <input
                            type="number"
                            name="currentCTC"
                            value={
                                formData.currentCTC
                            }
                            onChange={
                                handleChange
                            }
                            disabled={!canUpdate}
                            placeholder="Current CTC"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Notice Period
                        </label>

                        <input
                            type="number"
                            name="noticePeriod"
                            value={
                                formData.noticePeriod
                            }
                            onChange={
                                handleChange
                            }
                            disabled={!canUpdate}
                            placeholder="Notice Period"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Skills
                        </label>

                        <CreatableSelect
                            isMulti
                            name="skills"
                            options={formData.skills.map(skill => ({
                                value: skill,
                                label: skill
                            }))}
                            value={formData.skills.map(skill => ({
                                value: skill,
                                label: skill
                            }))}
                            onChange={(selectedOptions) => {
                                setFormData(prev => ({
                                    ...prev,
                                    skills: selectedOptions.map(option => option.value)
                                }));
                            }}
                            isDisabled={!canUpdate}
                            placeholder="Select or type skills..."
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Resume
                        </label>

                        <input
                            type="text"
                            name="resume"
                            value={
                                formData.resume || ""
                            }
                            onChange={
                                handleChange
                            }
                            disabled={!canUpdate}
                            placeholder="Resume URL"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                            Notice Period
                        </label>

                        <input
                            type="number"
                            name="noticePeriod"
                            value={
                                formData.noticePeriod
                            }
                            onChange={
                                handleChange
                            }
                            disabled={!canUpdate}
                            placeholder="Notice Period"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 disabled:bg-gray-100 dark:bg-gray-700 transition-colors"
                        />
                    </div>

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
                            <option value="inactive">
                                Inactive
                            </option>

                            <option value="active">
                                Active
                            </option>
                        </select>
                    </div>

                </div>

                <div className="flex justify-between border-t px-6 py-4 mt-4">
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

        </DashboardLayout>
    );
};

export default CandidateDetails;