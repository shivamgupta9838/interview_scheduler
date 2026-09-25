import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Moon, Sun } from "lucide-react";

function Navbar({ title, description, children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem("theme", newMode ? "dark" : "light");
            return newMode;
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const handleProfile = () => {
        setProfileOpen(false);
        navigate("/account/profile");
    };

    const handleLogout = () => {
        setProfileOpen(false);
        logout();
    };

    const getInitials = (name) => {
        if (!name) return "U";

        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    };

    return (
        <header className="flex min-h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:border-gray-800 dark:bg-gray-900 px-4 py-2 transition-colors duration-200">
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h1>

                {description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleDarkMode}
                    className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:text-gray-500 dark:hover:bg-gray-800"
                    title="Toggle Dark Mode"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* User Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        type="button"
                        onClick={() =>
                            setProfileOpen((prev) => !prev)
                        }
                        className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user?.name}
                            </p>

                            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 capitalize transition-colors">
                                {user?.role}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 font-semibold text-indigo-600 dark:text-indigo-400 dark:bg-indigo-900 dark:text-indigo-300 transition-colors">
                            {getInitials(user?.name)}
                        </div>

                        {/* Chevron */}
                        <svg
                            className={`h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400 transition-transform ${
                                profileOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m19 9-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">

                        {/* User info */}
                        <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-3">
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                {user?.name}
                            </p>

                            <p className="truncate text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                                {user?.email}
                            </p>
                        </div>

                        {/* Profile */}
                        <button
                            type="button"
                            onClick={handleProfile}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <svg
                                className="h-5 w-5 text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 16.5 0"
                                />
                            </svg>

                            <span>Profile</span>
                        </button>

                        {/* Logout */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:bg-red-900/20 dark:hover:bg-red-900/20 dark:text-red-500 dark:text-red-400 dark:hover:bg-gray-700"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-6 3 3m0 0-3 3m3-3h-9"
                                />
                            </svg>

                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
            </div>

            {children}
        </header>
    );
}

export default Navbar;