import { useState } from "react";

function Sidebar() {
    const [activeMenu, setActiveMenu] = useState("Dashboard");

    const menuItems = [
        {
            name: "Dashboard",
            icon: "▦",
        },
        {
            name: "Jobs",
            icon: "💼",
        },
        {
            name: "Applications",
            icon: "📄",
        },
        {
            name: "Candidates",
            icon: "👥",
        },
        {
            name: "Interviews",
            icon: "📅",
        },
    ];

    return (
        <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">

            {/* Logo */}
            <div className="flex h-16 items-center border-b border-gray-200 px-6">
                <h1 className="text-xl font-bold text-indigo-600">
                    Interview Scheduler
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Main Menu
                </p>

                <div className="space-y-1">

                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveMenu(item.name)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                                activeMenu === item.name
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
            <div className="border-t border-gray-200 p-4">

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                    <span>⚙️</span>
                    <span>Settings</span>
                </button>

                <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50">
                    <span>↪</span>
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;