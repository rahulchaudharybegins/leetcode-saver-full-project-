import { Link } from "react-router-dom";

const quickLinks = [
  {
    title: "Problem library",
    description: "Browse and search your saved coding problems.",
    to: "/app/problems",
  },
  {
    title: "Analytics",
    description: "Review your coding practice and progress.",
    to: "/app/analytics",
  },
  {
    title: "Profile",
    description: "View your account information.",
    to: "/app/profile",
  },
];

export default function OverviewPage() {
  return (
    <section>
      <div>
        <p className="text-sm font-medium text-indigo-600">YOUR WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Welcome to QSaver
        </h1>
        <p className="mt-2 text-gray-500">
          Your coding problems and solution notes, organized in one place.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Ready to revise?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Open your library to find saved problems, review approaches, and
          revisit original problem statements.
        </p>
        <Link
          to="/app/problems"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Open problem library
        </Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {quickLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
          >
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {item.description}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
              Open page →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}