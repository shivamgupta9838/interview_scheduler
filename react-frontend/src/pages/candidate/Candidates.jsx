import { useState, useEffect, useCallback, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const columnHelper = createColumnHelper();

function Candidates() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [pageCount, setPageCount] = useState(1);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [sorting, setSorting] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const Navigate = useNavigate();

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleView = (candidate) => {
        Navigate(`/account/candidate/${candidate._id}`);
    };

    // Fetch candidates from backend API
    const fetchCandidates = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const params = {
                page: pagination.pageIndex + 1,
                pageSize: pagination.pageSize,
            };

            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }

            if (sorting.length > 0) {
                params.sortBy = sorting[0].id;
                params.sortOrder = sorting[0].desc ? "desc" : "asc";
            }

            const response = await api.get("/candidate/getall", { params });
            const result = response.data;

            if (result && Array.isArray(result.data)) {
                setCandidates(result.data);
                setTotalCandidates(result.pagination?.total ?? result.data.length);
                setPageCount(result.pagination?.totalPages ?? 1);
            } else if (Array.isArray(result)) {
                setCandidates(result);
                setTotalCandidates(result.length);
                setPageCount(1);
            } else {
                setCandidates([]);
                setTotalCandidates(0);
                setPageCount(1);
            }
        } catch (err) {
            console.error("Failed to fetch candidates:", err);
            setError(
                err.response?.data?.message ||
                "Failed to fetch candidates. Please check your network connection and login status."
            );
        } finally {
            setLoading(false);
        }
    }, [pagination.pageIndex, pagination.pageSize, searchQuery, sorting]);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    // Table Column Definitions
    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "Candidate Name",
                cell: (info) => {
                    const candidate = info.row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 dark:text-indigo-400 flex items-center justify-center font-bold text-sm transition-colors">
                                {candidate.name ? candidate.name.charAt(0).toUpperCase() : "C"}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">{candidate.name || "N/A"}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">{candidate.email}</div>
                            </div>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("phone", {
                header: "Phone",
                cell: (info) => info.getValue() || "N/A",
            }),
            columnHelper.accessor("currentDesination", {
                id: "currentDesination",
                header: "Current Role",
                cell: (info) => {
                    const candidate = info.row.original;
                    const designation = candidate.currentDesination || candidate.currentDesignation;
                    const company = candidate.currentCompany;
                    return (
                        <div>
                            <div className="text-gray-900 dark:text-white font-medium transition-colors">{designation || "N/A"}</div>
                            {company && <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">at {company}</div>}
                        </div>
                    );
                },
            }),
            columnHelper.accessor("experience", {
                header: "Experience",
                cell: (info) => {
                    const exp = info.getValue();
                    return exp !== undefined && exp !== null ? `${exp} yrs` : "0 yrs";
                },
            }),
            columnHelper.accessor("skills", {
                header: "Skills",
                enableSorting: false,
                cell: (info) => {
                    const skills = info.getValue();
                    if (!skills || !Array.isArray(skills) || skills.length === 0) {
                        return <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors">No skills listed</span>;
                    }
                    const visibleSkills = skills.slice(0, 3);
                    const remainingCount = skills.length - 3;
                    return (
                        <div className="flex flex-wrap gap-1">
                            {visibleSkills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-0.5 text-xs rounded-md bg-blue-50 text-blue-700 border border-blue-100 font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                            {remainingCount > 0 && (
                                <span className="px-1.5 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 dark:text-gray-500 font-medium transition-colors">
                                    +{remainingCount}
                                </span>
                            )}
                        </div>
                    );
                },
            }),
            columnHelper.accessor("status", {
                header: "Status",
                cell: (info) => {
                    const status = info.getValue() || "active";
                    let badgeClass = "bg-green-50 text-green-700 border-green-200";
                    if (status === "inactive") {
                        badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                    } else if (status === "blacklisted") {
                        badgeClass = "bg-red-50 text-red-700 border-red-200";
                    }
                    return (
                        <span className={`capitalize px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeClass}`}>
                            {status}
                        </span>
                    );
                },
            }),
            columnHelper.accessor("createdAt", {
                header: "Applied On",
                cell: (info) => {
                    const dateVal = info.getValue();
                    if (!dateVal) return "N/A";
                    return new Date(dateVal).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    });
                },
            }),
            columnHelper.display({
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    return (
                        <button
                            onClick={() => handleView(row.original)}
                            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:text-gray-500 dark:hover:bg-gray-700 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400 transition-colors"
                            title="View details"
                        >
                            <Eye size={30} />
                        </button>
                    );
                },
            }),
        ],
        []
    );

    // Initialize TanStack React Table instance
    const table = useReactTable({
        data: candidates,
        columns,
        pageCount: pageCount,
        state: {
            pagination,
            sorting,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        manualPagination: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
    });

    const startRowIndex = pagination.pageIndex * pagination.pageSize + 1;
    const endRowIndex = Math.min(
        (pagination.pageIndex + 1) * pagination.pageSize,
        totalCandidates
    );

    return (
        <DashboardLayout
            title="Candidates"
            description="Manage candidate profiles and track application statuses"
        >

            <div className="space-y-4">

                {/* Filters & Control bar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 dark:text-gray-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
                        />
                        {searchInput && (
                            <button
                                onClick={() => setSearchInput("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                </div>

                {/* Error Banner */}
                {error && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 p-4 flex items-start gap-3 transition-colors">
                        <svg className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-red-800">Error Loading Data</h3>
                            <p className="text-sm text-red-600 dark:text-red-500 mt-0.5 transition-colors">{error}</p>
                        </div>
                        <button
                            onClick={fetchCandidates}
                            className="text-xs font-semibold text-red-700 underline hover:text-red-900"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* TanStack Table Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                    <div className="max-h-[calc(100vh-270px)] overflow-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="bg-gray-50 dark:bg-gray-900 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 dark:text-gray-500 dark:text-gray-300 transition-colors">
                                        {headerGroup.headers.map((header) => {
                                            const canSort = header.column.getCanSort();
                                            const isSorted = header.column.getIsSorted();

                                            return (
                                                <th
                                                    key={header.id}
                                                    onClick={
                                                        canSort
                                                            ? header.column.getToggleSortingHandler()
                                                            : undefined
                                                    }
                                                    className={`sticky top-0 z-20 bg-gray-50 dark:bg-gray-900 dark:bg-gray-800 px-6 py-3.5 font-semibold text-xs uppercase tracking-wider ${
                                                        canSort
                                                            ? "cursor-pointer select-none hover:bg-gray-100 dark:bg-gray-700"
                                                            : ""
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {canSort && (
                                                            <span className="text-gray-400 dark:text-gray-500 text-xs transition-colors">
                                                                {isSorted === "asc" ? (
                                                                    "▲"
                                                                ) : isSorted === "desc" ? (
                                                                    "▼"
                                                                ) : (
                                                                    <span className="opacity-40">↕</span>
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    Array.from({ length: pagination.pageSize }).map((_, idx) => (
                                        <tr key={idx} className="animate-pulse">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors" />
                                                    <div className="space-y-1.5 flex-1">
                                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 transition-colors" />
                                                        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-36 transition-colors" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 transition-colors" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 transition-colors" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 transition-colors" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 transition-colors" /></td>
                                            <td className="px-6 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16 transition-colors" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 transition-colors" /></td>
                                        </tr>
                                    ))
                                ) : candidates.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                                            <div className="max-w-xs mx-auto space-y-2">
                                                <svg className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 dark:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <p className="font-semibold text-gray-700 dark:text-gray-300">No candidates found</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">
                                                    {searchQuery ? `No results matching "${searchQuery}"` : "There are currently no candidates stored in the system."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700/50 transition-colors">
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-6 py-4 align-middle">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <label className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium transition-colors">Rows per page:</label>
                            <select
                                value={pagination.pageSize}
                                onChange={(e) => {
                                    table.setPageSize(Number(e.target.value));
                                }}
                                className="px-3 py-1.5 bg-white dark:bg-gray-800 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50 transition-colors"
                            >
                                {[10, 20, 50, 100].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <div className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 dark:text-gray-300 transition-colors">
                                {totalCandidates > 0 ? (
                                    <span>
                                        Showing <span className="font-semibold text-gray-900 dark:text-white">{startRowIndex}</span> to{" "}
                                        <span className="font-semibold text-gray-900 dark:text-white">{endRowIndex}</span> of{" "}
                                        <span className="font-semibold text-gray-900 dark:text-white">{totalCandidates}</span> candidates
                                    </span>
                                ) : (
                                    <span>0 candidates</span>
                                )}
                            </div>

                            <button
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage() || loading}
                                className="px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 dark:bg-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                title="First Page"
                            >
                                «
                            </button>
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage() || loading}
                                className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 dark:bg-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            
                            <span className="px-3 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                                Page {pagination.pageIndex + 1} of {pageCount || 1}
                            </span>

                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage() || loading}
                                className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 dark:bg-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                            <button
                                onClick={() => table.setPageIndex(pageCount - 1)}
                                disabled={!table.getCanNextPage() || loading}
                                className="px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 dark:bg-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                title="Last Page"
                            >
                                »
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Candidates;