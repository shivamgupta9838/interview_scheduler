import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-screen bg-white">

            {/* Navbar */}
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-xl font-bold text-indigo-600"
                    >
                        Interview Scheduler
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-3">

                        <Link
                            to="/login"
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                            Get Started
                        </Link>

                    </div>
                </div>
            </nav>


            {/* Hero */}
            <section className="bg-gray-50">
                <div className="mx-auto grid min-h-150 max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">

                    {/* Hero Content */}
                    <div>

                        <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600">
                            Smart Interview Management
                        </span>

                        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                            Schedule interviews.
                            <span className="block text-indigo-600">
                                Hire better.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                            Interview Scheduler helps recruiters manage jobs,
                            candidates, interviews, feedback and hiring
                            decisions — all from one place.
                        </p>

                        {/* Buttons */}
                        <div className="mt-8 flex flex-wrap gap-4">

                            <Link
                                to="/register"
                                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                Get Started
                            </Link>

                            <Link
                                to="/login"
                                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Login
                            </Link>

                        </div>

                    </div>


                    {/* Dashboard Preview */}
                    <div className="hidden lg:block">

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">

                            {/* Fake Browser Header */}
                            <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-4">
                                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                                <div className="h-3 w-3 rounded-full bg-green-400"></div>

                                <div className="ml-3 h-7 flex-1 rounded-md bg-gray-100"></div>
                            </div>

                            {/* Dashboard */}
                            <div className="flex gap-4">

                                {/* Mini Sidebar */}
                                <div className="w-32 space-y-3">

                                    <div className="h-7 rounded-md bg-indigo-100"></div>

                                    <div className="h-6 rounded-md bg-gray-100"></div>
                                    <div className="h-6 rounded-md bg-gray-100"></div>
                                    <div className="h-6 rounded-md bg-gray-100"></div>
                                    <div className="h-6 rounded-md bg-gray-100"></div>

                                </div>

                                {/* Mini Content */}
                                <div className="flex-1">

                                    <div className="mb-4 h-7 w-40 rounded-md bg-gray-200"></div>

                                    <div className="grid grid-cols-3 gap-3">

                                        <div className="h-20 rounded-lg bg-indigo-50"></div>
                                        <div className="h-20 rounded-lg bg-blue-50"></div>
                                        <div className="h-20 rounded-lg bg-green-50"></div>

                                    </div>

                                    <div className="mt-4 h-40 rounded-lg bg-gray-50"></div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>


            {/* Features */}
            <section className="bg-white py-20">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="mx-auto max-w-2xl text-center">

                        <h2 className="text-3xl font-bold text-gray-900">
                            Everything you need to manage interviews
                        </h2>

                        <p className="mt-4 text-gray-600">
                            Keep your entire hiring workflow organized from
                            application to final decision.
                        </p>

                    </div>


                    <div className="mt-12 grid gap-6 md:grid-cols-3">

                        <Feature
                            icon="💼"
                            title="Manage Jobs"
                            description="Create and manage job openings and keep your hiring pipeline organized."
                        />

                        <Feature
                            icon="👥"
                            title="Manage Candidates"
                            description="Track applications and candidate progress throughout the hiring process."
                        />

                        <Feature
                            icon="📅"
                            title="Schedule Interviews"
                            description="Schedule interviews and keep recruiters and interviewers aligned."
                        />

                        <Feature
                            icon="📝"
                            title="Collect Feedback"
                            description="Allow interviewers to submit structured feedback after interviews."
                        />

                        <Feature
                            icon="📊"
                            title="Track Applications"
                            description="Monitor candidate stages and understand your hiring pipeline."
                        />

                        <Feature
                            icon="✅"
                            title="Make Decisions"
                            description="Review interview feedback and make informed hiring decisions."
                        />

                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="bg-indigo-600">

                <div className="mx-auto max-w-7xl px-6 py-16 text-center">

                    <h2 className="text-3xl font-bold text-white">
                        Ready to simplify your hiring process?
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-indigo-100">
                        Start managing your interviews and candidates in one
                        centralized platform.
                    </p>

                    <Link
                        to="/register"
                        className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-gray-100"
                    >
                        Create Your Account
                    </Link>

                </div>

            </section>


            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

                    <p className="text-sm text-gray-500">
                        © 2026 Interview Scheduler
                    </p>

                    <div className="flex gap-6">

                        <Link
                            to="/login"
                            className="text-sm text-gray-500 hover:text-gray-900"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="text-sm text-gray-500 hover:text-gray-900"
                        >
                            Register
                        </Link>

                    </div>

                </div>

            </footer>

        </div>
    );
}


/* Feature Component */

function Feature({ icon, title, description }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-2xl">
                {icon}
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
                {description}
            </p>

        </div>
    );
}

export default Home;