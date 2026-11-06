import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <header className="px-6 py-5">
        <Link to="/" aria-label="QSaver home">
          <img src="/images/logo.svg" alt="QSaver" className="h-10 w-auto" />
        </Link>
      </header>

      <section className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <Outlet />
        </div>
      </section>

      <footer className="px-6 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} QSaver
      </footer>
    </main>
  );
}