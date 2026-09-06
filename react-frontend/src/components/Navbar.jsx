import { useAuth } from "../context/authContext";

function Navbar({ title, description, children }) {
    const { user } = useAuth();

    return (
        <header className="flex min-h-16 items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
            <div>
                <h1 className="text-xl font-bold text-gray-900">
                    {title}
                </h1>

                {description && (
                    <p className="mt-1 text-sm text-gray-500">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                        {user.name}
                    </p>

                    <p className="text-xs text-gray-500">
                        {user.role}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                    SG
                </div>
            </div>

            {children}
        </header>
    );
}

export default Navbar;