import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Navigate } from "react-router-dom";

function DashboardLayout({ children }) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-100">

            <Sidebar />

            <div className="ml-64">
                <Navbar />

                <main className="p-6">
                    {children}
                </main>
            </div>

        </div>
    );
}

export default DashboardLayout;