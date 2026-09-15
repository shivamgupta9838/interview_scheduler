import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/authContext";

function UserDashboard() {
    const { user } = useAuth();
    
    return (
        <DashboardLayout>

            <h1 className="text-2xl font-bold text-gray-900">
                {user.role} Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
                Manage your jobs, candidates and interviews.
            </p>

        </DashboardLayout>
    );
}

export default UserDashboard;