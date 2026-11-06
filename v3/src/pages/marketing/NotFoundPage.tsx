import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-3 text-gray-600">This page doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block font-semibold text-indigo-600">
        Return home
      </Link>
    </section>
  );
}