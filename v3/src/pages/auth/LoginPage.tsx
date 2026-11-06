import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logIn } from "../../features/auth/authService";
// import { useNavigate } from "react-router-dom";
import { sendVerificationEmailToCurrentUser } from "../../features/auth/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const destination =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/app";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await logIn(email.trim(), password);
      navigate(destination, { replace: true });
    } catch {
      setError("Unable to log in. Check your email and password, then try again.");
    } finally {
      setLoading(false);
    }

    const user = await logIn(email, password);

if (!user.emailVerified) {
    try {
       await sendVerificationEmailToCurrentUser();
    } catch (verificationError) {
    console.error("Automatic verification email failed:", verificationError);
    }

    navigate("/verify-email", { replace: true });
    } else {
         navigate("/app", { replace: true });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-gray-500">
        Sign in to revisit your coding solutions.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="mb-2 flex justify-between gap-3">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Enter your password"
          />
        </div>

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
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-indigo-600">
          Create one
        </Link>
      </p>
    </div>
  );
}