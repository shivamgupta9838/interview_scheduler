import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Navigate } from "react-router-dom";

function DashboardLayout({ children, title, description }) {
    const token = localStorage.getItem("accessToken");

    if (!token || token === "undefined" || token === "null") {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Sidebar />

            <div className="ml-64">
                <Navbar
                    title={title}
                    description={description}
                />

                <main className="p-4 text-gray-900 dark:text-white dark:text-gray-100 transition-colors">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;