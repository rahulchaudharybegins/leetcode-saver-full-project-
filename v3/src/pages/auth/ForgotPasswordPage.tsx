import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../features/auth/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSent(false);
    setError("");

    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch {
      setError("We couldn't send the reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
      <p className="mt-2 text-sm text-gray-500">
        Enter your account email and we'll send you a password-reset link.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="reset-email" className="mb-2 block text-sm font-medium">
            Email address
          </label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {sent && (
          <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            If an account exists for that email, a reset email may arrive shortly. Check your inbox and spam folder.
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-gray-700"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link to="/login" className="font-semibold text-indigo-600">
          Back to login
        </Link>
      </p>
    </div>
  );
}