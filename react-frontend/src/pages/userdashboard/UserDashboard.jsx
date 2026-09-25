import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/authContext";

function UserDashboard() {
    const { user } = useAuth();
    
    return (
        <DashboardLayout>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                {user.role} Dashboard
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors">
                Manage your jobs, candidates and interviews.
            </p>

        </DashboardLayout>
    );
}

export default UserDashboard;