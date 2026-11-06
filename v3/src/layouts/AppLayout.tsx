import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { label: "Overview", to: "/app", end: true },
  { label: "Problems", to: "/app/problems" },
  { label: "Analytics", to: "/app/analytics" },
  { label: "Profile", to: "/app/profile" },
  { label: "Settings", to: "/app/settings" },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 md:flex">
      <aside className="border-b border-gray-200 bg-white p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <NavLink to="/app" className="mb-8 block">
          <img src="/images/logo.svg" alt="QSaver" className="h-10 w-auto" />
        </NavLink>

        <nav aria-label="Main navigation" className="flex gap-2 overflow-x-auto md:flex-col">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h1 className="text-sm font-semibold">Your workspace</h1>
          <NavLink
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Account
          </NavLink>
        </header>

        <main className="mx-auto max-w-7xl p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}