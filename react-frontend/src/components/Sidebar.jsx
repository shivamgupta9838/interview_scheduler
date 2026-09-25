import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    const permissions = user?.permissions || [];

    const menuItems = [
        {
            name: "Dashboard",
            icon: "▦",
            path: "/account/dashboard",
        },
        {
            name: "Users",
            icon: "👥",
            permission: "User.read",
            path: "/account/users",
        },
        {
            name: "Jobs",
            icon: "💼",
            permission: "Job.read",
            path: "/account/jobs",
        },
        {
            name: "Applications",
            icon: "📄",
            permission: "Application.read",
            path: "/account/applications",
        },
        {
            name: "Candidates",
            icon: "👥",
            permission: "Candidate.read",
            path: "/account/candidates",
        },
        {
            name: "Interviews",
            icon: "📅",
            permission: "Interview.read",
            path: "/account/interviews",
        },
    ];

    const visibleMenuItems = menuItems.filter(
        item => !item.permission || permissions.includes(item.permission)
    );

    return (
        <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:border-gray-800 dark:bg-gray-900 transition-colors duration-200">

            {/* Logo */}
            <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 dark:border-gray-800 px-6 transition-colors">
                <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    Interview Scheduler
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 dark:text-gray-400 transition-colors">
                    Main Menu
                </p>

                <div className="space-y-1">

                    {visibleMenuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                                location.pathname  === item.path
                                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                                    : "text-gray-600 hover:bg-gray-50 dark:bg-gray-900 hover:text-gray-900 dark:text-white dark:text-gray-400 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-white"
                            }`}
                        >
                            <span className="w-5 text-center">
                                {item.icon}
                            </span>

                            <span>
                                {item.name}
                            </span>
                        </button>
                    ))}

                </div>

            </nav>

            {/* Bottom section */}
            <div className="border-t border-gray-200 dark:border-gray-700 dark:border-gray-800 p-4 transition-colors">

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:bg-gray-900 hover:text-gray-900 dark:text-white dark:text-gray-400 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-white transition-colors">
                    <span>⚙️</span>
                    <span>Settings</span>
                </button>

                <button
                    onClick={logout}
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                >
                    <span>↪</span>
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;