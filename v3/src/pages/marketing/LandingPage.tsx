import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-center">
      <p className="font-semibold text-indigo-600">
        YOUR CODING PROGRESS, ORGANIZED
      </p>

      <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
        Never lose track of a coding solution again.
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
        Save coding problems, document your approaches, and revisit your
        solutions when you need them.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/signup"
          className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-700"
        >
          Get started
        </Link>

        <Link
          to="/features"
          className="rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50"
        >
          Explore features
        </Link>
      </div>

      <img
        src="/images/hero-dashboard.svg"
        alt="Preview of the QSaver problem library"
        className="mx-auto mt-16 w-full max-w-4xl rounded-xl border border-gray-200 shadow-lg"
      />
    </section>
  );
}