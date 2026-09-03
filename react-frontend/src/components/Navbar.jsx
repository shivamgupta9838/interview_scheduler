function Navbar() {
    return (
        <>
            {/* Top bar */}
            <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
                <h2 className="text-lg font-semibold text-gray-900">
                    Dashboard
                </h2>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                            Shivam Gupta
                        </p>

                        <p className="text-xs text-gray-500">
                            Recruiter
                        </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                        SG
                    </div>
                </div>
            </header>
        </>
    );
}

export default Navbar;