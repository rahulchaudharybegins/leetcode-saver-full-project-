import { Link, NavLink, Outlet } from "react-router-dom";

export default function MarketingLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.svg" alt="QSaver" className="h-10 w-auto" />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <NavLink to="/features">Features</NavLink>
            <NavLink to="/how-it-works">How it works</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-3 py-2 text-sm font-medium">
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-500">
          © {new Date().getFullYear()} QSaver. Keep every solution worth revisiting.
        </div>
      </footer>
    </div>
  );
}